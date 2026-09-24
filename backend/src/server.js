import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getVideoInfo, downloadMedia, sanitizeFilename, identifyPlatform } from './downloader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API: Get Video / Audio Info
app.post('/api/info', async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }

  const cleanUrl = url.trim();
  const platform = identifyPlatform(cleanUrl);

  try {
    const info = await getVideoInfo(cleanUrl);
    res.json({ success: true, data: info });
  } catch (error) {
    console.error('Error fetching video info:', error.message);
    res.status(500).json({
      success: false,
      error: 'Gagal mengambil informasi media. Pastikan tautan valid dan tidak bersifat pribadi (private).'
    });
  }
});

// API: Download Media (Video / Audio)
app.get('/api/download', async (req, res) => {
  const { url, type = 'video', quality = 'best', title = 'media' } = req.query;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const cleanUrl = decodeURIComponent(url);
    const downloadResult = await downloadMedia(cleanUrl, type, quality);
    const { filePath, ext } = downloadResult;

    const safeTitle = sanitizeFilename(title);
    const downloadName = `${safeTitle}.${ext}`;

    res.download(filePath, downloadName, (err) => {
      // Remove temp file after sending or on error
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.error('Error removing temp file:', unlinkErr);
        }
      }

      if (err && !res.headersSent) {
        console.error('Download stream error:', err);
        res.status(500).send('Download failed during streaming.');
      }
    });
  } catch (error) {
    console.error('Error during download:', error.message);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Gagal mengunduh atau mengonversi media: ' + error.message
      });
    }
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AliplyDownloader API', timestamp: new Date() });
});

// Serve frontend in production if built
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 AliplyDownloader Server running on http://localhost:${PORT}`);
});
