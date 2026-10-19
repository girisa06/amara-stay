from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, model_validator

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

    @model_validator(mode="after")
    def rescheduling_requires_new_time(self):
        if self.status == VisitStatus.rescheduled and (self.visit_date is None or not self.time_slot):
            raise ValueError("A new date and time slot are required when rescheduling")
        return self


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
