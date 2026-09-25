import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Music,
  Video,
  Link2,
  Clipboard,
  X,
  Loader2,
  AlertTriangle,
  Play,
  Shield,
  Zap,
  ChevronRight
} from 'lucide-react';

// Platform icon SVGs — minimal, no emoji
const IconInstagram = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const IconTikTok = () => (
  <svg width="12" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.19a8.16 8.16 0 0 0 4.77 1.52V6.26a4.85 4.85 0 0 1-1-.57z"/>
  </svg>
);

const IconYouTube = () => (
  <svg width="14" height="11" viewBox="0 0 24 18" fill="currentColor">
    <path d="M23.5 2.5a3 3 0 0 0-2.1-2.1C19.5 0 12 0 12 0S4.5 0 2.6.4a3 3 0 0 0-2.1 2.1A31 31 0 0 0 0 9a31 31 0 0 0 .5 6.5A3 3 0 0 0 2.6 17.6C4.5 18 12 18 12 18s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 9a31 31 0 0 0-.5-6.5zM9.8 12.8V5.2L15.8 9l-6 3.8z"/>
  </svg>
);

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram',  Icon: IconInstagram, match: 'instagram.com/' },
  { id: 'tiktok',   label: 'TikTok',     Icon: IconTikTok,   match: 'tiktok.com/' },
  { id: 'youtube',  label: 'YouTube',    Icon: IconYouTube,  match: ['youtube.com/', 'youtu.be/'] },
];

const FORMATS = [
  {
    id: 'video-best',
    type: 'video',
    label: 'Best Quality',
    sub: 'MP4 — full resolution',
    wellClass: 'well-video',
    Icon: Video,
  },
  {
    id: 'video-720',
    type: 'video',
    label: 'HD 720p',
    sub: 'MP4 — balanced size',
    wellClass: 'well-video',
    Icon: Video,
  },
  {
    id: 'audio-mp3',
    type: 'audio',
    label: 'MP3 Audio',
    sub: '320 kbps — high fidelity',
    wellClass: 'well-audio',
    Icon: Music,
    isAudio: true,
  },
  {
    id: 'audio-m4a',
    type: 'audio',
    label: 'M4A / AAC',
    sub: 'AAC codec — device native',
    wellClass: 'well-audio',
    Icon: Music,
    isAudio: true,
  },
];

function detectPlatform(url) {
  const u = url.toLowerCase();
  for (const p of PLATFORMS) {
    const matches = Array.isArray(p.match) ? p.match : [p.match];
    if (matches.some((m) => u.includes(m))) return p.id;
  }
  return null;
}

function platformLabel(id) {
  const map = {
    instagram: 'Instagram Reel',
    tiktok:    'TikTok Video',
    youtube:   'YouTube',
  };
  return map[id] || 'Online Video';
}

