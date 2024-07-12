use anyhow::Result;

use crate::graphql::graphql::{CodeSnippet, Question};

use super::{add_leading_zeros::add_leading_zeros, sanitize_text::sanitize_text};

pub fn fill_exercise_template(
    template: &str,
    question: &Question,
    snippet: &CodeSnippet,
) -> Result<String> {
    let mut content = template.to_string();
    content = content.replace("__PROBLEM_ID__", &add_leading_zeros(&question.questionId));
    content = content.replace("__PROBLEM_TITLE__", &question.title);
    content = content.replace("__PROBLEM_DESC__", &sanitize_text(&question.content));
    content = content.replace("__PROBLEM_DIFFICULTY__", &question.difficulty);
    content = content.replace("__PROBLEM_DEFAULT_CODE__", &snippet.code);
    Ok(content)
}
