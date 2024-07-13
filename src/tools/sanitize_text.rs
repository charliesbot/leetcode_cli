use html_escape::decode_html_entities;
use textwrap::fill;

fn remove_html_tags(html: &str) -> String {
    let tags = vec![
        ("<strong>", ""),
        ("</strong>", ""),
        ("<em>", ""),
        ("</em>", ""),
        ("<p>", ""),
        ("</p>", ""),
        ("<b>", ""),
        ("</b>", ""),
        ("<pre>", ""),
        ("</pre>", ""),
        ("<ul>", ""),
        ("</ul>", ""),
        ("<li>", ""),
        ("</li>", ""),
        ("<code>", ""),
        ("</code>", ""),
        ("<i>", ""),
        ("</i>", ""),
        ("<sub>", ""),
        ("</sub>", ""),
        ("</sup>", ""),
        ("<sup>", "^"),
        ("<strong class=\"example\">", ""),
        ("<font face=\"monospace\">", ""),
        ("</font>", ""),
    ];

    let mut result = html.to_string();
    for (tag, replacement) in tags {
        result = result.replace(tag, replacement);
    }
    result
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
