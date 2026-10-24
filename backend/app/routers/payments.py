import os
import uuid
from datetime import date, datetime
from decimal import Decimal
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from fastapi.responses import FileResponse
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.core.deps import get_current_admin, get_current_user
from app.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.payment import Payment, PaymentSettings, PaymentStatus
from app.models.room import Room
from app.models.user import User, UserRole

router = APIRouter(tags=["payments"])
MAX_PROOF_BYTES = 5 * 1024 * 1024
PROOF_DIR = Path(os.getenv("PAYMENT_PROOF_DIR", Path(__file__).resolve().parents[2] / "private_payment_proofs")).resolve()
IMAGE_TYPES = {
    "image/jpeg": (".jpg", lambda b: b.startswith(b"\xff\xd8\xff")),
    "image/png": (".png", lambda b: b.startswith(b"\x89PNG\r\n\x1a\n")),
    "image/webp": (".webp", lambda b: len(b) >= 12 and b[:4] == b"RIFF" and b[8:12] == b"WEBP"),
}


class ReviewRequest(BaseModel):
    reason: str | None = Field(default=None, max_length=1000)


class UpiSettingsRequest(BaseModel):
    upi_id: str | None = Field(default=None, max_length=120)


def payment_out(payment: Payment):
    active_booking = next((b for b in (payment.user.bookings if payment.user else [])
                           if b.status == BookingStatus.confirmed), None)
    return {
        "id": payment.id, "user_id": payment.user_id,
        "resident_name": payment.user.name if payment.user else None,
        "resident_email": payment.user.email if payment.user else None,
        "room_number": active_booking.room.room_number if active_booking and active_booking.room else None,
        "billing_period": payment.billing_period, "amount": float(payment.amount),
        "payment_date": payment.payment_date, "transaction_reference": payment.transaction_reference,
        "status": payment.status.value, "submitted_at": payment.submitted_at,
        "reviewer_id": payment.reviewer_id, "reviewed_at": payment.reviewed_at,
        "rejection_reason": payment.rejection_reason, "proof_url": f"/api/payments/{payment.id}/proof",
    }


def get_payment(db: Session, payment_id: int):
    payment = db.query(Payment).options(joinedload(Payment.user)).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(404, "Payment not found")
    return payment


def resolve_proof(payment: Payment):
    candidate = (PROOF_DIR / payment.proof_key).resolve()
    if candidate.parent != PROOF_DIR or not candidate.is_file():
        raise HTTPException(404, "Payment proof is unavailable")
    return candidate


@router.post("/api/payments/submit", status_code=status.HTTP_201_CREATED)
async def submit_payment(
    billing_period: str = Form(..., pattern=r"^\d{4}-(0[1-9]|1[0-2])$"),
    amount: Decimal = Form(..., gt=0), payment_date: date | None = Form(default=None),
    transaction_reference: str | None = Form(default=None, max_length=120),
    proof: UploadFile = File(...), db: Session = Depends(get_db), user: User = Depends(get_current_user),
):
    if user.role != UserRole.tenant:
        raise HTTPException(403, "Resident account required")
    media_type = (proof.content_type or "").lower()
    extension = Path(proof.filename or "").suffix.lower()
    valid_extensions = {"image/jpeg": {".jpg", ".jpeg"}, "image/png": {".png"}, "image/webp": {".webp"}}
    if media_type not in IMAGE_TYPES or extension not in valid_extensions[media_type]:
        raise HTTPException(400, "Upload a JPEG, PNG, or WebP image")
    content = await proof.read(MAX_PROOF_BYTES + 1)
    if len(content) > MAX_PROOF_BYTES:
        raise HTTPException(413, "Image must be 5 MB or smaller")
    if not IMAGE_TYPES[media_type][1](content):
        raise HTTPException(400, "Uploaded file content does not match its image type")
    try:
        from io import BytesIO
        with Image.open(BytesIO(content)) as image:
            if image.format not in {"JPEG", "PNG", "WEBP"}:
                raise HTTPException(400, "Upload a JPEG, PNG, or WebP image")
            image.verify()
    except (UnidentifiedImageError, OSError, SyntaxError):
        raise HTTPException(400, "Uploaded image is invalid or corrupted")

    existing = db.query(Payment).filter(Payment.user_id == user.id, Payment.billing_period == billing_period).with_for_update().first()
    if existing and existing.status != PaymentStatus.rejected:
        raise HTTPException(409, "A payment for this billing period is already pending or verified")
    key = f"{uuid.uuid4().hex}{IMAGE_TYPES[media_type][0]}"
    PROOF_DIR.mkdir(parents=True, exist_ok=True)
    target = PROOF_DIR / key
    target.write_bytes(content)
    old_key = existing.proof_key if existing else None
    try:
        if existing:
            existing.amount = amount
            existing.payment_date = payment_date
            existing.transaction_reference = (transaction_reference or "").strip() or None
            existing.proof_key = key
            existing.status = PaymentStatus.pending
            existing.submitted_at = datetime.utcnow()
            existing.reviewer_id = None
            existing.reviewed_at = None
            existing.rejection_reason = None
            payment = existing
        else:
            payment = Payment(user_id=user.id, billing_period=billing_period, amount=amount,
                              payment_date=payment_date, transaction_reference=(transaction_reference or "").strip() or None,
                              proof_key=key, status=PaymentStatus.pending)
            db.add(payment)
        db.commit()
        db.refresh(payment)
        if old_key and old_key != key:
            try:
                (PROOF_DIR / old_key).unlink(missing_ok=True)
            except OSError:
                pass
    except IntegrityError:
        db.rollback()
        target.unlink(missing_ok=True)
        raise HTTPException(409, "A payment for this billing period already exists")
    except Exception:
        db.rollback()
        target.unlink(missing_ok=True)
        raise
    return payment_out(payment)


