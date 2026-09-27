"""Seed the database with an admin user and sample rooms.

Run with: python -m app.seed
"""

from app.core.security import hash_password
from app.database import Base, SessionLocal, engine
from app.models.room import Room, RoomPhoto, RoomType
from app.models.user import User, UserRole

ROOM_IMAGES = [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1540518614846-7a939ddd6e11?auto=format&fit=crop&w=1000&q=80",
]

SAMPLE_ROOMS = [
    {
        "room_number": "A101",
        "room_type": RoomType.single,
        "rent": 12000,
        "deposit": 24000,
        "total_beds": 1,
        "available_beds": 1,
        "room_size": "120 sq.ft",
        "description": "A private single-sharing room with attached balcony, ideal for working professionals who value privacy and quiet.",
        "facilities": ["WiFi", "AC", "Attached Washroom", "Wardrobe", "Study Table"],
        "food_plan": "Breakfast and dinner included, vegetarian and non-vegetarian options available.",
        "house_rules": "Entry timing 10:00 PM. Visitors allowed only in common areas till 8:00 PM.",
    },
    {
        "room_number": "A102",
        "room_type": RoomType.double,
        "rent": 9000,
        "deposit": 18000,
        "total_beds": 2,
        "available_beds": 1,
        "room_size": "160 sq.ft",
        "description": "Spacious double-sharing room with ample natural light and storage for two.",
        "facilities": ["WiFi", "AC", "Common Washroom", "Wardrobe", "Housekeeping"],
        "food_plan": "Breakfast, lunch and dinner included on request.",
        "house_rules": "Entry timing 10:00 PM. Quiet hours after 11:00 PM.",
    },
    {
        "room_number": "B201",
        "room_type": RoomType.triple,
        "rent": 7500,
        "deposit": 15000,
        "total_beds": 3,
        "available_beds": 3,
        "room_size": "180 sq.ft",
        "description": "Comfortable triple-sharing room, popular with students, close to the common study lounge.",
        "facilities": ["WiFi", "Fan", "Common Washroom", "Wardrobe", "RO Water"],
        "food_plan": "Breakfast and dinner included.",
        "house_rules": "Entry timing 9:30 PM. ID proof mandatory at check-in.",
    },
    {
        "room_number": "B202",
        "room_type": RoomType.four,
        "rent": 6000,
        "deposit": 12000,
        "total_beds": 4,
        "available_beds": 2,
        "room_size": "200 sq.ft",
        "description": "Budget-friendly four-sharing room with individual lockers and bunk beds.",
        "facilities": ["WiFi", "Fan", "Common Washroom", "Locker", "Laundry"],
        "food_plan": "Breakfast and dinner included.",
        "house_rules": "Entry timing 9:30 PM. Lights out by midnight.",
    },
    {
        "room_number": "C301",
        "room_type": RoomType.single,
        "rent": 13500,
        "deposit": 27000,
        "total_beds": 1,
        "available_beds": 0,
        "room_size": "130 sq.ft",
        "description": "Premium single room on the top floor with city view and dedicated workspace.",
        "facilities": ["WiFi", "AC", "Attached Washroom", "Wardrobe", "CCTV", "Housekeeping"],
        "food_plan": "All three meals included, customizable diet plans available.",
        "house_rules": "Entry timing 10:30 PM. Guests must register at the front desk.",
    },
    {
        "room_number": "C302",
        "room_type": RoomType.double,
        "rent": 9500,
        "deposit": 19000,
        "total_beds": 2,
        "available_beds": 2,
        "room_size": "165 sq.ft",
        "description": "Bright double-sharing room facing the garden, close to the dining hall.",
        "facilities": ["WiFi", "AC", "Common Washroom", "Wardrobe", "Security"],
        "food_plan": "Breakfast and dinner included.",
        "house_rules": "Entry timing 10:00 PM.",
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin_email = "admin@amarastay.in"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                name="AMARA Admin",
                email=admin_email,
                phone="+91 90000 00000",
                password_hash=hash_password("Admin@123"),
                role=UserRole.admin,
            )
            db.add(admin)
            print(f"Created admin user: {admin_email} / Admin@123")

        if db.query(Room).count() == 0:
            for i, room_data in enumerate(SAMPLE_ROOMS):
                room = Room(**room_data)
                db.add(room)
                db.flush()
                image_pool = ROOM_IMAGES[i % len(ROOM_IMAGES):] + ROOM_IMAGES[: i % len(ROOM_IMAGES)]
                for url in image_pool[:3]:
                    db.add(RoomPhoto(room_id=room.id, url=url))
            print(f"Seeded {len(SAMPLE_ROOMS)} rooms")

        db.commit()
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
