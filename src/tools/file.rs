use std::{
    fs,
    io::{self, ErrorKind},
    path::{Path, PathBuf},
};

const CLI_DIRECTORY: &str = env!("CARGO_MANIFEST_DIR");

fn copy_file(from: &PathBuf, to: &PathBuf) -> io::Result<()> {
    match fs::copy(from, to) {
        Ok(_) => Ok(()),
        Err(e) => match e.kind() {
            ErrorKind::NotFound => {
                eprintln!("Source file not found: {} {}", from.display(), e);
                Err(e)
            }
            _ => {
                eprintln!("Failed to copy file: {}", e);
                Err(e)
            }
        },
    }
}

pub fn copy_file_from_templates(filename: &str, new_file_path: &Path) -> io::Result<()> {
    let templates_directory: PathBuf = Path::new(CLI_DIRECTORY).join("templates");
    let from = templates_directory.join(filename);
    let to = new_file_path.join(filename);

    if !from.exists() {
        eprintln!("Source file not found hehe: {}", from.display());
        return Err(io::Error::new(
            ErrorKind::NotFound,
            format!("Source file not found hehe: {}", from.display()),
        ));
    }

    copy_file(&from, &to)
}
