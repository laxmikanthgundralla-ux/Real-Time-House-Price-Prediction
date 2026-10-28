import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChart2, Award, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchModelMetrics } from '../services/api';

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchModelMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Model metrics unavailable. Run backend training first.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <section id="analytics" style={{ padding: '60px 0' }}>
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <RefreshCw size={32} className="animate-spin" color="var(--teal-primary)" style={{ margin: '0 auto 16px' }} />
          <h3>Loading Model Evaluation Metrics...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Fetching actual hold-out benchmark results from backend.</p>
        </div>
      </section>
    );
  }

  if (error || !metrics) {
    return (
      <section id="analytics" style={{ padding: '60px 0' }}>
        <div className="card" style={{ textAlign: 'center', padding: '60px', borderLeft: '6px solid #ef4444' }}>
          <AlertCircle size={36} color="#ef4444" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ color: '#991b1b', marginBottom: '8px' }}>Benchmark Data Unavailable</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 20px' }}>
            {error || 'Model evaluation metrics file not found.'} To compute and save genuine metrics, run:
          </p>
          <code
            style={{
              background: '#f1f5f9',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--primary-navy)'
            }}
          >
            python -m backend.ml.train_model
          </code>
          <div style={{ marginTop: '24px' }}>
            <button className="btn btn-secondary" onClick={loadMetrics}>
              <RefreshCw size={16} />
              <span>Retry Loading Metrics</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  const comparisonMap = metrics.models_comparison || {};
  const modelList = Object.keys(comparisonMap);

  // Formatted data for Recharts
  const r2ChartData = modelList.map(name => ({
    name: name === 'XGBoost Regressor' ? 'XGBoost' : name,
    fullName: name,
    r2: comparisonMap[name].test_r2,
    trainR2: comparisonMap[name].train_r2
  }));

  const errorChartData = modelList.map(name => ({
    name: name === 'XGBoost Regressor' ? 'XGBoost' : name,
    fullName: name,
    maeLakhs: Number((comparisonMap[name].test_mae / 100000).toFixed(2)),
    rmseLakhs: Number((comparisonMap[name].test_rmse / 100000).toFixed(2)),
    maeInr: comparisonMap[name].test_mae_inr,
    rmseInr: comparisonMap[name].test_rmse_inr
  }));

  const chartColors = ['#3b82f6', '#10b981', '#0f766e'];

  return (
    <section id="analytics" style={{ padding: '60px 0' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--blue-subtle)',
            color: 'var(--blue-primary)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '16px',
            border: '1px solid #bfdbfe'
          }}
        >
          <BarChart2 size={14} />
          <span>Verified Hold-Out Test Metrics</span>
        </div>

        <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Machine Learning Model Benchmark</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
          Comparative performance measured on 700 unseen test samples (20% hold-out partition).
          All metrics are calculated directly from genuine model inference outputs.
        </p>
      </div>

      {/* Model Benchmark Summary Header Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)',
          border: '1px solid #99f6e4',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Award size={20} color="#0f766e" />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--teal-primary)' }}>
              Champion Model: {metrics.selected_model}
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--secondary-navy)' }}>
            <strong>Selection Criterion:</strong> {metrics.selection_criterion}
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Dataset: {metrics.train_samples} training samples, {metrics.test_samples} test samples (Seed: {metrics.random_seed})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ background: 'white', padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TEST R² SCORE</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--teal-primary)' }}>
              {metrics.best_model_metrics?.test_r2}
            </div>
          </div>

          <div style={{ background: 'white', padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TEST MAE</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary-navy)' }}>
              {metrics.best_model_metrics?.test_mae_inr}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '28px', marginBottom: '36px' }}>
        {/* Chart 1: R2 Score */}
        <div className="card">
          <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>R² Goodness of Fit (Higher is Better)</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Proportion of price variance explained by property features on test data
          </p>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={r2ChartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis domain={[0.8, 1.0]} stroke="#64748b" fontSize={12} />
                <Tooltip
                  formatter={(value) => [`${value} (${(value * 100).toFixed(1)}%)`, 'Test R²']}
                  contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="r2" name="Test R²" radius={[6, 6, 0, 0]}>
                  {r2ChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: MAE in Lakhs */}
        <div className="card">
          <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Mean Absolute Error (Lower is Better)</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Average absolute prediction error in ₹ Lakhs on held-out test houses
          </p>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={errorChartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  formatter={(value, name, item) => [`₹${value} Lakhs (${item.payload.maeInr})`, 'Test MAE']}
                  contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="maeLakhs" name="Test MAE (₹ Lakhs)" radius={[6, 6, 0, 0]}>
                  {errorChartData.map((entry, index) => (
                    <Cell key={`cell-mae-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Benchmark Data Table */}
      <div className="card">
        <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Benchmark Performance Table</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Exact numerical evaluation results across all candidate architectures evaluated during model training.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="benchmark-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>Test R² Score</th>
                <th>Train R² Score</th>
                <th>Mean Absolute Error (MAE)</th>
                <th>Root Mean Squared Error (RMSE)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {modelList.map(name => {
                const item = comparisonMap[name];
                const isChampion = name === metrics.selected_model;
                return (
                  <tr key={name} className={isChampion ? 'champion-row' : ''}>
                    <td>
                      <strong>{name}</strong>
                    </td>
                    <td>{item.test_r2}</td>
                    <td>{item.train_r2}</td>
                    <td>{item.test_mae_inr}</td>
                    <td>{item.test_rmse_inr}</td>
                    <td>
                      {isChampion ? (
                        <span
                          style={{
                            background: '#dcfce7',
                            color: '#15803d',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}
                        >
                          Champion Model
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Baseline</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
