import React, { useState, useRef } from 'react';
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
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';

// Platform SVG Icons with crisp skeuomorphic contours
const IconInstagram = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
  </svg>
);

const IconTikTok = () => (
  <svg width="14" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.19a8.16 8.16 0 0 0 4.77 1.52V6.26a4.85 4.85 0 0 1-1-.57z"/>
  </svg>
);

const IconYouTube = () => (
  <svg width="16" height="13" viewBox="0 0 24 18" fill="currentColor">
    <path d="M23.5 2.5a3 3 0 0 0-2.1-2.1C19.5 0 12 0 12 0S4.5 0 2.6.4a3 3 0 0 0-2.1 2.1A31 31 0 0 0 0 9a31 31 0 0 0 .5 6.5A3 3 0 0 0 2.6 17.6C4.5 18 12 18 12 18s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 9a31 31 0 0 0-.5-6.5zM9.8 12.8V5.2L15.8 9l-6 3.8z"/>
  </svg>
);

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', Icon: IconInstagram, tabClass: 'tab-instagram' },
  { id: 'tiktok', label: 'TikTok', Icon: IconTikTok, tabClass: 'tab-tiktok' },
  { id: 'youtube', label: 'YouTube', Icon: IconYouTube, tabClass: 'tab-youtube' },
];

const FORMATS = [
  {
    id: 'video-best',
    type: 'video',
    label: 'Best Quality',
    sub: 'MP4 • Full Resolution Video',
    category: 'video',
    Icon: Video,
  },
  {
    id: 'video-720',
    type: 'video',
    label: 'HD 720p',
    sub: 'MP4 • Fast & Balanced Size',
    category: 'video',
    Icon: Video,
  },
  {
    id: 'audio-mp3',
    type: 'audio',
    label: 'MP3 Audio',
    sub: '320 kbps • Studio High Fidelity',
    category: 'audio',
    Icon: Music,
    isAudio: true,
  },
  {
    id: 'audio-m4a',
    type: 'audio',
    label: 'M4A / AAC',
    sub: 'AAC Codec • Device Native',
    category: 'audio',
    Icon: Music,
    isAudio: true,
  },
];

