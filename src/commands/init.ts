import { Command } from 'commander';
import {
  isWorkspaceInitialized,
  createWorkspace,
  findWorkspaceRoot,
} from '../utils/workspace.js';

export const initCommand = new Command('init')
  .description('Initialize an empty leetkick workspace')
  .action(async () => {
    try {
      const workspaceRoot = findWorkspaceRoot();
      const currentDir = process.cwd();
      
      if (workspaceRoot || isWorkspaceInitialized(currentDir)) {
        console.log('Workspace already exists');
        return;
      }

      console.log('Creating leetkick workspace...');
      createWorkspace(currentDir);
      console.log('✓ Workspace initialized');
      console.log('\nUse "leetkick add <language>" to add language workspaces');
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      throw error;
    }
  });
