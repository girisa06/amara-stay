import tempfile
import unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from app.core.security import create_access_token
from app.database import Base, get_db
from app.models.user import User, UserRole
from app.models.washing_machine import WashingMachineSession
from app.routers.washing_machine import router


MACHINE_KEY = "shared-washing-machine"
BASE_URL = f"/api/washing-machines/{MACHINE_KEY}"


class WashingMachineApiTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        database_path = Path(self.temp_dir.name) / "washing-machine-test.db"
        self.engine = create_engine(
            f"sqlite:///{database_path.as_posix()}",
            connect_args={"check_same_thread": False, "timeout": 15},
            poolclass=NullPool,
        )
        Base.metadata.create_all(self.engine)
        self.SessionLocal = sessionmaker(bind=self.engine, expire_on_commit=False)
        with self.SessionLocal() as db:
            db.add_all(
                [
                    User(name="Resident One", email="one@example.test", password_hash="unused", role=UserRole.tenant),
                    User(name="Resident Two", email="two@example.test", password_hash="unused", role=UserRole.tenant),
                    User(name="Admin", email="admin@example.test", password_hash="unused", role=UserRole.admin),
                ]
            )
            db.commit()

        self.tokens = {
            1: create_access_token({"sub": "1", "role": "tenant"}),
            2: create_access_token({"sub": "2", "role": "tenant"}),
            3: create_access_token({"sub": "3", "role": "admin"}),
        }
        self.app = FastAPI()
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

    def headers(self, user_id):
        return {"Authorization": f"Bearer {self.tokens[user_id]}"}

    def test_status_requires_authentication(self):
        response = self.client.get(f"{BASE_URL}/status")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            self.client.post(f"{BASE_URL}/sessions").status_code,
            401,
        )

    def test_start_status_ownership_and_duplicate_end(self):
        headers_one = self.headers(1)
        headers_two = self.headers(2)
        self.assertEqual(self.client.get(f"{BASE_URL}/status", headers=headers_one).json()["status"], "available")

        started = self.client.post(f"{BASE_URL}/sessions", headers=headers_one)
        self.assertEqual(started.status_code, 201)
        session_id = started.json()["id"]
        self.assertEqual(started.json()["user_name"], "Resident One")
        self.assertTrue(started.json()["is_mine"])
        self.assertTrue(started.json()["started_at"].endswith(("+00:00", "Z")))

        other_status = self.client.get(f"{BASE_URL}/status", headers=headers_two).json()
        self.assertEqual(other_status["status"], "in_use")
        self.assertEqual(other_status["active_session"]["user_name"], "Resident One")
        self.assertFalse(other_status["active_session"]["is_mine"])

        conflict = self.client.post(f"{BASE_URL}/sessions", headers=headers_two)
        self.assertEqual(conflict.status_code, 409)
        denied = self.client.post(f"{BASE_URL}/sessions/{session_id}/end", headers=headers_two)
        self.assertEqual(denied.status_code, 403)

        ended = self.client.post(f"{BASE_URL}/sessions/{session_id}/end", headers=headers_one)
        self.assertEqual(ended.status_code, 200)
        repeated_end = self.client.post(f"{BASE_URL}/sessions/{session_id}/end", headers=headers_one)
        self.assertEqual(repeated_end.status_code, 200)
        self.assertIsNotNone(repeated_end.json()["ended_at"])
        self.assertEqual(self.client.get(f"{BASE_URL}/status", headers=headers_two).json()["status"], "available")

    def test_concurrent_starts_have_one_winner(self):
        def start_as(user_id):
            with TestClient(self.app) as client:
                return client.post(f"{BASE_URL}/sessions", headers=self.headers(user_id)).status_code

        with ThreadPoolExecutor(max_workers=2) as pool:
            responses = list(pool.map(start_as, (1, 2)))
        self.assertCountEqual(responses, [201, 409])

    def test_report_requires_admin_release_and_preserves_history(self):
        started = self.client.post(f"{BASE_URL}/sessions", headers=self.headers(1))
        session_id = started.json()["id"]

        report = self.client.post(f"{BASE_URL}/sessions/{session_id}/report", headers=self.headers(2))
        self.assertEqual(report.status_code, 200)
        self.assertIsNotNone(report.json()["reported_at"])

        denied = self.client.post(f"{BASE_URL}/sessions/{session_id}/release", headers=self.headers(2))
        self.assertEqual(denied.status_code, 403)
        released = self.client.post(f"{BASE_URL}/sessions/{session_id}/release", headers=self.headers(3))
        self.assertEqual(released.status_code, 200)
        self.assertEqual(released.json()["ended_at"] is not None, True)
        history = self.client.get(f"{BASE_URL}/history", headers=self.headers(2))
        self.assertEqual(history.status_code, 200)
        self.assertEqual(len(history.json()), 1)
        self.assertTrue(history.json()[0]["was_reported"])


if __name__ == "__main__":
    unittest.main()
