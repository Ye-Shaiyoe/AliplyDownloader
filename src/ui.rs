use std::path::Path;
use std::time::Duration;

use anyhow::Result;
use dialoguer::{Confirm, Input, Select};
use indicatif::{ProgressBar, ProgressStyle};
use url::Url;

use crate::models::{DownloadChoice, MediaInfo};

pub fn read_url(url: Option<String>) -> Result<String> {
    let value = match url {
        Some(url) => url,
        None => Input::<String>::new()
            .with_prompt("URL")
            .interact_text()?,
    };

    let parsed = Url::parse(value.trim())?;
    if !matches!(parsed.scheme(), "http" | "https") {
        anyhow::bail!("URL harus menggunakan HTTP atau HTTPS");
    }

    Ok(value.trim().to_owned())
}

pub fn show_spinner<T, F>(message: &str, operation: F) -> Result<T>
where
    F: FnOnce() -> Result<T>,
{
    let spinner = ProgressBar::new_spinner();
    spinner.set_style(
        ProgressStyle::with_template("{spinner} {msg}")
            .unwrap_or_else(|_| ProgressStyle::default_spinner()),
    );
    spinner.enable_steady_tick(Duration::from_millis(100));
    spinner.set_message(message.to_owned());

    let result = operation();
    match &result {
        Ok(_) => spinner.finish_with_message(format!("✓ {message}")),
        Err(_) => spinner.finish_with_message(format!("✗ {message}")),
    }
    result
}

pub fn print_media_info(media: &MediaInfo) {
    println!();
    println!("Title   : {}", media.title);
    println!("Duration: {}", format_duration(media.duration));
    println!(
        "Quality : {}",
        media
            .best_height()
            .map(|height| format!("{height}p"))
            .unwrap_or_else(|| "Unknown".to_owned())
    );
    if let Some(uploader) = &media.uploader {
        println!("Uploader: {uploader}");
    }
    println!();
}

pub fn choose_download() -> Result<DownloadChoice> {
    let options = [
        "Best quality MP4",
        "Normal quality MP4 (up to 720p)",
        "Audio MP3",
        "Cancel",
    ];
    let selected = Select::new()
        .with_prompt("Pilih format download")
        .items(&options)
        .default(0)
        .interact()?;

    Ok(match selected {
        0 => DownloadChoice::BestVideo,
        1 => DownloadChoice::NormalVideo,
        2 => DownloadChoice::AudioMp3,
        _ => DownloadChoice::Cancel,
    })
}

pub fn confirm_overwrite(path: &Path) -> Result<bool> {
    Ok(Confirm::new()
        .with_prompt(format!("File '{}' sudah ada. Timpa?", path.display()))
        .default(false)
        .interact()?)
}

fn format_duration(duration: Option<f64>) -> String {
    let Some(duration) = duration else {
        return "Unknown".to_owned();
    };

    let total_seconds = duration.max(0.0).round() as u64;
    let hours = total_seconds / 3600;
    let minutes = (total_seconds % 3600) / 60;
    let seconds = total_seconds % 60;

    if hours > 0 {
        format!("{hours:02}:{minutes:02}:{seconds:02}")
    } else {
        format!("{minutes:02}:{seconds:02}")
    }
}

#[cfg(test)]
mod tests {
    use super::format_duration;

    #[test]
    fn formats_duration_without_hours() {
        assert_eq!(format_duration(Some(42.0)), "00:42");
    }

    #[test]
    fn formats_duration_with_hours() {
        assert_eq!(format_duration(Some(3661.0)), "01:01:01");
    }
}
