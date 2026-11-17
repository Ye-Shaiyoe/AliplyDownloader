import { useState, useCallback, useTransition, useMemo } from 'react';
import {
  FormatOption,
  MediaInfo,
  SupportedPlatform,
  ToastNotification,
} from '../types';
import { PLATFORMS } from '../constants/platforms';
import { detectPlatform, isValidUrl, platformLabel } from '../utils/platform';
import {
  fetchMediaInfo,
  buildDownloadUrl,
  triggerBrowserDownload,
} from '../services/api';

export function useDownloader() {
  const [url, setUrlState] = useState<string>('');
  const [activePlatform, setActivePlatform] = useState<SupportedPlatform>('instagram');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [downloadingFormatId, setDownloadingFormatId] = useState<string | null>(null);
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const [, startTransition] = useTransition();

  // Real-time detected platform based on the current URL
  const detectedPlatform = useMemo(() => {
    return detectPlatform(url);
  }, [url]);

  const showToast = useCallback(
    (type: ToastNotification['type'], message: string, title?: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      setToast({ id, type, message, title, duration });
    },
    []
  );

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleUrlChange = useCallback(
    (newUrl: string) => {
      setUrlState(newUrl);
      setError(null);

      // Auto-switch platform if a valid URL of another platform is detected
      const detected = detectPlatform(newUrl);
      if (detected && detected !== activePlatform) {
        startTransition(() => {
          setActivePlatform(detected);
          setMediaInfo(null);
        });
      }
    },
    [activePlatform]
  );

  const handleSelectPlatform = useCallback(
    (platform: SupportedPlatform) => {
      setActivePlatform(platform);
      setError(null);
      setMediaInfo(null);
    },
    []
  );

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const trimmed = text.trim();
      if (!trimmed) {
        showToast('warning', 'Papan klip (clipboard) Anda kosong.', 'Papan Klip');
        return;
      }

      setUrlState(trimmed);
      setError(null);
      setMediaInfo(null);

      const detected = detectPlatform(trimmed);
      if (detected) {
        setActivePlatform(detected);
        showToast(
          'success',
          `Tautan ${platformLabel(detected)} terdeteksi & platform disesuaikan secara otomatis.`,
          'Auto-Detect Aktif'
        );
      } else {
        showToast('info', 'Tautan berhasil ditempel ke dalam formulir.', 'Berhasil Menempel');
      }
    } catch {
      showToast(
        'error',
        'Izin akses clipboard ditolak atau tidak didukung oleh browser Anda.',
        'Akses Ditolak'
      );
    }
  }, [showToast]);

  const handleClear = useCallback(() => {
    setUrlState('');
    setMediaInfo(null);
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const cleanUrl = url.trim();

      if (!cleanUrl) {
        setError('Tempel tautan video terlebih dahulu.');
        return;
      }

      if (!isValidUrl(cleanUrl)) {
        setError('Format tautan tidak valid. Gunakan format URL lengkap (https://...).');
        return;
      }

      const detected = detectPlatform(cleanUrl);
      if (detected !== activePlatform) {
        const activePlatformConfig = PLATFORMS.find((p) => p.id === activePlatform);
        const activeName = activePlatformConfig?.label || 'Platform terpilih';

        if (detected) {
          setError(
            `Tautan ini milik ${platformLabel(detected)}. Mengalihkan tab ke ${platformLabel(detected)}...`
          );
          setActivePlatform(detected);
          // Allow state to settle, then fetch
          setTimeout(() => {
            setError(null);
          }, 1500);
          return;
        }

        setError(`Masukkan tautan ${activeName} yang valid untuk melanjutkan.`);
        return;
      }

      setIsLoading(true);
      setError(null);
      setMediaInfo(null);

      try {
        const response = await fetchMediaInfo(cleanUrl, activePlatform);
        if (response.success && response.data) {
          setMediaInfo(response.data);
          showToast(
            'success',
            `Metadata untuk "${response.data.title.substring(0, 36)}..." siap diunduh!`,
            'Media Ditemukan'
          );
        } else {
          setError(
            response.error ||
              'Gagal mengambil informasi media. Pastikan tautan valid dan tidak bersifat pribadi (private).'
          );
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Koneksi terputus';
        setError(`Terjadi kesalahan sistem: ${msg}`);
      } finally {
        setIsLoading(false);
      }
    },
    [url, activePlatform, showToast]
  );

  const handleDownload = useCallback(
    (format: FormatOption) => {
      if (!mediaInfo) return;

      setDownloadingFormatId(format.id);
      showToast(
        'info',
        `Menyiapkan unduhan ${format.label} (${format.ext.toUpperCase()})... Browser Anda akan memulai unduhan segera.`,
        'Memproses Unduhan'
      );

      const downloadUrl = buildDownloadUrl(
        mediaInfo.originalUrl,
        activePlatform,
        format,
        mediaInfo.title
      );

      triggerBrowserDownload(downloadUrl);

      // Reset downloading state after a sensible feedback delay
      setTimeout(() => {
        setDownloadingFormatId(null);
      }, 4000);
    },
    [mediaInfo, activePlatform, showToast]
  );

  return {
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
  };
}

