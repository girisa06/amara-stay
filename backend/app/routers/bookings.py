import random
import string

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.deps import get_current_admin, get_current_user
from app.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.room import Room
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingOut, BookingStatusUpdate

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


def _generate_reference() -> str:
    return "BK" + "".join(random.choices(string.digits, k=8))


@router.post("", response_model=BookingOut, status_code=201)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = (
        db.query(Room)
        .options(joinedload(Room.availability_control))
        .filter(Room.id == payload.room_id)
        .with_for_update()
        .first()
    )
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.availability_status == "unavailable":
        raise HTTPException(status_code=409, detail="This room is temporarily unavailable")
    if room.available_beds <= 0:
        raise HTTPException(status_code=400, detail="This room is fully occupied")

    booking = Booking(
        user_id=current_user.id,
        room_id=payload.room_id,
        tenant_name=payload.tenant_name,
        tenant_phone=payload.tenant_phone,
        tenant_email=payload.tenant_email,
        emergency_contact_name=payload.emergency_contact_name,
        emergency_contact_phone=payload.emergency_contact_phone,
        advance_amount=payload.advance_amount,
        notes=payload.notes,
        reference_id=_generate_reference(),
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("", response_model=list[BookingOut])
def list_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Booking)
    if current_user.role.value != "admin":
        query = query.filter(Booking.user_id == current_user.id)
    return query.order_by(Booking.booking_date.desc()).all()


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if current_user.role.value != "admin" and booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return booking


@router.put("/{booking_id}/status", response_model=BookingOut)
def update_booking_status(
    booking_id: int,
    payload: BookingStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).with_for_update().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    previous_status = booking.status
    if previous_status == BookingStatus.pending:
        if payload.status not in (BookingStatus.confirmed, BookingStatus.rejected):
            raise HTTPException(status_code=409, detail="Pending reservations can only be confirmed or rejected")
        if payload.status == BookingStatus.confirmed:
            room = (
                db.query(Room)
                .options(joinedload(Room.availability_control))
                .filter(Room.id == booking.room_id)
                .with_for_update()
                .first()
            )
            if not room:
                raise HTTPException(status_code=409, detail="The reserved room no longer exists")
            if room.availability_status == "unavailable":
                raise HTTPException(status_code=409, detail="The room is temporarily unavailable")
            if room.available_beds <= 0:
                raise HTTPException(status_code=409, detail="No beds remain in this room")
            room.available_beds -= 1
        booking.status = payload.status
    elif previous_status == BookingStatus.confirmed and payload.status == BookingStatus.confirmed:
        if payload.payment_status is None or payload.payment_status == booking.payment_status:
            raise HTTPException(status_code=409, detail="This reservation has already been confirmed")
    else:
        raise HTTPException(status_code=409, detail="This reservation can no longer be changed")

    if payload.payment_status is not None:
        booking.payment_status = payload.payment_status

    db.commit()
    db.refresh(booking)
    return booking
