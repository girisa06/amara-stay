import enum

from sqlalchemy import Column, Integer, String, Numeric, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    rejected = "rejected"
    cancelled = "cancelled"


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    booking_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(Enum(BookingStatus), default=BookingStatus.pending, nullable=False)

    tenant_name = Column(String(120), nullable=False)
    tenant_phone = Column(String(20), nullable=False)
    tenant_email = Column(String(180), nullable=False)
    emergency_contact_name = Column(String(120), nullable=False)
    emergency_contact_phone = Column(String(20), nullable=False)
    advance_amount = Column(Numeric(10, 2), nullable=True)
    payment_status = Column(String(30), default="unpaid", nullable=False)
    notes = Column(Text, nullable=True)
    reference_id = Column(String(20), unique=True, nullable=False)

    user = relationship("User", back_populates="bookings")
    room = relationship("Room", back_populates="bookings")
