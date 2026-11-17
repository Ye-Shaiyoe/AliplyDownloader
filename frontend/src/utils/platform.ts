import { PLATFORMS, PLATFORM_LABEL_MAP } from '../constants/platforms';
import { PlatformId, SupportedPlatform } from '../types';

/**
 * Validates if a string is a valid HTTP/HTTPS URL
 */
export function isValidUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const parsed = new URL(urlString.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Identifies the target platform from a URL string
 */
export function detectPlatform(urlString: string): SupportedPlatform | null {
  if (!isValidUrl(urlString)) return null;

  try {
    const parsed = new URL(urlString.trim());
    const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '');

    for (const platform of PLATFORMS) {
      const match = platform.domains.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
      );
      if (match) {
        return platform.id;
      }
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Returns human-readable platform label
 */
export function platformLabel(platformId: PlatformId): string {
  if (platformId === 'instagram' || platformId === 'tiktok' || platformId === 'youtube') {
    return PLATFORM_LABEL_MAP[platformId];
  }
  return 'Online Media';
}

/**
 * Normalizes user-input URL strings
 */
export function cleanUrlInput(input: string): string {
  return input.trim();
}

