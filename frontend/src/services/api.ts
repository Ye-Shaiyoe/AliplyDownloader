import { ApiResponse, FormatOption, MediaInfo, SupportedPlatform } from '../types';

/**
 * Calls backend API to fetch media metadata
 */
export async function fetchMediaInfo(
  url: string,
  platform: SupportedPlatform
): Promise<ApiResponse<MediaInfo>> {
  try {
    const response = await fetch('/api/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url.trim(),
        platform,
      }),
    });

    const data: ApiResponse<MediaInfo> = await response.json();
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network failure';
    return {
      success: false,
      error: `Koneksi ke backend gagal: ${message}. Pastikan server aktif.`,
    };
  }
}

/**
 * Builds the GET endpoint URL for direct file downloading
 */
export function buildDownloadUrl(
  originalUrl: string,
  platform: SupportedPlatform,
  format: FormatOption,
  title: string
): string {
  const params = new URLSearchParams({
    url: originalUrl,
    platform,
    type: format.type,
    quality: format.qualityParam,
    title: title || 'media',
  });

  return `/api/download?${params.toString()}`;
}

/**
 * Safely triggers an in-browser direct download
 */
export function triggerBrowserDownload(downloadUrl: string): void {
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

