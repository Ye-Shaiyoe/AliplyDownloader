import React, { ReactNode } from 'react';

export type OrbVariant = 'aqua' | 'emerald' | 'amber' | 'rose' | 'default';

interface AeroOrbProps {
  children: ReactNode;
  variant?: OrbVariant;
  size?: number;
  className?: string;
  glow?: boolean;
}

export const AeroOrb: React.FC<AeroOrbProps> = ({
  children,
  variant = 'default',
  size = 40,
  className = '',
  glow = true,
}) => {
  return (
    <div
      className={`aero-orb ${variant} ${glow ? 'glow' : ''} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
      }}
      aria-hidden="true"
    >
      <div className="aero-orb-reflection" />
      <div className="aero-orb-content">{children}</div>
    </div>
  );
};

