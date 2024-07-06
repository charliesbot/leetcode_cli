use clap::ValueEnum;
use core::fmt;

#[derive(Debug, Clone, ValueEnum)]
pub enum SupportedLanguage {
    Python,
    TypeScript,
    Rust,
    Cpp,
}

impl fmt::Display for SupportedLanguage {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            SupportedLanguage::Python => write!(f, "python"),
            SupportedLanguage::TypeScript => write!(f, "typescript"),
            SupportedLanguage::Rust => write!(f, "rust"),
            SupportedLanguage::Cpp => write!(f, "cpp"),
        }
    }
}
