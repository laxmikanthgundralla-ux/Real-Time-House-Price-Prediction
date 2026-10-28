/**
 * API service for communicating with the FastAPI backend.
 * Uses environment variable VITE_API_URL with localhost fallback.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://house-price-api-9mer.onrender.com';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('API Health check unreachable:', err.message);
    return { status: 'offline', model_loaded: false };
  }
}

export async function fetchLocations() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/locations`);
    if (!res.ok) throw new Error(`Failed to load locations: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('Using fallback location list due to network error');
    return {
      locations: [
        'Mumbai',
        'Bengaluru',
        'Hyderabad',
        'Delhi NCR',
        'Chennai',
        'Pune',
        'Kolkata',
        'Ahmedabad'
      ],
      property_types: ['Apartment', 'Independent House', 'Villa', 'Penthouse'],
      count: 8
    };
  }
}

export async function fetchModelMetrics() {
  const res = await fetch(`${API_BASE_URL}/api/model-metrics`);
  if (!res.ok) {
    throw new Error(`Failed to fetch model metrics (${res.status}): ${res.statusText}`);
  }
  return await res.json();
}

export async function submitPrediction(propertyData) {
  const res = await fetch(`${API_BASE_URL}/api/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(propertyData)
  });

  if (!res.ok) {
    let errorMsg = `Prediction failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          errorMsg = errorData.detail.map(d => `${d.loc ? d.loc.join('.') : ''}: ${d.msg}`).join(', ');
        } else {
          errorMsg = errorData.detail;
        }
      }
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return await res.json();
}

export async function fetchPredictionHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/history`);
    if (!res.ok) return { database_enabled: false, records: [] };
    return await res.json();
  } catch (_) {
    return { database_enabled: false, records: [] };
  }
}

export { API_BASE_URL };
