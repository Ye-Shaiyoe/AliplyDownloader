import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="skeleton-panel" aria-busy="true" aria-label="Memuat preview media...">
      <div className="skeleton-sheen" />
      <div className="skeleton-header">
        <div className="skeleton-thumb" />
        <div className="skeleton-meta">
          <div className="skeleton-badge-line" />
          <div className="skeleton-title-line" />
          <div className="skeleton-title-line short" />
          <div className="skeleton-author-line" />
        </div>
      </div>
      <div className="skeleton-grid">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    </div>
  );
};

