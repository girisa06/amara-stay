from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import get_current_admin
from app.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.room import Room
from app.models.user import User
from app.models.visit_request import VisitRequest, VisitStatus

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/overview")
def overview(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    rooms = db.query(Room).all()
    total_rooms = len(rooms)
    total_beds = sum(r.total_beds for r in rooms)
    available_beds = sum(r.available_beds for r in rooms)
    occupied_beds = total_beds - available_beds

    pending_visits = (
        db.query(VisitRequest).filter(VisitRequest.status == VisitStatus.pending).count()
    )
    pending_reservations = (
        db.query(Booking).filter(Booking.status == BookingStatus.pending).count()
    )

    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_bookings = (
        db.query(Booking)
        .filter(Booking.status == BookingStatus.confirmed, Booking.booking_date >= month_start)
        .all()
    )
    monthly_revenue = 0
    for booking in monthly_bookings:
        room = db.query(Room).filter(Room.id == booking.room_id).first()
        if room:
            monthly_revenue += float(room.rent)

    return {
        "total_rooms": total_rooms,
        "total_beds": total_beds,
        "occupied_beds": occupied_beds,
        "available_beds": available_beds,
        "pending_visits": pending_visits,
        "pending_reservations": pending_reservations,
        "monthly_revenue": monthly_revenue,
    }


@router.get("/occupancy-trend")
def occupancy_trend(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    rooms = db.query(Room).all()
    total_beds = sum(r.total_beds for r in rooms) or 1
    occupied_now = sum(r.total_beds - r.available_beds for r in rooms)

    data = []
    months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"]
    base = max(0, occupied_now - 15)
    for i, month in enumerate(months):
        occupancy = min(total_beds, base + i * 3)
        data.append(
            {
                "month": month,
                "occupancy_rate": round((occupancy / total_beds) * 100, 1),
            }
        )
    data[-1]["occupancy_rate"] = round((occupied_now / total_beds) * 100, 1)
    return data


@router.get("/revenue-trend")
def revenue_trend(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    confirmed_bookings = (
        db.query(Booking).filter(Booking.status == BookingStatus.confirmed).all()
    )
    monthly_totals: dict[str, float] = {}
    for booking in confirmed_bookings:
        month_key = booking.booking_date.strftime("%b")
        room = db.query(Room).filter(Room.id == booking.room_id).first()
        if room:
            monthly_totals[month_key] = monthly_totals.get(month_key, 0) + float(room.rent)

    months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"]
    return [{"month": m, "revenue": monthly_totals.get(m, 0)} for m in months]


@router.get("/booking-growth")
def booking_growth(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    now = datetime.utcnow()
    data = []
    for i in range(5, -1, -1):
        start = (now - timedelta(days=30 * (i + 1)))
        end = (now - timedelta(days=30 * i))
        count = (
            db.query(Booking)
            .filter(Booking.booking_date >= start, Booking.booking_date < end)
            .count()
        )
        data.append({"month": start.strftime("%b"), "bookings": count})
    return data
