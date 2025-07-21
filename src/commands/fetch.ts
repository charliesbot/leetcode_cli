import { Command } from 'commander';
import { fetchProblem } from '../utils/leetcode-api.js';
import {
  getAvailableLanguages,
  initializeLanguage,
} from '../utils/templates.js';
import { createProblemFiles } from '../utils/file-operations.js';
import { existsSync } from 'fs';
import { join } from 'path';

export const fetchCommand = new Command('fetch')
  .description('Fetch a LeetCode problem and create exercise files')
  .argument('<problem-slug>', 'LeetCode problem slug (e.g., "two-sum")')
  .option('-l, --language <language>', 'Programming language')
  .action(async (problemSlug: string, options: { language?: string }) => {
    try {
      console.log(`Fetching problem: ${problemSlug}...`);

      const problem = await fetchProblem(problemSlug);
      console.log(`✓ Found: [${problem.questionFrontendId}] ${problem.title}`);

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
      const languageDir = join(process.cwd(), options.language);
      if (!existsSync(languageDir)) {
        console.log(`Initializing ${options.language} workspace...`);
        await initializeLanguage(options.language);
      }

      // Create problem files
      await createProblemFiles(problem, options.language);

      console.log(
        `✓ Created ${options.language} exercise for: ${problem.title}`
      );
      console.log(
        `📁 Location: ${languageDir}/${problem.titleSlug.replace('-', '_')}`
      );
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      throw error;
    }
  });
