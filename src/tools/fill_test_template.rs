use convert_case::{Case, Casing};

use crate::graphql::graphql::Question;

pub fn fill_test_template(template: &str, question: &Question, exercise_file_name: &str) -> String {
    let mut content = template.to_string();

    // TODO - update this to support the conventions of other languages.
    // Currently this cover languages like TypeScript and JavaScript
    let problem_name_formatted = question.title.to_case(Case::Camel);

    content = content.replace("__PROBLEM_NAME_FORMATTED__", &problem_name_formatted);
    content = content.replace("__EXERCISE_FILE_NAME__", exercise_file_name);

    content
}
