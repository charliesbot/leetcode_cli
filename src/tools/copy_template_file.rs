use std::fs;
use std::path::{Path, PathBuf};

pub fn copy_template_file(template_path: &str, destination: &Path) {
    let template_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("templates");
    let source = template_dir.join(template_path);
    fs::copy(source, destination)
        .expect(&format!("Failed to copy template file: {}", template_path));
}
