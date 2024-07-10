mod commands;
mod graphql;
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
    Fetch(commands::fetch::FetchArgs),
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    match &cli.command {
        Commands::Init(args) => {
            commands::init::run(args)?;
        }
        Commands::Fetch(args) => {
            commands::fetch::run(args).await?;
        }
    }

    Ok(())
}
