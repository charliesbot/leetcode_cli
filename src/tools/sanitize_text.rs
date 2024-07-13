use html_escape::decode_html_entities;
use textwrap::fill;

fn remove_html_tags(html: &str) -> String {
    html.replace("<strong>", "")
        .replace("</strong>", "")
        .replace("<em>", "")
        .replace("</em>", "")
        .replace("</p>", "")
        .replace("<p>", "")
        .replace("<b>", "")
        .replace("</b>", "")
        .replace("<pre>", "")
        .replace("</pre>", "")
        .replace("<ul>", "")
        .replace("</ul>", "")
        .replace("<li>", "")
        .replace("</li>", "")
        .replace("<code>", "")
        .replace("</code>", "")
        .replace("<i>", "")
        .replace("</i>", "")
        .replace("<sub>", "")
        .replace("</sub>", "")
        .replace("</sup>", "")
        .replace("<sup>", "^")
        .replace("<strong class=\"example\">", "")
        .replace("<font face=\"monospace\">", "")
        .replace("</font>", "")
}
pub fn sanitize_text(content: &str) -> String {
    // Step 1: Decode HTML entities
    let decoded = decode_html_entities(content);

    // Step 2: Remove HTML tags, but keep some structure
    let removed_tags = remove_html_tags(&decoded);

    // Step 3: Clean up whitespace while preserving paragraph structure
    let cleaned = removed_tags
        .split('\n')
        .map(|line| line.trim())
        .filter(|line| !line.is_empty())
        .collect::<Vec<&str>>()
        .join("\n\n");

    // Step 4: Wrap text to 80 characters, respecting paragraphs
    let wrapped = cleaned
        .split("\n\n")
        .map(|paragraph| fill(paragraph, 80))
        .collect::<Vec<String>>()
        .join("\n\n");

    // Step 5: Format with asterisks
    wrapped
        .split('\n')
        .enumerate()
        .map(|(i, line)| {
            if i == 0 {
                line.to_string()
            } else {
                format!(" * {}", line.trim())
            }
        })
        .collect::<Vec<String>>()
        .join("\n")
}
