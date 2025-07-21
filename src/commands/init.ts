import { Command } from 'commander';
import {
  getAvailableLanguages,
  initializeLanguage,
} from '../utils/templates.js';
import { existsSync } from 'fs';
import { join } from 'path';

export const initCommand = new Command('init')
  .description('Initialize a language workspace')
  .argument('<language>', 'Programming language to initialize')
  .action(async (language: string) => {
    try {
      const availableLanguages = await getAvailableLanguages();

      if (!availableLanguages.includes(language)) {
        console.log('Available languages:', availableLanguages.join(', '));
        throw new Error(`Language '${language}' not supported.`);
      }

      const languageDir = join(process.cwd(), language);
      if (existsSync(languageDir)) {
        console.log(`${language} workspace already exists at: ${languageDir}`);
        return;
      }

      console.log(`Initializing ${language} workspace...`);
      await initializeLanguage(language);
      console.log(`✓ Created ${language} workspace at: ${languageDir}`);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      throw error;
    }
  });
