import React from 'react';
import { useDownloader } from './hooks/useDownloader';
import { Atmosphere } from './components/layout/Atmosphere';
import { Header } from './components/layout/Header';
import { Hero } from './components/downloader/Hero';
import { PlatformTabs } from './components/downloader/PlatformTabs';
import { DownloaderConsole } from './components/downloader/DownloaderConsole';
import { MediaResult } from './components/downloader/MediaResult';
import { LoadingSkeleton } from './components/common/Skeleton';
import { FeatureCards } from './components/features/FeatureCards';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';

export default function App(): React.JSX.Element {
  const {
    url,
    activePlatform,
    detectedPlatform,
    isLoading,
    downloadingFormatId,
    mediaInfo,
    error,
    toast,
    handleUrlChange,
    handleSelectPlatform,
    handlePaste,
    handleClear,
    handleSubmit,
    handleDownload,
    dismissToast,
  } = useDownloader();

  return (
    <>
      {/* ─── Frutiger Aero Atmosphere: Sky/Water Gradient & Floating Bubbles ─── */}
      <Atmosphere />

      {/* ─── Floating Toast Feedback ─── */}
      <Toast notification={toast} onClose={dismissToast} />

      <div className="app-shell">
        {/* ─── Top Aero Glass Header ─── */}
        <Header />

        <main className="content-column">
          {/* ─── Hero Section ─── */}
          <Hero />

          {/* ─── Platform Selector Dock ─── */}
          <PlatformTabs
            activePlatform={activePlatform}
            onSelectPlatform={handleSelectPlatform}
            detectedPlatform={detectedPlatform}
          />

          {/* ─── Main Downloader Aero Glass Console ─── */}
          <DownloaderConsole
            url={url}
            activePlatform={activePlatform}
            detectedPlatform={detectedPlatform}
            isLoading={isLoading}
            error={error}
            onUrlChange={handleUrlChange}
            onPaste={handlePaste}
            onClear={handleClear}
            onSubmit={handleSubmit}
          />

          {/* ─── Loading State Skeleton ─── */}
          {isLoading && <LoadingSkeleton />}

          {/* ─── Result Media Showcase Panel ─── */}
          {mediaInfo && !isLoading && (
            <MediaResult
              mediaInfo={mediaInfo}
              activePlatform={activePlatform}
              downloadingFormatId={downloadingFormatId}
              onDownload={handleDownload}
            />
          )}

          {/* ─── Desktop Gadget Feature Cards ─── */}
          <FeatureCards />
        </main>

        {/* ─── Aero Glass Footer ─── */}
        <Footer />
      </div>
    </>
  );
}

