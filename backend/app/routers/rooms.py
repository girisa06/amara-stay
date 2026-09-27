from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.core.deps import get_current_admin
from app.database import get_db
from app.models.room import Room, RoomPhoto, RoomType
from app.models.user import User
from app.schemas.room import RoomCreate, RoomOut, RoomUpdate

router = APIRouter(prefix="/api/rooms", tags=["rooms"])


def _apply_photos(db: Session, room: Room, photo_urls: list[str]):
    db.query(RoomPhoto).filter(RoomPhoto.room_id == room.id).delete()
    for url in photo_urls:
        db.add(RoomPhoto(room_id=room.id, url=url))


@router.get("", response_model=list[RoomOut])
def list_rooms(
    room_type: RoomType | None = None,
    min_rent: Decimal | None = None,
    max_rent: Decimal | None = None,
    availability: str | None = Query(None, description="available|few_beds_left|fully_occupied"),
    sort: str | None = Query(None, description="price_asc|price_desc|popular"),
    db: Session = Depends(get_db),
):
    query = db.query(Room).options(joinedload(Room.photos))

    if room_type:
        query = query.filter(Room.room_type == room_type)
    if min_rent is not None:
        query = query.filter(Room.rent >= min_rent)
    if max_rent is not None:
        query = query.filter(Room.rent <= max_rent)

    rooms = query.all()

    if availability:
        rooms = [r for r in rooms if r.availability_status == availability]

    if sort == "price_asc":
        rooms.sort(key=lambda r: r.rent)
    elif sort == "price_desc":
        rooms.sort(key=lambda r: r.rent, reverse=True)
    elif sort == "popular":
        rooms.sort(key=lambda r: r.total_beds - r.available_beds, reverse=True)

    return rooms


@router.get("/{room_id}", response_model=RoomOut)
def get_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).options(joinedload(Room.photos)).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room


@router.post("", response_model=RoomOut, status_code=201)
def create_room(payload: RoomCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    existing = db.query(Room).filter(Room.room_number == payload.room_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Room number already exists")

    data = payload.model_dump(exclude={"photo_urls"})
    room = Room(**data)
    db.add(room)
    db.commit()
    db.refresh(room)

    _apply_photos(db, room, payload.photo_urls)
    db.commit()
    db.refresh(room)
    return room


@router.put("/{room_id}", response_model=RoomOut)
def update_room(
    room_id: int,
    payload: RoomUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    update_data = payload.model_dump(exclude_unset=True, exclude={"photo_urls"})
    for field, value in update_data.items():
        setattr(room, field, value)

    if payload.photo_urls is not None:
        _apply_photos(db, room, payload.photo_urls)

    db.commit()
    db.refresh(room)
    return room


@router.delete("/{room_id}", status_code=204)
def delete_room(room_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    db.delete(room)
    db.commit()
    return None
