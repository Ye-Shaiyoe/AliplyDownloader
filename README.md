# 🚀 AliplyDownloader

**AliplyDownloader** adalah web application gratis dan tanpa login untuk mengunduh video dan mengonversi video ke musik (MP3 / Audio) dari **Instagram Reels**, **TikTok (Tanpa Watermark)**, dan **YouTube (Video & Shorts)**.

Dibuat dengan UI modern bernuansa *Futuristic Dark Glassmorphism* yang elegan, minimalis, dan responsif.

---

## ✨ Fitur Utama

- 📸 **Instagram Reels Downloader**: Download Reels dalam kualitas HD.
- 🎵 **TikTok Video & Sound**: Unduh video TikTok tanpa watermark dan ekstrak audio latar belakang.
- ▶️ **YouTube Video & MP3**: Download MP4 (Best Quality / 720p) atau langsung convert ke MP3 (320kbps High Quality).
- 🔓 **100% Free & No Login**: Langsung pakai tanpa registrasi atau batasan akun.
- 📋 **Auto Paste & Auto-Platform Detect**: Mendeteksi platform target secara otomatis saat link ditempel.
- ⚡ **High Performance**: Didukung oleh engine `yt-dlp` dan `ffmpeg`.

---

## 🛠️ Tech Stack

- **Backend**: Node.js & Express.js
- **Frontend**: React + Vite + Lucide Icons + Modern Vanilla CSS Glassmorphism
- **Media Engine**: `yt-dlp` & `ffmpeg`

---

## 🚀 Cara Menjalankan

### 1. Prasyarat Sistem
Pastikan `Node.js`, `yt-dlp`, dan `ffmpeg` telah terpasang di sistem:
```bash
yt-dlp --version
ffmpeg -version
node -v
```

### 2. Menjalankan Aplikasi
```bash
# Menjalankan server aplikasi (Production mode)
npm start

# Atau menjalankan mode development dengan hot-reloading
npm run dev
```

Buka browser Anda di:
👉 **`http://localhost:5000`** (atau `http://localhost:3000` pada mode dev)

---

## 📁 Struktur Direktori

```
VIdeoDownloader/
├── backend/
│   ├── src/
│   │   ├── downloader.js    # Engine ekstraksi & konversi media (yt-dlp & ffmpeg)
│   │   └── server.js        # Express API & static server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Interactive UI & platform detection
│   │   ├── index.css        # Futuristic Glassmorphic Design System
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
├── package.json             # Root runner scripts
└── GEMINI.md
```
