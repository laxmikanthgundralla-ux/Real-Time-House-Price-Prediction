import logging
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.app.config import settings

logger = logging.getLogger("backend.database")

Base = declarative_base()

class PredictionRecord(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    location = Column(String(100), nullable=False)
    area_sqft = Column(Float, nullable=False)
    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Integer, nullable=False)
    property_age = Column(Integer, nullable=False)
    floors = Column(Integer, nullable=False)
    parking = Column(Integer, nullable=False)
    property_type = Column(String(50), nullable=False)
    predicted_price = Column(Float, nullable=False)
    lower_range = Column(Float, nullable=False)
    upper_range = Column(Float, nullable=False)
    model_name = Column(String(100), nullable=False)
    dataset_type = Column(String(50), nullable=False)
    is_synthetic = Column(String(10), default="true")

# Engine & Session
_engine = None
_SessionLocal = None
_db_connected = False

def init_db() -> bool:
    """Initialize optional database connection. Gracefully handles absence."""
    global _engine, _SessionLocal, _db_connected
    
    if not settings.ENABLE_DB or not settings.DATABASE_URL:
        logger.info("Optional PostgreSQL database is disabled. Running in local standalone mode.")
        _db_connected = False
        return False

    try:
        _engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 5} if "postgresql" in settings.DATABASE_URL else {}
        )
        # Test connection
        with _engine.connect() as conn:
            pass
        Base.metadata.create_all(bind=_engine)
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
        _db_connected = True
        logger.info("Successfully connected to PostgreSQL database.")
        return True
    except Exception as e:
        logger.warning(f"Could not connect to PostgreSQL database: {e}. Falling back to standalone mode.")
        _db_connected = False
        return False

def is_db_connected() -> bool:
    return _db_connected

def save_prediction(
    location: str,
    area_sqft: float,
    bedrooms: int,
    bathrooms: int,
    property_age: int,
    floors: int,
    parking: int,
    property_type: str,
    predicted_price: float,
    lower_range: float,
    upper_range: float,
    model_name: str,
    dataset_type: str,
    is_synthetic: bool = True
) -> Optional[int]:
    """Persist prediction details to DB if available."""
    if not _db_connected or not _SessionLocal:
        return None

    try:
        session = _SessionLocal()
        record = PredictionRecord(
            timestamp=datetime.now(timezone.utc),
            location=location,
            area_sqft=area_sqft,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            property_age=property_age,
            floors=floors,
            parking=parking,
            property_type=property_type,
            predicted_price=predicted_price,
            lower_range=lower_range,
            upper_range=upper_range,
            model_name=model_name,
            dataset_type=dataset_type,
            is_synthetic="true" if is_synthetic else "false"
        )
        session.add(record)
        session.commit()
        rec_id = record.id
        session.close()
        return rec_id
    except Exception as e:
        logger.error(f"Failed to record prediction history: {e}")
        return None

def get_recent_predictions(limit: int = 10) -> List[Dict[str, Any]]:
    """Retrieve recent prediction history if database is available."""
    if not _db_connected or not _SessionLocal:
        return []

    try:
        session = _SessionLocal()
        records = session.query(PredictionRecord).order_by(PredictionRecord.id.desc()).limit(limit).all()
        result = [
            {
                "id": r.id,
                "timestamp": r.timestamp.isoformat(),
                "location": r.location,
                "area_sqft": r.area_sqft,
                "bedrooms": r.bedrooms,
                "bathrooms": r.bathrooms,
                "property_age": r.property_age,
                "floors": r.floors,
                "parking": r.parking,
                "property_type": r.property_type,
                "predicted_price": r.predicted_price,
                "model_name": r.model_name
            }
            for r in records
        ]
        session.close()
        return result
    except Exception as e:
        logger.error(f"Failed to fetch prediction history: {e}")
        return []
