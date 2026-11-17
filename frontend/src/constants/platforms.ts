import { PlatformConfig, SupportedPlatform, FormatOption } from '../types';
import {
  IconInstagram,
  IconTikTok,
  IconYouTube,
} from '../components/common/PlatformIcons';

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    shortName: 'Reels',
    tagline: 'Reels, Video & Audio',
    placeholder: 'Tempel link Instagram di sini (cth: https://instagram.com/reel/...)...',
    accentColor: '#f43f5e',
    gradientClass: 'tab-instagram',
    domains: ['instagram.com'],
    sampleUrl: 'https://www.instagram.com/reel/C3abc123/',
    Icon: IconInstagram,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    shortName: 'TikTok',
    tagline: 'No Watermark Video & Sound',
    placeholder: 'Tempel link TikTok di sini (cth: https://tiktok.com/@user/video/...)...',
    accentColor: '#0ea5e9',
    gradientClass: 'tab-tiktok',
    domains: ['tiktok.com'],
    sampleUrl: 'https://www.tiktok.com/@creator/video/1234567890',
    Icon: IconTikTok,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    shortName: 'YouTube',
    tagline: 'Video HD & MP3 320kbps',
    placeholder: 'Tempel link YouTube di sini (cth: https://youtu.be/... atau youtube.com)...',
    accentColor: '#ef4444',
    gradientClass: 'tab-youtube',
    domains: ['youtube.com', 'youtu.be'],
    sampleUrl: 'https://youtu.be/dQw4w9WgXcQ',
    Icon: IconYouTube,
  },
];

export const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: 'video-best',
    type: 'video',
    label: 'Best Quality',
    sub: 'MP4 • Resolusi Penuh & Suara Jernih',
    category: 'video',
    ext: 'mp4',
    qualityParam: 'best',
    badge: 'Rekomendasi',
  },
  {
    id: 'video-720',
    type: 'video',
    label: 'HD 720p',
    sub: 'MP4 • Hemat Kuota & Seimbang',
    category: 'video',
    ext: 'mp4',
    qualityParam: '720',
    badge: 'Cepat',
  },
  {
    id: 'audio-mp3',
    type: 'audio',
    label: 'MP3 Audio',
    sub: '320 kbps • Studio High Fidelity',
    category: 'audio',
    ext: 'mp3',
    qualityParam: 'mp3',
    badge: 'HQ Audio',
    isAudio: true,
  },
  {
    id: 'audio-m4a',
    type: 'audio',
    label: 'M4A / AAC',
    sub: 'AAC Codec • Format Native Device',
    category: 'audio',
    ext: 'm4a',
    qualityParam: 'm4a',
    isAudio: true,
  },
];

export const PLATFORM_LABEL_MAP: Record<SupportedPlatform, string> = {
  instagram: 'Instagram Reel',
  tiktok: 'TikTok Video',
  youtube: 'YouTube Media',
};

