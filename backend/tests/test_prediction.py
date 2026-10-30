import pytest
from backend.app.predictor import model_service

def test_model_loading():
    """Verify that the model service is correctly loaded and ready."""
    assert model_service.is_loaded is True
    assert model_service.pipeline is not None
    assert model_service.metrics is not None

def test_valid_prediction(client):
    """Verify prediction workflow with a valid residential property payload."""
    payload = {
        "location": "Bengaluru",
        "area_sqft": 1600.0,
        "bedrooms": 3,
        "bathrooms": 2,
        "property_age": 3,
        "floors": 2,
        "parking": 1,
        "property_type": "Apartment"
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Check prediction fields
    assert "predicted_price" in data
    assert data["predicted_price"] > 1000000.0
    assert "₹" in data["predicted_price_formatted"]
    assert data["currency"] == "INR (₹)"
    
    # Check range uncertainty bounds
    assert data["lower_range"] < data["predicted_price"]
    assert data["upper_range"] > data["predicted_price"]
    assert "range_disclaimer" in data
    assert "test MAE" in data["range_disclaimer"]
    
    # Check demonstration / synthetic notices
    assert data["is_synthetic"] is True
    assert data["demonstration_warning"] is not None

def test_invalid_area_value(client):
    """Verify that unreasonably small or negative areas are rejected with 422."""
    payload = {
        "location": "Mumbai",
        "area_sqft": 40.0, # Below minimum allowed (100)
        "bedrooms": 1,
        "bathrooms": 1,
        "property_age": 2,
        "floors": 1,
        "parking": 0,
        "property_type": "Apartment"
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422

    # Test excessively large area (> 25000)
    payload["area_sqft"] = 35000.0
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422

def test_invalid_bedroom_count(client):
    """Verify that invalid bedroom counts (0 or > 10) are rejected with 422."""
    payload = {
        "location": "Hyderabad",
        "area_sqft": 1200.0,
        "bedrooms": 0, # Invalid: must be >= 1
        "bathrooms": 1,
        "property_age": 1,
        "floors": 1,
        "parking": 1,
        "property_type": "Apartment"
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422

    payload["bedrooms"] = 15 # Invalid: must be <= 10
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422

def test_missing_required_fields(client):
    """Verify that requests missing required fields are rejected with 422."""
    payload = {
        "location": "Pune",
        # area_sqft is missing
        "bedrooms": 2,
        "bathrooms": 2,
        "property_age": 5,
        "floors": 1,
        "parking": 1,
        "property_type": "Apartment"
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422

def test_empty_location_validation(client):
    """Verify that empty whitespace location strings are rejected."""
    payload = {
        "location": "   ",
        "area_sqft": 1200.0,
        "bedrooms": 2,
        "bathrooms": 2,
        "property_age": 5,
        "floors": 1,
        "parking": 1,
        "property_type": "Apartment"
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422

def test_history_endpoint_graceful_handling(client):
    """Verify that /api/history returns clean JSON even when DB is inactive."""
    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert "database_enabled" in data
    assert "records" in data
