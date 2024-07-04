mod commands;

use clap::Parser;
use commands::Commands;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Fetch(args)) => {
            commands::fetch::execute(args);
        }
        Some(Commands::Init(args)) => {
            commands::init::execute(args);
        }
        None => println!("Please use a valid subcommand. Use --help for more information."),
    }
}
