import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function NoticeBanner({ isSynthetic = true }) {
  if (!isSynthetic) return null;

  return (
    <div className="disclaimer-banner">
      <AlertCircle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
      <div>
        <p>
          <strong>Academic Demonstration Notice:</strong> This platform is powered by an XGBoost regression model trained on a verified synthetic Indian residential property dataset (3,500 records across 8 major metro cities). All predicted valuations and confidence intervals are computed for development, testing, and college PBL demonstration purposes.
        </p>
      </div>
    </div>
  );
}
