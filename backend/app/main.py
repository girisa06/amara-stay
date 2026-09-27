from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import auth, bookings, dashboard, enquiries, rooms, tenants, visits

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AMARA Stay API", version="1.0.0")

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


@app.get("/")
def root():
    return {"message": "AMARA Stay API", "status": "running"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
