import { Command } from 'commander';
import {
  isWorkspaceInitialized,
  createWorkspace,
  findWorkspaceRoot,
} from '../utils/workspace.js';
import { mkdir } from 'fs/promises';
import { resolve } from 'path';
import { existsSync } from 'fs';

export const initCommand = new Command('init')
  .description('Initialize an empty leetkick workspace')
  .argument(
    '[directory]',
    "Directory to initialize (creates if it doesn't exist)",
  )
  .action(async (directory?: string) => {
    try {
      let targetDir: string;

      if (directory) {
        targetDir = resolve(directory);

        // Create directory if it doesn't exist
        if (!existsSync(targetDir)) {
          await mkdir(targetDir, { recursive: true });
          console.log(`Created directory: ${directory}`);
        }

        // Check if directory is empty or already a workspace
        if (isWorkspaceInitialized(targetDir)) {
          console.log(`Workspace already exists in ${directory}`);
          return;
        }
      } else {
        targetDir = process.cwd();
        const workspaceRoot = findWorkspaceRoot();

        if (workspaceRoot || isWorkspaceInitialized(targetDir)) {
          console.log('Workspace already exists');
          return;
        }
      }

      console.log(
        `Creating leetkick workspace in ${directory || 'current directory'}...`,
      );
      createWorkspace(targetDir);
      console.log('✓ Workspace initialized');
      console.log('\nUse "leetkick add <language>" to add language workspaces');
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      throw error;
    }
  });
