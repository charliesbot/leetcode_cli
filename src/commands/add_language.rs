use clap::Args;
use std::fs;
use std::path::PathBuf;

#[derive(Args)]
pub struct AddLanguageArgs {
    /// The language to add
    pub language: String,
    /// The directory of the project
    #[arg(default_value = ".")]
    pub directory: PathBuf,
}

pub fn execute(args: &AddLanguageArgs) {
    println!(
        "Adding language '{}' to project in {:?}",
        args.language, args.directory
    );

    let lang_dir = args.directory.join(&args.language);
    fs::create_dir_all(&lang_dir).expect("Failed to create language directory");

    // Copy BUILD file from template
    // copy_template_file(&format!("languages/{}/BUILD", args.language), &lang_dir);

    println!("Language '{}' added successfully!", args.language);
}
