import React, { memo } from 'react';

export const Atmosphere: React.FC = memo(() => {
  return (
    <div className="aero-background" aria-hidden="true">
      {/* Sunlight refraction beam */}
      <div className="aero-light-ray" />
      <div className="aero-light-ray secondary" />

      {/* Floating Frutiger Aero Glass Water Bubbles */}
      <div className="aero-bubble-container">
        <div className="aero-bubble bubble-1" />
        <div className="aero-bubble bubble-2" />
        <div className="aero-bubble bubble-3" />
        <div className="aero-bubble bubble-4" />
        <div className="aero-bubble bubble-5" />
        <div className="aero-bubble bubble-6" />
        <div className="aero-bubble bubble-7" />
        <div className="aero-bubble bubble-8" />
      </div>

      {/* Horizon water shimmer line */}
      <div className="aero-horizon-glow" />
    </div>
  );
});

Atmosphere.displayName = 'Atmosphere';

