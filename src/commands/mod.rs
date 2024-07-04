pub mod fetch;
pub mod init;

use clap::Subcommand;

#[derive(Subcommand)]
pub enum Commands {
    Fetch(fetch::FetchArgs),
    Init(init::InitArgs),
}
