import React from 'react';
import { Home, Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'var(--teal-primary)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Home size={18} color="white" />
              </div>
              <span>PropValuate AI</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#94a3b8' }}>
              Real-Time House Price Prediction Platform. Multi-model regression benchmarks, transparent uncertainty bounds, and calibrated Indian real estate valuations.
            </p>
          </div>

          <div>
            <h4>Project Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <li><a href="#home">Home</a></li>
              <li><a href="#predict">Price Valuation Tool</a></li>
              <li><a href="#analytics">ML Benchmark & Analytics</a></li>
              <li><a href="#about">Project Architecture</a></li>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">FastAPI Swagger Docs</a></li>
            </ul>
          </div>

          <div>
            <h4>Technology Stack</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <li>React 18 & Vite</li>
              <li>FastAPI & Uvicorn</li>
              <li>XGBoost & Scikit-Learn</li>
              <li>Pydantic v2 & Joblib</li>
              <li>Docker & GitHub Actions</li>
            </ul>
          </div>

          <div>
            <h4>Academic Information</h4>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px' }}>
              <strong>Author:</strong> Gundralla Laxmikanth
            </p>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px' }}>
              <strong>Academic Year:</strong> 2026–2027
            </p>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Project-Based Learning (PBL) Demonstration Capstone
            </p>
            <div style={{ marginTop: '14px' }}>
              <a
                href="https://github.com/placeholder/house-price-prediction"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ background: '#1e293b', color: 'white', borderColor: '#334155', padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <Github size={14} />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026–2027 Real-Time House Price Prediction Platform by Gundralla Laxmikanth. Built for College PBL Submission.</p>
        </div>
      </div>
    </footer>
  );
}
