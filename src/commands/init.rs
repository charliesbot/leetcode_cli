use anyhow::{Context, Result};
use clap::Args;
use std::{fs, path::Path};
use strum::IntoEnumIterator;

use crate::tools::{file::FileUtils, languages::SupportedLanguage};

#[derive(Args)]
pub struct InitArgs {
    /// The path to create the LeetCode project
    /// (defaults to the current directory)
    #[arg(default_value = ".")]
    pub path: String,
}

pub fn run(args: &InitArgs) -> Result<()> {
    let workspace_path = Path::new(&args.path);
    let file_utils = FileUtils::new(workspace_path);

    // Create the workspace directory
    file_utils.create_project_directory();

    // Copy root files
    file_utils.copy_file_to_root("WORKSPACE")?;
    file_utils.copy_file_to_root("BUILD")?;

    for lang in SupportedLanguage::iter() {
        copy_language_related_files(&lang, &file_utils)?;
    }

    println!(
        "LeetCode workspace initialized successfully at: {}",
        args.path
    );
    println!("Created WORKSPACE file");
    println!("You can now add languages using the `exercise` command.");

    Ok(())
}

fn copy_language_related_files(language: &SupportedLanguage, file_utils: &FileUtils) -> Result<()> {
    match language {
        SupportedLanguage::TypeScript => {
            file_utils.create_language_directory(language)?;
            file_utils.copy_file_to_root("typescript/package.json")?;
            file_utils.copy_file_to_root("typescript/tsconfig.json")?;
            file_utils.copy_file_to_root("typescript/.prettierrc.json")?;

            file_utils.copy_file_to_lang("typescript/BUILD")?;
        }
        SupportedLanguage::Python => {
            // file_utils.copy_file_from_templates("python/pytest.ini", "")?;
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
