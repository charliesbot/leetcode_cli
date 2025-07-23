import { Command } from 'commander';
import {
  getAvailableLanguages,
  initializeLanguage,
} from '../utils/templates.js';
import {
  isWorkspaceInitialized,
  findWorkspaceRoot,
} from '../utils/workspace.js';
import { existsSync } from 'fs';
import { join } from 'path';

export const addCommand = new Command('add')
  .description('Add a language workspace to an existing leetkick workspace')
  .argument('<language>', 'Programming language to add')
  .action(async (language: string) => {
    try {
      const workspaceRoot = findWorkspaceRoot();
      const currentDir = process.cwd();
      
      if (!workspaceRoot && !isWorkspaceInitialized(currentDir)) {
        console.log('No leetkick workspace found. Run "leetkick init" first.');
        return;
      }

      const availableLanguages = await getAvailableLanguages();

      if (!availableLanguages.includes(language)) {
        console.log('Available languages:', availableLanguages.join(', '));
        throw new Error(`Language '${language}' not supported.`);
      }

      const languageDir = join(currentDir, language);
      if (existsSync(languageDir)) {
        console.log(`${language} workspace already exists at: ${languageDir}`);
        return;
      }

      console.log(`Adding ${language} workspace...`);
      await initializeLanguage(language);
      console.log(`✓ Created ${language} workspace at: ${languageDir}`);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      throw error;
    }
  });