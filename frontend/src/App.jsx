import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Music, 
  Video, 
  Link as LinkIcon, 
  Clipboard, 
  X, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Play
} from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState('all');
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [mediaInfo, setMediaInfo] = useState(null);
  const [error, setError] = useState('');

  // Detect platform automatically as user types or pastes
  useEffect(() => {
    if (!url) {
      setDetectedPlatform('all');
      return;
    }
    const clean = url.toLowerCase();
    if (clean.includes('instagram.com/')) {
      setDetectedPlatform('instagram');
    } else if (clean.includes('tiktok.com/')) {
      setDetectedPlatform('tiktok');
    } else if (clean.includes('youtube.com/') || clean.includes('youtu.be/')) {
      setDetectedPlatform('youtube');
    } else {
      setDetectedPlatform('other');
    }
  }, [url]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setError('');
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  const handleClear = () => {
    setUrl('');
    setMediaInfo(null);
    setError('');
    setDetectedPlatform('all');
  };

  const handleFetchInfo = async (e) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      setError('Silakan masukkan URL Instagram, TikTok, atau YouTube terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError('');
    setMediaInfo(null);

    try {
      const response = await fetch('/api/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await response.json();
      if (data.success && data.data) {
        setMediaInfo(data.data);
      } else {
        setError(data.error || 'Gagal memproses URL tersebut. Pastikan link aktif dan publik.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kendala jaringan saat menghubungi server downloader.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (format) => {
    setDownloadingId(format.id);
    const downloadUrl = `/api/download?url=${encodeURIComponent(mediaInfo.originalUrl)}&type=${format.type}&quality=${format.id === 'audio-m4a' ? 'm4a' : (format.id === 'video-720' ? '720' : (format.type === 'audio' ? 'mp3' : 'best'))}&title=${encodeURIComponent(mediaInfo.title)}`;

    // Create an invisible anchor tag to trigger browser download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingId(null);
    }, 4000);
  };

  return (
    <div className="app-wrapper">
      {/* Dynamic Ambient Glows */}
      <div className="bg-ambient-lights">
        <div className="ambient-blob-1"></div>
        <div className="ambient-blob-2"></div>
        <div className="ambient-blob-3"></div>
      </div>

      {/* Header */}
      <header className="app-header">
        <a href="/" className="brand-logo" id="brand-logo">
          <div className="logo-badge">
            <Download />
          </div>
          <span className="brand-name">
            Aliply<span>Downloader</span>
          </span>
        </a>

        <div className="header-badge" id="free-badge">
          <span className="header-badge-dot"></span>
          100% Free & No Login
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="hero-text">
          <div className="hero-pill">
            <Sparkles size={14} color="#a855f7" />
            <span>Smart Video Extractor & Audio Converter</span>
          </div>
          <h1 className="hero-title">
            Download Video & Convert ke <span className="gradient-text">Musik Bebas</span>
          </h1>
          <p className="hero-desc">
            Unduh video berkualitas tinggi dan ekstrak audio MP3 dari Instagram Reels, TikTok, dan YouTube tanpa batas & tanpa registrasi.
          </p>
        </div>

        {/* Platform Indicators */}
        <div className="platform-chips">
          <div className={`platform-chip instagram ${detectedPlatform === 'instagram' ? 'active' : ''}`}>
            <span>📸 Instagram Reels</span>
          </div>
          <div className={`platform-chip tiktok ${detectedPlatform === 'tiktok' ? 'active' : ''}`}>
            <span>🎵 TikTok (No WM)</span>
          </div>
          <div className={`platform-chip youtube ${detectedPlatform === 'youtube' ? 'active' : ''}`}>
            <span>▶️ YouTube Video & Shorts</span>
          </div>
        </div>

        {/* Input Box Card */}
        <div className="downloader-box">
          <form onSubmit={handleFetchInfo} className="input-container">
            <div className="input-icon">
              <LinkIcon size={20} />
            </div>
            <input
              id="url-input"
              type="url"
              className="url-input"
              placeholder="Tempel tautan video Instagram Reels, TikTok, atau YouTube..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              autoComplete="off"
            />
            <div className="input-actions">
              {url ? (
                <button
                  type="button"
                  id="btn-clear"
                  onClick={handleClear}
                  className="btn-clear"
                  title="Hapus"
                >
                  <X size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-paste"
                  onClick={handlePaste}
                  className="btn-paste"
                  title="Tempel dari Clipboard"
                >
                  <Clipboard size={14} />
                  <span>Paste</span>
                </button>
              )}
              <button
                type="submit"
                id="btn-fetch"
                className="btn-fetch"
                disabled={loading || !url.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="spinner" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Proses Link</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Notice */}
          {error && (
            <div className="error-alert" id="error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Media Info & Download Options Card */}
          {mediaInfo && (
            <div className="media-preview-card" id="media-preview">
              <div className="media-header">
                <div className="thumbnail-wrapper">
                  {mediaInfo.thumbnail ? (
                    <img 
                      src={mediaInfo.thumbnail} 
                      alt={mediaInfo.title} 
                      className="thumbnail-img" 
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
                      <Play size={28} />
                    </div>
                  )}
                  {mediaInfo.duration && (
                    <span className="duration-tag">{mediaInfo.duration}</span>
                  )}
                </div>

                <div className="media-details">
                  <span className="media-platform-badge">
                    {mediaInfo.platform === 'instagram' ? 'Instagram Reel' :
                     mediaInfo.platform === 'tiktok' ? 'TikTok Video' :
                     mediaInfo.platform === 'youtube' ? 'YouTube Media' : 'Online Video'}
                  </span>
                  <h3 className="media-title" title={mediaInfo.title}>
                    {mediaInfo.title}
                  </h3>
                  <div className="media-author">
                    <span>Oleh: {mediaInfo.author}</span>
                  </div>
                </div>
              </div>

              {/* Download Buttons Section */}
              <div className="download-options-grid">
                {mediaInfo.formats.map((fmt) => {
                  const isAudio = fmt.type === 'audio';
                  const isDownloading = downloadingId === fmt.id;

                  return (
                    <div key={fmt.id} className="download-option-card">
                      <div className="option-info">
                        <div className={`option-icon-box ${isAudio ? 'audio' : 'video'}`}>
                          {isAudio ? <Music size={18} /> : <Video size={18} />}
                        </div>
                        <div>
                          <div className="option-title">{fmt.quality}</div>
                          <div className="option-sub">
                            {isAudio ? 'Format Audio High Bitrate' : 'Format Video MP4'}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownload(fmt)}
                        disabled={isDownloading}
                        className={`btn-download-action ${isAudio ? 'audio-btn' : ''}`}
                        id={`btn-download-${fmt.id}`}
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 size={15} className="spinner" />
                            <span>Mengunduh...</span>
                          </>
                        ) : (
                          <>
                            <Download size={15} />
                            <span>Unduh</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Features Highlights */}
        <section className="features-section">
          <div className="feature-box">
            <div className="feature-icon-wrapper purple">
              <ShieldCheck size={22} />
            </div>
            <h3 className="feature-title">Tanpa Akun / Login</h3>
            <p className="feature-desc">
              Nikmati kebebasan mendownload langsung tanpa perlu membuat akun, berlangganan, atau membagikan kredensial.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper cyan">
              <Music size={22} />
            </div>
            <h3 className="feature-title">Convert Video ke Musik</h3>
            <p className="feature-desc">
              Otomatis ekstrak dan konversi lagu latar, sound Reels, atau klip TikTok ke format MP3 320kbps jernih.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper rose">
              <Zap size={22} />
            </div>
            <h3 className="feature-title">Super Cepat & Bebas</h3>
            <p className="feature-desc">
              Didukung oleh engine yt-dlp & ffmpeg untuk kecepatan konversi dan kualitas unduhan terbaik.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div>
          © 2026 <strong>AliplyDownloader</strong>. All rights reserved.
        </div>
        <div className="footer-links">
          <span>Instagram Reels</span>
          <span>•</span>
          <span>TikTok</span>
          <span>•</span>
          <span>YouTube</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
