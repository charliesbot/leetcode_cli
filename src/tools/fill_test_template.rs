use convert_case::Casing;

use crate::graphql::graphql::Question;

use super::{get_case_by_language::get_case_by_language, languages::SupportedLanguage};

pub fn fill_test_template(
    template: &str,
    question: &Question,
    exercise_file_name: &str,
    language: &SupportedLanguage,
) -> String {
    let mut content = template.to_string();
    let case = get_case_by_language(language);

    let problem_name_formatted = question.title.to_case(case);

    content = content.replace("__PROBLEM_NAME_FORMATTED__", &problem_name_formatted);
    content = content.replace("__EXERCISE_FILE_NAME__", exercise_file_name);

    content
}
