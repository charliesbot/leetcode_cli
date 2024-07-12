use super::languages::SupportedLanguage;

pub fn get_file_extension(language: &SupportedLanguage) -> &str {
    match language {
        SupportedLanguage::Python => "py",
        SupportedLanguage::Java => "java",
        SupportedLanguage::Cpp => "cc",
        SupportedLanguage::TypeScript => "ts",
        SupportedLanguage::JavaScript => "js",
        SupportedLanguage::Php => "php",
        SupportedLanguage::Swift => "swift",
        SupportedLanguage::Ruby => "rb",
        SupportedLanguage::Rust => "rs",
        SupportedLanguage::Kotlin => "kt",
        SupportedLanguage::Scala => "scala",
        SupportedLanguage::Go => "go",
    }
}
