import React from 'react';
import { Download, Video, Music } from 'lucide-react';
import { FormatOption } from '../../types';
import { FORMAT_OPTIONS } from '../../constants/platforms';
import { AeroButton } from '../common/AeroButton';
import { AeroOrb } from '../common/AeroOrb';

interface FormatListProps {
  downloadingFormatId: string | null;
  onDownload: (format: FormatOption) => void;
}

export const FormatList: React.FC<FormatListProps> = ({
  downloadingFormatId,
  onDownload,
}) => {
  return (
    <div className="formats-section">
      <div className="formats-header-label">
        <Download size={15} aria-hidden="true" />
        <span>Pilih Format & Kualitas:</span>
      </div>

      <div className="formats-grid" role="list">
        {FORMAT_OPTIONS.map((fmt) => {
          const isDownloading = downloadingFormatId === fmt.id;
          const isVideo = fmt.category === 'video';

          return (
            <div
              key={fmt.id}
              className={`format-card ${isVideo ? 'video-card' : 'audio-card'} ${
                isDownloading ? 'downloading' : ''
              }`}
              role="listitem"
            >
              <div className="format-details">
                <AeroOrb
                  variant={isVideo ? 'aqua' : 'emerald'}
                  size={42}
                  className="format-orb"
                >
                  {isVideo ? <Video size={18} /> : <Music size={18} />}
                </AeroOrb>

                <div className="format-text">
                  <div className="format-name-row">
                    <span className="format-name">{fmt.label}</span>
                    {fmt.badge && <span className="format-tag-badge">{fmt.badge}</span>}
                  </div>
                  <span className="format-sub">{fmt.sub}</span>
                </div>
              </div>

              <AeroButton
                id={`btn-dl-${fmt.id}`}
                variant={isVideo ? 'video' : 'audio'}
                isLoading={isDownloading}
                loadingText="Proses..."
                onClick={() => onDownload(fmt)}
                disabled={Boolean(downloadingFormatId)}
                leftIcon={<Download size={14} />}
                className="format-action-btn"
                aria-label={`Unduh ${fmt.label} (${fmt.ext.toUpperCase()})`}
              >
                Download
              </AeroButton>
            </div>
          );
        })}
      </div>
    </div>
  );
};

