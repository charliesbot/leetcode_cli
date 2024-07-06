use std::fs;
use std::path::Path;

pub fn is_leetcode_cli_project(path: &Path) -> bool {
    let workspace_file = path.join("WORKSPACE");
    workspace_file.exists()
        && fs::read_to_string(workspace_file)
            .map(|content| content.contains("# LeetCode CLI Workspace"))
            .unwrap_or(false)
}
