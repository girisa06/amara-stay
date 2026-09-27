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
      models/        SQLAlchemy models (User, Room, Booking, VisitRequest, Enquiry)
      schemas/        Pydantic request/response schemas
      routers/        auth, rooms, bookings, visits, enquiries, dashboard, tenants
      core/           security (JWT/bcrypt) and auth dependencies
      main.py         FastAPI app entrypoint
      seed.py         Seeds an admin user + sample rooms
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
   python -m app.seed      # creates admin user + sample rooms
   uvicorn app.main:app --reload --port 8000
   ```

Default seeded admin login: **admin@amarastay.in / Admin@123** — change this password before deploying.

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
