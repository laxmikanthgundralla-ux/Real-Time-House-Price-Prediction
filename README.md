# Real-Time House Price Prediction Platform

[![CI Quality Pipeline](https://github.com/placeholder/house-price-prediction/actions/workflows/tests.yml/badge.svg)](https://github.com/placeholder/house-price-prediction/actions)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.12+-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-Regressor-EB5424.svg)](https://xgboost.readthedocs.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An end-to-end, full-stack machine learning web application that estimates residential property prices across major Indian metropolitan cities. Built with an asynchronous **FastAPI** backend, a responsive **React + Vite** frontend, and evaluated regression pipelines (**Linear Regression**, **Random Forest**, and **XGBoost**).

> **Academic Demonstration Notice:** This platform was developed for an academic **Project-Based Learning (PBL)** capstone project. All valuations and error metrics are trained and benchmarked on a verified, statistically calibrated synthetic Indian real estate dataset (3,500 records).

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Architecture & Workflow](#architecture--workflow)
4. [Technology Stack](#technology-stack)
5. [Machine Learning Benchmark](#machine-learning-benchmark)
6. [Project Directory Structure](#project-directory-structure)
7. [Getting Started Locally](#getting-started-locally)
   - [Prerequisites](#prerequisites)
   - [1. Clone Repository](#1-clone-repository)
   - [2. Backend Setup & Training](#2-backend-setup--training)
   - [3. Frontend Setup](#3-frontend-setup)
   - [4. Running Automated Tests](#4-running-automated-tests)
8. [Docker & Containerized Deployment](#docker--containerized-deployment)
9. [API Documentation](#api-documentation)
10. [Optional PostgreSQL Integration](#optional-postgresql-integration)
11. [Production Deployment Guide](#production-deployment-guide)
12. [Dataset Attribution & Limitations](#dataset-attribution--limitations)
13. [Future Enhancements](#future-enhancements)
14. [Author & Academic Credits](#author--academic-credits)

---

## Project Overview

The **Real-Time House Price Prediction Platform** addresses the challenge of opacity and high variance in Indian residential real estate pricing. By capturing eight core architectural and geographic parameters, the system generates point valuations in Indian Rupees (₹) alongside empirical uncertainty ranges derived from hold-out validation errors.

### Supported Indian Metro Markets
- **Mumbai** (Financial Capital / Tier 1 High-Density)
- **Bengaluru** (Tech Corridor)
- **Hyderabad** (Cyberabad / Growth Sector)
- **Delhi NCR** (National Capital Region)
- **Chennai** (Automotive & IT Hub)
- **Pune** (Educational & IT Center)
- **Kolkata** (Eastern Metro)
- **Ahmedabad** (Commercial Center)

---

## Key Features

- **Multi-Model Regression Benchmark:** Automatically fits and evaluates Linear Regression, Random Forest, and XGBoost using hold-out test partitions.
- **Empirical Uncertainty Intervals:** Transparent price ranges computed from the champion model's Mean Absolute Error (±1 test MAE).
- **Indian Currency Formatting:** Direct representation in Lakhs (₹ L) and Crores (₹ Cr), adhering to the Indian numbering system.
- **Interactive Visual Dashboard:** Interactive bar charts powered by **Recharts** displaying R², MAE, and RMSE comparisons.
- **Production-Grade Input Validation:** Strict Pydantic v2 schemas reject out-of-range numerical values and malformed payloads.
- **Zero Stack-Trace Leakage:** Safe, friendly HTTP error envelopes without exposing internal backend tracebacks.
- **Optional PostgreSQL Telemetry:** Supports logging prediction audits without breaking local file-based offline execution.

---

## Architecture & Workflow

### Mermaid Architecture Diagram

```mermaid
flowchart TD
    User([User / Browser])

    subgraph Frontend ["Frontend (React 18 + Vite)"]
        UI[Prediction Form & Dashboard]
        Charts[Recharts Visualization]
        APIClient[API Service Module]
    end

    subgraph Backend ["Backend API (FastAPI + Uvicorn)"]
        CORS[CORS Middleware]
        Validation[Pydantic Schema Validation]
        Routes[REST API Endpoints]
        Predictor[Model Predictor Service]
    end

    subgraph ML ["Machine Learning Pipeline"]
        Pipeline[Scikit-Learn Pipeline]
        Encoders[OneHotEncoder & StandardScaler]
        XGBoost[XGBoost Champion Model]
        MetricsFile[(model_metrics.json)]
    end

    subgraph Storage ["Optional Persistence"]
        DB[(PostgreSQL Audit Log)]
    end

    User -->|HTTP Requests| UI
    UI --> APIClient
    APIClient -->|JSON Request| CORS
    CORS --> Validation
    Validation --> Routes
    Routes --> Predictor
    Predictor --> Pipeline
    Pipeline --> Encoders
    Encoders --> XGBoost
    XGBoost -->|Valuation & Range| Predictor
    Predictor -.->|Log Record| DB
    Predictor -->|PredictionResponse JSON| APIClient
    APIClient --> Charts
    APIClient --> UI
```

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, JavaScript (ES2024), Recharts 2, Lucide React, Modern CSS3 |
| **Backend** | Python 3.12+, FastAPI, Uvicorn, Pydantic v2, Pydantic Settings |
| **Machine Learning** | Scikit-Learn 1.4+, XGBoost 2.0+, Pandas 2.2+, NumPy, Joblib |
| **Database (Optional)** | PostgreSQL 16, SQLAlchemy 2.0 |
| **Testing** | Pytest 8.0+, HTTPX 0.28+ |
| **DevOps & Containers**| Docker, Docker Compose, GitHub Actions CI |

---

## Machine Learning Benchmark

The pipeline automatically evaluates all models on an unseen 20% hold-out test set (700 properties) with reproducible seed `42`.

### Actual Measured Benchmark Results

| Model Architecture | Test R² Score | Train R² Score | Test MAE (INR) | Test RMSE (INR) | Selection Status |
|---|---|---|---|---|---|
| **Linear Regression** | 0.8642 | 0.8576 | ₹48,70,252 | ₹78,21,603 | Baseline |
| **Random Forest Regressor** | 0.9810 | 0.9957 | ₹16,43,508 | ₹29,27,861 | Strong Candidate |
| **XGBoost Regressor** | **0.9815** | 0.9967 | **₹15,09,083** | **₹28,84,202** | **Champion Model** |

- **Selection Criterion:** Highest R² score on 20% hold-out test set.
- **Champion Artifact:** Serialized via Joblib to `backend/artifacts/house_price_pipeline.joblib`.

---

## Project Directory Structure

```text
house-price-prediction/
│
├── .github/
│   └── workflows/
│       └── tests.yml              # GitHub Actions CI workflow
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py              # Pydantic Settings & environment variables
│   │   ├── database.py            # Optional PostgreSQL SQLAlchemy integration
│   │   ├── main.py                # FastAPI endpoints & CORS configuration
│   │   ├── predictor.py           # Model inference & Indian currency formatting
│   │   └── schemas.py             # Pydantic input/output validation models
│   ├── artifacts/
│   │   ├── .gitkeep
│   │   ├── dataset_metadata.json  # Data origin & column specifications
│   │   ├── house_data_demo.csv    # 3,500 demo properties dataset
│   │   ├── house_price_pipeline.joblib # Trained champion pipeline
│   │   ├── model_comparison.png   # Benchmark comparative plots
│   │   └── model_metrics.json     # Measured benchmark scores
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── evaluate_models.py     # Benchmark inspector CLI
│   │   ├── generate_demo_data.py  # Calibrated synthetic data generator
│   │   └── train_model.py         # Multi-model training & selection pipeline
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py            # Session-scoped test fixtures
│   │   ├── test_health.py         # System health & metadata unit tests
│   │   └── test_prediction.py     # Prediction & validation error tests
│   ├── .env.example
│   ├── Dockerfile                 # Backend container definition
│   └── requirements.txt           # Python backend dependencies
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── AboutProject.jsx       # PBL capstone & author information
│   │   │   ├── AnalyticsDashboard.jsx # Recharts comparison visualizer
│   │   │   ├── Footer.jsx             # Site footer & repository links
│   │   │   ├── HeroSection.jsx        # Landing hero banner
│   │   │   ├── Navbar.jsx             # Sticky navigation & status badge
│   │   │   ├── NoticeBanner.jsx       # Academic demonstration notice
│   │   │   ├── PredictionForm.jsx     # Validated valuation form
│   │   │   ├── PredictionResult.jsx   # Point estimate & uncertainty card
│   │   │   └── WorkflowSection.jsx    # Architectural step cards
│   │   ├── services/
│   │   │   └── api.js                 # Centralized fetch client
│   │   ├── App.jsx                    # Root application component
│   │   ├── index.css                  # Modern responsive design tokens
│   │   └── main.jsx                   # Vite entry point
│   ├── .env.example
│   ├── Dockerfile                     # Multi-stage Nginx container definition
│   ├── nginx.conf                     # Production SPA routing config
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml                 # Local multi-service orchestrator
├── .gitignore                         # Comprehensive Git exclusions
├── LICENSE                            # MIT License
└── README.md                          # Project documentation
```

---

## Getting Started Locally

### Prerequisites
- **Python**: 3.11, 3.12, or 3.13
- **Node.js**: v18+ or v20+ with npm
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/placeholder/house-price-prediction.git
cd house-price-prediction
```

### 2. Backend Setup & Training
```bash
# Create and activate virtual environment
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Run machine learning model training & evaluation
python -m backend.ml.train_model

# Start FastAPI server with live reloading
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
The API is now running at `http://localhost:8000`.
- Swagger Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend

# Install npm packages
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Running Automated Tests
```bash
# From the project root with virtual environment activated:
pytest backend/tests -v
```

---

## Docker & Containerized Deployment

Run the entire platform (Frontend + FastAPI Backend + optional PostgreSQL) with Docker Compose:

```bash
# Build and run containers
docker-compose up --build

# Run in background
docker-compose up -d

# Stop containers
docker-compose down
```

Services exposed:
- **Frontend App**: `http://localhost:3000`
- **FastAPI Backend**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

## API Documentation

### 1. `GET /`
Returns platform metadata and author details.

### 2. `GET /health`
Returns runtime status and whether the ML model pipeline is active:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_name": "XGBoost Regressor",
  "dataset_type": "synthetic_demonstration",
  "is_synthetic": true,
  "database_connected": false,
  "version": "1.0.0",
  "project": "Real-Time House Price Prediction Platform",
  "author": "Gundralla Laxmikanth",
  "academic_year": "2026–2027"
}
```

### 3. `GET /api/locations`
Returns supported Indian metro cities and property categories.

### 4. `GET /api/model-metrics`
Returns actual measured R², MAE, and RMSE scores for all trained models.

### 5. `POST /api/predict`
Evaluates a property.

**Request Payload:**
```json
{
  "location": "Bengaluru",
  "area_sqft": 1650,
  "bedrooms": 3,
  "bathrooms": 2,
  "property_age": 4,
  "floors": 2,
  "parking": 1,
  "property_type": "Apartment"
}
```

**Response Payload:**
```json
{
  "predicted_price": 16288239.0,
  "predicted_price_formatted": "₹1,62,88,239 (~1.63 Cr)",
  "currency": "INR (₹)",
  "lower_range": 14779156.0,
  "upper_range": 17797322.0,
  "lower_range_formatted": "₹1,47,79,156 (~1.48 Cr)",
  "upper_range_formatted": "₹1,77,97,322 (~1.78 Cr)",
  "range_disclaimer": "Approximate model-based range (±1 test MAE = ₹1,509,083). This is an empirical uncertainty band representing expected prediction variance, not a statistically validated confidence interval.",
  "input_details": {
    "location": "Bengaluru",
    "area_sqft": 1650.0,
    "bedrooms": 3,
    "bathrooms": 2,
    "property_age": 4,
    "floors": 2,
    "parking": 1,
    "property_type": "Apartment"
  },
  "model_name": "XGBoost Regressor",
  "dataset_type": "synthetic_demonstration",
  "is_synthetic": true,
  "demonstration_warning": "NOTICE: Prediction is generated using a model trained on synthetic demonstration data. Values reflect realistic statistical relationships for Indian metro properties for academic demonstration.",
  "timestamp": "2026-10-28T14:45:00.000000Z"
}
```

---

## Optional PostgreSQL Integration

The backend is fully self-contained and runs locally without any database. However, production telemetry can be enabled via environment variables:

In `backend/.env`:
```env
ENABLE_DB=true
DATABASE_URL=postgresql://user:password@localhost:5432/house_db
```
When enabled:
- Prediction records, timestamps, features, and model versions are saved to `prediction_history`.
- Recent predictions are queryable via `GET /api/history`.
- If the database is unreachable or offline, the platform logs a notice and continues normal inference without interruption.

---

## Production Deployment Guide

### Architecture Decoupling Note
GitHub Pages can only host static assets and **cannot directly execute Python backends**. Therefore, deploy the frontend and backend to separate compatible platforms.

### Step 1: Deploy Backend (e.g., Render / Railway / Fly.io / AWS EC2)
1. Push repository to GitHub.
2. Create a new **Web Service** pointing to the repository root.
3. Configure settings:
   - **Runtime**: Python 3.12+ (or Docker using `backend/Dockerfile`)
   - **Build Command**: `pip install -r backend/requirements.txt && python -m backend.ml.train_model`
   - **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables:
   - `CORS_ORIGINS`: `https://your-frontend.vercel.app`
5. Verify deployment: `https://your-backend.onrender.com/health`

### Step 2: Deploy Frontend (e.g., Vercel / Netlify / Cloudflare Pages)
1. Create a new project pointing to the `frontend/` directory.
2. Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Environment Variables:
   - `VITE_API_URL`: `https://your-backend.onrender.com` (point to deployed backend)
4. Deploy and verify the live connection!

---

## Dataset Attribution & Limitations

- **Dataset Type**: Calibrated Synthetic Indian Residential Real Estate Demonstration Dataset (`house_data_demo.csv`).
- **Samples**: 3,500 property records with realistic price per sq ft distributions across 8 Indian metropolitan zones.
- **Academic Context**: Created to guarantee a reproducible, self-contained project demonstration for academic PBL assessment without reliance on external paid APIs or brittle web scraping scripts.
- **Known Limitations**:
  - Broad metro pricing: does not model specific micro-neighborhood boundaries (e.g. Koramangala vs Whitefield).
  - Empirical uncertainty band: based on test MAE (±1 MAE) rather than formal conformal prediction or Bayesian credible intervals.

---

## Future Enhancements

- [ ] Micro-locality GIS mapping with Leaflet / Mapbox.
- [ ] SHAP (SHapley Additive exPlanations) visual feature importance breakdown per prediction.
- [ ] Conformal prediction for statistically rigorous finite-sample coverage intervals.
- [ ] Automated real-time ingestion pipelines from verified public municipal property registration registries.

---

## Author & Academic Credits

- **Author**: Gundralla Laxmikanth
- **Project**: Real-Time House Price Prediction Platform
- **Academic Year**: 2026–2027
- **Submission**: College Project-Based Learning (PBL) Capstone Project
- **License**: [MIT License](LICENSE)
