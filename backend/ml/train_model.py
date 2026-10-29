"""
Production-model setup.

This project now uses the published IAAC MaAI pipeline trained on cleaned Indian
real-estate asking-price listings. Run this module to download the model artifact
and refresh the accompanying, source-attributed evaluation metadata.
"""
import os
import shutil
import json
from huggingface_hub import hf_hub_download
from backend.app.config import settings

REPO_ID = "iaac-maai/day2-example-house-price"
SOURCE_FILENAME = "model.joblib"

def train_and_evaluate(dataset_csv_path=None, artifacts_dir=None):
    # Retain signature compatibility with earlier scripts, but do not label
    # generated demo data as real-market training data.
    target_dir = artifacts_dir or settings.ARTIFACTS_DIR
    os.makedirs(target_dir, exist_ok=True)
    downloaded = hf_hub_download(repo_id=REPO_ID, filename=SOURCE_FILENAME)
    target = os.path.join(target_dir, settings.MODEL_FILENAME)
    shutil.copy2(downloaded, target)
    metrics_path = os.path.join(target_dir, settings.METRICS_FILENAME)
    if not os.path.exists(metrics_path):
        raise RuntimeError("model_metrics.json is missing. Restore the source-attributed metrics file from the backend package.")
    with open(metrics_path, encoding="utf-8") as f:
        metrics = json.load(f)
    print(f"Downloaded published real-listings model to {target}")
    print("Evaluation values in model_metrics.json are reported by the original model authors; they were not independently re-evaluated here.")
    return metrics

if __name__ == "__main__":
    train_and_evaluate()
