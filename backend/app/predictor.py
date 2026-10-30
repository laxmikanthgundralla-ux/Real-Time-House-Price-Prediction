import os
import json
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any, Tuple
import joblib
import pandas as pd

from backend.app.config import settings
from backend.app.schemas import PredictionRequest, PredictionResponse, ModelMetricsResponse
from backend.app.database import save_prediction

logger = logging.getLogger("backend.predictor")

FEATURE_COLUMNS = [
    "location",
    "area_sqft",
    "bedrooms",
    "bathrooms",
    "property_age",
    "floors",
    "parking",
    "property_type"
]

def format_indian_currency(amount: float, include_words: bool = True) -> str:
    """Format numeric value according to the Indian numbering system (Lakhs & Crores)."""
    val = round(amount)
    s = str(abs(val))
    if len(s) <= 3:
        formatted = s
    else:
        last3 = s[-3:]
        remaining = s[:-3]
        parts = []
        while remaining:
            parts.append(remaining[-2:])
            remaining = remaining[:-2]
        formatted = ",".join(reversed(parts)) + "," + last3

    sign = "-" if val < 0 else ""
    base_str = f"{sign}₹{formatted}"

    if not include_words:
        return base_str

    if abs(val) >= 10_000_000:
        cr = val / 10_000_000.0
        return f"{base_str} (~{cr:.2f} Cr)"
    elif abs(val) >= 100_000:
        lakhs = val / 100_000.0
        return f"{base_str} (~{lakhs:.2f} L)"
    return base_str

class ModelService:
    def __init__(self):
        self.pipeline = None
        self.metrics: Optional[Dict[str, Any]] = None
        self.is_loaded: bool = False
        self.pipeline_path = os.path.join(settings.ARTIFACTS_DIR, settings.MODEL_FILENAME)
        self.metrics_path = os.path.join(settings.ARTIFACTS_DIR, settings.METRICS_FILENAME)
        self.load_model()

    def load_model(self) -> bool:
        """Load fitted pipeline and evaluation metrics from artifacts directory."""
        try:
            if not os.path.exists(self.pipeline_path):
                logger.warning(
                    f"Model pipeline not found at {self.pipeline_path}. "
                    "Run 'python -m backend.ml.train_model' to generate artifacts."
                )
                self.is_loaded = False
                return False

            self.pipeline = joblib.load(self.pipeline_path)

            if os.path.exists(self.metrics_path):
                with open(self.metrics_path, "r", encoding="utf-8") as f:
                    self.metrics = json.load(f)
            else:
                self.metrics = None

            self.is_loaded = True
            logger.info("Successfully loaded ML pipeline and metrics.")
            return True
        except Exception as e:
            logger.error(f"Error loading model pipeline: {e}")
            self.pipeline = None
            self.metrics = None
            self.is_loaded = False
            return False

    def get_supported_locations(self) -> Tuple[list, list]:
        if self.metrics and "supported_locations" in self.metrics:
            return (
                self.metrics["supported_locations"],
                self.metrics.get("supported_property_types", ["Apartment", "Independent House", "Villa", "Penthouse"])
            )
        return (
            ["Mumbai", "Bengaluru", "Hyderabad", "Delhi NCR", "Chennai", "Pune", "Kolkata", "Ahmedabad"],
            ["Apartment", "Independent House", "Villa", "Penthouse"]
        )

    def get_model_metrics(self) -> Optional[Dict[str, Any]]:
        return self.metrics

    def predict(self, req: PredictionRequest) -> PredictionResponse:
        """Perform inference with input validation and empirical range estimation."""
        if not self.is_loaded or self.pipeline is None:
            # Try reloading once in case artifact was generated
            if not self.load_model():
                raise RuntimeError(
                    "Model pipeline is not loaded. Train the model by running 'python -m backend.ml.train_model'."
                )

        # Build feature DataFrame matching exact training schema and order
        input_dict = {
            "location": req.location,
            "area_sqft": float(req.area_sqft),
            "bedrooms": int(req.bedrooms),
            "bathrooms": int(req.bathrooms),
            "property_age": int(req.property_age),
            "floors": int(req.floors),
            "parking": int(req.parking),
            "property_type": req.property_type
        }
        df_input = pd.DataFrame([input_dict], columns=FEATURE_COLUMNS)

        # Run model inference
        raw_pred = float(self.pipeline.predict(df_input)[0])
        # Floor price at a realistic baseline minimum
        predicted_price = max(500_000.0, raw_pred)

        # Empirical uncertainty range: derived from test MAE of best model
        best_mae = 1_500_000.0 # sensible default fallback
        if self.metrics and "best_model_metrics" in self.metrics:
            best_mae = float(self.metrics["best_model_metrics"].get("test_mae", best_mae))

        lower_bound = max(200_000.0, predicted_price - best_mae)
        upper_bound = predicted_price + best_mae

        model_name = self.metrics.get("selected_model", "XGBoost Regressor") if self.metrics else "Trained Regressor"
        dataset_type = self.metrics.get("dataset_type", "synthetic_demonstration") if self.metrics else "synthetic_demonstration"
        is_synthetic = self.metrics.get("is_synthetic", True) if self.metrics else True

        warning = (
            "NOTICE: Prediction is generated using a model trained on synthetic demonstration data. "
            "Values reflect realistic statistical relationships for Indian metro properties for academic demonstration."
            if is_synthetic else None
        )

        # Persist to database if enabled
        db_id = save_prediction(
            location=req.location,
            area_sqft=req.area_sqft,
            bedrooms=req.bedrooms,
            bathrooms=req.bathrooms,
            property_age=req.property_age,
            floors=req.floors,
            parking=req.parking,
            property_type=req.property_type,
            predicted_price=predicted_price,
            lower_range=lower_bound,
            upper_range=upper_bound,
            model_name=model_name,
            dataset_type=dataset_type,
            is_synthetic=is_synthetic
        )

        return PredictionResponse(
            predicted_price=round(predicted_price, 2),
            predicted_price_formatted=format_indian_currency(predicted_price),
            currency="INR (₹)",
            lower_range=round(lower_bound, 2),
            upper_range=round(upper_bound, 2),
            lower_range_formatted=format_indian_currency(lower_bound),
            upper_range_formatted=format_indian_currency(upper_bound),
            range_disclaimer=(
                f"Approximate model-based range (±1 test MAE = ₹{int(best_mae):,}). "
                "This is an empirical uncertainty band representing expected prediction variance, "
                "not a statistically validated confidence interval."
            ),
            input_details=input_dict,
            model_name=model_name,
            dataset_type=dataset_type,
            is_synthetic=is_synthetic,
            demonstration_warning=warning,
            prediction_id=str(db_id) if db_id else None,
            timestamp=datetime.now(timezone.utc).isoformat()
        )

# Global singleton
model_service = ModelService()
