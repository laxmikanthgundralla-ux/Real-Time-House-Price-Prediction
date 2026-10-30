import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Real-Time House Price Prediction Platform"
    PROJECT_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    AUTHOR_NAME: str = "Gundralla Laxmikanth"
    ACADEMIC_YEAR: str = "2026–2027"
    
    # CORS Origins
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://localhost:4173"
    
    # Artifacts Directory
    ARTIFACTS_DIR: str = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "artifacts"
    )
    MODEL_FILENAME: str = "house_price_pipeline.joblib"
    METRICS_FILENAME: str = "model_metrics.json"
    
    # Optional PostgreSQL Configuration
    DATABASE_URL: str = ""
    ENABLE_DB: bool = False
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings()
