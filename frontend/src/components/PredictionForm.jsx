import React, { useState } from 'react';
import {
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Clock,
  Layers,
  Car,
  Home,
  Loader2,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { submitPrediction } from '../services/api';

const DEFAULT_FORM_DATA = {
  location: 'Bengaluru',
  area_sqft: 1550,
  bedrooms: 3,
  bathrooms: 2,
  property_age: 4,
  floors: 2,
  parking: 1,
  property_type: 'Apartment'
};

export default function PredictionForm({ locationsData, onPredictionSuccess }) {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const locations = locationsData?.locations || [
    'Mumbai', 'Bengaluru', 'Hyderabad', 'Delhi NCR', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'
  ];
  const propertyTypes = locationsData?.property_types || [
    'Apartment', 'Independent House', 'Villa', 'Penthouse'
  ];

  const validate = () => {
    const errs = {};
    if (!formData.location) errs.location = 'Please select a location';
    if (!formData.area_sqft || formData.area_sqft < 150) {
      errs.area_sqft = 'Area must be at least 150 sq ft';
    } else if (formData.area_sqft > 20000) {
      errs.area_sqft = 'Area cannot exceed 20,000 sq ft';
    }

    if (!formData.bedrooms || formData.bedrooms < 1 || formData.bedrooms > 10) {
      errs.bedrooms = 'Bedrooms must be between 1 and 10';
    }

    if (!formData.bathrooms || formData.bathrooms < 1 || formData.bathrooms > 10) {
      errs.bathrooms = 'Bathrooms must be between 1 and 10';
    }

    if (formData.property_age === '' || formData.property_age < 0 || formData.property_age > 100) {
      errs.property_age = 'Age must be between 0 and 100 years';
    }

    if (!formData.floors || formData.floors < 1 || formData.floors > 50) {
      errs.floors = 'Floors must be between 1 and 50';
    }

    if (!formData.property_type) errs.property_type = 'Please select a property type';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        location: formData.location,
        area_sqft: Number(formData.area_sqft),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        property_age: Number(formData.property_age),
        floors: Number(formData.floors),
        parking: Number(formData.parking),
        property_type: formData.property_type
      };

      const result = await submitPrediction(payload);
      onPredictionSuccess(result);
    } catch (err) {
      setApiError(err.message || 'Failed to generate prediction. Check backend status.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card form-card">
      {apiError && (
        <div className="alert-error">
          <strong>Error:</strong> {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="location">
              <MapPin size={16} color="var(--teal-primary)" />
              <span>Location / Metro City</span>
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`form-select ${errors.location ? 'error' : ''}`}
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            {errors.location && <span className="error-msg">{errors.location}</span>}
          </div>

          {/* Property Type */}
          <div className="form-group">
            <label className="form-label" htmlFor="property_type">
              <Home size={16} color="var(--teal-primary)" />
              <span>Property Type</span>
            </label>
            <select
              id="property_type"
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              className={`form-select ${errors.property_type ? 'error' : ''}`}
            >
              {propertyTypes.map(pt => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
            {errors.property_type && <span className="error-msg">{errors.property_type}</span>}
          </div>

          {/* Super Built-up Area */}
          <div className="form-group">
            <label className="form-label" htmlFor="area_sqft">
              <Maximize2 size={16} color="var(--teal-primary)" />
              <span>Super Built-up Area (Sq Ft)</span>
            </label>
            <input
              id="area_sqft"
              type="number"
              name="area_sqft"
              placeholder="e.g. 1550"
              value={formData.area_sqft}
              onChange={handleChange}
              className={`form-input ${errors.area_sqft ? 'error' : ''}`}
              min="150"
              max="20000"
            />
            {errors.area_sqft ? (
              <span className="error-msg">{errors.area_sqft}</span>
            ) : (
              <span className="field-hint">Between 150 and 20,000 sq ft</span>
            )}
          </div>

          {/* Bedrooms */}
          <div className="form-group">
            <label className="form-label" htmlFor="bedrooms">
              <Bed size={16} color="var(--teal-primary)" />
              <span>Bedrooms (BHK)</span>
            </label>
            <select
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className={`form-select ${errors.bedrooms ? 'error' : ''}`}
            >
              {[1, 2, 3, 4, 5, 6].map(bhk => (
                <option key={bhk} value={bhk}>
                  {bhk} {bhk === 1 ? 'Bedroom' : 'Bedrooms'}
                </option>
              ))}
            </select>
            {errors.bedrooms && <span className="error-msg">{errors.bedrooms}</span>}
          </div>

          {/* Bathrooms */}
          <div className="form-group">
            <label className="form-label" htmlFor="bathrooms">
              <Bath size={16} color="var(--teal-primary)" />
              <span>Bathrooms</span>
            </label>
            <select
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className={`form-select ${errors.bathrooms ? 'error' : ''}`}
            >
              {[1, 2, 3, 4, 5, 6].map(b => (
                <option key={b} value={b}>
                  {b} {b === 1 ? 'Bathroom' : 'Bathrooms'}
                </option>
              ))}
            </select>
            {errors.bathrooms && <span className="error-msg">{errors.bathrooms}</span>}
          </div>

          {/* Property Age */}
          <div className="form-group">
            <label className="form-label" htmlFor="property_age">
              <Clock size={16} color="var(--teal-primary)" />
              <span>Property Age (Years)</span>
            </label>
            <input
              id="property_age"
              type="number"
              name="property_age"
              placeholder="e.g. 4 (0 for new construction)"
              value={formData.property_age}
              onChange={handleChange}
              className={`form-input ${errors.property_age ? 'error' : ''}`}
              min="0"
              max="100"
            />
            {errors.property_age ? (
              <span className="error-msg">{errors.property_age}</span>
            ) : (
              <span className="field-hint">0 = Ready-to-move new build</span>
            )}
          </div>

          {/* Floors */}
          <div className="form-group">
            <label className="form-label" htmlFor="floors">
              <Layers size={16} color="var(--teal-primary)" />
              <span>Floors / Floor Level</span>
            </label>
            <input
              id="floors"
              type="number"
              name="floors"
              placeholder="e.g. 2"
              value={formData.floors}
              onChange={handleChange}
              className={`form-input ${errors.floors ? 'error' : ''}`}
              min="1"
              max="50"
            />
            {errors.floors && <span className="error-msg">{errors.floors}</span>}
          </div>

          {/* Dedicated Parking */}
          <div className="form-group">
            <label className="form-label" htmlFor="parking">
              <Car size={16} color="var(--teal-primary)" />
              <span>Dedicated Parking Space</span>
            </label>
            <select
              id="parking"
              name="parking"
              value={formData.parking}
              onChange={handleChange}
              className="form-select"
            >
              <option value={1}>Yes (Covered / Reserved)</option>
              <option value={0}>No Dedicated Parking</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isLoading}
          >
            <RotateCcw size={16} />
            <span>Reset Form</span>
          </button>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Estimating Price...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Predict House Price</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
