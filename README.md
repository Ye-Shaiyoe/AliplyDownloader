# AliplyDownloader

CLI downloader berbasis Rust untuk video YouTube dan ekstraksi audio MP3.

> Versi saat ini adalah MVP YouTube. Dukungan TikTok dan Instagram belum diaktifkan.

## Dependency

AliplyDownloader menggunakan dua program eksternal:

- [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) untuk metadata dan download.
- [`FFmpeg`](https://ffmpeg.org/) untuk menggabungkan stream video/audio dan mengubah audio ke MP3.

Keduanya harus tersedia di `PATH`.

Contoh instalasi:

### Linux

```bash
# Debian/Ubuntu
sudo apt install ffmpeg yt-dlp

# Alternatif jika yt-dlp tidak tersedia di package manager
python3 -m pip install -U yt-dlp
```

### macOS

```bash
brew install ffmpeg yt-dlp
```

### Windows

```powershell
winget install yt-dlp.yt-dlp
winget install Gyan.FFmpeg.Shared
```

Pastikan dependency terdeteksi:

```bash
yt-dlp --version
ffmpeg -version
```

## Menjalankan dari source

```bash
cargo run -- "https://www.youtube.com/watch?v=VIDEO_ID"
```

Jika URL tidak diberikan sebagai argument, aplikasi akan memintanya melalui prompt:

```bash
cargo run
```

Folder output default adalah folder `Downloads` user aktif. Folder tujuan dapat diubah:

```bash
cargo run -- --output-dir ./downloads "https://youtu.be/VIDEO_ID"
```

## Pilihan download

- **Best quality MP4**: kualitas video terbaik yang tersedia, dengan audio jika diperlukan.
- **Normal quality MP4**: kualitas hingga 720p.
- **Audio MP3**: ekstrak audio dengan kualitas 192K.
- **Cancel**: membatalkan proses.

## Build release

```bash
cargo build --release
```

Binary tersedia di `target/release/aliply-downloader`.

## Testing

```bash
cargo check
cargo test
```

## Catatan

- Gunakan tool ini hanya untuk konten yang boleh Anda download dan sesuai dengan hak cipta serta ketentuan layanan platform.
- `yt-dlp` perlu diperbarui secara berkala karena platform dapat mengubah mekanisme ekstraksi.
- Video yang memerlukan login atau bersifat private belum menjadi bagian dari MVP.
