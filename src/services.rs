use std::io::{BufRead, BufReader};
use std::path::Path;
use std::process::{Command, Stdio};

use anyhow::{bail, Context, Result};
use indicatif::{ProgressBar, ProgressStyle};

use crate::models::{DownloadChoice, MediaInfo};

pub struct Extractor {
    executable: &'static str,
}

impl Extractor {
    pub fn new() -> Self {
        Self { executable: "yt-dlp" }
    }

    pub fn ensure_available(&self) -> Result<()> {
        check_executable(self.executable, "yt-dlp", &["--version"])
    }

    pub fn fetch(&self, url: &str) -> Result<MediaInfo> {
        let output = Command::new(self.executable)
            .args([
                "--dump-single-json",
                "--no-warnings",
                "--skip-download",
                "--no-playlist",
                url,
            ])
            .output()
            .with_context(|| "Gagal menjalankan yt-dlp untuk mengambil metadata")?;

        if !output.status.success() {
            let error = String::from_utf8_lossy(&output.stderr);
            bail!("yt-dlp gagal mengambil metadata: {}", clean_output(&error));
        }

        serde_json::from_slice(&output.stdout)
            .context("Metadata dari yt-dlp tidak dapat dibaca")
    }
}

pub struct Downloader {
    executable: &'static str,
}

impl Downloader {
    pub fn new() -> Self {
        Self { executable: "yt-dlp" }
    }

    pub fn ensure_available(&self) -> Result<()> {
        check_executable(self.executable, "yt-dlp", &["--version"])?;
        check_executable("ffmpeg", "FFmpeg", &["-version"])
    }

    pub fn download(
        &self,
        url: &str,
        destination: &Path,
        choice: DownloadChoice,
        overwrite: bool,
    ) -> Result<()> {
        let mut command = Command::new(self.executable);
        command
            .arg("--no-playlist")
            .arg("--newline")
            .arg("--progress")
            .arg("--no-warnings")
            .arg("--output")
            .arg(destination);

        match choice {
            DownloadChoice::BestVideo => {
                command
                    .arg("--format")
                    .arg("bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b")
                    .arg("--merge-output-format")
                    .arg("mp4");
            }
            DownloadChoice::NormalVideo => {
                command
                    .arg("--format")
                    .arg("bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720][ext=mp4]/b[height<=720]/b")
                    .arg("--merge-output-format")
                    .arg("mp4");
            }
            DownloadChoice::AudioMp3 => {
                command
                    .arg("--extract-audio")
                    .arg("--audio-format")
                    .arg("mp3")
                    .arg("--audio-quality")
                    .arg("192K");
            }
            DownloadChoice::Cancel => bail!("Pilihan download tidak valid"),
        }

        if overwrite {
            command.arg("--force-overwrites");
        } else {
            command.arg("--no-overwrites");
        }

        command.arg(url).stdout(Stdio::null()).stderr(Stdio::piped());
        let mut child = command
            .spawn()
            .with_context(|| "Gagal memulai proses download yt-dlp")?;
        let stderr = child
            .stderr
            .take()
            .context("Tidak dapat membaca progress yt-dlp")?;
        let reader = BufReader::new(stderr);
        let progress = progress_bar();

        for line in reader.lines() {
            let line = line.context("Gagal membaca output yt-dlp")?;
            if let Some(percent) = parse_percent(&line) {
                progress.set_position(percent.round() as u64);
                progress.set_message(format!("{percent:.1}%"));
            }
        }

        let status = child.wait().context("Gagal menunggu proses yt-dlp")?;
        progress.finish_and_clear();

        if !status.success() {
            bail!("Download gagal. Periksa URL dan pastikan video dapat diakses.");
        }

        Ok(())
    }
}

fn check_executable(executable: &str, display_name: &str, version_args: &[&str]) -> Result<()> {
    let result = Command::new(executable).args(version_args).output();
    match result {
        Ok(output) if output.status.success() => Ok(()),
        Ok(_) => bail!("{} ditemukan, tetapi tidak dapat dijalankan", display_name),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => bail!(
            "{} tidak ditemukan di PATH. Silakan install {} terlebih dahulu.",
            display_name,
            display_name
        ),
        Err(error) => Err(error).with_context(|| format!("Gagal menjalankan {}", display_name)),
    }
}

fn progress_bar() -> ProgressBar {
    let progress = ProgressBar::new(100);
    let style = ProgressStyle::with_template("{bar:40.cyan/blue} {pos:>3}% {msg}")
        .unwrap_or_else(|_| ProgressStyle::default_bar())
        .progress_chars("##-");
    progress.set_style(style);
    progress
}

fn parse_percent(line: &str) -> Option<f64> {
    line.split_whitespace().find_map(|token| {
        token
            .strip_suffix('%')
            .and_then(|value| value.parse::<f64>().ok())
            .filter(|value| (0.0..=100.0).contains(value))
    })
}

fn clean_output(output: &str) -> String {
    output.lines().last().unwrap_or(output).trim().to_owned()
}
