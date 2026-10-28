import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import NoticeBanner from './components/NoticeBanner';
import HeroSection from './components/HeroSection';
import WorkflowSection from './components/WorkflowSection';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AboutProject from './components/AboutProject';
import Footer from './components/Footer';
import { fetchHealth, fetchLocations } from './services/api';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
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

  const handlePredictClick = () => {
    setActiveSection('predict');
    const el = document.getElementById('predict');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreMetricsClick = () => {
    setActiveSection('analytics');
    const el = document.getElementById('analytics');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePredictionSuccess = (result) => {
    setPredictionResult(result);
    // Smooth scroll to results
    setTimeout(() => {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }, 100);
  };

  const handlePredictAnother = () => {
    setPredictionResult(null);
    const el = document.getElementById('predict');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-layout">
      <Navbar
        health={health}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="container" style={{ marginTop: '24px' }}>
        <NoticeBanner isSynthetic={health?.is_synthetic ?? true} />

        <HeroSection
          onPredictClick={handlePredictClick}
          onExploreMetricsClick={handleExploreMetricsClick}
        />

        <WorkflowSection />

        <div id="predict-anchor">
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

        <AnalyticsDashboard />

        <AboutProject />
      </main>

      <Footer />
    </div>
  );
}
