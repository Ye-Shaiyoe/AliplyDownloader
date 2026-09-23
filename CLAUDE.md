Saya mau bikin sebuah tools pendownload video dan convert ke music dengan nama tools ini AliplyDownloader berbasis CLI. 
untuk downloader menggunakan curl ata rekomendasi aja.(soalnya universala linux, windows dan macos).
stak bahasa pemrograman saya mau pake bahasa pemrograman Rust 
beberapa website nya yaitu: 

1. https://www.instagram.com/reels/
2. https://www.tiktok.com/
3. https://www.youtube.com/


Tools ini berbasis CLI 

kira2 contoh Outputnya seperti ini:
```
URL:
> https://example.com/video/123

⠋ Fetching metadata...
✓ Video found

Title  : Example Video
Duration: 00:42
Quality: 1080p

[1] 1080p MP4 (best quality) < (pake tombol keyboard panah untuk pilih, Space untuk milih jadi (X), dan enter untuk Download)
[2] 720p  MP4 (normal quality)
[3] Audio MP3 (just music)
[4] Cancel

Select > 1

⠋ Downloading...
██████████████████████████ 100%

✓ Saved to:

~/Downloads/video1.mp4
```

target akhir bisa di donwload di > 
/home/namauser/Downloads/video1.mp4 (di linux) (Utama)
/C/Users/namauser/Downloads/video1.mp4 (di windows)
/Users/namauser/Downloads/video1.mp4 (di macos)
