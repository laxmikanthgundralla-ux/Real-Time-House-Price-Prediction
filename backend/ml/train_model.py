"""
Machine Learning Training and Evaluation Pipeline.

Trains and compares:
1. Linear Regression
2. Random Forest Regressor
3. XGBoost Regressor

Evaluates on test split using:
- MAE (Mean Absolute Error)
- RMSE (Root Mean Squared Error)
- R2 Score

Selects the best performing model based on test R2 score,
saves the fitted pipeline, metrics JSON, and comparison charts.
"""

import os
import sys
import json

# Ensure UTF-8 output encoding on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import numpy as np
import pandas as pd
import joblib
import matplotlib
matplotlib.use("Agg") # Non-interactive backend for server/CLI
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from backend.ml.generate_demo_data import generate_dataset, RANDOM_SEED, LOCATIONS, PROPERTY_TYPES

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

CATEGORICAL_FEATURES = ["location", "property_type"]
NUMERICAL_FEATURES = ["area_sqft", "bedrooms", "bathrooms", "property_age", "floors", "parking"]
TARGET_COLUMN = "price_inr"

def get_preprocessor():
    """Build column transformer for categorical and numerical features."""
    return ColumnTransformer(
        transformers=[
            (
                "cat",
                OneHotEncoder(categories=[LOCATIONS, PROPERTY_TYPES], handle_unknown="ignore", sparse_output=False),
                CATEGORICAL_FEATURES
            ),
            (
                "num",
                StandardScaler(),
                NUMERICAL_FEATURES
            )
        ],
        remainder="drop"
    )

