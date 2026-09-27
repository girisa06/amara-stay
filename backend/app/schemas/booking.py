from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.booking import BookingStatus


class BookingCreate(BaseModel):
    room_id: int
    tenant_name: str
    tenant_phone: str
    tenant_email: EmailStr
    emergency_contact_name: str
    emergency_contact_phone: str
    advance_amount: Decimal | None = None
    notes: str | None = None


class BookingStatusUpdate(BaseModel):
    status: BookingStatus
    payment_status: str | None = None


class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    reference_id: str
    room_id: int
    user_id: int
    booking_date: datetime
    status: BookingStatus
    tenant_name: str
    tenant_phone: str
    tenant_email: EmailStr
    emergency_contact_name: str
    emergency_contact_phone: str
    advance_amount: Decimal | None = None
    payment_status: str
    notes: str | None = None
