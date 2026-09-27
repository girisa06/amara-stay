from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.core.deps import get_current_admin
from app.database import get_db
from app.models.enquiry import Enquiry
from app.models.user import User
from app.schemas.enquiry import EnquiryCreate, EnquiryOut, EnquiryReply

router = APIRouter(prefix="/api/enquiries", tags=["enquiries"])


@router.get("/contact-info")
def contact_info():
    return {
        "phone": settings.OWNER_PHONE,
        "whatsapp": settings.OWNER_WHATSAPP,
        "email": settings.OWNER_EMAIL,
    }


@router.post("", response_model=EnquiryOut, status_code=201)
def create_enquiry(payload: EnquiryCreate, db: Session = Depends(get_db)):
    enquiry = Enquiry(**payload.model_dump())
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return enquiry


@router.get("", response_model=list[EnquiryOut])
def list_enquiries(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return db.query(Enquiry).order_by(Enquiry.created_at.desc()).all()


@router.put("/{enquiry_id}/reply", response_model=EnquiryOut)
def reply_enquiry(
    enquiry_id: int,
    payload: EnquiryReply,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    enquiry.reply = payload.reply
    enquiry.is_resolved = payload.is_resolved
    db.commit()
    db.refresh(enquiry)
    return enquiry
