"""
Generate a clearly labeled synthetic Indian property market dataset.

IMPORTANT:
This dataset is generated for development, academic evaluation, and demonstration
purposes for the Real-Time House Price Prediction Platform. It provides realistic
statistical distributions and relationships observed in major Indian metro markets,
but is explicitly labeled as synthetic demo data.
"""

import os
import json
import numpy as np
import pandas as pd

# Reproducible seed
RANDOM_SEED = 42

LOCATIONS = [
    "Mumbai",
    "Bengaluru",
    "Hyderabad",
    "Delhi NCR",
    "Chennai",
    "Pune",
    "Kolkata",
    "Ahmedabad"
]

PROPERTY_TYPES = [
    "Apartment",
    "Independent House",
    "Villa",
    "Penthouse"
]

# Baseline price per sqft (INR) by location
LOCATION_BASE_RATE = {
    "Mumbai": 18500,
    "Delhi NCR": 11000,
    "Bengaluru": 9200,
    "Hyderabad": 7400,
    "Pune": 6800,
    "Chennai": 6500,
    "Kolkata": 5200,
    "Ahmedabad": 4600
}

# Multiplier by property type
TYPE_MULTIPLIERS = {
    "Apartment": 1.00,
    "Independent House": 1.12,
    "Villa": 1.30,
    "Penthouse": 1.40
}

