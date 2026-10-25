import enum

from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, Index, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class Payment(Base):
    __tablename__ = "payments"
    __table_args__ = (
        UniqueConstraint("user_id", "billing_period", name="uq_payment_resident_period"),
        Index("ix_payments_status_period", "status", "billing_period"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    billing_period = Column(String(7), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_date = Column(Date, nullable=True)
    transaction_reference = Column(String(120), nullable=True)
    proof_key = Column(String(255), nullable=False)
    status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.pending)
    submitted_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    rejection_reason = Column(Text, nullable=True)

    user = relationship("User", back_populates="payments", foreign_keys=[user_id])
    reviewer = relationship("User", foreign_keys=[reviewer_id])


class PaymentSettings(Base):
    __tablename__ = "payment_settings"

    id = Column(Integer, primary_key=True)
    upi_id = Column(String(120), nullable=True)
    updated_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
