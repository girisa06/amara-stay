from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, model_validator

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
    total_beds: int = Field(gt=0)
    available_beds: int = Field(ge=0)
    room_size: str | None = None
    description: str | None = None
    facilities: list[str] = []
    food_plan: str | None = None
    house_rules: str | None = None

    @model_validator(mode="after")
    def available_beds_must_fit_capacity(self):
        if self.available_beds > self.total_beds:
            raise ValueError("Available beds cannot exceed total beds")
        return self


class RoomCreate(RoomBase):
    photo_urls: list[str] = []


class RoomUpdate(BaseModel):
    room_number: str | None = None
    room_type: RoomType | None = None
    rent: Decimal | None = None
    deposit: Decimal | None = None
    total_beds: int | None = Field(default=None, gt=0)
    available_beds: int | None = Field(default=None, ge=0)
    room_size: str | None = None
    description: str | None = None
    facilities: list[str] | None = None
    food_plan: str | None = None
    house_rules: str | None = None
    photo_urls: list[str] | None = None

    @model_validator(mode="after")
    def supplied_available_beds_must_fit_capacity(self):
        if self.total_beds is not None and self.available_beds is not None:
            if self.available_beds > self.total_beds:
                raise ValueError("Available beds cannot exceed total beds")
        return self


class RoomAvailabilityUpdate(BaseModel):
    is_available: bool


class RoomOut(RoomBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    photos: list[RoomPhotoOut] = []
    availability_status: str
