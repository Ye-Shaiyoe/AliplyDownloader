import React from 'react';
import { Play, Check, Clock, User } from 'lucide-react';
import { FormatOption, MediaInfo, SupportedPlatform } from '../../types';
import { platformLabel } from '../../utils/platform';
import { FormatList } from './FormatList';

interface MediaResultProps {
  mediaInfo: MediaInfo;
  activePlatform: SupportedPlatform;
  downloadingFormatId: string | null;
  onDownload: (format: FormatOption) => void;
}

export const MediaResult: React.FC<MediaResultProps> = ({
  mediaInfo,
  activePlatform,
  downloadingFormatId,
  onDownload,
}) => {
  const currentPlatform = (mediaInfo.platform as SupportedPlatform) || activePlatform;

  return (
    <div className="result-panel" id="result-panel" role="region" aria-label="Hasil Media">
      <div className="panel-sheen" aria-hidden="true" />

      {/* Media Showcase Card */}
      <div className="result-showcase">
        <div className="thumb-frame">
          {mediaInfo.thumbnail ? (
            <img
              src={mediaInfo.thumbnail}
              alt={mediaInfo.title}
              className="thumb-image"
              crossOrigin="anonymous"
              loading="lazy"
            />
          ) : (
            <div className="thumb-placeholder" aria-label="Media preview">
              <Play size={28} />
            </div>
          )}
          {mediaInfo.duration && (
            <span className="duration-aero-chip" title={`Durasi: ${mediaInfo.duration}`}>
              <Clock size={11} className="duration-icon" aria-hidden="true" />
              <span>{mediaInfo.duration}</span>
            </span>
          )}
        </div>

        <div className="result-info">
          <div className="result-badge-row">
            <span
              className={`platform-pill-badge ${currentPlatform}`}
              title={`Platform: ${platformLabel(currentPlatform)}`}
            >
              {platformLabel(currentPlatform)}
            </span>
            <span className="ready-pill-tag">
              <Check size={12} className="check-icon" aria-hidden="true" />
              <span>Siap Diunduh</span>
            </span>
          </div>

          <h2 className="result-title" title={mediaInfo.title}>
            {mediaInfo.title}
          </h2>

          <div className="result-author">
            <User size={13} className="author-icon" aria-hidden="true" />
            <span>
              Dipublikasikan oleh: <strong>{mediaInfo.author || 'Kreator Konten'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Formats Grid */}
      <FormatList
        downloadingFormatId={downloadingFormatId}
        onDownload={onDownload}
      />
    </div>
  );
};

