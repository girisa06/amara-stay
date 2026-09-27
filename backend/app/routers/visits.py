import random
import string

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_admin, get_optional_current_user
from app.database import get_db
from app.models.user import User
from app.models.visit_request import VisitRequest
from app.schemas.visit_request import VisitRequestCreate, VisitRequestOut, VisitStatusUpdate

router = APIRouter(prefix="/api/visits", tags=["visits"])


def _generate_reference() -> str:
    return "VR" + "".join(random.choices(string.digits, k=8))


@router.post("", response_model=VisitRequestOut, status_code=201)
def create_visit_request(
    payload: VisitRequestCreate,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    visit = VisitRequest(
        user_id=current_user.id if current_user else None,
        full_name=payload.full_name,
        mobile_number=payload.mobile_number,
        email=payload.email,
        visit_date=payload.visit_date,
        time_slot=payload.time_slot,
        reference_id=_generate_reference(),
    )
    db.add(visit)
    db.commit()
    db.refresh(visit)
    return visit


@router.get("", response_model=list[VisitRequestOut])
def list_visit_requests(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return db.query(VisitRequest).order_by(VisitRequest.created_at.desc()).all()


@router.put("/{visit_id}/status", response_model=VisitRequestOut)
def update_visit_status(
    visit_id: int,
    payload: VisitStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    visit = db.query(VisitRequest).filter(VisitRequest.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit request not found")

    visit.status = payload.status
    if payload.visit_date:
        visit.visit_date = payload.visit_date
    if payload.time_slot:
        visit.time_slot = payload.time_slot

    db.commit()
    db.refresh(visit)
    return visit