def generate_dataset(num_samples: int = 3500, seed: int = RANDOM_SEED) -> pd.DataFrame:
    """Generate realistic Indian property market data."""
    np.random.seed(seed)
    
    locations = np.random.choice(LOCATIONS, size=num_samples, p=[0.20, 0.20, 0.16, 0.14, 0.10, 0.08, 0.06, 0.06])
    prop_types = np.random.choice(PROPERTY_TYPES, size=num_samples, p=[0.58, 0.22, 0.14, 0.06])
    
    # Correlate bedrooms and area
    bedrooms = []
    area_sqft = []
    bathrooms = []
    floors = []
    parking = []
    property_age = []
    prices = []
    
    for i in range(num_samples):
        ptype = prop_types[i]
        loc = locations[i]
        
        # Bed count conditioned on type
        if ptype == "Apartment":
            bhk = np.random.choice([1, 2, 3, 4], p=[0.18, 0.47, 0.30, 0.05])
            base_sqft = {1: (450, 680), 2: (800, 1300), 3: (1350, 2100), 4: (2100, 3200)}[bhk]
            sqft = int(np.random.uniform(base_sqft[0], base_sqft[1]))
            baths = min(bhk + np.random.choice([0, 1], p=[0.75, 0.25]), bhk + 1)
            flr = int(np.random.choice([1, 2, 3, 4, 5, 6, 8, 12, 18, 24]))
            park = int(np.random.choice([0, 1], p=[0.25 if bhk == 1 else 0.10, 0.75 if bhk == 1 else 0.90]))
            age = int(np.random.exponential(scale=6))
            
        elif ptype == "Independent House":
            bhk = np.random.choice([2, 3, 4, 5], p=[0.25, 0.45, 0.22, 0.08])
            base_sqft = {2: (950, 1500), 3: (1400, 2400), 4: (2200, 3600), 5: (3200, 5000)}[bhk]
            sqft = int(np.random.uniform(base_sqft[0], base_sqft[1]))
            baths = min(bhk, int(np.random.choice([bhk - 1, bhk, bhk + 1], p=[0.2, 0.6, 0.2])))
            flr = int(np.random.choice([1, 2, 3], p=[0.4, 0.45, 0.15]))
            park = int(np.random.choice([0, 1], p=[0.12, 0.88]))
            age = int(np.random.exponential(scale=9))
            
        elif ptype == "Villa":
            bhk = np.random.choice([3, 4, 5, 6], p=[0.25, 0.45, 0.22, 0.08])
            base_sqft = {3: (1800, 2800), 4: (2600, 4200), 5: (3800, 6000), 6: (5000, 7500)}[bhk]
            sqft = int(np.random.uniform(base_sqft[0], base_sqft[1]))
            baths = bhk + int(np.random.choice([0, 1], p=[0.4, 0.6]))
            flr = int(np.random.choice([2, 3, 4], p=[0.55, 0.35, 0.10]))
            park = 1
            age = int(np.random.exponential(scale=4))
            
        else: # Penthouse
            bhk = np.random.choice([3, 4, 5], p=[0.30, 0.50, 0.20])
            base_sqft = {3: (2200, 3400), 4: (3200, 5200), 5: (4800, 7000)}[bhk]
            sqft = int(np.random.uniform(base_sqft[0], base_sqft[1]))
            baths = bhk + 1
            flr = int(np.random.choice([15, 20, 25, 30, 40]))
            park = 1
            age = int(np.random.exponential(scale=4))
            
        # Age cap
        age = min(age, 35)
        baths = max(1, baths)
        
        # Economic valuation logic:
        # 1. Base rate per sqft for location
        base_rate = LOCATION_BASE_RATE[loc]
        # 2. Type multiplier
        type_mult = TYPE_MULTIPLIERS[ptype]
        # 3. Age depreciation factor (up to 25% max)
        age_depreciation = max(0.75, 1.0 - (age * 0.009))
        # 4. Amenities & room adjustment
        room_bonus = (bhk * 150000) + (baths * 120000)
        parking_bonus = 450000 if park == 1 else 0
        floor_premium = min(flr * 15000, 300000) if ptype in ["Apartment", "Penthouse"] else (flr * 250000)
        
        # Base raw price
        raw_price = (sqft * base_rate * type_mult * age_depreciation) + room_bonus + parking_bonus + floor_premium
        
        # Add realistic market noise (Gaussian with 7.5% std dev)
        noise = np.random.normal(loc=1.0, scale=0.075)
        final_price = max(1200000, round(raw_price * noise, -4)) # Round to nearest 10,000 INR
        
        bedrooms.append(bhk)
        area_sqft.append(sqft)
        bathrooms.append(baths)
        floors.append(flr)
        parking.append(park)
        property_age.append(age)
        prices.append(int(final_price))
        
    df = pd.DataFrame({
        "location": locations,
        "area_sqft": area_sqft,
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "property_age": property_age,
        "floors": floors,
        "parking": parking,
        "property_type": prop_types,
        "price_inr": prices
    })
    
    return df

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    artifacts_dir = os.path.join(os.path.dirname(script_dir), "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)
    
    output_path = os.path.join(artifacts_dir, "house_data_demo.csv")
    meta_path = os.path.join(artifacts_dir, "dataset_metadata.json")
    
    print(f"Generating synthetic demonstration property dataset (3500 samples)...")
    df = generate_dataset(num_samples=3500, seed=RANDOM_SEED)
    df.to_csv(output_path, index=False)
    print(f"Dataset saved to: {output_path}")
    print(f"Dataset shape: {df.shape}")
    print(f"Price range: INR {df['price_inr'].min():,} to INR {df['price_inr'].max():,}")
    print(f"Locations included: {', '.join(LOCATIONS)}")
    
    metadata = {
        "dataset_type": "synthetic_demonstration",
        "description": "Synthetically generated Indian property market dataset for academic demonstration and machine learning training.",
        "samples_count": len(df),
        "locations": LOCATIONS,
        "property_types": PROPERTY_TYPES,
        "features": [
            "location",
            "area_sqft",
            "bedrooms",
            "bathrooms",
            "property_age",
            "floors",
            "parking",
            "property_type"
        ],
        "target": "price_inr",
        "is_synthetic": True,
        "disclaimer": "This is synthetic demonstration data modeled on Indian metro price patterns for college PBL presentation. Predictions should be interpreted as academic demonstrations."
    }
    
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata saved to: {meta_path}")

if __name__ == "__main__":
    main()
