use anyhow::Result;
use clap::Args;
use std::path::{Path, PathBuf};

use crate::graphql::graphql;
use crate::tools::add_leading_zeros::add_leading_zeros;
use crate::tools::file::FileUtils;
use crate::tools::languages::SupportedLanguage;

#[derive(Args)]
pub struct FetchArgs {
    /// The LeetCode problem ID or slug
    pub problem_identifier: String,
    /// The programming language to use
    pub language: SupportedLanguage,
    /// The path to save the problem (defaults to current directory)
    #[arg(short, long, default_value = ".")]
    pub path: PathBuf,
}

pub async fn run(args: &FetchArgs) -> Result<()> {
    let question = graphql::fetch_question(&args.problem_identifier).await?;
    let workspace_path = Path::new(&args.path);
    let language = &args.language;
    let file_utils = FileUtils::new(workspace_path);

    let title_slug = format!(
        "{}_{}",
        add_leading_zeros(&question.questionId),
        question.titleSlug.replace("-", "_")
    );
    let exercise_name = file_utils.create_exercise(&title_slug, &question, language)?;
    let test_name = file_utils.create_test(&title_slug, &question, language)?;

    println!("Created exercise file: {}", exercise_name);
    println!("Created test file: {}", test_name);

    Ok(())
}
