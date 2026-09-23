use std::path::{Path, PathBuf};

use anyhow::{bail, Context, Result};

pub fn downloads_dir() -> Result<PathBuf> {
    if let Some(path) = dirs::download_dir() {
        return Ok(path);
    }

    if let Some(path) = dirs::home_dir() {
        return Ok(path.join("Downloads"));
    }

    bail!("Tidak dapat menentukan folder Downloads user saat ini");
}

pub fn output_path(output_dir: &Path, title: &str, extension: &str) -> PathBuf {
    output_dir.join(format!("{}.{}", sanitize_filename(title), extension))
}

pub fn sanitize_filename(input: &str) -> String {
    let sanitized: String = input
        .chars()
        .map(|character| match character {
            '<' | '>' | ':' | '"' | '/' | '\\' | '|' | '?' | '*' => '_',
            character if character.is_control() => '_',
            character => character,
        })
        .collect();

    let trimmed = sanitized.trim().trim_end_matches(['.', ' ']);
    let result = if trimmed.is_empty() { "video" } else { trimmed };
    let reserved = result
        .split('.')
        .next()
        .unwrap_or(result)
        .to_ascii_uppercase();

    if matches!(reserved.as_str(), "CON" | "PRN" | "AUX" | "NUL")
        || (reserved.len() == 4
            && matches!(reserved.as_bytes().first(), Some(b'L' | b'C'))
            && reserved[1..].chars().all(|character| character.is_ascii_digit()))
    {
        format!("_{}", result)
    } else {
        result.to_owned()
    }
}

pub fn ensure_output_directory(path: &Path) -> Result<()> {
    std::fs::create_dir_all(path)
        .with_context(|| format!("Tidak dapat membuat folder: {}", path.display()))?;
    Ok(())
}
