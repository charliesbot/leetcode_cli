import { Command } from 'commander';
import { fetchProblem } from '../utils/leetcode-api.js';
import {
  getAvailableLanguages,
  initializeLanguage,
} from '../utils/templates.js';
import { createProblemFiles } from '../utils/file-operations.js';
import {
  findWorkspaceRoot,
  isWorkspaceInitialized,
} from '../utils/workspace.js';
import { existsSync } from 'fs';
import { join } from 'path';

export const fetchCommand = new Command('fetch')
  .description('Fetch a LeetCode problem and create exercise files')
  .argument('<problem-slug>', 'LeetCode problem slug (e.g., "two-sum")')
  .option('-l, --language <language>', 'Programming language')
  .option('-f, --force', 'Overwrite existing exercise if it exists')
  .action(
    async (
      problemSlug: string,
      options: { language?: string; force?: boolean }
    ) => {
      try {
        const workspaceRoot = findWorkspaceRoot();

        if (!workspaceRoot) {
          console.log(
            'No leetkick workspace found. Run "leetkick init" first.'
          );
          console.log(
            'Make sure you are in a directory that contains .leetkick.json or run the command from within a leetkick workspace.'
          );
          return;
        }

        console.log(`Fetching problem: ${problemSlug}...`);

        const problem = await fetchProblem(problemSlug);
        console.log(
          `✓ Found: [${problem.questionFrontendId}] ${problem.title}`
        );

        const availableLanguages = await getAvailableLanguages();

        if (!options.language) {
          console.log('Available languages:', availableLanguages.join(', '));
          throw new Error('Please specify a language with --language <lang>');
        }

        if (!availableLanguages.includes(options.language)) {
          console.log('Available languages:', availableLanguages.join(', '));
          throw new Error(`Language '${options.language}' not supported.`);
        }

        // Check if language workspace exists, initialize if not
        const languageDir = join(workspaceRoot, options.language);
        if (!existsSync(languageDir)) {
          console.log(`Initializing ${options.language} workspace...`);

          // Change to workspace root to create language directory there
          const originalCwd = process.cwd();
          process.chdir(workspaceRoot);

          try {
            await initializeLanguage(options.language);
          } finally {
            process.chdir(originalCwd);
          }
        }

        // Check if exercise already exists
        const paddedId = problem.questionFrontendId.padStart(4, '0');
        const problemName = `problem_${paddedId}`;
        const problemDir = join(languageDir, problemName);

        if (existsSync(problemDir)) {
          if (!options.force) {
            console.log(`❌ Exercise already exists: ${problemDir}`);
            console.log('The exercise directory already contains files.');
            console.log('Options:');
            console.log('  • Use --force to overwrite existing files');
            console.log('  • Choose a different language');
            console.log('  • Remove the existing directory manually');
            throw new Error(
              `Exercise '${problemName}' already exists in ${options.language}`
            );
          } else {
            console.log(`⚠️  Overwriting existing exercise: ${problemName}`);
          }
        }

        // Create problem files (change to workspace root since createProblemFiles uses process.cwd())
        const originalCwd = process.cwd();
        process.chdir(workspaceRoot);

        try {
          await createProblemFiles(problem, options.language);
          console.log(
            `✓ Created ${options.language} exercise for: ${problem.title}`
          );
          console.log(`📁 Location: ${languageDir}/${problemName}`);
        } finally {
          process.chdir(originalCwd);
        }
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        throw error;
      }
    }
  );
