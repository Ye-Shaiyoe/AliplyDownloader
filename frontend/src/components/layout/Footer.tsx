import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-glass-sheen" aria-hidden="true" />

      <div className="footer-info">
        <strong>AliplyDownloader</strong> • Futuristic Frutiger Aero Edition
      </div>

      <div className="footer-tags">
        <span className="footer-pill-tag">yt-dlp Core</span>
        <span className="footer-pill-tag">FFmpeg Audio</span>
        <span className="footer-pill-tag">React 19 + TypeScript</span>
        <span className="footer-pill-tag">Vite</span>
      </div>
    </footer>
  );
};

