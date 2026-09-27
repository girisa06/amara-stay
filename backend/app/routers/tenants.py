from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_admin
from app.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.user import User, UserRole
from app.schemas.auth import UserOut

router = APIRouter(prefix="/api/tenants", tags=["tenants"])


@router.get("")
def list_tenants(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    tenants = db.query(User).filter(User.role == UserRole.tenant).all()
    result = []
    for tenant in tenants:
        active_booking = (
            db.query(Booking)
            .filter(Booking.user_id == tenant.id, Booking.status == BookingStatus.confirmed)
            .first()
        )
        result.append(
            {
                **UserOut.model_validate(tenant).model_dump(),
                "has_active_reservation": active_booking is not None,
                "room_number": active_booking.room.room_number if active_booking else None,
            }
        )
    return result
