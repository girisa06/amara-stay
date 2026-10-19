import tempfile
import unittest
from datetime import date
from pathlib import Path

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from app.core.security import create_access_token, hash_password
from app.database import Base, get_db
from app.models.booking import Booking, BookingStatus
from app.models.room import Room, RoomType
from app.models.user import User, UserRole
from app.models.visit_request import VisitRequest, VisitStatus
from app.routers import auth, bookings, dashboard, rooms, visits


class AdminWorkflowTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        path = Path(self.temp_dir.name) / "admin-workflows.db"
        self.engine = create_engine(
            f"sqlite:///{path.as_posix()}",
            connect_args={"check_same_thread": False, "timeout": 10},
            poolclass=NullPool,
        )
        Base.metadata.create_all(self.engine)
        self.SessionLocal = sessionmaker(bind=self.engine, expire_on_commit=False)
        with self.SessionLocal() as db:
            self.admin = User(
                name="Test Admin",
                email="admin@example.com",
                password_hash=hash_password("Test Admin Password 2026!"),
                role=UserRole.admin,
            )
            self.resident = User(
                name="Test Resident",
                email="resident@example.com",
                password_hash=hash_password("Test Resident Password 2026!"),
                role=UserRole.tenant,
            )
            db.add_all([self.admin, self.resident])
            db.flush()
            self.admin_id = self.admin.id
            self.resident_id = self.resident.id
            self.room = Room(
                room_number="TEST-1",
                room_type=RoomType.double,
                rent=10000,
                deposit=20000,
                total_beds=1,
                available_beds=1,
                facilities=[],
            )
            db.add(self.room)
            db.commit()
            self.room_id = self.room.id

        self.tokens = {
            "admin": create_access_token({"sub": str(self.admin_id), "role": "admin"}),
            "resident": create_access_token({"sub": str(self.resident_id), "role": "tenant"}),
        }
        self.app = FastAPI()
        for router in (auth.router, rooms.router, bookings.router, visits.router, dashboard.router):
            self.app.include_router(router)

        def override_db():
            with self.SessionLocal() as db:
                yield db

        self.app.dependency_overrides[get_db] = override_db
        self.client = TestClient(self.app)

    def tearDown(self):
        self.client.close()
        self.engine.dispose()
        self.temp_dir.cleanup()

    def headers(self, role):
        return {"Authorization": f"Bearer {self.tokens[role]}"}

    def add_visit(self, reference, user_id):
        with self.SessionLocal() as db:
            visit = VisitRequest(
                user_id=user_id,
                full_name="Test Resident",
                mobile_number="9000000000",
                email="resident@example.com",
                visit_date=date(2026, 12, 1),
                time_slot="10:00 AM",
                status=VisitStatus.pending,
                reference_id=reference,
            )
            db.add(visit)
            db.commit()
            return visit.id

    def add_booking(self, reference, user_id):
        with self.SessionLocal() as db:
            booking = Booking(
                user_id=user_id,
                room_id=self.room_id,
                tenant_name="Test Resident",
                tenant_phone="9000000000",
                tenant_email="resident@example.com",
                emergency_contact_name="Contact",
                emergency_contact_phone="9111111111",
                reference_id=reference,
                status=BookingStatus.pending,
            )
            db.add(booking)
            db.commit()
            return booking.id

    def test_login_and_server_enforced_admin_access(self):
        resident_login = self.client.post(
            "/api/auth/login",
            json={"email": "resident@example.com", "password": "Test Resident Password 2026!"},
        )
        self.assertEqual(resident_login.status_code, 200)
        self.assertEqual(resident_login.json()["user"]["role"], "tenant")
        self.assertEqual(self.client.get("/api/dashboard/overview", headers=self.headers("resident")).status_code, 403)
        self.assertEqual(self.client.get("/api/dashboard/overview").status_code, 401)
        forged_role = create_access_token({"sub": str(self.resident_id), "role": "admin"})
        self.assertEqual(
            self.client.get(
                "/api/dashboard/overview",
                headers={"Authorization": f"Bearer {forged_role}"},
            ).status_code,
            403,
        )

        admin_login = self.client.post(
            "/api/auth/login",
            json={"email": "admin@example.com", "password": "Test Admin Password 2026!"},
        )
        self.assertEqual(admin_login.status_code, 200)
        self.assertEqual(admin_login.json()["user"]["role"], "admin")
        self.assertEqual(self.client.get("/api/dashboard/overview", headers=self.headers("admin")).status_code, 200)

    def test_room_availability_is_admin_only_and_resident_visible(self):
        url = f"/api/rooms/{self.room_id}/availability"
        denied = self.client.put(url, json={"is_available": False}, headers=self.headers("resident"))
        self.assertEqual(denied.status_code, 403)

        disabled = self.client.put(url, json={"is_available": False}, headers=self.headers("admin"))
        self.assertEqual(disabled.status_code, 200)
        self.assertEqual(disabled.json()["availability_status"], "unavailable")
        public_rooms = self.client.get("/api/rooms").json()
        self.assertEqual(public_rooms[0]["availability_status"], "unavailable")

        restored = self.client.put(url, json={"is_available": True}, headers=self.headers("admin"))
        self.assertEqual(restored.status_code, 200)
        self.assertEqual(restored.json()["availability_status"], "few_beds_left")

    def test_visit_approval_rejection_and_resident_status(self):
        approved_id = self.add_visit("VRTEST001", self.resident_id)
        rejected_id = self.add_visit("VRTEST002", self.resident_id)
        approve_url = f"/api/visits/{approved_id}/status"
        reject_url = f"/api/visits/{rejected_id}/status"

        self.assertEqual(self.client.put(approve_url, json={"status": "approved"}, headers=self.headers("resident")).status_code, 403)
        self.assertEqual(self.client.put(approve_url, json={"status": "approved"}, headers=self.headers("admin")).status_code, 200)
        self.assertEqual(self.client.put(approve_url, json={"status": "rejected"}, headers=self.headers("admin")).status_code, 409)
        self.assertEqual(self.client.put(reject_url, json={"status": "rejected"}, headers=self.headers("admin")).json()["status"], "rejected")

        own_visits = self.client.get("/api/visits/mine", headers=self.headers("resident"))
        self.assertEqual(own_visits.status_code, 200)
        self.assertEqual({visit["status"] for visit in own_visits.json()}, {"approved", "rejected"})

    def test_reservation_capacity_and_invalid_transitions(self):
        first_id = self.add_booking("BKTEST001", self.resident_id)
        second_id = self.add_booking("BKTEST002", self.resident_id)
        first_url = f"/api/bookings/{first_id}/status"
        second_url = f"/api/bookings/{second_id}/status"

        self.assertEqual(self.client.put(first_url, json={"status": "confirmed"}, headers=self.headers("resident")).status_code, 403)
        self.assertEqual(self.client.put(first_url, json={"status": "confirmed"}, headers=self.headers("admin")).status_code, 200)
        self.assertEqual(self.client.put(first_url, json={"status": "confirmed"}, headers=self.headers("admin")).status_code, 409)
        self.assertEqual(self.client.put(second_url, json={"status": "confirmed"}, headers=self.headers("admin")).status_code, 409)
        self.assertEqual(self.client.put(second_url, json={"status": "cancelled"}, headers=self.headers("admin")).status_code, 409)
        with self.SessionLocal() as db:
            room = db.query(Room).filter(Room.id == self.room_id).one()
            first = db.query(Booking).filter(Booking.id == first_id).one()
            second = db.query(Booking).filter(Booking.id == second_id).one()
            self.assertEqual(room.available_beds, 0)
            self.assertEqual(first.status, BookingStatus.confirmed)
            self.assertEqual(second.status, BookingStatus.pending)


if __name__ == "__main__":
    unittest.main()
