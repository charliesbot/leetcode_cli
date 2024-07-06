use crate::tools::file::copy_file_from_templates;
use crate::tools::is_leetcode_cli_project::is_leetcode_cli_project;
use crate::tools::languages::SupportedLanguage;
use anyhow::{anyhow, Context, Result};
use clap::Args;
use std::fs;
use std::path::Path;

#[derive(Args)]
pub struct AddLanguageArgs {
    pub language: SupportedLanguage,
    #[arg(default_value = ".")]
    pub path: String,
}

pub fn run(args: &AddLanguageArgs) -> Result<()> {
    let workspace_path = Path::new(&args.path);
    //
    if !is_leetcode_cli_project(&workspace_path) {
        return Err(anyhow!(
            "This doesn't appear to be a LeetCode CLI project. Please run 'init' first."
        ));
    }

    let language_directory = workspace_path.join(args.language.to_string());

    fs::create_dir_all(&language_directory)
        .with_context(|| format!("Failed to create directory at {}", args.path))?;

    // Copy BUILD file for the language
    let build_file_path = format!("{}/BUILD", args.language);
    copy_file_from_templates(&build_file_path, &language_directory)
        .with_context(|| format!("Failed to copy BUILD file for {}", args.language))?;

    // Copy additional language-specific files
    // copy_additional_files(&args.language, &language_directory)?;

    Ok(())
}

fn copy_additional_files(language: &SupportedLanguage, target_dir: &Path) -> Result<()> {
    match language {
        SupportedLanguage::TypeScript => {
            copy_file_from_templates("typescript/tsconfig.json", target_dir)?;
        }
        SupportedLanguage::Python => {
            copy_file_from_templates("python/pytest.ini", target_dir)?;
        }
        SupportedLanguage::Rust => {
            // Add any Rust-specific files here if needed
        }
        SupportedLanguage::Cpp => {
            // Add any C++-specific files here if needed
        }
    }
    Ok(())
}
