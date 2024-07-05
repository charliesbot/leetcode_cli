use crate::tools::read_template::read_template;
use anyhow::{Context, Result};
use clap::Args;
use std::{
    fs::{self, File},
    io::Write,
    path::Path,
};

#[derive(Args)]
pub struct InitArgs {
    /// The path to create the LeetCode project (defaults to the current directory)
    #[arg(default_value = ".")]
    pub path: String,
}

pub fn run(args: &InitArgs) -> Result<()> {
    let workspace_path = Path::new(&args.path);

    // Create the workspace directory
    fs::create_dir_all(workspace_path)
        .with_context(|| format!("Failed to create directory at {}", args.path))?;

    // Read the WORKSPACE template
    let workspace_template = read_template("WORKSPACE")?;

    // Create the WORKSPACE file
    let workspace_file_path = workspace_path.join("WORKSPACE");
    let mut file = File::create(&workspace_file_path).with_context(|| {
        format!(
            "Failed to create WORKSPACE file at {:?}",
            workspace_file_path
        )
    })?;

    file.write_all(workspace_template.as_bytes())
        .with_context(|| {
            format!(
                "Failed to write to WORKSPACE file at {:?}",
                workspace_file_path
            )
        })?;

    println!(
        "LeetCode workspace initialized successfully at: {}",
        args.path
    );
    println!("Created WORKSPACE file");
    println!("You can now add languages using the `add_language` command.");

    Ok(())
}