export default function App() {
  const [url, setUrl]                   = useState('');
  const [activePlatform, setActivePlatform] = useState('instagram');
  const [detectedPlatform, setDetectedPlatform] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [downloading, setDownloading]   = useState(null);
  const [mediaInfo, setMediaInfo]       = useState(null);
  const [error, setError]               = useState('');
  const inputRef = useRef(null);

  // Detect platform from URL as user types
  useEffect(() => {
    if (!url.trim()) {
      setDetectedPlatform(null);
      return;
    }
    const detected = detectPlatform(url);
    setDetectedPlatform(detected);
    if (detected) setActivePlatform(detected);
  }, [url]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setUrl(text.trim());
        setError('');
        setMediaInfo(null);
      }
    } catch {
      // Clipboard API not available — silently ignore
    }
  };

  const handleClear = () => {
    setUrl('');
    setMediaInfo(null);
    setError('');
    setDetectedPlatform(null);
    inputRef.current?.focus();
  };

  const handleFetch = async (e) => {
    if (e) e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Paste a URL to get started.');
      return;
    }

    setLoading(true);
    setError('');
    setMediaInfo(null);

    try {
      const res = await fetch('/api/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (data.success) {
        setMediaInfo(data.data);
      } else {
        setError(data.error || 'Could not process this URL. Check that the video is public.');
      }
    } catch {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fmt) => {
    if (!mediaInfo) return;
    setDownloading(fmt.id);

    const quality =
      fmt.id === 'audio-m4a' ? 'm4a' :
      fmt.id === 'video-720' ? '720'  :
      fmt.type === 'audio'   ? 'mp3'  : 'best';

    const href = `/api/download?url=${encodeURIComponent(mediaInfo.originalUrl)}&type=${fmt.type}&quality=${quality}&title=${encodeURIComponent(mediaInfo.title)}`;
    const a = document.createElement('a');
    a.href = href;
    a.setAttribute('download', '');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => setDownloading(null), 4500);
  };

  return (
    <div className="app-shell">

      {/* ─── Header ─── */}
      <header className="app-header">
        <a href="/" className="brand" id="brand-logo">
          <div className="brand-icon">
            <Download size={16} />
          </div>
          <span className="brand-text">
            Aliply<span>Downloader</span>
          </span>
        </a>
        <span className="free-badge" id="free-label">100% FREE</span>
      </header>

      <div className="content-column">

        {/* ─── Hero ─── */}
        <section className="hero">
          <h1 className="hero-heading">
            Download video.<br />
            Extract <em>audio</em>.
          </h1>
          <p className="hero-sub">
            Works with Instagram Reels, TikTok, and YouTube. No account. No watermark. No limits.
          </p>
        </section>

        {/* ─── Platform Tab Switcher ─── */}
        <div className="platform-switcher" role="tablist" aria-label="Select platform">
          {PLATFORMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              role="tab"
              id={`tab-${id}`}
              aria-selected={activePlatform === id}
              className={`platform-tab ${activePlatform === id ? 'active' : ''}`}
              onClick={() => {
                setActivePlatform(id);
                setError('');
              }}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>

        {/* ─── Main Downloader Panel ─── */}
        <div className="downloader-panel">
          <form onSubmit={handleFetch}>
            {/* URL Input Slot */}
            <div className="input-row">
              <div className="input-slot-icon">
                <Link2 size={14} />
              </div>
              <input
                ref={inputRef}
                id="url-input"
                type="url"
                className="url-field"
                placeholder={`Paste ${activePlatform} URL here...`}
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(''); }}
                disabled={loading}
                autoComplete="off"
                spellCheck="false"
              />
              {url ? (
                <button
                  type="button"
                  id="btn-clear"
                  className="btn-clear"
                  onClick={handleClear}
                  aria-label="Clear"
                >
                  <X size={12} />
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-paste"
                  className="btn-paste"
                  onClick={handlePaste}
                >
                  <Clipboard size={11} />
                  Paste
                </button>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="error-row" id="error-message" style={{ marginTop: '0.6rem' }}>
                <AlertTriangle size={13} />
                <span>{error}</span>
              </div>
            )}

            {/* CTA */}
            <button
              type="submit"
              id="btn-fetch"
              className="btn-primary"
              disabled={loading || !url.trim()}
              style={{ marginTop: '0.75rem' }}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="spin" />
                  Fetching info...
                </>
              ) : (
                <>
                  <ChevronRight size={14} />
                  Get Download Options
                </>
              )}
            </button>
          </form>
        </div>

        {/* ─── Result Card ─── */}
        {mediaInfo && (
          <div className="result-panel" id="result-panel">

            {/* Media Header */}
            <div className="result-header">
              <div className="thumb-slot">
                {mediaInfo.thumbnail ? (
                  <img
                    src={mediaInfo.thumbnail}
                    alt={mediaInfo.title}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="thumb-placeholder">
                    <Play size={22} />
                  </div>
                )}
                {mediaInfo.duration && (
                  <span className="duration-chip">{mediaInfo.duration}</span>
                )}
              </div>

              <div className="result-meta">
                <span className="result-platform-label">
                  {platformLabel(mediaInfo.platform)}
                </span>
                <div className="result-title" title={mediaInfo.title}>
                  {mediaInfo.title}
                </div>
                <div className="result-author">{mediaInfo.author}</div>
              </div>
            </div>

            {/* Format Rows */}
            <div className="formats-list">
              {FORMATS.map((fmt) => {
                const isDownloading = downloading === fmt.id;
                return (
                  <div key={fmt.id} className="format-row">
                    <div className="format-left">
                      <div className={`format-icon-well ${fmt.wellClass}`}>
                        <fmt.Icon size={14} />
                      </div>
                      <div>
                        <div className="format-name">{fmt.label}</div>
                        <div className="format-sub">{fmt.sub}</div>
                      </div>
                    </div>

                    <button
                      id={`btn-dl-${fmt.id}`}
                      className={`btn-download ${fmt.isAudio ? 'btn-download-audio' : ''}`}
                      onClick={() => handleDownload(fmt)}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 size={11} className="spin" />
                          Wait
                        </>
                      ) : (
                        <>
                          <Download size={11} />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Feature Cards ─── */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feat-icon-well feat-well-green">
              <Shield size={15} />
            </div>
            <div className="feat-text">
              <div className="feat-title">No account required</div>
              <div className="feat-desc">Paste and download. Zero signup friction.</div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feat-icon-well feat-well-purple">
              <Music size={15} />
            </div>
            <div className="feat-text">
              <div className="feat-title">Audio extraction</div>
              <div className="feat-desc">Convert any video to MP3 or M4A instantly.</div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feat-icon-well feat-well-amber">
              <Zap size={15} />
            </div>
            <div className="feat-text">
              <div className="feat-title">yt-dlp engine</div>
              <div className="feat-desc">Always-updated. No broken links, no expiry.</div>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Footer ─── */}
      <footer className="app-footer">
        <span>AliplyDownloader</span>
        <div className="footer-platforms">
          <span>Instagram</span>
          <span>TikTok</span>
          <span>YouTube</span>
        </div>
      </footer>

    </div>
  );
}
