#!/usr/bin/env node

import { Command } from 'commander';
import { fetchCommand } from './commands/fetch.js';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { testCommand } from './commands/test.js';
import { syncCommand } from './commands/sync.js';
import { fixCommand } from './commands/fix.js';

const program = new Command();

program
  .name('leetkick')
  .description('CLI tool for scaffolding LeetCode exercises')
  .version('0.1.0');

program.addCommand(fetchCommand);
program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(testCommand);
program.addCommand(syncCommand);
program.addCommand(fixCommand);

program.parse();
