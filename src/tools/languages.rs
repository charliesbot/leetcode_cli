use core::fmt;
use strum_macros::EnumIter;

#[non_exhaustive]
#[derive(Debug, EnumIter)]
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
