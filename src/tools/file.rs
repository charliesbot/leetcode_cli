use anyhow::{Context, Result};
use std::fs::File;
use std::io::Read;
use std::{
    fs::{self},
    io::{self, ErrorKind, Write},
    path::{Path, PathBuf},
};

use crate::graphql::graphql::Question;
use crate::tools::fill_exercise_template::fill_exercise_template;

use super::fill_test_template::fill_test_template;
use super::get_code_snippet_by_lang::get_code_snippet_by_lang;
use super::get_file_extension;
use super::{
    add_leading_zeros::add_leading_zeros, get_file_extension::get_file_extension,
    languages::SupportedLanguage,
};

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

    fn read_file(&self, file_path: &Path) -> Result<String> {
        let mut file_content = String::new();
        File::open(&file_path)
            .with_context(|| format!("Failed to read file: {}", file_path.display()))?
            .read_to_string(&mut file_content)?;
        Ok(file_content)
    }

    fn write_file(&self, file_path: &PathBuf, content: &str) -> Result<()> {
        let mut file = File::create(file_path)
            .with_context(|| format!("Failed to create file: {}", file_path.display()))?;
        file.write_all(content.as_bytes())
            .with_context(|| format!("Failed to write to file: {}", file_path.display()))?;
        Ok(())
    }

    pub fn new(target_directory: impl AsRef<Path>) -> Self {
        let cli_directory = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let templates_directory = cli_directory.join("templates");
        FileUtils {
            templates_directory,
            target_directory: target_directory.as_ref().to_path_buf(),
        }
    }

    pub fn create_exercise(
        &self,
        question: &Question,
        language: &SupportedLanguage,
    ) -> Result<String> {
        let title_slug = question.titleSlug.replace("-", "_");
        let file_extension = get_file_extension(&language);
        let file_name = format!(
            "{}_{}.{}",
            add_leading_zeros(&question.questionId),
            title_slug,
            file_extension
        );

        let snippet = get_code_snippet_by_lang(question, language)?;

        let exercise_template_name = format!("{}.{}", "exercise_template", file_extension);
        let exercise_template_path = self
            .templates_directory
            .join(language.to_string())
            .join(exercise_template_name);
        let exercise_template_content = self.read_file(&exercise_template_path)?;
        let full_exercise_content =
            fill_exercise_template(&exercise_template_content, question, snippet)?;
        let new_file_path = self
            .target_directory
            .join(language.to_string())
            .join(file_name.clone());
        self.write_file(&new_file_path, &full_exercise_content)?;
        Ok(file_name)
    }

    pub fn create_test(&self, question: &Question, language: &SupportedLanguage) -> Result<String> {
        let title_slug = question.titleSlug.replace("-", "_");
        let file_extension = get_file_extension(&language);
        let file_name = format!(
            "{}_{}_test.{}",
            add_leading_zeros(&question.questionId),
            title_slug,
            file_extension
        );

        let test_template_name = format!("{}.{}", "test_template", file_extension);
        let test_template_path = self
            .templates_directory
            .join(language.to_string())
            .join(test_template_name);
        let test_template_content = self.read_file(&test_template_path)?;
        let full_exercise_content =
            fill_test_template(&test_template_content, &question, &file_name)?;
        let new_file_path = self
            .target_directory
            .join(language.to_string())
            .join(file_name.clone());
        self.write_file(&new_file_path, &full_exercise_content)?;
        Ok(file_name)
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
