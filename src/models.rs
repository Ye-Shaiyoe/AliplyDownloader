use std::fmt;

use anyhow::{bail, Context, Result};
use serde::Deserialize;
use url::Url;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Platform {
    YouTube,
}

impl Platform {
    pub fn from_url(raw_url: &str) -> Result<Self> {
        let url = Url::parse(raw_url).context("URL tidak valid")?;
        let host = url
            .host_str()
            .context("URL tidak memiliki hostname")?
            .to_ascii_lowercase();

        if host == "youtube.com"
            || host.ends_with(".youtube.com")
            || host == "youtu.be"
            || host.ends_with(".youtu.be")
        {
            return Ok(Self::YouTube);
        }

        bail!("URL '{}' bukan URL YouTube yang didukung", raw_url);
    }
}

impl fmt::Display for Platform {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::YouTube => write!(f, "YouTube"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::Platform;

    #[test]
    fn recognizes_youtube_hosts() {
        assert_eq!(Platform::from_url("https://www.youtube.com/watch?v=test").unwrap(), Platform::YouTube);
        assert_eq!(Platform::from_url("https://youtu.be/test").unwrap(), Platform::YouTube);
    }

    #[test]
    fn rejects_non_youtube_hosts() {
        assert!(Platform::from_url("https://example.com/video").is_err());
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DownloadChoice {
    BestVideo,
    NormalVideo,
    AudioMp3,
    Cancel,
}

impl DownloadChoice {
    pub fn extension(self) -> &'static str {
        match self {
            Self::AudioMp3 => "mp3",
            Self::BestVideo | Self::NormalVideo | Self::Cancel => "mp4",
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct MediaInfo {
    #[serde(default)]
    pub title: String,
    pub duration: Option<f64>,
    pub uploader: Option<String>,

    pub height: Option<u32>,
    #[serde(default)]
    pub formats: Vec<FormatInfo>,
}

impl MediaInfo {
    pub fn best_height(&self) -> Option<u32> {
        self.height.or_else(|| {
            self.formats
                .iter()
                .filter_map(|format| format.height)
                .max()
        })
    }
}

#[derive(Debug, Deserialize)]
pub struct FormatInfo {
    pub height: Option<u32>,
}
