use clap::ValueEnum;
use core::fmt;
use strum_macros::EnumIter;

#[non_exhaustive]
#[derive(Debug, Clone, ValueEnum, EnumIter, PartialEq)]
pub enum SupportedLanguage {
    #[value(name = "python")]
    Python,
    #[value(name = "java")]
    Java,
    #[value(name = "cpp")]
    Cpp,
    #[value(name = "javascript", alias = "js")]
    JavaScript,
    #[value(name = "typescript", alias = "ts")]
    TypeScript,
    #[value(name = "rust", alias = "rs")]
    Rust,
    #[value(name = "go")]
    Go,
    #[value(name = "swift")]
    Swift,
    #[value(name = "kotlin")]
    Kotlin,
    #[value(name = "scala")]
    Scala,
    #[value(name = "ruby")]
    Ruby,
    #[value(name = "php")]
    Php,
}

impl fmt::Display for SupportedLanguage {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            SupportedLanguage::Python => write!(f, "python"),
            SupportedLanguage::Java => write!(f, "java"),
            SupportedLanguage::Cpp => write!(f, "cpp"),
            SupportedLanguage::JavaScript => write!(f, "javascript"),
            SupportedLanguage::TypeScript => write!(f, "typescript"),
            SupportedLanguage::Rust => write!(f, "rust"),
            SupportedLanguage::Go => write!(f, "golang"),
            SupportedLanguage::Swift => write!(f, "swift"),
            SupportedLanguage::Kotlin => write!(f, "kotlin"),
            SupportedLanguage::Scala => write!(f, "scala"),
            SupportedLanguage::Ruby => write!(f, "ruby"),
            SupportedLanguage::Php => write!(f, "php"),
        }
    }
}
