use super::{get_file_extension, languages::SupportedLanguage};

pub fn fill_build_template(
    template: &str,
    exercise_name: &str,
    test_name: &str,
    lang: &SupportedLanguage,
) -> String {
    let file_extension = get_file_extension::get_file_extension(&lang);
    let exercise_file = format!("{exercise_name}.{file_extension}");
    let test_file = format!("{test_name}.{file_extension}");
    template
        .replace("__PROJECT_NAME__", &exercise_name)
        .replace("__EXERCISE_FILE__", &exercise_file)
        .replace("__TEST_NAME__", &test_name)
        .replace("__TEST_FILE__", &test_file)
}
