import { Command } from 'commander';
import { findWorkspaceRoot } from '../utils/workspace.js';
import { getAvailableLanguages } from '../utils/templates.js';
import { existsSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { readdir, readFile } from 'fs/promises';

export const testCommand = new Command('test')
  .description('Run tests for a LeetCode problem')
  .argument('<problem>', 'Problem number (e.g., "1") or slug (e.g., "two-sum")')
  .option('-l, --language <language>', 'Programming language')
  .action(async (problem: string, options: { language?: string }) => {
    try {
      const workspaceRoot = findWorkspaceRoot();

      if (!workspaceRoot) {
        console.log('No leetkick workspace found. Run "leetkick init" first.');
        console.log(
          'Make sure you are in a directory that contains .leetkick.json or run the command from within a leetkick workspace.'
        );
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
        throw new Error(
          `${options.language} workspace not found. Run "leetkick add ${options.language}" first.`
        );
      }

      // Find the problem directory
      const problemDir = await findProblemDirectory(languageDir, problem);
      if (!problemDir) {
        throw new Error(
          `Problem '${problem}' not found in ${options.language} workspace.`
        );
      }

      console.log(`Running tests for: ${problemDir}...`);

      // Run tests based on language
      await runTests(languageDir, problemDir, options.language);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      throw error;
    }
  });

async function findProblemDirectory(
  languageDir: string,
  problem: string
): Promise<string | null> {
  try {
    const entries = await readdir(languageDir, { withFileTypes: true });
    const directories = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    // Try exact match first
    if (directories.includes(problem)) {
      return problem;
    }

    // Try to match by problem number (e.g., "1" matches "problem_0001")
    const paddedProblem = problem.padStart(4, '0');
    const byNumber = directories.find(
      (dir) => dir === `problem_${paddedProblem}`
    );
    if (byNumber) {
      return byNumber;
    }

    // For backward compatibility and flexible matching, also check if it's a number
    // and find any directory containing that number
    if (/^\d+$/.test(problem)) {
      const numericMatch = directories.find((dir) =>
        dir.includes(paddedProblem)
      );
      if (numericMatch) {
        return numericMatch;
      }
    }

    // For slug matching, read problem metadata from files
    for (const dir of directories) {
      if (dir.startsWith('problem_')) {
        const problemInfo = await extractProblemInfoFromDirectory(
          join(languageDir, dir)
        );
        if (problemInfo && matchesProblemSlug(problem, problemInfo)) {
          return dir;
        }
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

async function extractProblemInfoFromDirectory(
  problemDir: string
): Promise<{ title: string; slug: string } | null> {
  try {
    const files = await readdir(problemDir);

    // Look for any files that might contain problem metadata
    for (const file of files) {
      if (file === 'catch_amalgamated.hpp') {
        continue;
      }

      const filePath = join(problemDir, file);
      const content = await readFile(filePath, 'utf-8');

      // Extract problem info from comment header
      const titleMatch = content.match(/\* \[\d+\] (.+)/);
      if (titleMatch) {
        const title = titleMatch[1];
        const slug = titleToSlug(title);
        return { title, slug };
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function matchesProblemSlug(
  searchTerm: string,
  problemInfo: { title: string; slug: string }
): boolean {
  const normalizedSearch = searchTerm.toLowerCase().replace(/_/g, '-');
  const normalizedSlug = problemInfo.slug.toLowerCase();
  const normalizedTitle = problemInfo.title.toLowerCase();

  return (
    normalizedSlug === normalizedSearch ||
    normalizedSlug.includes(normalizedSearch) ||
    normalizedTitle.includes(normalizedSearch.replace(/-/g, ' '))
  );
}

async function runTests(
  languageDir: string,
  problemDir: string,
  language: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    let command: string;
    let args: string[];

    switch (language) {
      case 'typescript':
        command = 'npx';
        args = ['vitest', 'run', `${problemDir}`];
        break;
      case 'javascript':
        command = 'node';
        args = ['--test', `${problemDir}/*.test.js`];
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
        // Compile and run C++ test directly with include path for shared headers
        command = 'sh';
        args = [
          '-c',
          `cd "${problemDir}" && g++ -I.. -std=c++17 *.test.cpp -o test_runner && ./test_runner`,
        ];
        break;
      default:
        reject(new Error(`Testing not implemented for language: ${language}`));
        return;
    }

    const child = spawn(command, args, {
      cwd: languageDir,
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('✓ Tests passed!');
        resolve();
      } else {
        // For test failures, just exit gracefully without throwing errors
        process.exit(code || 1);
      }
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to run tests: ${error.message}`));
    });
  });
}
