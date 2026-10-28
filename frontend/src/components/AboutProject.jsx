import React from 'react';
import { BookOpen, Layers, Cpu, Server, Database, Globe, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function AboutProject() {
  const techStack = [
    {
      category: 'Frontend Client',
      techs: ['React 18', 'Vite 5', 'JavaScript (ES2024)', 'Recharts', 'Lucide React', 'CSS3 Design System']
    },
    {
      category: 'Backend Microservice',
      techs: ['Python 3.12+', 'FastAPI', 'Uvicorn ASGI', 'Pydantic v2', 'RESTful API']
    },
    {
      category: 'Machine Learning',
      techs: ['Scikit-Learn', 'XGBoost', 'Pandas', 'NumPy', 'Joblib Serialization']
    },
    {
      category: 'Database & DevOps',
      techs: ['PostgreSQL (Optional)', 'Docker & Docker Compose', 'GitHub Actions CI', 'Pytest']
    }
  ];

  return (
    <section id="about" style={{ padding: '60px 0' }}>
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--teal-subtle)',
            color: 'var(--teal-primary)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '16px',
            border: '1px solid #ccfbf1'
          }}
        >
          <BookOpen size={14} />
          <span>Academic Project-Based Learning (PBL)</span>
        </div>

        <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>About The Platform</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
          Developed as a comprehensive full-stack and applied machine learning capstone project, demonstrating reproducible data science, REST API engineering, and modern web application development.
        </p>
      </div>

      {/* Author & Academic Info Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: 'white',
          padding: '28px 36px',
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.06em' }}>
            PROJECT AUTHOR & DEVELOPER
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>
            Gundralla Laxmikanth
          </div>
          <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '2px' }}>
            Academic Year: 2026–2027
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>CAPSTONE PROJECT</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>
            Real-Time House Price Prediction Platform
          </div>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
            Full-Stack + Machine Learning Regression
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '20px' }}>Technology Stack</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {techStack.map((group, idx) => (
            <div key={idx} className="card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--teal-primary)', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                {group.category}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {group.techs.map((t, tidx) => (
                  <li key={tidx} style={{ fontSize: '0.88rem', color: 'var(--secondary-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={14} color="#10b981" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* System Architecture Section */}
      <div className="card" style={{ padding: '32px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>System Architecture & ML Flow</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          The architecture decouples the machine learning inference pipeline from the client layer via an asynchronous REST API, allowing scalable separate deployment.
        </p>

        <div
          style={{
            background: '#0f172a',
            color: '#f8fafc',
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            overflowX: 'auto',
            lineHeight: '1.6'
          }}
        >
          <div>┌─────────────────────────┐        HTTP POST (JSON)        ┌─────────────────────────┐</div>
          <div>│   React / Vite Client   │ ──────────────────────────────▶ │     FastAPI Backend     │</div>
          <div>│  - Input Form Validation│                                 │  - Pydantic Schema Valid│</div>
          <div>│  - Recharts Dashboard   │ ◀────────────────────────────── │  - CORS Middleware      │</div>
          <div>└─────────────────────────┘      Prediction & Metrics JSON  └───────────┬─────────────┘</div>
          <div>                                                                      │</div>
          <div>                                     ┌────────────────────────────────┼────────────────────────────────┐</div>
          <div>                                     ▼                                ▼                                ▼</div>
          <div>                         ┌───────────────────────┐        ┌───────────────────────┐        ┌───────────────────────┐</div>
          <div>                         │ Joblib ML Pipeline    │        │ Model Evaluation JSON │        │ PostgreSQL (Optional) │</div>
          <div>                         │ - OneHotEncoder       │        │ - Test R² (0.9815)    │        │ - Prediction History  │</div>
          <div>                         │ - StandardScaler      │        │ - Test MAE & RMSE     │        │ - Feature Telemetry   │</div>
          <div>                         │ - XGBoost Champion    │        │ - Model Benchmarks    │        │ - Timestamped Logs    │</div>
          <div>                         └───────────────────────┘        └───────────────────────┘        └───────────────────────┘</div>
        </div>
      </div>

      {/* Limitations & Future Enhancements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ padding: '28px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <AlertCircle size={20} color="#d97706" />
            <h4 style={{ fontSize: '1.1rem' }}>Current Limitations</h4>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: 'var(--secondary-navy)' }}>
            <li>• <strong>Demonstration Dataset:</strong> Utilizes a calibrated synthetic dataset modeled after Indian metro properties rather than live scraped MLS feeds.</li>
            <li>• <strong>Locality Granularity:</strong> Models broad city-level rates rather than hyper-local micro-markets (e.g. Whitefield vs Indiranagar in Bengaluru).</li>
            <li>• <strong>Empirical Uncertainty:</strong> Uncertainty bounds are derived from test MAE (±1 MAE) rather than Bayesian posterior intervals.</li>
          </ul>
        </div>

        <div className="card" style={{ padding: '28px', borderLeft: '4px solid var(--teal-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Globe size={20} color="var(--teal-primary)" />
            <h4 style={{ fontSize: '1.1rem' }}>Future Enhancements</h4>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: 'var(--secondary-navy)' }}>
            <li>• <strong>Geographic GIS Integration:</strong> Add interactive map coordinates (Leaflet / Google Maps) for neighborhood amenity scoring.</li>
            <li>• <strong>SHAP Feature Explainability:</strong> Visualize individual feature contributions (e.g., parking bonus vs age penalty) for each valuation.</li>
            <li>• <strong>Live Ingestion Pipelines:</strong> Integrate Apache Kafka or automated web scrapers for real-time market data ingestion.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
