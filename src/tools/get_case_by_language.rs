use convert_case::Case;

use super::languages::SupportedLanguage;

pub fn get_case_by_language(language: &SupportedLanguage) -> Case {
    match language {
        SupportedLanguage::Python
        | SupportedLanguage::Cpp
        | SupportedLanguage::Rust
        | SupportedLanguage::Ruby
        | SupportedLanguage::Php => Case::Snake,

        SupportedLanguage::Java
        | SupportedLanguage::JavaScript
        | SupportedLanguage::TypeScript
        | SupportedLanguage::Go
        | SupportedLanguage::Swift
        | SupportedLanguage::Kotlin
        | SupportedLanguage::Scala => Case::Camel,
    }
}
