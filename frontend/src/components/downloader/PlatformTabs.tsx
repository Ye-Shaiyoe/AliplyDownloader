import React, { KeyboardEvent } from 'react';
import { PLATFORMS } from '../../constants/platforms';
import { SupportedPlatform } from '../../types';

interface PlatformTabsProps {
  activePlatform: SupportedPlatform;
  onSelectPlatform: (platform: SupportedPlatform) => void;
  detectedPlatform?: SupportedPlatform | null;
}

export const PlatformTabs: React.FC<PlatformTabsProps> = ({
  activePlatform,
  onSelectPlatform,
  detectedPlatform,
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = PLATFORMS.findIndex((p) => p.id === activePlatform);
    if (e.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % PLATFORMS.length;
      onSelectPlatform(PLATFORMS[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (currentIndex - 1 + PLATFORMS.length) % PLATFORMS.length;
      onSelectPlatform(PLATFORMS[prevIndex].id);
    }
  };

  return (
    <div className="platform-dock-container">
      <div
        className="platform-dock"
        role="tablist"
        aria-label="Pilih platform target unduhan"
        onKeyDown={handleKeyDown}
      >
        <div className="dock-glass-sheen" aria-hidden="true" />

        {PLATFORMS.map(({ id, label, Icon, gradientClass }) => {
          const isActive = activePlatform === id;
          const isDetected = detectedPlatform === id;

          return (
            <button
              key={id}
              role="tab"
              id={`tab-${id}`}
              aria-selected={isActive}
              aria-controls="downloader-panel"
              tabIndex={isActive ? 0 : -1}
              className={`platform-dock-tab ${isActive ? `active ${gradientClass}` : ''} ${
                !isActive && isDetected ? 'detected-hint' : ''
              }`}
              onClick={() => onSelectPlatform(id)}
            >
              <span className="tab-sheen" aria-hidden="true" />
              <Icon />
              <span className="tab-label">{label}</span>
              {isDetected && !isActive && (
                <span className="detected-dot" title="Tautan cocok dengan platform ini" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

