import React from 'react';
import { Sparkles, Calculator } from 'lucide-react';

export default function HeroSection() {
  return (
    <section style={{ padding: '40px 0 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
          <Sparkles size={14} />
          <span>Real-Time Property Valuation Engine</span>
        </div>

        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '14px', color: 'var(--primary-navy)' }}>
          Predict Your House Price
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Select your location, area, and property features below to calculate an estimated market selling price and valuation range in Indian Rupees (₹).
        </p>
      </div>
    </section>
  );
}
