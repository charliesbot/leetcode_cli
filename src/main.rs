mod commands;
mod tools;
use anyhow::{Ok, Result};
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
pub enum Commands {
    Init(commands::init::InitArgs),
    // Fetch(commands::fetch::FetchArgs),
}

fn main() -> Result<()> {
    let cli = Cli::parse();

    match &cli.command {
        Commands::Init(args) => {
            commands::init::run(args)?;
        }
    }

    Ok(())
}
