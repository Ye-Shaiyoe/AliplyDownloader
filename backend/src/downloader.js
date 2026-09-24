import { execFile, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';

const TEMP_DIR = path.join(os.tmpdir(), 'aliply_downloads');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Cleanup files older than 15 minutes periodically
setInterval(() => {
  try {
    const files = fs.readdirSync(TEMP_DIR);
    const now = Date.now();
    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > 15 * 60 * 1000) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (err) {
    console.error('Cleanup error:', err);
  }
}, 5 * 60 * 1000);

export function identifyPlatform(url) {
  if (!url || typeof url !== 'string') return 'unknown';
  const cleanUrl = url.trim().toLowerCase();
  if (cleanUrl.includes('instagram.com/')) return 'instagram';
  if (cleanUrl.includes('tiktok.com/')) return 'tiktok';
  if (cleanUrl.includes('youtube.com/') || cleanUrl.includes('youtu.be/')) return 'youtube';
  return 'general';
}

export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function sanitizeFilename(name) {
  if (!name) return 'media';
  return name
    .replace(/[^\w\s\-\.\u0600-\u06FF\u4e00-\u9fa5]/gi, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 100) || 'media';
}

/**
 * Fetches metadata using yt-dlp
 */
export async function getVideoInfo(url) {
  return new Promise((resolve, reject) => {
    const args = [
      '--dump-single-json',
      '--no-playlist',
      '--no-warnings',
      '--skip-download',
      url
    ];

    execFile('yt-dlp', args, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(stderr || error.message));
      }

      try {
        const data = JSON.parse(stdout);
        const platform = identifyPlatform(url);

        // Extract thumbnail
        let thumbnail = data.thumbnail || (data.thumbnails && data.thumbnails.length > 0 ? data.thumbnails[data.thumbnails.length - 1].url : null);

        // Filter and organize video qualities
        const formats = data.formats || [];
        const hasAudio = formats.some(f => f.vcodec === 'none' && f.acodec !== 'none');

        const result = {
          title: data.title || 'Untitled Media',
          thumbnail: thumbnail,
          duration: data.duration ? formatDuration(data.duration) : null,
          durationSeconds: data.duration || 0,
          author: data.uploader || data.channel || data.creator || 'Creator',
          platform: platform,
          originalUrl: url,
          hasAudio: hasAudio,
          formats: [
            { id: 'video-best', type: 'video', quality: 'Best Quality (MP4)', ext: 'mp4' },
            { id: 'video-720', type: 'video', quality: 'HD 720p', ext: 'mp4' },
            { id: 'audio-mp3', type: 'audio', quality: 'Audio Music (MP3 - 320kbps)', ext: 'mp3' },
            { id: 'audio-m4a', type: 'audio', quality: 'Audio Music (M4A / AAC)', ext: 'm4a' }
          ]
        };

        resolve(result);
      } catch (parseError) {
        reject(new Error('Failed to parse media metadata: ' + parseError.message));
      }
    });
  });
}

/**
 * Downloads and prepares file for client
 */
export async function downloadMedia(url, type = 'video', quality = 'best') {
  return new Promise((resolve, reject) => {
    const fileId = crypto.randomBytes(8).toString('hex');
    const isAudio = type === 'audio';
    const targetExt = isAudio ? (quality === 'm4a' ? 'm4a' : 'mp3') : 'mp4';
    const outputTemplate = path.join(TEMP_DIR, `${fileId}.%(ext)s`);

    let args = [
      '--no-playlist',
      '--no-warnings',
      url,
      '-o', outputTemplate
    ];

    if (isAudio) {
      if (targetExt === 'mp3') {
        args.push(
          '-x',
          '--audio-format', 'mp3',
          '--audio-quality', '0',
          '--embed-thumbnail',
          '--add-metadata'
        );
      } else {
        args.push(
          '-x',
          '--audio-format', 'm4a',
          '--embed-thumbnail',
          '--add-metadata'
        );
      }
    } else {
      // Video
      if (quality === '720') {
        args.push('-f', 'bestvideo[height<=720]+bestaudio/best[height<=720]/best');
      } else {
        args.push('-f', 'bestvideo+bestaudio/best');
      }
      args.push('--merge-output-format', 'mp4');
    }

    const process = spawn('yt-dlp', args);

    let stderr = '';
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Download failed with code ${code}: ${stderr}`));
      }

      // Locate the generated file
      try {
        const files = fs.readdirSync(TEMP_DIR);
        const match = files.find(f => f.startsWith(fileId));
        if (!match) {
          return reject(new Error('Output file was not found after processing.'));
        }

        const finalPath = path.join(TEMP_DIR, match);
        const ext = path.extname(match).replace('.', '');
        resolve({
          filePath: finalPath,
          ext: ext
        });
      } catch (err) {
        reject(err);
      }
    });

    process.on('error', (err) => {
      reject(err);
    });
  });
}
