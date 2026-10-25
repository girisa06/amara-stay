from datetime import datetime, timezone

from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.database import Base


class WashingMachineSession(Base):
    __tablename__ = "washing_machine_sessions"
    __table_args__ = (
        UniqueConstraint("active_machine_key", name="uq_washing_machine_active_key"),
        CheckConstraint(
            "(ended_at IS NULL AND active_machine_key IS NOT NULL) OR "
            "(ended_at IS NOT NULL AND active_machine_key IS NULL)",
            name="ck_washing_machine_active_state",
        ),
        Index("ix_washing_machine_key_started_at", "machine_key", "started_at"),
    )

    id = Column(Integer, primary_key=True, index=True)
    machine_key = Column(String(80), nullable=False, default="shared-washing-machine")
    # MySQL permits multiple NULL values in a unique index, while allowing only
    # one row per machine key to hold its active key.
    active_machine_key = Column(String(80), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    ended_at = Column(DateTime(timezone=True), nullable=True)
    ended_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    end_reason = Column(String(32), nullable=True)
    reported_at = Column(DateTime(timezone=True), nullable=True)
    reported_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    user = relationship("User", foreign_keys=[user_id])


def utc_now_naive():
    """Return UTC for MySQL's timezone-naive DATETIME columns."""
    return datetime.now(timezone.utc).replace(tzinfo=None)
