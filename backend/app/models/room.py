import enum

from sqlalchemy import Column, Integer, String, Numeric, Text, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database import Base


class RoomType(str, enum.Enum):
    single = "single"
    double = "double"
    triple = "triple"
    four = "four"


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String(20), unique=True, nullable=False)
    room_type = Column(Enum(RoomType), nullable=False)
    rent = Column(Numeric(10, 2), nullable=False)
    deposit = Column(Numeric(10, 2), nullable=False)
    total_beds = Column(Integer, nullable=False, default=1)
    available_beds = Column(Integer, nullable=False, default=1)
    room_size = Column(String(40), nullable=True)
    description = Column(Text, nullable=True)
    facilities = Column(JSON, nullable=True, default=list)
    food_plan = Column(Text, nullable=True)
    house_rules = Column(Text, nullable=True)

    photos = relationship("RoomPhoto", back_populates="room", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="room")

    @property
    def availability_status(self) -> str:
        if self.available_beds <= 0:
            return "fully_occupied"
        if self.available_beds <= max(1, self.total_beds // 4):
            return "few_beds_left"
        return "available"


class RoomPhoto(Base):
    __tablename__ = "room_photos"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    url = Column(String(500), nullable=False)

    room = relationship("Room", back_populates="photos")
