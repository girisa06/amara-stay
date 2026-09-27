import enum

from sqlalchemy import Column, Integer, String, Date, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class VisitStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    rescheduled = "rescheduled"


class VisitRequest(Base):
    __tablename__ = "visit_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    full_name = Column(String(120), nullable=False)
    mobile_number = Column(String(20), nullable=False)
    email = Column(String(180), nullable=False)
    visit_date = Column(Date, nullable=False)
    time_slot = Column(String(40), nullable=False)
    status = Column(Enum(VisitStatus), default=VisitStatus.pending, nullable=False)
    reference_id = Column(String(20), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="visit_requests")
