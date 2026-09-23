mod cli;
mod filesystem;
mod models;
mod services;
mod ui;

use anyhow::{bail, Result};
use clap::Parser;
use cli::Cli;
use filesystem::{downloads_dir, output_path};
use models::{DownloadChoice, Platform};
use services::{Downloader, Extractor};
use ui::{choose_download, confirm_overwrite, print_media_info, read_url, show_spinner};

fn main() -> Result<()> {
    let cli = Cli::parse();
    run(cli)
}

fn run(cli: Cli) -> Result<()> {
    let raw_url = read_url(cli.url)?;
    let platform = Platform::from_url(&raw_url)?;

    if platform != Platform::YouTube {
        bail!("Platform '{}' belum didukung. Saat ini AliplyDownloader hanya mendukung YouTube.", platform);
    }

    let extractor = Extractor::new();
    extractor.ensure_available()?;

    let metadata = show_spinner("Fetching metadata...", || extractor.fetch(&raw_url))?;
    print_media_info(&metadata);

    let choice = choose_download()?;
    if choice == DownloadChoice::Cancel {
        println!("Download dibatalkan.");
        return Ok(());
    }

    let output_dir = cli
        .output_dir
        .map(Ok)
        .unwrap_or_else(downloads_dir)?;
    filesystem::ensure_output_directory(&output_dir)?;

    let extension = choice.extension();
    let destination = output_path(&output_dir, &metadata.title, extension);
    let overwrite = if destination.exists() {
        confirm_overwrite(&destination)?
    } else {
        false
    };

    let downloader = Downloader::new();
    downloader.ensure_available()?;
    show_spinner("Downloading...", || {
        downloader.download(&raw_url, &destination, choice, overwrite)
    })?;

    println!("\n✓ Saved to:\n{}", destination.display());
    Ok(())
}
