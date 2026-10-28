import React, { useState, useEffect } from 'react';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import { fetchLocations } from './services/api';

export default function App() {
  const [locationsData, setLocationsData] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  useEffect(() => {
    async function init() {
      const locs = await fetchLocations();
      setLocationsData(locs);
    }
    init();
  }, []);

  const handlePredictionSuccess = (result) => {
    setPredictionResult(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePredictAnother = () => {
    setPredictionResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-wrapper">
      <main className="main-content">
        <header className="page-header">
          <h1 className="page-title">House Price Prediction</h1>
          <p className="page-subtitle">
            Enter your property details to estimate its selling price.
          </p>
        </header>

        <div className="content-container">
          {predictionResult ? (
            <PredictionResult
              result={predictionResult}
              onPredictAnother={handlePredictAnother}
            />
          ) : (
            <PredictionForm
              locationsData={locationsData}
              onPredictionSuccess={handlePredictionSuccess}
            />
          )}
        </div>
      </main>

      <footer className="simple-footer">
        <p>© House Price Prediction. All rights reserved.</p>
      </footer>
    </div>
  );
}
