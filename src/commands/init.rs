use crate::tools::file::copy_file_from_templates;
use anyhow::{Context, Result};
use clap::Args;
use std::{fs, path::Path};

#[derive(Args)]
pub struct InitArgs {
    /// The path to create the LeetCode project
    /// (defaults to the current directory)
    #[arg(default_value = ".")]
    pub path: String,
}

pub fn run(args: &InitArgs) -> Result<()> {
    let workspace_path = Path::new(&args.path);

    // Create the workspace directory
    fs::create_dir_all(workspace_path)
        .with_context(|| format!("Failed to create directory at {}", args.path))?;

    // Create the WORKSPACE file
    match copy_file_from_templates("WORKSPACE", &workspace_path) {
        Ok(_) => {
            println!(
                "LeetCode workspace initialized successfully at: {}",
                args.path
            );
            println!("Created WORKSPACE file");
            println!("You can now add languages using the `add_language` command.");
        }
        Err(e) => {
            println!("Error initializing Project: {}", e);
        }
    }

    Ok(())
}
