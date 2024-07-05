use anyhow::{Context, Result};
use std::path::PathBuf;

pub fn get_project_path(path: Option<String>) -> Result<PathBuf> {
    match path {
        Some(p) => Ok(PathBuf::from(p)),
        None => std::env::current_dir().context("Failed to get current directory"),
    }
}
