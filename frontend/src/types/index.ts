import { ComponentType, SVGProps } from 'react';

export type SupportedPlatform = 'instagram' | 'tiktok' | 'youtube';
export type PlatformId = SupportedPlatform | 'general' | 'unknown';

export type FormatCategory = 'video' | 'audio';
export type DownloadFormatId = 'video-best' | 'video-720' | 'audio-mp3' | 'audio-m4a';

export interface PlatformConfig {
  id: SupportedPlatform;
  label: string;
  shortName: string;
  tagline: string;
  placeholder: string;
  accentColor: string;
  gradientClass: string;
  domains: string[];
  sampleUrl: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface RawApiFormat {
  id: string;
  type: FormatCategory;
  quality: string;
  ext: string;
}

export interface MediaInfo {
  title: string;
  thumbnail: string | null;
  duration: string | null;
  durationSeconds: number;
  author: string;
  platform: PlatformId;
  originalUrl: string;
  hasAudio: boolean;
  formats: RawApiFormat[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface FormatOption {
  id: DownloadFormatId;
  type: FormatCategory;
  label: string;
  sub: string;
  category: FormatCategory;
  ext: string;
  qualityParam: string;
  badge?: string;
  isAudio?: boolean;
}

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

