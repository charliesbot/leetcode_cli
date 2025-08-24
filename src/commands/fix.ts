import {Command} from 'commander';
import {findWorkspaceRoot} from '../utils/workspace.js';
import {spawn} from 'child_process';
import {join} from 'path';

export const fixCommand = new Command()
  .name('fix')
  .description('Fix linting and formatting issues in workspace')
  .argument('[language]', 'Language workspace to fix (omit to fix all)')
  .option('--all', 'Fix all language workspaces')
  .action(async (language?: string, options?: {all?: boolean}) => {
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
        `Fixing ${languages.length === 1 ? languages[0] : languages.length + ' languages'}...`,
      );

      for (const lang of languages) {
        await fixLanguageWorkspace(workspaceRoot, lang);
      }

      console.log('✓ All fixes completed');
    } catch (error) {
      console.error(
        '❌ Fix failed:',
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  });

async function getWorkspaceLanguages(workspaceRoot: string): Promise<string[]> {
  const {readdir} = await import('fs/promises');
  const {existsSync} = await import('fs');
  const languages: string[] = [];

  try {
    const entries = await readdir(workspaceRoot, {withFileTypes: true});

    for (const entry of entries) {
      if (
        entry.isDirectory() &&
        entry.name !== '.git' &&
        !entry.name.startsWith('.')
      ) {
        // Check if this directory has package.json (indicates it's a language workspace)
        const packageJson = join(workspaceRoot, entry.name, 'package.json');
        if (existsSync(packageJson)) {
          languages.push(entry.name);
        }
      }
    }
  } catch (error) {
    console.error('Failed to scan workspace languages:', error);
  }

  return languages;
}

async function fixLanguageWorkspace(
  workspaceRoot: string,
  language: string,
): Promise<void> {
  const languageDir = join(workspaceRoot, language);
  const {existsSync} = await import('fs');

  if (!existsSync(languageDir)) {
    throw new Error(`Language workspace '${language}' not found`);
  }

  console.log(`\n📁 Fixing ${language}...`);

  // Run lint fix first
  try {
    console.log('  🔧 Running linter fixes...');
    await runCommand('npm', ['run', 'lint:fix'], languageDir);
  } catch (error) {
    console.log('  ⚠️  No lint:fix script found, trying lint...');
    try {
      await runCommand('npm', ['run', 'lint'], languageDir);
    } catch {
      console.log('  ℹ️  No linting available');
    }
  }

  // Run formatting
  try {
    console.log('  ✨ Running formatter...');
    await runCommand('npm', ['run', 'format'], languageDir);
  } catch (error) {
    console.log('  ⚠️  No format script found');
  }

  console.log(`  ✓ ${language} fixed`);
}

function runCommand(
  command: string,
  args: string[],
  cwd: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'pipe',
      shell: true,
    });

    let output = '';
    let errorOutput = '';

    child.stdout?.on('data', data => {
      output += data.toString();
    });

    child.stderr?.on('data', data => {
      errorOutput += data.toString();
    });

    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        // Don't reject on non-zero exit codes for linting - just log
        if (errorOutput) {
          console.log('    ', errorOutput.trim());
        }
        resolve(); // Continue with other fixes even if one fails
      }
    });

    child.on('error', error => {
      reject(error);
    });
  });
}
