from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

connect_args = {}
if settings.DB_SSL:
    # Managed MySQL (e.g. Aiven) requires TLS; pass the provider CA to verify the server.
    # Without a CA the connection is encrypted but the server certificate is not verified.
    connect_args["ssl"] = (
        {"ca": settings.DB_SSL_CA} if settings.DB_SSL_CA else {"check_hostname": False}
    )

engine = create_engine(
    settings.DATABASE_URL, pool_pre_ping=True, pool_recycle=3600, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
