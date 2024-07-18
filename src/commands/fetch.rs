use anyhow::{Context, Result};
use clap::Args;
use std::path::PathBuf;

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
    let question = graphql::fetch_question(&args.problem_identifier)
        .await
        .context("Failed to fetch question details")?;

    let file_utils = FileUtils::new(&args.path);
    let title_slug = format!(
        "{}_{}",
        add_leading_zeros(&question.questionId),
        question.titleSlug.replace("-", "_")
    );
    let exercise_name = file_utils.create_exercise(&title_slug, &question, &args.language)?;
    let test_name = file_utils
        .maybe_create_test(&title_slug, &question, &args.language)
        .context("Failed to create test file")?
        .unwrap_or_else(|| exercise_name.clone());

    file_utils.update_build_file(&exercise_name, &test_name, &args.language)?;

    println!("Created exercise file: {}", exercise_name);

    // If test name and exercise name are the same,
    // it means there test is inside the exercise file.
    // Therefore, we don't print the test file path.
    if test_name != exercise_name {
        println!("Created test file: {}", test_name);
    }

    println!(
        "Run `bazel test //{}:{}`",
        &args.language.to_string(),
        &test_name
    );

    Ok(())
}
