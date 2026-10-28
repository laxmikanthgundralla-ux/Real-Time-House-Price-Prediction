import React from 'react';
import { Home } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer" style={{ marginTop: '60px', padding: '36px 0 24px' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              background: 'var(--teal-primary)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Home size={16} color="white" />
          </div>
          <span>Real-Time House Price Prediction Platform</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 16px' }}>
          Real-time machine-learning-based residential property valuations for major Indian metropolitan cities.
        </p>
        <div style={{ borderTop: '1px solid #334155', paddingTop: '16px', fontSize: '0.8rem', color: '#64748b' }}>
          © 2026–2027 Real-Time House Price Prediction. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
