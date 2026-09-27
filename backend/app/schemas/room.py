from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.room import RoomType


class RoomPhotoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    url: str


class RoomBase(BaseModel):
    room_number: str
    room_type: RoomType
    rent: Decimal
    deposit: Decimal
    total_beds: int
    available_beds: int
    room_size: str | None = None
    description: str | None = None
    facilities: list[str] = []
    food_plan: str | None = None
    house_rules: str | None = None


class RoomCreate(RoomBase):
    photo_urls: list[str] = []


class RoomUpdate(BaseModel):
    room_number: str | None = None
    room_type: RoomType | None = None
    rent: Decimal | None = None
    deposit: Decimal | None = None
    total_beds: int | None = None
    available_beds: int | None = None
    room_size: str | None = None
    description: str | None = None
    facilities: list[str] | None = None
    food_plan: str | None = None
    house_rules: str | None = None
    photo_urls: list[str] | None = None


class RoomOut(RoomBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    photos: list[RoomPhotoOut] = []
    availability_status: str
