use std::{
    fs,
    io::{self, ErrorKind},
    path::{Path, PathBuf},
};

use anyhow::Context;

use super::languages::SupportedLanguage;

pub struct FileUtils {
    templates_directory: PathBuf,
    target_directory: PathBuf,
}

impl FileUtils {
    fn create_directory(&self, path: &Path) -> anyhow::Result<()> {
        return fs::create_dir_all(path).with_context(|| {
            format!(
                "Failed to create directory at {}",
                path.display().to_string()
            )
        });
    }

    pub fn new(target_directory: impl AsRef<Path>) -> Self {
        let cli_directory = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let templates_directory = cli_directory.join("templates");
        FileUtils {
            templates_directory,
            target_directory: target_directory.as_ref().to_path_buf(),
        }
    }

    pub fn copy_file(&self, from: impl AsRef<Path>, to: impl AsRef<Path>) -> io::Result<()> {
        let from = from.as_ref();
        let to = to.as_ref();
        match fs::copy(from, to) {
            Ok(_) => Ok(()),
            Err(e) => match e.kind() {
                ErrorKind::NotFound => {
                    eprintln!(
                        "Source file not found: FROM {} TO {} ERROR {}",
                        from.display(),
                        to.display(),
                        e
                    );
                    Err(e)
                }
                _ => {
                    eprintln!("Failed to copy file: {}", e);
                    Err(e)
                }
            },
        }
    }

    pub fn copy_file_to_root(&self, file_path: &str) -> io::Result<()> {
        let file_name = file_path.split("/").last().ok_or_else(|| {
            io::Error::new(
                io::ErrorKind::InvalidInput,
                "Invalid file path: no file name found",
            )
        })?;
        let from = self.templates_directory.join(file_path);
        let to = self.target_directory.join(file_name);
        self.copy_file(from, to)
    }

    pub fn copy_file_to_lang(&self, file_path: &str) -> io::Result<()> {
        let from = self.templates_directory.join(file_path);
        let to = self.target_directory.join(file_path);
        self.copy_file(from, to)
    }

    pub fn create_project_directory(&self) -> anyhow::Result<()> {
        self.create_directory(&self.target_directory)
    }

    pub fn create_language_directory(&self, language: &SupportedLanguage) -> anyhow::Result<()> {
        let language_directory_path = self.target_directory.join(language.to_string());
        self.create_directory(&language_directory_path)
    }
}
