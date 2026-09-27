from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.visit_request import VisitStatus


class VisitRequestCreate(BaseModel):
    full_name: str
    mobile_number: str
    email: EmailStr
    visit_date: date
    time_slot: str


class VisitStatusUpdate(BaseModel):
    status: VisitStatus
    visit_date: date | None = None
    time_slot: str | None = None


class VisitRequestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    reference_id: str
    full_name: str
    mobile_number: str
    email: EmailStr
    visit_date: date
    time_slot: str
    status: VisitStatus
    created_at: datetime
