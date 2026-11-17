import React from 'react';
import { Download, Sparkles } from 'lucide-react';
import { AeroOrb } from '../common/AeroOrb';

export const Header: React.FC = () => {
  return (
    <header className="app-header" role="banner">
      <div className="header-glass-sheen" aria-hidden="true" />

      <a href="/" className="brand" id="brand-logo" aria-label="AliplyDownloader Beranda">
        <AeroOrb variant="aqua" size={38} className="brand-orb">
          <Download size={18} strokeWidth={2.6} />
        </AeroOrb>
        <span className="brand-text">
          Aliply<span>Downloader</span>
        </span>
      </a>

      <div className="header-actions">
        <div className="free-badge-aero" id="free-label" title="Semua fitur 100% gratis tanpa batasan">
          <span className="free-badge-dot" aria-hidden="true" />
          <span className="free-badge-text">100% FREE</span>
        </div>

        <div className="aero-version-pill" title="Frutiger Aero Modern UI Edition">
          <Sparkles size={11} className="sparkle-icon" aria-hidden="true" />
          <span>v2.0 Aero</span>
        </div>
      </div>
    </header>
  );
};

