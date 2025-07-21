import test from 'node:test';
import assert from 'node:assert';
import {spawn} from 'node:child_process';
import {promises as fs} from 'fs';
import {join} from 'path';
import {tmpdir} from 'os';

const CLI_PATH = join(process.cwd(), 'build', 'src', 'index.js');

test('CLI integration test suite', async (t) => {
  const testWorkspace = join(tmpdir(), 'leetcode-cli-integration-test');

  await t.test('should show help when no command provided', async () => {
    const result = await runCLI([], {expectError: true});
    
    // Help is output to stderr by commander.js
    const output = result.stderr || result.stdout;
    assert(output.includes('CLI tool for scaffolding LeetCode exercises'));
    assert(output.includes('Commands:'));
    assert(output.includes('fetch'));
    assert(output.includes('init'));
  });

  await t.test('should show version information', async () => {
    const result = await runCLI(['--version']);
    
    assert(result.stdout.includes('0.1.0'));
  });

  await t.test('should show fetch command help', async () => {
    const result = await runCLI(['fetch', '--help']);
    
    assert(result.stdout.includes('Fetch a LeetCode problem'));
    assert(result.stdout.includes('<problem-slug>'));
    assert(result.stdout.includes('--language'));
  });

  await t.test('should show init command help', async () => {
    const result = await runCLI(['init', '--help']);
    
    assert(result.stdout.includes('Initialize a language workspace'));
    assert(result.stdout.includes('<language>'));
  });

  await t.test('should list available languages when no language specified', async () => {
    // Setup test workspace
    await fs.mkdir(testWorkspace, {recursive: true});
    process.chdir(testWorkspace);

    const result = await runCLI(['fetch', 'two-sum'], {expectError: true});
    
    // Check both stdout and stderr for the error message
    const output = result.stderr || result.stdout;
    assert(output.includes('Available languages:') || output.includes('Please specify a language'));
    assert(output.includes('typescript'));
  });

  await t.test('should handle invalid language gracefully', async () => {
    const result = await runCLI(['fetch', 'two-sum', '--language', 'invalidlang'], {expectError: true});
    
    const output = result.stderr || result.stdout;
    assert(output.includes("Language 'invalidlang' not supported") || output.includes('not supported'));
    assert(output.includes('Available languages:'));
  });

  await t.test('should handle invalid problem slug gracefully', async () => {
    const result = await runCLI(['fetch', 'invalid-problem-that-does-not-exist', '--language', 'typescript'], {expectError: true});
    
    assert(result.stderr.includes('Error:'));
    // Should handle LeetCode API errors
  });

  await t.test('should initialize language workspace successfully', async () => {
    // Setup fresh test workspace
    await fs.rm(testWorkspace, {recursive: true, force: true});
    await fs.mkdir(testWorkspace, {recursive: true});
    process.chdir(testWorkspace);

    const result = await runCLI(['init', 'typescript']);
    
    assert(result.stdout.includes('Initializing typescript workspace'));
    assert(result.stdout.includes('Created typescript workspace'));
    
    // Verify workspace was created
    const workspaceExists = await fs.access(join(testWorkspace, 'typescript')).then(() => true).catch(() => false);
    assert(workspaceExists);
  });

  // Cleanup
  await fs.rm(testWorkspace, {recursive: true, force: true});
});

// Helper function to run CLI commands
async function runCLI(
  args: string[], 
  options: {expectError?: boolean; timeout?: number} = {}
): Promise<{stdout: string; stderr: string; exitCode: number}> {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [CLI_PATH, ...args], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error('CLI command timed out'));
    }, options.timeout || 10000);

    child.on('close', (code) => {
      clearTimeout(timeout);
      
      if (!options.expectError && code !== 0) {
        reject(new Error(`CLI command failed with exit code ${code}\nstdout: ${stdout}\nstderr: ${stderr}`));
      } else {
        resolve({
          stdout,
          stderr,
          exitCode: code || 0,
        });
      }
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}