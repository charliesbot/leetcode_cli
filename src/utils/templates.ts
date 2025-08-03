import { readdir, copyFile, mkdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '../../templates');

export async function getAvailableLanguages(): Promise<string[]> {
  try {
    const entries = await readdir(TEMPLATES_DIR, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch (error) {
    throw new Error(`Failed to read templates directory: ${error}`);
  }
}

export async function initializeLanguage(language: string): Promise<void> {
  const templateDir = join(TEMPLATES_DIR, language);
  const targetDir = join(process.cwd(), language);

  if (!existsSync(templateDir)) {
    throw new Error(`Template for language '${language}' not found`);
  }

  // Create language directory
  await mkdir(targetDir, { recursive: true });

  // For Kotlin and Java, we need to create the source directory structure
  if (language === 'kotlin' || language === 'java') {
    await mkdir(join(targetDir, 'src', 'main', language), { recursive: true });
    await mkdir(join(targetDir, 'src', 'test', language), { recursive: true });
  }

  // For Rust, we need to create the src directory
  if (language === 'rust') {
    await mkdir(join(targetDir, 'src'), { recursive: true });
  }

  // Copy all non-template files (config files)
  const templateFiles = await readdir(templateDir);

  for (const file of templateFiles) {
    // Skip template files (they're used per-problem, not per-language)
    if (file.includes('_template.')) {
      continue;
    }

    const sourcePath = join(templateDir, file);

    // Special handling for gitignore file to avoid conflicts in the CLI repo
    const targetFileName = file === 'gitignore' ? '.gitignore' : file;
    const targetPath = join(targetDir, targetFileName);

    // Check if it's a directory or file
    const fileStats = await stat(sourcePath);
    if (fileStats.isDirectory()) {
      await copyDirectoryRecursive(sourcePath, targetPath);
    } else {
      await copyFile(sourcePath, targetPath);
    }
  }
}

async function copyDirectoryRecursive(
  src: string,
  dest: string
): Promise<void> {
  await mkdir(dest, { recursive: true });

  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectoryRecursive(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}
