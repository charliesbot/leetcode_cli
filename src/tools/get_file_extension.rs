pub fn get_file_extension(language: &str) -> &str {
    match language.to_lowercase().as_str() {
        "python" => "py",
        "typescript" => "ts",
        "c++" | "cpp" => "cc",
        "rust" => "rs",
        _ => "txt",
    }
}
