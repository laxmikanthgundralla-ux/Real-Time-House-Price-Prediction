import React from 'react';
import {
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Clock,
  Layers,
  Car,
  Home,
  RotateCcw,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function PredictionResult({ result, onPredictAnother }) {
  if (!result) return null;

  const {
    predicted_price_formatted,
    lower_range_formatted,
    upper_range_formatted,
    range_disclaimer,
    input_details
  } = result;

  return (
    <div className="card result-card">
      <div className="result-header">
        <span className="success-badge">
          <CheckCircle size={15} />
          <span>Estimated Valuation</span>
        </span>

        <button className="btn btn-secondary btn-sm" onClick={onPredictAnother}>
          <RotateCcw size={14} />
          <span>Predict Another Property</span>
        </button>
      </div>

      {/* Main Estimated Price */}
      <div className="price-hero">
        <div className="price-label">Estimated Selling Price</div>
        <div className="price-value">{predicted_price_formatted}</div>

        {/* Valuation Range */}
        <div className="range-box">
          <div className="range-title">Approximate Valuation Range</div>
          <div className="range-value">
            {lower_range_formatted} – {upper_range_formatted}
          </div>
          <p className="range-disclaimer">{range_disclaimer}</p>
        </div>
      </div>

      {/* Evaluated Property Attributes */}
      <div className="property-summary">
        <h4 className="summary-title">Evaluated Property Details</h4>
        <div className="chips-grid">
          <div className="chip">
            <MapPin size={14} color="var(--teal-primary)" />
            <span>{input_details.location}</span>
          </div>
          <div className="chip">
            <Home size={14} color="var(--teal-primary)" />
            <span>{input_details.property_type}</span>
          </div>
          <div className="chip">
            <Maximize2 size={14} color="var(--teal-primary)" />
            <span>{input_details.area_sqft?.toLocaleString()} Sq Ft</span>
          </div>
          <div className="chip">
            <Bed size={14} color="var(--teal-primary)" />
            <span>{input_details.bedrooms} BHK</span>
          </div>
          <div className="chip">
            <Bath size={14} color="var(--teal-primary)" />
            <span>{input_details.bathrooms} Bathrooms</span>
          </div>
          <div className="chip">
            <Clock size={14} color="var(--teal-primary)" />
            <span>{input_details.property_age === 0 ? 'Brand New' : `${input_details.property_age} yrs old`}</span>
          </div>
          <div className="chip">
            <Layers size={14} color="var(--teal-primary)" />
            <span>Floor: {input_details.floors}</span>
          </div>
          <div className="chip">
            <Car size={14} color="var(--teal-primary)" />
            <span>{input_details.parking ? 'Parking Included' : 'No Parking'}</span>
          </div>
        </div>
      </div>

      {/* Explanatory Note */}
      <div className="info-note">
        <div className="info-note-header">
          <HelpCircle size={15} color="var(--teal-primary)" />
          <strong>How to Interpret This Result</strong>
        </div>
        <p>
          This valuation is an estimated market selling price calculated by the machine learning model. The valuation range represents an approximate empirical error band based on test evaluation data.
        </p>
      </div>

      {/* Bottom Action Button */}
      <div className="result-actions">
        <button className="btn btn-primary btn-lg" onClick={onPredictAnother} style={{ width: '100%' }}>
          <RotateCcw size={18} />
          <span>Predict Price for Another Property</span>
        </button>
      </div>
    </div>
  );
}
