use html_escape::decode_html_entities;
use regex::Regex;
use textwrap::wrap;

pub fn sanitize_text(content: &String) -> String {
    let desc = content.lines().next().unwrap_or("");
    // Step 1: Decode HTML entities
    let decoded = decode_html_entities(desc);

    // Step 2: Remove HTML tags
    let re = Regex::new(r"<[^>]+>").unwrap();
    let without_tags = re.replace_all(&decoded, "");

    // Step 3: Wrap text to 80 characters
    let wrapped = wrap(&without_tags, 50);
    wrapped
        .iter()
        .enumerate()
        .map(|(i, line)| {
            if i == 0 {
                line.trim().to_string()
            } else {
                format!(" * {}", line.trim())
            }
        })
        .collect::<Vec<String>>()
        .join("\n")
}
