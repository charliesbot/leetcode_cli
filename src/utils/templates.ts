import { readdir, copyFile, mkdir } from 'fs/promises';
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

    await copyFile(sourcePath, targetPath);
  }
}
