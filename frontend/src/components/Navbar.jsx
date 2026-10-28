import React from 'react';
import { Home, Github } from 'lucide-react';

export default function Navbar({ health }) {
  const isHealthy = health?.status === 'healthy';

  return (
    <header className="navbar">
      <div className="container nav-container">
        <a href="#" className="brand">
          <div className="brand-icon">
            <Home size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              House Price <span style={{ color: 'var(--teal-primary)' }}>Predictor</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              REAL-TIME PROPERTY VALUATION
            </div>
          </div>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            className={`status-badge ${isHealthy ? 'status-online' : ''}`}
            style={!isHealthy ? { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' } : {}}
          >
            <span
              className="status-dot"
              style={!isHealthy ? { background: '#ef4444', boxShadow: '0 0 0 2px #fee2e2' } : {}}
            ></span>
            <span>{isHealthy ? 'Model Active' : 'Backend Offline'}</span>
          </div>

          <a
            href="https://github.com/placeholder/house-price-prediction"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repository"
            style={{ color: 'var(--secondary-navy)', display: 'flex', alignItems: 'center' }}
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </header>
  );
}
