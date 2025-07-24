import { Command } from 'commander';
import { findWorkspaceRoot } from '../utils/workspace.js';
import { getAvailableLanguages } from '../utils/templates.js';
import { existsSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { readdir } from 'fs/promises';

export const testCommand = new Command('test')
  .description('Run tests for a LeetCode problem')
  .argument('<problem>', 'Problem number (e.g., "1") or slug (e.g., "two-sum")')
  .option('-l, --language <language>', 'Programming language')
  .action(async (problem: string, options: { language?: string }) => {
    try {
      const workspaceRoot = findWorkspaceRoot();
      
      if (!workspaceRoot) {
        console.log('No leetkick workspace found. Run "leetkick init" first.');
        console.log('Make sure you are in a directory that contains .leetkick.json or run the command from within a leetkick workspace.');
        return;
      }

      const availableLanguages = await getAvailableLanguages();

      if (!options.language) {
        console.log('Available languages:', availableLanguages.join(', '));
        throw new Error('Please specify a language with --language <lang>');
      }

      if (!availableLanguages.includes(options.language)) {
        console.log('Available languages:', availableLanguages.join(', '));
        throw new Error(`Language '${options.language}' not supported.`);
      }

      const languageDir = join(workspaceRoot, options.language);
      if (!existsSync(languageDir)) {
        throw new Error(`${options.language} workspace not found. Run "leetkick add ${options.language}" first.`);
      }

      // Find the problem directory
      const problemDir = await findProblemDirectory(languageDir, problem);
      if (!problemDir) {
        throw new Error(`Problem '${problem}' not found in ${options.language} workspace.`);
      }

      console.log(`Running tests for: ${problemDir}...`);

      // Run tests based on language
      await runTests(languageDir, problemDir, options.language);

    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      throw error;
    }
  });

async function findProblemDirectory(languageDir: string, problem: string): Promise<string | null> {
  try {
    const entries = await readdir(languageDir, { withFileTypes: true });
    const directories = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);

    // Try exact match first
    if (directories.includes(problem)) {
      return problem;
    }

    // Try to match by problem number (e.g., "1" matches "0001_two_sum")
    const paddedProblem = problem.padStart(4, '0');
    const byNumber = directories.find(dir => dir.startsWith(paddedProblem + '_'));
    if (byNumber) {
      return byNumber;
    }

    // Try to match by slug (e.g., "two-sum" matches "0001_two_sum")
    const slugPattern = problem.replace('-', '_');
    const bySlug = directories.find(dir => dir.includes(slugPattern));
    if (bySlug) {
      return bySlug;
    }

    return null;
  } catch (error) {
    return null;
  }
}

async function runTests(languageDir: string, problemDir: string, language: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let command: string;
    let args: string[];

    switch (language) {
      case 'typescript':
      case 'javascript':
        command = 'node';
        args = ['--test', `${problemDir}/*.test.ts`, `${problemDir}/*.test.js`];
        break;
      case 'python':
        command = 'python';
        args = ['-m', 'pytest', `${problemDir}/`, '-v'];
        break;
      case 'java':
        command = 'mvn';
        args = ['test', `-Dtest=**/${problemDir}/*Test`];
        break;
      case 'go':
        command = 'go';
        args = ['test', `./${problemDir}/...`];
        break;
      case 'rust':
        command = 'cargo';
        args = ['test', '--manifest-path', `${problemDir}/Cargo.toml`];
        break;
      case 'cpp':
        // Assuming we'll have a Makefile or CMake setup
        command = 'make';
        args = ['test', `-C`, problemDir];
        break;
      default:
        reject(new Error(`Testing not implemented for language: ${language}`));
        return;
    }

    const child = spawn(command, args, {
      cwd: languageDir,
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('✓ Tests passed!');
        resolve();
      } else {
        reject(new Error(`Tests failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to run tests: ${error.message}`));
    });
  });
}