# AMARA Stay

A production-ready booking platform for **AMARA Ladies PG** in Chennai. Tenants can browse rooms, book visits, reserve beds and send enquiries; the owner manages everything from an admin dashboard.

## Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios, React Hook Form, Framer Motion, Recharts, Lucide Icons
- **Backend:** FastAPI, SQLAlchemy, MySQL (PyMySQL), JWT auth (python-jose + passlib/bcrypt)

## Project Structure

```
amara-stay/
  backend/
    app/
      models/        SQLAlchemy models (User, Room, Booking, Payment, VisitRequest, Enquiry)
      schemas/        Pydantic request/response schemas
      routers/        auth, rooms, bookings, payments, visits, enquiries, dashboard, tenants
      core/           security (JWT/bcrypt) and auth dependencies
      main.py         FastAPI app entrypoint
      seed.py         Seeds sample rooms only (when none exist)
      create_admin.py Secure interactive administrator setup
    requirements.txt
    .env.example
  frontend/
    src/
      api/            axios client + one module per resource
      components/      layout, home, rooms, admin, common
      context/        AuthContext (JWT session)
      pages/          public pages + pages/admin/* (dashboard)
      routes/         ProtectedRoute, AdminRoute
    .env.example
```

## Backend Setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE amara_stay;
   ```
2. Copy `.env.example` to `.env` and set `DATABASE_URL` / `JWT_SECRET_KEY`.
3. Install dependencies and run:
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m app.seed      # adds sample rooms only when no rooms exist
   python -m app.create_admin  # securely create or promote an admin account
   uvicorn app.main:app --reload --port 8000
   ```

There is no default administrator account or password. Run `python -m app.create_admin` from `backend/` in a trusted terminal. It prompts for account details and a password without echoing it. To promote an existing resident account, enter that account's email and confirm by typing `PROMOTE` when prompted. Never expose this command through a public endpoint.

Admin portal: `http://localhost:5173/admin/login`; dashboard: `http://localhost:5173/admin/dashboard`.

### Resident UPI payments

The API creates the additive `payments` and `payment_settings` tables at startup using the existing SQLAlchemy `create_all` setup. Configure the actual UPI ID from **Admin → Payment Verification**; no payment ID is prefilled. Residents can submit proof at `/my-payments`. Proof images are kept in a private backend directory (default: `backend/private_payment_proofs`), outside frontend public assets, and served only through authenticated ownership/admin checks. Set `PAYMENT_PROOF_DIR` to choose a different private storage directory. Keep this directory private and include it in deployment backups. A confirmed booking supplies the displayed current rent; due dates are not modeled and therefore show as not configured.

An admin reviews submissions at `/admin/payments`, checks the transaction in UPI/bank records, then verifies or rejects it with a reason. Residents can resubmit rejected proof for that month. The previous rejected proof is replaced on resubmission; payment records are unique per resident and billing month.

API docs available at `http://localhost:8000/docs`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The dev server proxies `/api/*` to `http://localhost:8000` (see `vite.config.js`), so no CORS setup is needed locally.

## Notes on Implementation Choices

- **Room photos** are managed as a list of image URLs (entered in the admin Room form, one per line) rather than direct binary file uploads, to keep the backend storage-agnostic. Swap in S3/Cloudinary upload + a file input if you need direct uploads.
- **Visit requests** can be submitted by guests (no login required) or by logged-in tenants; bed reservations require a tenant account since the reservation is tied to a user record.
- **Dashboard trend charts** (occupancy/revenue/booking growth) are computed from live booking and room data in the database.
- Seeded content uses Unsplash stock photography as placeholders — replace with real property photos before launch.

## Default Ports

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173` (or next available port)
