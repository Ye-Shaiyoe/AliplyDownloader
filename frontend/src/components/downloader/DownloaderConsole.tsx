import React, { useRef, FormEvent } from 'react';
import {
  Link2,
  Clipboard,
  X,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { SupportedPlatform } from '../../types';
import { PLATFORMS } from '../../constants/platforms';
import { platformLabel } from '../../utils/platform';
import { AeroButton } from '../common/AeroButton';

interface DownloaderConsoleProps {
  url: string;
  activePlatform: SupportedPlatform;
  detectedPlatform: SupportedPlatform | null;
  isLoading: boolean;
  error: string | null;
  onUrlChange: (url: string) => void;
  onPaste: () => void;
  onClear: () => void;
  onSubmit: (e?: FormEvent) => void;
}

export const DownloaderConsole: React.FC<DownloaderConsoleProps> = ({
  url,
  activePlatform,
  detectedPlatform,
  isLoading,
  error,
  onUrlChange,
  onPaste,
  onClear,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const activeConfig = PLATFORMS.find((p) => p.id === activePlatform) || PLATFORMS[0];

  const handleClearClick = () => {
    onClear();
    inputRef.current?.focus();
  };

  const isPlatformMismatch = detectedPlatform && detectedPlatform !== activePlatform;

  return (
    <div
      className="aero-panel"
      id="downloader-panel"
      role="tabpanel"
      aria-labelledby={`tab-${activePlatform}`}
    >
      <div className="panel-sheen" aria-hidden="true" />

      {/* Header ribbon with platform status */}
      <div className="panel-header-ribbon">
        <div className="panel-title">
          <div className="panel-icon-orb">
            <Link2 size={16} />
          </div>
          <span>Masukkan Tautan Media</span>
        </div>

        <div className="panel-badge-container">
          {detectedPlatform === activePlatform && url.trim() ? (
            <span className="panel-title-badge verified">
              <CheckCircle2 size={12} />
              <span>{platformLabel(activePlatform)} Terverifikasi</span>
            </span>
          ) : isPlatformMismatch ? (
            <span className="panel-title-badge warning">
              <AlertTriangle size={12} />
              <span>Terdeteksi: {platformLabel(detectedPlatform)}</span>
            </span>
          ) : (
            <span className="panel-title-badge">
              Target: {platformLabel(activePlatform)}
            </span>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate>
        {/* Sunken glass input dock */}
        <div className={`input-dock ${url.trim() ? 'has-value' : ''} ${error ? 'has-error' : ''}`}>
          <div className="input-icon-slot">
            <Link2 size={18} />
          </div>

          <input
            ref={inputRef}
            id="url-input"
            type="url"
            className="url-input-field"
            placeholder={activeConfig.placeholder}
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
            aria-label={`Masukkan URL ${activeConfig.label}`}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'error-message' : undefined}
          />

          <div className="input-actions-slot">
            {url ? (
              <button
                type="button"
                id="btn-clear"
                className="btn-glass-pill clear"
                onClick={handleClearClick}
                aria-label="Bersihkan tautan"
                title="Bersihkan input (Esc)"
              >
                <X size={13} />
                <span>Hapus</span>
              </button>
            ) : (
              <button
                type="button"
                id="btn-paste"
                className="btn-glass-pill paste"
                onClick={onPaste}
                aria-label="Tempel tautan dari clipboard"
                title="Tempel dari papan klip"
              >
                <Clipboard size={13} />
                <span>Tempel</span>
              </button>
            )}
          </div>
        </div>

        {/* Validation Error Message */}
        {error && (
          <div className="error-pill" id="error-message" role="alert">
            <AlertTriangle size={16} className="error-icon" aria-hidden="true" />
            <span className="error-text">{error}</span>
          </div>
        )}

        {/* Primary Aqua Gel CTA Button */}
        <AeroButton
          type="submit"
          id="btn-fetch"
          variant="primary"
          isLoading={isLoading}
          loadingText="Menganalisis Media..."
          disabled={!url.trim() || isLoading}
          className="downloader-submit-btn"
          leftIcon={<Sparkles size={18} />}
          rightIcon={<ArrowRight size={17} />}
        >
          Dapatkan Pilihan Unduhan
        </AeroButton>
      </form>
    </div>
  );
};

