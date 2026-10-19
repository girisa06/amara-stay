from datetime import datetime
from decimal import Decimal

from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, model_validator

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
    payment_status: Literal["unpaid", "partial", "paid"] | None = None

    @model_validator(mode="after")
    def payment_updates_require_confirmed_reservation(self):
        if self.payment_status is not None and self.status != BookingStatus.confirmed:
            raise ValueError("Payment status can only be updated on confirmed reservations")
        return self


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
