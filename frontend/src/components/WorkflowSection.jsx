import React from 'react';
import { Sliders, Cpu, Calculator, CheckCircle2 } from 'lucide-react';

export default function WorkflowSection() {
  const steps = [
    {
      number: '01',
      title: 'Property Details',
      desc: 'User inputs city, area (sqft), BHK, age, floor, parking, and house type.',
      icon: <Sliders size={20} />
    },
    {
      number: '02',
      title: 'Feature Engineering',
      desc: 'One-hot encoding for cities and property types + Standard scaling on numerical metrics.',
      icon: <Cpu size={20} />
    },
    {
      number: '03',
      title: 'ML Model Inference',
      desc: 'Gradient-boosted decision trees (XGBoost) calculate fair market valuation in INR.',
      icon: <Calculator size={20} />
    },
    {
      number: '04',
      title: 'Price & Uncertainty Band',
      desc: 'Displays point estimate in ₹ + empirical range derived from test MAE.',
      icon: <CheckCircle2 size={20} />
    }
  ];

  return (
    <section style={{ margin: '40px 0 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.85rem', marginBottom: '8px' }}>How the Valuation Engine Works</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          An end-to-end reproducible machine learning pipeline from user input to calibrated valuation
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}
      >
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              padding: '24px',
              borderTop: '4px solid var(--teal-primary)',
              position: 'relative'
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--teal-primary)',
                letterSpacing: '0.08em',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>STEP {step.number}</span>
              <span style={{ color: 'var(--teal-primary)' }}>{step.icon}</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{step.title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
