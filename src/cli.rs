use std::path::PathBuf;

use clap::Parser;

#[derive(Debug, Parser)]
#[command(
    name = "aliply-downloader",
    version,
    about = "Download video YouTube atau ekstrak audionya dari terminal"
)]
pub struct Cli {
    /// URL video YouTube yang akan diproses
    #[arg(value_name = "URL")]
    pub url: Option<String>,

    /// Folder tujuan output; default: folder Downloads user saat ini
    #[arg(short, long, value_name = "DIR")]
    pub output_dir: Option<PathBuf>,
}
