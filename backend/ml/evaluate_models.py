"""
Evaluation utility to inspect and report model metrics from saved artifacts.
"""

import os
import sys
import json
import pandas as pd

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def load_and_print_metrics():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    metrics_path = os.path.join(base_dir, "artifacts", "model_metrics.json")

    if not os.path.exists(metrics_path):
        print(f"Error: metrics file not found at {metrics_path}. Please run train_model.py first.")
        return None

    with open(metrics_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print("=" * 65)
    print(" HOUSE PRICE PREDICTION MODEL BENCHMARK REPORT")
    print("=" * 65)
    print(f"Selected Champion Model : {data.get('selected_model')}")
    print(f"Dataset Type            : {data.get('dataset_type')} (Synthetic: {data.get('is_synthetic')})")
    print(f"Training Samples        : {data.get('train_samples')}")
    print(f"Testing Samples         : {data.get('test_samples')}")
    print(f"Selection Criterion     : {data.get('selection_criterion')}")
    print("-" * 65)
    print(f"{'Model Name':<22} | {'Test R²':<10} | {'MAE (INR)':<14} | {'RMSE (INR)':<14}")
    print("-" * 65)

    for name, m in data.get("models_comparison", {}).items():
        print(f"{name:<22} | {m['test_r2']:<10.4f} | {m['test_mae_inr']:<14} | {m['test_rmse_inr']:<14}")

    print("=" * 65)
    return data

if __name__ == "__main__":
    load_and_print_metrics()
