import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.database import Base, engine
from app.routers import auth, bookings, dashboard, enquiries, payments, rooms, tenants, visits, washing_machine
from app.models.payment import Payment, PaymentSettings

logger = logging.getLogger(__name__)

app = FastAPI(title="AMARA Stay API", version="1.0.0")


@app.on_event("startup")
def create_missing_tables():
    try:
        Base.metadata.create_all(bind=engine)
    except SQLAlchemyError:
        logger.exception("Database schema initialization failed; API requests will report database errors")


@app.exception_handler(SQLAlchemyError)
async def database_error_handler(_: Request, exc: SQLAlchemyError):
    # Do not leak connection details or SQL to API clients.
    return JSONResponse(
        status_code=503,
        content={"detail": "The database is temporarily unavailable. Please try again."},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(rooms.router)
app.include_router(bookings.router)
app.include_router(visits.router)
app.include_router(enquiries.router)
app.include_router(dashboard.router)
app.include_router(tenants.router)
app.include_router(washing_machine.router)
app.include_router(payments.router)


@app.get("/")
def root():
    return {"message": "AMARA Stay API", "status": "running"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
