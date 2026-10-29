import os
import json
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any, Tuple

import joblib
import numpy as np
import pandas as pd
from huggingface_hub import hf_hub_download

from backend.app.config import settings
from backend.app.schemas import PredictionRequest, PredictionResponse
from backend.app.database import save_prediction

logger = logging.getLogger("backend.predictor")

# This integration uses the published IAAC MaAI model card's 20-feature pipeline.
# Only features actually available in the current website form are mapped; missing
# listing details are passed as NaN and imputed by the published pipeline.
MODEL_REPO = "iaac-maai/day2-example-house-price"
MODEL_FILENAME = "model.joblib"

CITY_ALIASES = {
    "Bengaluru": "Bangalore",
    "Bangalore": "Bangalore",
    "Delhi NCR": "New Delhi",
    "Delhi": "New Delhi",
    "Mumbai": "Mumbai",
    "Hyderabad": "Hyderabad",
    "Chennai": "Chennai",
    "Pune": "Pune",
    "Kolkata": "Kolkata",
    "Ahmedabad": "Ahmedabad",
}

def format_indian_currency(amount: float, include_words: bool = True) -> str:
    val = max(0, round(amount))
    s = str(abs(val))
    if len(s) <= 3:
        formatted = s
    else:
        last3, remaining = s[-3:], s[:-3]
        parts = []
        while remaining:
            parts.append(remaining[-2:])
            remaining = remaining[:-2]
        formatted = ",".join(reversed(parts)) + "," + last3
    base = f"₹{formatted}"
    if not include_words:
        return base
    if val >= 10_000_000:
        return f"{base} (~{val / 10_000_000:.2f} Cr)"
    if val >= 100_000:
        return f"{base} (~{val / 100_000:.2f} L)"
    return base

class ModelService:
    def __init__(self):
        self.pipeline = None
        self.metrics: Optional[Dict[str, Any]] = None
        self.is_loaded = False
        self.pipeline_path = os.path.join(settings.ARTIFACTS_DIR, settings.MODEL_FILENAME)
        self.metrics_path = os.path.join(settings.ARTIFACTS_DIR, settings.METRICS_FILENAME)
        self.load_model()

    def load_model(self) -> bool:
        try:
            os.makedirs(settings.ARTIFACTS_DIR, exist_ok=True)
            if not os.path.exists(self.pipeline_path):
                logger.info("Downloading published India housing-listings model from Hugging Face.")
                downloaded = hf_hub_download(repo_id=MODEL_REPO, filename=MODEL_FILENAME)
                # Copy the trusted repository model into the configured artifacts path.
                import shutil
                shutil.copy2(downloaded, self.pipeline_path)
            self.pipeline = joblib.load(self.pipeline_path)
            if os.path.exists(self.metrics_path):
                with open(self.metrics_path, "r", encoding="utf-8") as f:
                    self.metrics = json.load(f)
            else:
                self.metrics = None
            self.is_loaded = True
            logger.info("Published real-listings model loaded successfully.")
            return True
        except Exception as e:
            logger.exception("Unable to load/download real-listings model: %s", e)
            self.pipeline = None
            self.is_loaded = False
            return False

    def get_supported_locations(self) -> Tuple[list, list]:
        if self.metrics:
            return self.metrics.get("supported_locations", []), self.metrics.get("supported_property_types", ["Apartment"])
        return ["Mumbai", "Bengaluru", "Hyderabad", "Delhi NCR", "Chennai", "Pune", "Kolkata", "Ahmedabad"], ["Apartment"]

    def get_model_metrics(self):
        return self.metrics

    def predict(self, req: PredictionRequest) -> PredictionResponse:
        if not self.is_loaded or self.pipeline is None:
            if not self.load_model():
                raise RuntimeError("Real-listings model could not be loaded. Check deployment internet access and Hugging Face availability.")

        location = CITY_ALIASES.get(req.location.strip(), req.location.strip())
        # The published model only covers flats/apartments. Avoid implying that
        # its training data represents independent houses, villas, or penthouses.
        property_type = "Flat"
        gross_area = float(req.area_sqft)
        carpet_area = gross_area * 0.80  # documented approximation; dataset card reports missing carpet area
        floor_num = float(req.floors)

        model_input = pd.DataFrame([{
            "location": location,
            "bhk": int(req.bedrooms),
            "property_type": property_type,
            "carpet_area": carpet_area,
            "super_area": gross_area,
            "efficiency": 0.80,
            "bathroom": int(req.bathrooms),
            "balcony": np.nan,
            "balcony_was_missing": 1,
            "floor_num": floor_num,
            "total_floors": np.nan,
            "floor_ratio": np.nan,
            "facing": "Unknown",
            "view_garden": np.nan,
            "view_pool": np.nan,
            "view_main_road": np.nan,
            "transaction": "Unknown",
            "furnishing": "Unknown",
            "ownership": "Unknown",
            "parking_spaces": float(req.parking)
        }])

        log10_price = float(self.pipeline.predict(model_input)[0])
        predicted_price = float(10 ** np.clip(log10_price, 4, 10))
        best_mae = float((self.metrics or {}).get("best_model_metrics", {}).get("test_mae", 1_940_000.0))
        lower_bound = max(0.0, predicted_price - best_mae)
        upper_bound = predicted_price + best_mae
        model_name = (self.metrics or {}).get("selected_model", "Published HistGradientBoostingRegressor")
        dataset_type = (self.metrics or {}).get("dataset_type", "real_market_listings")
        is_synthetic = False

        warning = (
            "Estimate based on historical asking-price listings for flats, not verified sale prices. "
            "Property age is not used by this model; area/floor assumptions and missing amenities may affect accuracy. "
            "Not suitable for financial or investment decisions."
        )

        db_id = save_prediction(
            location=req.location, area_sqft=req.area_sqft, bedrooms=req.bedrooms,
            bathrooms=req.bathrooms, property_age=req.property_age, floors=req.floors,
            parking=req.parking, property_type=req.property_type,
            predicted_price=predicted_price, lower_range=lower_bound, upper_range=upper_bound,
            model_name=model_name, dataset_type=dataset_type, is_synthetic=False
        )

        return PredictionResponse(
            predicted_price=round(predicted_price, 2),
            predicted_price_formatted=format_indian_currency(predicted_price),
            currency="INR (₹)",
            lower_range=round(lower_bound, 2), upper_range=round(upper_bound, 2),
            lower_range_formatted=format_indian_currency(lower_bound),
            upper_range_formatted=format_indian_currency(upper_bound),
            range_disclaimer=(
                "Indicative range uses the published test MAE (±₹19.4 lakh) as a rough error scale; "
                "it is not a statistically validated confidence interval and may not fit every city/property."
            ),
            input_details={
                "location": req.location, "area_sqft": req.area_sqft, "bedrooms": req.bedrooms,
                "bathrooms": req.bathrooms, "property_age": req.property_age, "floors": req.floors,
                "parking": req.parking, "property_type": req.property_type,
                "model_area_assumption": "carpet area estimated as 80% of entered area",
                "property_age_used": False,
                "model_property_type": "Flat",
                "model_floor_interpretation": "entered floors value interpreted as floor number"
            },
            model_name=model_name, dataset_type=dataset_type, is_synthetic=is_synthetic,
            demonstration_warning=warning, prediction_id=str(db_id) if db_id else None,
            timestamp=datetime.now(timezone.utc).isoformat()
        )

model_service = ModelService()
