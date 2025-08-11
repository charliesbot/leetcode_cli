import { Command } from 'commander';
import { readdir, copyFile, unlink, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { findWorkspaceRoot } from '../utils/workspace.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '../../../templates');

interface SyncResult {
  updated: string[];
  added: string[];
  removed: string[];
}

export const syncCommand = new Command()
  .name('sync')
  .description('Sync workspace configuration files with latest templates')
  .argument('[language]', 'Language to sync (omit to sync all)')
  .option('--all', 'Sync all languages in workspace')
  .option('--dry-run', 'Preview changes without applying them')
  .action(
    async (
      language?: string,
      options?: { all?: boolean; dryRun?: boolean },
    ) => {
      try {
        const workspaceRoot = await findWorkspaceRoot();
        if (!workspaceRoot) {
          throw new Error(
            'No leetkick workspace found. Run "leetkick init" first.',
          );
        }

        const languages = language
          ? [language]
          : await getWorkspaceLanguages(workspaceRoot);

        if (languages.length === 0) {
          console.log(
            'No languages found in workspace. Use "leetkick add <language>" first.',
          );
          return;
        }

        console.log(
          `Syncing ${languages.length === 1 ? languages[0] : languages.length + ' languages'}...`,
        );

        for (const lang of languages) {
          const result = await syncLanguage(
            workspaceRoot,
            lang,
            options?.dryRun || false,
          );
          displaySyncResult(lang, result, options?.dryRun || false);
        }
      } catch (error) {
        console.error(
          '❌ Sync failed:',
          error instanceof Error ? error.message : String(error),
        );
        throw error;
      }
    },
  );

async function getWorkspaceLanguages(workspaceRoot: string): Promise<string[]> {
  const languages: string[] = [];

  try {
    const entries = await readdir(workspaceRoot, { withFileTypes: true });

    for (const entry of entries) {
      if (
        entry.isDirectory() &&
        entry.name !== '.git' &&
        !entry.name.startsWith('.')
      ) {
        // Check if this directory has a template
        const templateDir = join(TEMPLATES_DIR, entry.name);
        if (existsSync(templateDir)) {
          languages.push(entry.name);
        }
      }
    }
  } catch (error) {
    console.error('Failed to scan workspace languages:', error);
  }

  return languages;
}

async function syncLanguage(
  workspaceRoot: string,
  language: string,
  dryRun: boolean,
): Promise<SyncResult> {
  const result: SyncResult = { updated: [], added: [], removed: [] };
  const languageDir = join(workspaceRoot, language);
  const templateDir = join(TEMPLATES_DIR, language);

  if (!existsSync(languageDir)) {
    throw new Error(`Language workspace '${language}' not found`);
  }

  if (!existsSync(templateDir)) {
    throw new Error(`Template for '${language}' not found`);
  }

  // Get all template files (excluding exercise/test templates)
  const templateFiles = await getConfigFiles(templateDir);

  for (const file of templateFiles) {
    const sourcePath = join(templateDir, file);
    const targetPath = join(languageDir, file);
    const exists = existsSync(targetPath);

    if (await shouldSyncFile(sourcePath, targetPath)) {
      if (!dryRun) {
        await copyFile(sourcePath, targetPath);
      }

      if (exists) {
        result.updated.push(file);
      } else {
        result.added.push(file);
      }
    }
  }

  // Check for files to remove (e.g., .prettierrc.json when migrating to Biome)
  const obsoleteFiles = await getObsoleteFiles(languageDir, language);
  for (const file of obsoleteFiles) {
    const filePath = join(languageDir, file);
    if (existsSync(filePath)) {
      if (!dryRun) {
        await unlink(filePath);
      }
      result.removed.push(file);
    }
  }

  return result;
}

async function getConfigFiles(templateDir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && !isTemplateFile(entry.name)) {
      files.push(entry.name);
    }
  }

  return files;
}

function isTemplateFile(filename: string): boolean {
  return (
    filename.includes('_template.') ||
    filename.startsWith('exercise_') ||
    filename.startsWith('test_')
  );
}

async function shouldSyncFile(
  sourcePath: string,
  targetPath: string,
): Promise<boolean> {
  if (!existsSync(targetPath)) {
    return true; // File doesn't exist, should add it
  }

  try {
    const sourceContent = await readFile(sourcePath, 'utf-8');
    const targetContent = await readFile(targetPath, 'utf-8');

    // Only sync if files are different
    return sourceContent !== targetContent;
  } catch {
    return true; // If we can't read files, err on the side of syncing
  }
}

async function getObsoleteFiles(
  languageDir: string,
  language: string,
): Promise<string[]> {
  const obsoleteFiles: string[] = [];

  // Common obsolete files when migrating from Biome to ESLint + Prettier
  const biomeFiles = ['biome.json'];

  for (const file of biomeFiles) {
    if (existsSync(join(languageDir, file))) {
      // Only mark as obsolete if we have ESLint + Prettier configs
      if (
        (existsSync(join(languageDir, 'eslint.config.js')) ||
          existsSync(join(TEMPLATES_DIR, language, 'eslint.config.js'))) &&
        (existsSync(join(languageDir, '.prettierrc')) ||
          existsSync(join(TEMPLATES_DIR, language, '.prettierrc')))
      ) {
        obsoleteFiles.push(file);
      }
    }
  }

  return obsoleteFiles;
}

function displaySyncResult(
  language: string,
  result: SyncResult,
  dryRun: boolean,
): void {
  const { updated, added, removed } = result;
  const total = updated.length + added.length + removed.length;

  if (total === 0) {
    console.log(`✓ ${language}: Already up to date`);
    return;
  }

  const prefix = dryRun ? '[DRY RUN] ' : '';
  console.log(`${prefix}${language}:`);

  if (added.length > 0) {
    added.forEach((file) => console.log(`  + Added ${file}`));
  }

  if (updated.length > 0) {
    updated.forEach((file) => console.log(`  ✓ Updated ${file}`));
  }

  if (removed.length > 0) {
    removed.forEach((file) => console.log(`  - Removed ${file}`));
  }

  console.log(
    `  → ${total} file${total === 1 ? '' : 's'} ${dryRun ? 'would be ' : ''}changed\n`,
  );
}
