from io import BytesIO
import tempfile
import unittest
from pathlib import Path
from PIL import Image

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from app.core.security import create_access_token, hash_password
from app.database import Base, get_db
from app.models.payment import Payment, PaymentStatus
from app.models.user import User, UserRole
from app.routers import payments

buffer = BytesIO()
Image.new("RGB", (1, 1), "white").save(buffer, format="PNG")
PNG = buffer.getvalue()
buffer = BytesIO()
Image.new("RGB", (1, 1), "white").save(buffer, format="JPEG")
JPEG = buffer.getvalue()


class PaymentWorkflowTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.old_proof_dir = payments.PROOF_DIR
        payments.PROOF_DIR = Path(self.temp.name) / "private-proofs"
        self.engine = create_engine(f"sqlite:///{Path(self.temp.name) / 'payments.db'}", connect_args={"check_same_thread": False}, poolclass=NullPool)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine, expire_on_commit=False)
        with self.Session() as db:
            admin = User(name="Admin", email="admin@test.local", password_hash=hash_password("admin password"), role=UserRole.admin)
            resident = User(name="Resident", email="resident@test.local", password_hash=hash_password("resident password"), role=UserRole.tenant)
            other = User(name="Other", email="other@test.local", password_hash=hash_password("other password"), role=UserRole.tenant)
            db.add_all([admin, resident, other]); db.commit()
            self.admin_id, self.resident_id, self.other_id = admin.id, resident.id, other.id
        self.tokens = {name: create_access_token({"sub": str(uid), "role": role}) for name, uid, role in [
            ("admin", self.admin_id, "admin"), ("resident", self.resident_id, "tenant"), ("other", self.other_id, "tenant")
        ]}
        self.app = FastAPI()
        self.app.include_router(payments.router)
        def override_db():
            with self.Session() as db: yield db
        self.app.dependency_overrides[get_db] = override_db
        self.client = TestClient(self.app)

    def tearDown(self):
        payments.PROOF_DIR = self.old_proof_dir
        self.engine.dispose(); self.temp.cleanup()

    def auth(self, who): return {"Authorization": f"Bearer {self.tokens[who]}"}
    def submit(self, who="resident", name="proof.png", media="image/png", body=PNG, month="2026-05"):
        return self.client.post("/api/payments/submit", headers=self.auth(who), data={"billing_period": month, "amount": "12000", "payment_date": "2026-05-02", "transaction_reference": "UPI123"}, files={"proof": (name, body, media)})

    def test_submit_duplicate_review_resubmit_and_private_proof(self):
        created = self.submit(); self.assertEqual(created.status_code, 201, created.text)
        payment_id = created.json()["id"]
        self.assertEqual(created.json()["status"], "pending")
        admin_rows = self.client.get("/api/admin/payments?status=pending", headers=self.auth("admin"))
        self.assertEqual(admin_rows.status_code, 200)
        self.assertEqual(admin_rows.json()[0]["id"], payment_id)
        with self.Session() as db:
            saved = db.query(Payment).filter(Payment.id == payment_id).one()
            self.assertEqual(saved.status, PaymentStatus.pending)
        self.assertEqual(self.submit().status_code, 409)
        self.assertEqual(self.client.get(f"/api/payments/{payment_id}/proof", headers=self.auth("other")).status_code, 404)
        self.assertEqual(self.client.get(f"/api/payments/{payment_id}/proof", headers=self.auth("resident")).status_code, 200)
        self.assertEqual(self.client.get("/api/admin/payments", headers=self.auth("resident")).status_code, 403)
        self.assertEqual(self.client.post(f"/api/admin/payments/{payment_id}/reject", headers=self.auth("admin"), json={}).status_code, 422)
        rejected = self.client.post(f"/api/admin/payments/{payment_id}/reject", headers=self.auth("admin"), json={"reason": "Reference not found"})
        self.assertEqual(rejected.status_code, 200); self.assertEqual(rejected.json()["status"], "rejected")
        resubmitted = self.submit()
        self.assertEqual(resubmitted.status_code, 201); self.assertEqual(resubmitted.json()["status"], "pending")
        verified = self.client.post(f"/api/admin/payments/{payment_id}/verify", headers=self.auth("admin"))
        self.assertEqual(verified.status_code, 200); self.assertEqual(verified.json()["status"], "verified")
        self.assertEqual(verified.json()["reviewer_id"], self.admin_id)
        self.assertEqual(self.submit().status_code, 409)
        self.assertEqual(self.client.get("/api/payments/my", headers=self.auth("other")).json(), [])

    def test_invalid_images_and_large_uploads_rejected(self):
        jpeg = self.submit(name="proof.jpeg", media="image/jpeg", body=JPEG)
        self.assertEqual(jpeg.status_code, 201, jpeg.text)
        self.assertEqual(self.submit(name="bad.png", body=b"not an image").status_code, 400)
        self.assertEqual(self.submit(name="bad.txt", media="text/plain").status_code, 400)
        self.assertEqual(self.submit(name="big.png", body=b"\x89PNG\r\n\x1a\n" + b"0" * (5 * 1024 * 1024)).status_code, 413)


if __name__ == "__main__": unittest.main()
