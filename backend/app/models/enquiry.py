from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func

from app.database import Base


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(180), nullable=True)
    message = Column(Text, nullable=False)
    is_resolved = Column(Boolean, default=False, nullable=False)
    reply = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
