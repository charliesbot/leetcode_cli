use anyhow::Result;
use clap::Args;
use std::path::{Path, PathBuf};

use crate::graphql::graphql;
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

    let exercise_name = file_utils.create_exercise(&question, language)?;

    println!("Created exercise file: {}", exercise_name);
    println!("Created test file: {}", test_file_path.display());

    // TODO
    // 1. Create file
    // 2. Create tests
    // 3. Add them to the respective BUILD file

    // Create file name let file_name = format!(
    //     "{}_{}.{}",
    //     question.question_frontend_id,
    //     question.title_slug,
    //     get_file_extension(&args.language)
    // );
    // let file_path = PathBuf::from(&file_name);

    // Write to file
    // let mut file = File::create(file_path)?;
    // writeln!(
    //     file,
    //     "// LeetCode {} - {}",
    //     question.question_frontend_id, question.title
    // )?;
    // writeln!(file, "// Difficulty: {}", question.difficulty)?;
    // writeln!(file, "// {}", question.content.lines().next().unwrap_or(""))?;
    // writeln!(file)?;
    // file.write_all(snippet.code.as_bytes())?;
    // writeln!(file)?;
    // writeln!(file, "// Sample test case:")?;
    // writeln!(file, "// {}", question.sample_test_case)?;
    //
    // println!("Created file: {}", file_name);

    Ok(())
}