def train_and_evaluate(dataset_csv_path: str = None, artifacts_dir: str = None):
    """Run end-to-end training, model comparison, and artifact serialization."""
    if artifacts_dir is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        artifacts_dir = os.path.join(base_dir, "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)

    if dataset_csv_path is None or not os.path.exists(dataset_csv_path):
        dataset_csv_path = os.path.join(artifacts_dir, "house_data_demo.csv")
        if not os.path.exists(dataset_csv_path):
            print("Dataset not found. Generating demonstration dataset...")
            df = generate_dataset(num_samples=3500, seed=RANDOM_SEED)
            df.to_csv(dataset_csv_path, index=False)
            is_synthetic = True
        else:
            df = pd.read_csv(dataset_csv_path)
            is_synthetic = True
    else:
        df = pd.read_csv(dataset_csv_path)
        is_synthetic = True

    print(f"Loaded dataset with {len(df)} records.")
    
    # Check and handle any missing values
    df = df.dropna(subset=FEATURE_COLUMNS + [TARGET_COLUMN])
    
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN].values

    # Train / Test split (80/20) with fixed random seed
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=RANDOM_SEED
    )

    print(f"Training set: {len(X_train)} samples, Test set: {len(X_test)} samples.")

    # Candidate models
    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(
            n_estimators=150,
            max_depth=16,
            min_samples_split=4,
            random_state=RANDOM_SEED,
            n_jobs=-1
        ),
        "XGBoost Regressor": XGBRegressor(
            n_estimators=200,
            learning_rate=0.08,
            max_depth=6,
            subsample=0.85,
            colsample_bytree=0.85,
            random_state=RANDOM_SEED,
            n_jobs=-1
        )
    }

    results = {}
    fitted_pipelines = {}

    for name, model in models.items():
        print(f"\nTraining {name}...")
        preprocessor = get_preprocessor()
        pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("model", model)
        ])

        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)

        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        r2 = float(r2_score(y_test, y_pred))

        # Train metrics for overfitting check
        y_train_pred = pipeline.predict(X_train)
        train_r2 = float(r2_score(y_train, y_train_pred))

        results[name] = {
            "model_name": name,
            "test_mae": round(mae, 2),
            "test_rmse": round(rmse, 2),
            "test_r2": round(r2, 4),
            "train_r2": round(train_r2, 4),
            "test_mae_inr": f"₹{int(mae):,}",
            "test_rmse_inr": f"₹{int(rmse):,}"
        }

        fitted_pipelines[name] = pipeline
        print(f"{name} -> Test MAE: ₹{int(mae):,}, RMSE: ₹{int(rmse):,}, R²: {r2:.4f} (Train R²: {train_r2:.4f})")

    # Documented selection criterion: Model with highest Test R²
    best_model_name = max(results.keys(), key=lambda k: results[k]["test_r2"])
    best_pipeline = fitted_pipelines[best_model_name]
    best_metrics = results[best_model_name]
    print(f"\nBest performing model selected: {best_model_name} (R² = {best_metrics['test_r2']})")

    # Save best pipeline
    pipeline_path = os.path.join(artifacts_dir, "house_price_pipeline.joblib")
    joblib.dump(best_pipeline, pipeline_path)
    print(f"Saved fitted pipeline to: {pipeline_path}")

    # Prepare model metrics summary
    metrics_data = {
        "selected_model": best_model_name,
        "selection_criterion": "Highest R² score on 20% hold-out test set",
        "dataset_type": "synthetic_demonstration" if is_synthetic else "real_market_data",
        "is_synthetic": is_synthetic,
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "random_seed": RANDOM_SEED,
        "features": FEATURE_COLUMNS,
        "categorical_features": CATEGORICAL_FEATURES,
        "numerical_features": NUMERICAL_FEATURES,
        "supported_locations": LOCATIONS,
        "supported_property_types": PROPERTY_TYPES,
        "models_comparison": results,
        "best_model_metrics": best_metrics,
        "disclaimer": "Academic demonstration: metrics computed strictly on 20% test partition of synthetic demo data."
    }

    metrics_path = os.path.join(artifacts_dir, "model_metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_data, f, indent=2)
    print(f"Saved model metrics to: {metrics_path}")

    # Generate comparison plot
    plot_path = os.path.join(artifacts_dir, "model_comparison.png")
    generate_comparison_chart(results, plot_path)
    print(f"Saved comparison chart to: {plot_path}")

    # Sanity inference test
    sample_input = pd.DataFrame([{
        "location": "Bengaluru",
        "area_sqft": 1650,
        "bedrooms": 3,
        "bathrooms": 3,
        "property_age": 4,
        "floors": 2,
        "parking": 1,
        "property_type": "Apartment"
    }])
    sample_pred = best_pipeline.predict(sample_input)[0]
    print(f"Sanity test prediction for 3BHK Bengaluru (1650 sqft): ₹{int(sample_pred):,}")

    return metrics_data

def generate_comparison_chart(results: dict, output_path: str):
    """Generate professional side-by-side comparison charts."""
    names = list(results.keys())
    r2_scores = [results[n]["test_r2"] for n in names]
    mae_in_lakhs = [results[n]["test_mae"] / 100000.0 for n in names] # In Lakhs ₹
    rmse_in_lakhs = [results[n]["test_rmse"] / 100000.0 for n in names] # In Lakhs ₹

    fig, axes = plt.subplots(1, 3, figsize=(16, 5))
    fig.patch.set_facecolor("#F8FAFC")

    colors = ["#3B82F6", "#10B981", "#0D9488"]

    # 1. R2 Score (higher is better)
    bars1 = axes[0].bar(names, r2_scores, color=colors, width=0.55)
    axes[0].set_title("R² Score (Higher is Better)", fontsize=13, fontweight="bold", color="#0F172A", pad=12)
    axes[0].set_ylabel("R²", fontsize=11, fontweight="bold", color="#334155")
    axes[0].set_ylim(0, 1.05)
    axes[0].grid(axis="y", linestyle="--", alpha=0.5)
    for bar in bars1:
        yval = bar.get_height()
        axes[0].text(bar.get_x() + bar.get_width() / 2.0, yval + 0.02, f"{yval:.4f}", ha="center", va="bottom", fontweight="bold", color="#0F172A")

    # 2. MAE in Lakhs (lower is better)
    bars2 = axes[1].bar(names, mae_in_lakhs, color=colors, width=0.55)
    axes[1].set_title("Mean Absolute Error (Lower is Better)", fontsize=13, fontweight="bold", color="#0F172A", pad=12)
    axes[1].set_ylabel("MAE (₹ in Lakhs)", fontsize=11, fontweight="bold", color="#334155")
    axes[1].grid(axis="y", linestyle="--", alpha=0.5)
    for bar in bars2:
        yval = bar.get_height()
        axes[1].text(bar.get_x() + bar.get_width() / 2.0, yval + (max(mae_in_lakhs)*0.02), f"₹{yval:.2f}L", ha="center", va="bottom", fontweight="bold", color="#0F172A")

    # 3. RMSE in Lakhs (lower is better)
    bars3 = axes[2].bar(names, rmse_in_lakhs, color=colors, width=0.55)
    axes[2].set_title("Root Mean Squared Error (Lower is Better)", fontsize=13, fontweight="bold", color="#0F172A", pad=12)
    axes[2].set_ylabel("RMSE (₹ in Lakhs)", fontsize=11, fontweight="bold", color="#334155")
    axes[2].grid(axis="y", linestyle="--", alpha=0.5)
    for bar in bars3:
        yval = bar.get_height()
        axes[2].text(bar.get_x() + bar.get_width() / 2.0, yval + (max(rmse_in_lakhs)*0.02), f"₹{yval:.2f}L", ha="center", va="bottom", fontweight="bold", color="#0F172A")

    for ax in axes:
        ax.set_facecolor("#FFFFFF")
        ax.tick_params(axis="x", labelsize=10, rotation=10)
        ax.spines["top"].set_visible(False)
        ax.spines["right"].set_visible(False)

    plt.suptitle("House Price Prediction Model Benchmark (Linear Regression vs Random Forest vs XGBoost)", fontsize=14, fontweight="bold", color="#0F172A", y=1.02)
    plt.tight_layout()
    plt.savefig(output_path, dpi=200, bbox_inches="tight")
    plt.close()

if __name__ == "__main__":
    train_and_evaluate()
