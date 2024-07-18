use crate::graphql::graphql::{CodeSnippet, Question};

use super::{
    add_leading_zeros::add_leading_zeros, get_case_by_language::get_case_by_language,
    sanitize_text::sanitize_text,
};
use convert_case::Casing;

use super::languages::SupportedLanguage;

pub fn fill_exercise_template(
    template: &str,
    question: &Question,
    snippet: &CodeSnippet,
    exercise_file_name: &str,
    language: &SupportedLanguage,
) -> String {
    let mut content = template.to_string();
    let case = get_case_by_language(language);
    let problem_name_formatted = question.title.to_case(case);

    content = content.replace("__PROBLEM_ID__", &add_leading_zeros(&question.questionId));
    content = content.replace("__PROBLEM_TITLE__", &question.title);
    content = content.replace("__PROBLEM_DESC__", &sanitize_text(&question.content));
    content = content.replace("__PROBLEM_DIFFICULTY__", &question.difficulty);
    content = content.replace("__PROBLEM_DEFAULT_CODE__", &snippet.code);
    content = content.replace("__PROBLEM_NAME_FORMATTED__", &problem_name_formatted);
    content = content.replace("__EXERCISE_FILE_NAME__", exercise_file_name);
    content
}
