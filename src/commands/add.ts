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
      
      if (!workspaceRoot) {
        console.log('No leetkick workspace found. Run "leetkick init" first.');
        console.log('Make sure you are in a directory that contains .leetkick.json or run the command from within a leetkick workspace.');
        return;
      }

      const availableLanguages = await getAvailableLanguages();

      if (!availableLanguages.includes(language)) {
        console.log('Available languages:', availableLanguages.join(', '));
        throw new Error(`Language '${language}' not supported.`);
      }

      const languageDir = join(workspaceRoot, language);
      if (existsSync(languageDir)) {
        console.log(`${language} workspace already exists at: ${languageDir}`);
        return;
      }

      console.log(`Adding ${language} workspace...`);
      
      // Change to workspace root to create language directory there
      const originalCwd = process.cwd();
      process.chdir(workspaceRoot);
      
      try {
        await initializeLanguage(language);
        console.log(`✓ Created ${language} workspace at: ${languageDir}`);
      } finally {
        process.chdir(originalCwd);
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      throw error;
    }
  });