"""Seed the PG's room types without creating or changing user accounts.

Run with: python -m app.seed

Create the first administrator separately with: python -m app.create_admin

Rents come from the owner's PG details sheet. Deposit and bed availability were
not provided, so deposit is 0 and every bed starts as available; update both
from the admin dashboard.
"""

from app.database import Base, SessionLocal, engine
from app.models.room import Room, RoomPhoto, RoomType

BASE_FACILITIES = [
    "3 Meals Complimentary",
    "Self-Cooking Kitchen",
    "Washing Machine",
    "High-Speed Wi-Fi",
    "Individual Lockable Locker",
]
FOOD_PLAN = "Three times complimentary homestyle food. Kitchen also available for self-cooking."
HOUSE_RULES = (
    "Inform 30 days in advance before vacating. "
    "Enter the hostel before 10:30 PM. "
    "Drinking and smoking are strictly prohibited."
)

IMG = {
    RoomType.double: ["/images/room-2-sharing.jpeg", "/images/room-lockers.jpeg"],
    RoomType.triple: ["/images/room-3-sharing.jpeg", "/images/room-lockers.jpeg"],
    RoomType.four: ["/images/room-4-sharing.jpeg", "/images/room-lockers.jpeg"],
}

# (room_number, type, beds, is_ac, rent)
ROOMS = [
    ("2S-NAC", RoomType.double, 2, False, 7500),
    ("2S-AC", RoomType.double, 2, True, 12500),
    ("3S-NAC", RoomType.triple, 3, False, 7000),
    ("3S-AC", RoomType.triple, 3, True, 9000),
    ("4S-NAC", RoomType.four, 4, False, 6500),
    ("4S-AC", RoomType.four, 4, True, 8000),
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Room).count() == 0:
            for number, rtype, beds, is_ac, rent in ROOMS:
                ac_label = "AC" if is_ac else "Non-AC"
                room = Room(
                    room_number=number,
                    room_type=rtype,
                    rent=rent,
                    deposit=0,
                    total_beds=beds,
                    available_beds=beds,
                    description=f"{beds} sharing {ac_label} room. Rent is per bed per month.",
                    facilities=[ac_label] + BASE_FACILITIES,
                    food_plan=FOOD_PLAN,
                    house_rules=HOUSE_RULES,
                )
                db.add(room)
                db.flush()
                for url in IMG[rtype]:
                    db.add(RoomPhoto(room_id=room.id, url=url))
            print(f"Seeded {len(ROOMS)} rooms")

        db.commit()
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
