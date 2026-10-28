import React from 'react';
import {
  TrendingUp,
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Clock,
  Layers,
  Car,
  Home,
  AlertTriangle,
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
    input_details,
    model_name,
    dataset_type,
    is_synthetic,
    demonstration_warning
  } = result;

  return (
    <div className="result-card" style={{ maxWidth: '880px', margin: '0 auto 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: '#ecfdf5',
              color: '#047857',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle size={14} />
            ML Inference Complete
          </span>

          <span
            style={{
              background: '#f1f5f9',
              color: '#334155',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            Model: {model_name}
          </span>
        </div>

        <button className="btn btn-secondary" onClick={onPredictAnother} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <RotateCcw size={14} />
          <span>Predict Another Property</span>
        </button>
      </div>

      {/* Hero Price Valuation */}
      <div className="price-hero">
        <div className="price-label">Estimated Selling Price</div>
        <div className="price-value">{predicted_price_formatted}</div>

        {/* Uncertainty Range */}
        <div className="range-box" style={{ maxWidth: '580px', margin: '18px auto 0' }}>
          <div className="range-title">Approximate Valuation Range</div>
          <div className="range-value">
            {lower_range_formatted} – {upper_range_formatted}
          </div>
          <p className="range-disclaimer">{range_disclaimer}</p>
        </div>
      </div>

      {/* Property Input Summary Chips */}
      <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary-navy)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Evaluated Property Attributes
        </h4>
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
            <span>{input_details.area_sqft.toLocaleString()} Sq Ft</span>
          </div>
          <div className="chip">
            <Bed size={14} color="var(--teal-primary)" />
            <span>{input_details.bedrooms} BHK</span>
          </div>
          <div className="chip">
            <Bath size={14} color="var(--teal-primary)" />
            <span>{input_details.bathrooms} Baths</span>
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

      {/* Explanatory Guide Box */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginTop: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <HelpCircle size={16} color="var(--teal-primary)" />
          <strong style={{ fontSize: '0.88rem', color: 'var(--secondary-navy)' }}>
            How to Interpret This Result
          </strong>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          The valuation represents the expected point estimate generated by the trained XGBoost regression model. The valuation range is an approximate empirical band calculated from the model's out-of-sample Mean Absolute Error (±1 MAE). This empirical interval reflects historical residual variance observed during rigorous model testing, rather than an uncalibrated theoretical confidence interval.
        </p>
      </div>

      {/* Synthetic Demonstration Notice if applicable */}
      {is_synthetic && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}
        >
          <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.82rem', color: '#92400e', lineHeight: '1.45' }}>
            <strong>Demonstration Notice:</strong> {demonstration_warning || 'This prediction is generated using synthetic demonstration data for academic PBL evaluation.'}
          </p>
        </div>
      )}
    </div>
  );
}
