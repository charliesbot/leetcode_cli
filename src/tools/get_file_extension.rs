pub fn get_file_extension(language: &str) -> &str {
    match language.to_lowercase().as_str() {
        "python" | "python3" => "py",
        "java" => "java",
        "c++" => "cpp",
        "javascript" => "js",
        "typescript" => "ts",
        "rust" => "rs",
        "golang" => "go",
        "swift" => "swift",
        "kotlin" => "kt",
        "scala" => "scala",
        "ruby" => "rb",
        "php" => "php",
        // Add more languages as needed
        _ => "txt",
    }
}