function detectPlatform(url) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') return null;
    const hostname = parsedUrl.hostname.toLowerCase().replace(/\.$/, '');
    for (const platform of PLATFORMS) {
      const domains = platform.id === 'youtube'
        ? ['youtube.com', 'youtu.be']
        : [`${platform.id}.com`];
      if (domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) {
        return platform.id;
      }
    }
  } catch {
    return null;
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
  const [loading, setLoading]           = useState(false);
  const [downloading, setDownloading]   = useState(null);
  const [mediaInfo, setMediaInfo]       = useState(null);
  const [error, setError]               = useState('');
  const inputRef = useRef(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setUrl(text.trim());
        setError('');
        setMediaInfo(null);
      }
    } catch {
      // Fallback or ignore if clipboard permission denied
    }
  };

  const handleClear = () => {
    setUrl('');
    setMediaInfo(null);
    setError('');
    inputRef.current?.focus();
  };

  const handleFetch = async (e) => {
    if (e) e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Tempel tautan video terlebih dahulu.');
      return;
    }

    const detectedPlatform = detectPlatform(trimmed);
    if (detectedPlatform !== activePlatform) {
      const selectedPlatform = PLATFORMS.find(({ id }) => id === activePlatform)?.label;
      setMediaInfo(null);
      setError(
        detectedPlatform
          ? `Tautan ini milik ${platformLabel(detectedPlatform)}. Silakan pilih tab ${platformLabel(detectedPlatform)} di atas.`
          : `Masukkan tautan ${selectedPlatform} yang valid untuk melanjutkan.`,
      );
      return;
    }

    setLoading(true);
    setError('');
    setMediaInfo(null);

    try {
      const res = await fetch('/api/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed, platform: activePlatform }),
      });
      const data = await res.json();
      if (data.success) {
        setMediaInfo(data.data);
      } else {
        setError(data.error || 'Gagal memproses tautan. Pastikan video bersifat publik.');
      }
    } catch {
      setError('Koneksi terputus. Pastikan server backend sedang aktif.');
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

    const href = `/api/download?url=${encodeURIComponent(mediaInfo.originalUrl)}&platform=${activePlatform}&type=${fmt.type}&quality=${quality}&title=${encodeURIComponent(mediaInfo.title)}`;
    const a = document.createElement('a');
    a.href = href;
    a.setAttribute('download', '');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => setDownloading(null), 4500);
  };

  return (
    <>
      {/* ─── Frutiger Aero Atmosphere & Floating Glass Bubbles ─── */}
      <div className="aero-background">
        <div className="aero-light-ray" />
        <div className="aero-bubble-container">
          <div className="aero-bubble bubble-1" />
          <div className="aero-bubble bubble-2" />
          <div className="aero-bubble bubble-3" />
          <div className="aero-bubble bubble-4" />
          <div className="aero-bubble bubble-5" />
          <div className="aero-bubble bubble-6" />
        </div>
      </div>

      <div className="app-shell">

        {/* ─── Top Aero Glass Header ─── */}
        <header className="app-header">
          <a href="/" className="brand" id="brand-logo">
            <div className="brand-icon-orb">
              <Download size={18} strokeWidth={2.6} />
            </div>
            <span className="brand-text">
              Aliply<span>Downloader</span>
            </span>
          </a>

          <div className="free-badge-aero" id="free-label">
            <span className="free-badge-dot" />
            <span>100% FREE</span>
          </div>
        </header>

        <div className="content-column">

          {/* ─── Hero Section ─── */}
          <section className="hero">
            <div className="hero-pill-tag">
              <Sparkles size={14} />
              <span>Pure High-Definition Media Extractor</span>
            </div>
            <h1 className="hero-heading">
              Download video.<br />
              Extract <em>audio murni</em>.
            </h1>
            <p className="hero-sub">
              Dukungan instan untuk Instagram Reels, TikTok tanpa watermark, dan YouTube MP4/MP3. Bebas batasan, tanpa registrasi.
            </p>
          </section>

          {/* ─── Platform Selector Dock ─── */}
          <div className="platform-dock-container">
            <div className="platform-dock" role="tablist" aria-label="Select target platform">
              {PLATFORMS.map(({ id, label, Icon, tabClass }) => (
                <button
                  key={id}
                  role="tab"
                  id={`tab-${id}`}
                  aria-selected={activePlatform === id}
                  className={`platform-dock-tab ${activePlatform === id ? `active ${tabClass}` : ''}`}
                  onClick={() => {
                    setActivePlatform(id);
                    setError('');
                    setMediaInfo(null);
                  }}
                >
                  <Icon />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ─── Main Downloader Aero Glass Console ─── */}
          <div className="aero-panel">
            <div className="panel-header-ribbon">
              <div className="panel-title">
                <Link2 size={18} color="#0284c7" />
                <span>Masukkan Tautan Media</span>
              </div>
              <span className="panel-title-badge">
                Auto Detect: {platformLabel(activePlatform)}
              </span>
            </div>

            <form onSubmit={handleFetch}>
              <div className="input-dock">
                <div className="input-icon-slot">
                  <Link2 size={16} />
                </div>
                <input
                  ref={inputRef}
                  id="url-input"
                  type="url"
                  className="url-input-field"
                  placeholder={`Tempel link ${activePlatform} di sini (cth: https://${activePlatform}.com/...)...`}
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(''); setMediaInfo(null); }}
                  disabled={loading}
                  autoComplete="off"
                  spellCheck="false"
                />
                {url ? (
                  <button
                    type="button"
                    id="btn-clear"
                    className="btn-glass-pill"
                    onClick={handleClear}
                    aria-label="Bersihkan"
                  >
                    <X size={13} />
                    <span>Hapus</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="btn-paste"
                    className="btn-glass-pill"
                    onClick={handlePaste}
                  >
                    <Clipboard size={13} />
                    <span>Tempel</span>
                  </button>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-pill" id="error-message">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Primary Aqua Gel CTA */}
              <button
                type="submit"
                id="btn-fetch"
                className="btn-aero-primary"
                disabled={loading || !url.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    <span>Menganalisis Media...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Dapatkan Pilihan Unduhan</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ─── Result Media Showcase Panel ─── */}
          {mediaInfo && (
            <div className="result-panel" id="result-panel">
              {/* Media Card Header */}
              <div className="result-showcase">
                <div className="thumb-frame">
                  {mediaInfo.thumbnail ? (
                    <img
                      src={mediaInfo.thumbnail}
                      alt={mediaInfo.title}
                      className="thumb-image"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="thumb-placeholder">
                      <Play size={28} />
                    </div>
                  )}
                  {mediaInfo.duration && (
                    <span className="duration-aero-chip">{mediaInfo.duration}</span>
                  )}
                </div>

                <div className="result-info">
                  <div className="result-badge-row">
                    <span className={`platform-pill-badge ${mediaInfo.platform || activePlatform}`}>
                      {platformLabel(mediaInfo.platform || activePlatform)}
                    </span>
                    <span className="hero-pill-tag" style={{ padding: '0.2rem 0.6rem', fontSize: '0.74rem' }}>
                      <Check size={12} color="#10b981" />
                      Siap Diunduh
                    </span>
                  </div>
                  <h2 className="result-title" title={mediaInfo.title}>
                    {mediaInfo.title}
                  </h2>
                  <div className="result-author">
                    Dipublikasikan oleh: <strong>{mediaInfo.author || 'Kreator Konten'}</strong>
                  </div>
                </div>
              </div>

              {/* Formats Grid */}
              <div className="formats-header-label">
                <Download size={15} />
                <span>Pilih Format & Kualitas:</span>
              </div>

              <div className="formats-grid">
                {FORMATS.map((fmt) => {
                  const isDownloading = downloading === fmt.id;
                  const isVideo = fmt.category === 'video';

                  return (
                    <div key={fmt.id} className="format-card">
                      <div className="format-details">
                        <div className={`format-icon-orb ${fmt.category}`}>
                          <fmt.Icon size={18} />
                        </div>
                        <div>
                          <div className="format-name">{fmt.label}</div>
                          <div className="format-sub">{fmt.sub}</div>
                        </div>
                      </div>

                      <button
                        id={`btn-dl-${fmt.id}`}
                        className={isVideo ? 'btn-aero-video' : 'btn-aero-audio'}
                        onClick={() => handleDownload(fmt)}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 size={13} className="spin" />
                            <span>Proses...</span>
                          </>
                        ) : (
                          <>
                            <Download size={13} />
                            <span>Download</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Aero Desktop Gadget Feature Cards ─── */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feat-icon-orb emerald">
                <Shield size={20} />
              </div>
              <div className="feat-content">
                <div className="feat-title">Tanpa Registrasi</div>
                <div className="feat-desc">Langsung tempel tautan dan unduh seketika tanpa perlu login akun atau data pribadi.</div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feat-icon-orb cyan">
                <Music size={20} />
              </div>
              <div className="feat-content">
                <div className="feat-title">Ekstraksi Musik 320kbps</div>
                <div className="feat-desc">Konversi video Reels, TikTok, atau Shorts ke MP3/M4A fidelitas tinggi dengan FFmpeg engine.</div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feat-icon-orb amber">
                <Zap size={20} />
              </div>
              <div className="feat-content">
                <div className="feat-title">Engine yt-dlp Mutakhir</div>
                <div className="feat-desc">Pembaruan rutin untuk stabilitas ekstraksi tanpa watermark dan tanpa limit kecepatan.</div>
              </div>
            </div>
          </div>

        </div>

        {/* ─── Aero Glass Footer ─── */}
        <footer className="app-footer">
          <div>
            <strong>AliplyDownloader</strong> • Futuristic Frutiger Aero Edition
          </div>
          <div className="footer-tags">
            <span className="footer-pill-tag">yt-dlp Core</span>
            <span className="footer-pill-tag">FFmpeg Audio</span>
            <span className="footer-pill-tag">React 19 + Vite</span>
          </div>
        </footer>

      </div>
    </>
  );
}
