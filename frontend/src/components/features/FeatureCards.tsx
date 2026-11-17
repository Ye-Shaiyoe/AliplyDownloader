import React from 'react';
import { Shield, Music, Zap } from 'lucide-react';
import { AeroOrb } from '../common/AeroOrb';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  variant: 'emerald' | 'aqua' | 'amber';
  Icon: React.ComponentType<{ size?: number }>;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'no-registration',
    title: 'Tanpa Registrasi',
    description:
      'Langsung tempel tautan dan unduh seketika tanpa perlu login akun atau data pribadi.',
    variant: 'emerald',
    Icon: Shield,
  },
  {
    id: 'music-extraction',
    title: 'Ekstraksi Musik 320kbps',
    description:
      'Konversi video Reels, TikTok, atau Shorts ke MP3/M4A fidelitas tinggi dengan FFmpeg engine.',
    variant: 'aqua',
    Icon: Music,
  },
  {
    id: 'yt-dlp-engine',
    title: 'Engine yt-dlp Mutakhir',
    description:
      'Pembaruan rutin untuk stabilitas ekstraksi tanpa watermark dan tanpa limit kecepatan.',
    variant: 'amber',
    Icon: Zap,
  },
];

export const FeatureCards: React.FC = () => {
  return (
    <section className="features-grid" aria-label="Keunggulan Layanan">
      {FEATURES.map(({ id, title, description, variant, Icon }) => (
        <article key={id} className="feature-card">
          <div className="card-sheen" aria-hidden="true" />
          <AeroOrb variant={variant} size={46} className="feat-orb">
            <Icon size={20} />
          </AeroOrb>
          <div className="feat-content">
            <h3 className="feat-title">{title}</h3>
            <p className="feat-desc">{description}</p>
          </div>
        </article>
      ))}
    </section>
  );
};

