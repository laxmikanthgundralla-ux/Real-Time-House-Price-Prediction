import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.config import settings
from backend.app.schemas import (
    PredictionRequest,
    PredictionResponse,
    ModelMetricsResponse,
    LocationsResponse,
    HealthResponse
)
from backend.app.predictor import model_service
from backend.app.database import init_db, is_db_connected, get_recent_predictions

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("backend.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.PROJECT_VERSION}")
    init_db()
    model_service.load_model()
    yield
    # Shutdown
    logger.info("Shutting down application.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description=(
        "Production-ready FastAPI backend for Real-Time House Price Prediction Platform. "
        "Evaluates real estate properties across major Indian metro locations using trained "
        "machine learning regression pipelines."
    ),
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["System"])
async def root():
    """Return platform metadata, author information, and API links."""
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "author": settings.AUTHOR_NAME,
        "academic_year": settings.ACADEMIC_YEAR,
        "docs_url": "/docs",
        "health_url": "/health",
        "description": "Real-time AI property valuation platform for Indian residential real estate."
    }

@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """Return backend health status and model availability."""
    metrics = model_service.get_model_metrics()
    return HealthResponse(
        status="healthy" if model_service.is_loaded else "degraded",
        model_loaded=model_service.is_loaded,
        model_name=metrics.get("selected_model") if metrics else None,
        dataset_type=metrics.get("dataset_type") if metrics else None,
        is_synthetic=metrics.get("is_synthetic") if metrics else None,
        database_connected=is_db_connected(),
        version=settings.PROJECT_VERSION,
        project=settings.PROJECT_NAME,
        author=settings.AUTHOR_NAME,
        academic_year=settings.ACADEMIC_YEAR
    )

@app.get("/api/locations", response_model=LocationsResponse, tags=["Metadata"])
async def get_locations():
    """Return supported Indian cities/metros and property types."""
    locs, ptypes = model_service.get_supported_locations()
    return LocationsResponse(
        locations=locs,
        property_types=ptypes,
        count=len(locs)
    )

@app.get("/api/model-metrics", response_model=ModelMetricsResponse, tags=["Machine Learning"])
async def get_model_metrics():
    """Return measured evaluation metrics and comparative benchmark for trained models."""
    metrics = model_service.get_model_metrics()
    if not metrics:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model evaluation metrics are not available. Please run model training first."
        )
    return metrics

@app.post("/api/predict", response_model=PredictionResponse, tags=["Machine Learning"])
async def predict_price(request: PredictionRequest):
    """Predict estimated house price and return uncertainty band."""
    if not model_service.is_loaded:
        success = model_service.load_model()
        if not success:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Model pipeline is currently unavailable. Please run 'python -m backend.ml.train_model'."
            )

    try:
        prediction = model_service.predict(request)
        return prediction
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid property data: {str(ve)}"
        )
    except Exception as e:
        logger.error(f"Prediction execution error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating the house price prediction. Please verify inputs."
        )

@app.get("/api/history", tags=["Database"])
async def get_history(limit: int = 10):
    """Return recent prediction queries if PostgreSQL database is connected."""
    if not is_db_connected():
        return {
            "database_enabled": False,
            "message": "Optional PostgreSQL storage is not active. Running in stateless mode.",
            "records": []
        }
    return {
        "database_enabled": True,
        "records": get_recent_predictions(limit=limit)
    }

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": True, "detail": exc.detail}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
