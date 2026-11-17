import React from 'react';
import { Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-pill-tag">
        <Sparkles size={14} className="hero-pill-icon" aria-hidden="true" />
        <span>Pure High-Definition Media Extractor</span>
      </div>

      <h1 id="hero-title" className="hero-heading">
        Download video.<br />
        Extract <em>audio murni</em>.
      </h1>

      <p className="hero-sub">
        Dukungan instan untuk Instagram Reels, TikTok tanpa watermark, dan YouTube MP4/MP3.
        Bebas batasan, tanpa registrasi.
      </p>
    </section>
  );
};

