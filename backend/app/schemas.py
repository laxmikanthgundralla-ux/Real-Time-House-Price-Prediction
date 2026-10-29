from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, field_validator

class PredictionRequest(BaseModel):
    location: str = Field(..., description="Indian city/metro location, e.g., Mumbai, Bengaluru, Hyderabad")
    area_sqft: float = Field(..., gt=100, lt=25000, description="Total property area in square feet (100 to 25,000)")
    bedrooms: int = Field(..., ge=1, le=10, description="Number of bedrooms (1 to 10)")
    bathrooms: int = Field(..., ge=1, le=10, description="Number of bathrooms (1 to 10)")
    property_age: int = Field(..., ge=0, le=100, description="Property age in years (0 to 100)")
    floors: int = Field(..., ge=1, le=60, description="Total number of floors or floor level (1 to 60)")
    parking: int = Field(..., ge=0, le=1, description="Parking availability (1 for Yes, 0 for No)")
    property_type: str = Field(..., description="Property type: Apartment, Independent House, Villa, Penthouse")

    @field_validator("location")
    @classmethod
    def validate_location(cls, v: str) -> str:
        clean = v.strip()
        if not clean:
            raise ValueError("Location cannot be empty")
        return clean

    @field_validator("property_type")
    @classmethod
    def validate_property_type(cls, v: str) -> str:
        clean = v.strip()
        if not clean:
            raise ValueError("Property type cannot be empty")
        return clean

class PredictionResponse(BaseModel):
    predicted_price: float = Field(..., description="Estimated house selling price in Indian Rupees")
    predicted_price_formatted: str = Field(..., description="Formatted Indian currency representation")
    currency: str = Field(default="INR (₹)")
    lower_range: float = Field(..., description="Approximate model lower bound")
    upper_range: float = Field(..., description="Approximate model upper bound")
    lower_range_formatted: str = Field(..., description="Formatted lower bound in INR")
    upper_range_formatted: str = Field(..., description="Formatted upper bound in INR")
    range_disclaimer: str = Field(
        default="Approximate model-based range derived from test MAE (±1 MAE). This is an empirical uncertainty band, not a statistically validated confidence interval."
    )
    input_details: Dict[str, Any]
    model_name: str
    dataset_type: str
    is_synthetic: bool
    demonstration_warning: Optional[str] = None
    prediction_id: Optional[str] = None
    timestamp: str

class ModelBenchmarkItem(BaseModel):
    model_name: str
    test_mae: float
    test_rmse: float
    test_r2: float
    train_r2: float
    test_mae_inr: str
    test_rmse_inr: str

class ModelMetricsResponse(BaseModel):
    selected_model: str
    selection_criterion: str
    dataset_type: str
    is_synthetic: bool
    train_samples: int
    test_samples: int
    random_seed: int
    features: List[str]
    supported_locations: List[str]
    supported_property_types: List[str]
    models_comparison: Dict[str, ModelBenchmarkItem]
    best_model_metrics: ModelBenchmarkItem
    disclaimer: str

class LocationsResponse(BaseModel):
    locations: List[str]
    property_types: List[str]
    count: int

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: Optional[str] = None
    dataset_type: Optional[str] = None
    is_synthetic: Optional[bool] = None
    database_connected: bool = False
    version: str
    project: str
    author: str
    academic_year: str
