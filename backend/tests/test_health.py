import pytest

def test_root_endpoint(client):
    """Verify application metadata and author credentials."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "Real-Time House Price Prediction Platform"
    assert data["author"] == "Gundralla Laxmikanth"
    assert data["academic_year"] == "2026–2027"
    assert data["version"] == "1.0.0"

def test_health_check_endpoint(client):
    """Verify system health and model availability status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert data["model_loaded"] is True
    assert data["model_name"] is not None
    assert data["author"] == "Gundralla Laxmikanth"

def test_locations_endpoint(client):
    """Verify supported locations and property types."""
    response = client.get("/api/locations")
    assert response.status_code == 200
    data = response.json()
    assert "locations" in data
    assert "property_types" in data
    assert len(data["locations"]) >= 5
    assert "Bengaluru" in data["locations"]
    assert "Apartment" in data["property_types"]

def test_model_metrics_endpoint(client):
    """Verify that model comparison metrics are available and accurately structured."""
    response = client.get("/api/model-metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["selected_model"] is not None
    assert "models_comparison" in data
    
    # Check that all three candidate models are present
    models = data["models_comparison"]
    assert "Linear Regression" in models
    assert "Random Forest" in models
    assert "XGBoost Regressor" in models
    
    # Verify non-trivial actual measured evaluation metrics
    for model_name, metrics in models.items():
        assert 0.0 <= metrics["test_r2"] <= 1.0
        assert metrics["test_mae"] > 0
        assert metrics["test_rmse"] > 0
        assert "₹" in metrics["test_mae_inr"]
