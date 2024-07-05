use std::path::{Path, PathBuf};

use anyhow::{Context, Result};

fn get_template_dir() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("templates")
}

pub fn read_template(template_path: &str) -> Result<String> {
    let template_dir = get_template_dir();
    let full_path = template_dir.join(template_path);
    std::fs::read_to_string(&full_path)
        .with_context(|| format!("Failed to read template file: {:?}", full_path))
}
