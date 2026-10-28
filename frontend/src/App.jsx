import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import NoticeBanner from './components/NoticeBanner';
import HeroSection from './components/HeroSection';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import Footer from './components/Footer';
import { fetchHealth, fetchLocations } from './services/api';

export default function App() {
  const [health, setHealth] = useState(null);
  const [locationsData, setLocationsData] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  useEffect(() => {
    async function init() {
      const [h, locs] = await Promise.all([fetchHealth(), fetchLocations()]);
      setHealth(h);
      setLocationsData(locs);
    }
    init();
  }, []);

  const handlePredictionSuccess = (result) => {
    setPredictionResult(result);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handlePredictAnother = () => {
    setPredictionResult(null);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      <Navbar health={health} />

      <main className="container" style={{ marginTop: '16px' }}>
        <NoticeBanner isSynthetic={health?.is_synthetic ?? true} />

        <HeroSection />

        <div id="prediction-container" style={{ margin: '20px 0 40px' }}>
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

      <Footer />
    </div>
  );
}
