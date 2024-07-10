use crate::graphql::graphql;
use anyhow::Result;
use clap::Args;
use std::fs::File;
use std::io::Write;
use std::path::PathBuf;

#[derive(Args)]
pub struct FetchArgs {
    /// The LeetCode problem ID or slug
    pub problem_identifier: String,
    /// The programming language to use
    pub language: String,
}

pub async fn run(args: &FetchArgs) -> Result<()> {
    let question = graphql::fetch_question(&args.problem_identifier).await?;

    let snippet = question
        .codeSnippets
        .iter()
        .find(|s| s.langSlug.to_lowercase() == args.language.to_lowercase())
        .ok_or_else(|| anyhow::anyhow!("Language not supported for this problem"))?;

    println!(
        "Code snippet for problem '{}' in {}:",
        question.title, args.language
    );
    println!("{}", snippet.code);
    println!("{}", question.titleSlug.replace("-", "_"));

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
