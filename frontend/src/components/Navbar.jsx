import React from 'react';
import { Home, Activity, BarChart3, Info, Github } from 'lucide-react';

export default function Navbar({ health, activeSection, setActiveSection }) {
  const isHealthy = health?.status === 'healthy';

  return (
    <header className="navbar">
      <div className="container nav-container">
        <a href="#home" className="brand" onClick={() => setActiveSection('home')}>
          <div className="brand-icon">
            <Home size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              PropValuate <span style={{ color: 'var(--teal-primary)' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              HOUSE PRICE PREDICTION PLATFORM
            </div>
          </div>
        </a>

        <nav>
          <ul className="nav-links">
            <li>
              <a
                href="#home"
                className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                onClick={() => setActiveSection('home')}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#predict"
                className={`nav-link ${activeSection === 'predict' ? 'active' : ''}`}
                onClick={() => setActiveSection('predict')}
              >
                Predict Price
              </a>
            </li>
            <li>
              <a
                href="#analytics"
                className={`nav-link ${activeSection === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveSection('analytics')}
              >
                Analytics & ML Benchmark
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                onClick={() => setActiveSection('about')}
              >
                About Project
              </a>
            </li>
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className={`status-badge ${isHealthy ? 'status-online' : ''}`} style={!isHealthy ? { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' } : {}}>
            <span
              className="status-dot"
              style={!isHealthy ? { background: '#ef4444', boxShadow: '0 0 0 2px #fee2e2' } : {}}
            ></span>
            <span>{isHealthy ? 'Model Ready' : 'Backend Offline'}</span>
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
