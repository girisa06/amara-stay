from datetime import datetime, timezone

from pydantic import BaseModel, ConfigDict, field_validator


class WashingMachineSessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    machine_key: str
    user_name: str
    is_mine: bool = False
    started_at: datetime
    ended_at: datetime | None
    reported_at: datetime | None

    @field_validator("started_at", "ended_at", "reported_at", mode="before")
    @classmethod
    def mark_database_timestamps_as_utc(cls, value):
        if value is not None and value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value


class WashingMachineStatusOut(BaseModel):
    machine_key: str
    machine_name: str
    status: str
    active_session: WashingMachineSessionOut | None


class WashingMachineHistoryItem(BaseModel):
    id: int
    machine_key: str
    started_at: datetime
    ended_at: datetime
    end_reason: str | None
    was_reported: bool

    @field_validator("started_at", "ended_at", mode="before")
    @classmethod
    def mark_database_timestamps_as_utc(cls, value):
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value