@router.get("/api/payments/my")
def my_payments(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = db.query(Payment).options(joinedload(Payment.user)).filter(Payment.user_id == user.id).order_by(Payment.billing_period.desc()).all()
    return [payment_out(row) for row in rows]


@router.get("/api/payments/summary")
def payment_summary(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    booking = (db.query(Booking).options(joinedload(Booking.room))
               .filter(Booking.user_id == user.id, Booking.status == BookingStatus.confirmed)
               .order_by(Booking.booking_date.desc()).first())
    today = date.today()
    return {"current_rent": float(booking.room.rent) if booking and booking.room else None,
            "billing_period": today.strftime("%Y-%m"), "due_date": None,
            "room_number": booking.room.room_number if booking and booking.room else None}


@router.get("/api/payments/settings")
def get_payment_settings(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    setting = db.query(PaymentSettings).first()
    return {"upi_id": setting.upi_id if setting else None}


@router.put("/api/admin/payments/settings")
def update_payment_settings(payload: UpiSettingsRequest, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    upi_id = payload.upi_id.strip() if payload.upi_id else None
    if upi_id and ("@" not in upi_id or any(ch.isspace() for ch in upi_id)):
        raise HTTPException(422, "Enter a valid UPI ID")
    setting = db.query(PaymentSettings).first()
    if setting is None:
        setting = PaymentSettings(upi_id=upi_id, updated_by_user_id=admin.id)
        db.add(setting)
    else:
        setting.upi_id = upi_id
        setting.updated_by_user_id = admin.id
    db.commit()
    return {"upi_id": upi_id}


@router.get("/api/payments/{payment_id}")
def payment_detail(payment_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    payment = get_payment(db, payment_id)
    if user.role != UserRole.admin and payment.user_id != user.id:
        raise HTTPException(404, "Payment not found")
    return payment_out(payment)


@router.get("/api/payments/{payment_id}/proof")
def payment_proof(payment_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    payment = get_payment(db, payment_id)
    if user.role != UserRole.admin and payment.user_id != user.id:
        raise HTTPException(404, "Payment not found")
    content_type = {".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}[Path(payment.proof_key).suffix.lower()]
    return FileResponse(resolve_proof(payment), media_type=content_type, filename=f"payment-{payment.id}-proof{Path(payment.proof_key).suffix}", headers={"Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff"})


@router.get("/api/admin/payments")
def admin_payments(status_filter: str | None = Query(default=None, alias="status"), month: str | None = None,
                   db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    query = db.query(Payment).options(joinedload(Payment.user))
    if status_filter:
        try:
            query = query.filter(Payment.status == PaymentStatus(status_filter))
        except ValueError:
            raise HTTPException(422, "Invalid payment status")
    if month:
        query = query.filter(Payment.billing_period == month)
    return [payment_out(p) for p in query.order_by(Payment.submitted_at.desc()).all()]


@router.post("/api/admin/payments/{payment_id}/verify")
def verify_payment(payment_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    payment = db.query(Payment).filter(Payment.id == payment_id).with_for_update().first()
    if not payment:
        raise HTTPException(404, "Payment not found")
    if payment.status != PaymentStatus.pending:
        raise HTTPException(409, "Only pending payments can be reviewed")
    payment.status = PaymentStatus.verified
    payment.reviewer_id = admin.id
    payment.reviewed_at = datetime.utcnow()
    payment.rejection_reason = None
    db.commit()
    return payment_out(get_payment(db, payment_id))


@router.post("/api/admin/payments/{payment_id}/reject")
def reject_payment(payment_id: int, payload: ReviewRequest, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    reason = (payload.reason or "").strip()
    if not reason:
        raise HTTPException(422, "A rejection reason is required")
    payment = db.query(Payment).filter(Payment.id == payment_id).with_for_update().first()
    if not payment:
        raise HTTPException(404, "Payment not found")
    if payment.status != PaymentStatus.pending:
        raise HTTPException(409, "Only pending payments can be reviewed")
    payment.status = PaymentStatus.rejected
    payment.reviewer_id = admin.id
    payment.reviewed_at = datetime.utcnow()
    payment.rejection_reason = reason
    db.commit()
    return payment_out(get_payment(db, payment_id))
