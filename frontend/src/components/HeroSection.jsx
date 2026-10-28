import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, LineChart, Award } from 'lucide-react';

export default function HeroSection({ onPredictClick, onExploreMetricsClick }) {
  return (
    <section id="home" style={{ padding: '60px 0 40px' }}>
      <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
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
            marginBottom: '20px',
            border: '1px solid #ccfbf1'
          }}
        >
          <Sparkles size={14} />
          <span>Next-Gen Machine Learning Real Estate Valuation</span>
        </div>

        <h1 style={{ fontSize: '3.1rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary-navy)' }}>
          Predict Your Dream Home's Value
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '32px' }}>
          Evaluate residential property prices across major Indian metro markets using trained Scikit-Learn and XGBoost regression models. Instant, transparent, and multi-model benchmarked.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={onPredictClick}>
            <span>Predict Price Now</span>
            <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary btn-lg" onClick={onExploreMetricsClick}>
            <LineChart size={18} />
            <span>View ML Benchmarks</span>
          </button>
        </div>
      </div>

      {/* Feature Highlight Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginTop: '60px'
        }}
      >
        <div className="card" style={{ padding: '24px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: '#ecfdf5',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              marginBottom: '16px'
            }}
          >
            <Award size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Champion ML Model</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Systematically trained and evaluated across Linear Regression, Random Forest, and XGBoost with R² score up to 0.98.
          </p>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: '#eff6ff',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              marginBottom: '16px'
            }}
          >
            <Zap size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Real-Time Inference</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Sub-millisecond prediction generation powered by an asynchronous FastAPI backend and optimized Joblib pipelines.
          </p>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: '#fef3c7',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d97706',
              marginBottom: '16px'
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Empirical Uncertainty Bands</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Every valuation includes an approximate model-based range derived from the model's test MAE for honest transparency.
          </p>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: '#f3e8ff',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7e22ce',
              marginBottom: '16px'
            }}
          >
            <LineChart size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Verified Benchmark Analytics</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Inspect genuine MAE, RMSE, and R² metrics computed directly from hold-out test sets without fabricated figures.
          </p>
        </div>
      </div>
    </section>
  );
}
