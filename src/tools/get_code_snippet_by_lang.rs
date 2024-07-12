use anyhow::{anyhow, Result};

use crate::graphql::graphql::{CodeSnippet, Question};

use super::languages::SupportedLanguage;

pub fn get_code_snippet_by_lang<'a>(
    question: &'a Question,
    language: &SupportedLanguage,
) -> Result<&'a CodeSnippet> {
    question
        .codeSnippets
        .iter()
        .find(|s| s.langSlug.to_lowercase() == language.to_string().to_lowercase())
        .ok_or_else(|| anyhow!("No code snippet found for language: {}", language))
}
