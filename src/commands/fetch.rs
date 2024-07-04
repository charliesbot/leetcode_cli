use clap::Args;

#[derive(Args)]
pub struct FetchArgs {
    /// The LeetCode problem ID
    pub id: String,
}

pub fn execute(args: &FetchArgs) {
    println!("Fetching problem with ID: {}", args.id);
    // TODO: Implement fetching logic
}
