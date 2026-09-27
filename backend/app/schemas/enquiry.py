from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class EnquiryCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr | None = None
    message: str


class EnquiryReply(BaseModel):
    reply: str
    is_resolved: bool = True


class EnquiryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    phone: str
    email: EmailStr | None = None
    message: str
    is_resolved: bool
    reply: str | None = None
    created_at: datetime
