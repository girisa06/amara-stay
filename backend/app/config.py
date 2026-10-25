import re

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/amara_stay"
    JWT_SECRET_KEY: str = "dev-secret-key-change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DB_SSL: bool = False
    DB_SSL_CA: str = ""
    CORS_ORIGINS: str = "http://localhost:5173"
    OWNER_PHONE: str = "+91 9841321999"
    OWNER_WHATSAPP: str = "+91 9841321999"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @field_validator("DATABASE_URL", "DB_SSL_CA", mode="before")
    @classmethod
    def strip_whitespace(cls, value):
        # Pasted env values often carry stray spaces/newlines that break hostnames;
        # neither a URL nor a CA path legitimately contains whitespace here.
        return re.sub(r"\s+", "", value) if isinstance(value, str) else value

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


settings = Settings()
