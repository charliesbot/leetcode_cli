import test from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const CLI_PATH = join(process.cwd(), 'build', 'src', 'index.js');

test('CLI integration test suite', async (t) => {
  const testWorkspace = join(tmpdir(), 'leetcode-cli-integration-test');

  await t.test('should show help when no command provided', async () => {
    const result = await runCLI([], { expectError: true });

    // Help is output to stderr by commander.js
    const output = result.stderr || result.stdout;
    assert(output.includes('CLI tool for scaffolding LeetCode exercises'));
    assert(output.includes('Commands:'));
    assert(output.includes('fetch'));
    assert(output.includes('init'));
    assert(output.includes('add'));
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

    assert(result.stdout.includes('Initialize an empty leetkick workspace'));
  });

  await t.test('should show add command help', async () => {
    const result = await runCLI(['add', '--help']);

    assert(result.stdout.includes('Add a language workspace'));
    assert(result.stdout.includes('<language>'));
  });

  await t.test(
    'should list available languages when no language specified',
    async () => {
      // Setup test workspace with initialized workspace
      await fs.rm(testWorkspace, { recursive: true, force: true });
      await fs.mkdir(testWorkspace, { recursive: true });
      process.chdir(testWorkspace);
      await runCLI(['init']);
      await runCLI(['add', 'typescript']);

      const result = await runCLI(['fetch', 'two-sum'], { expectError: true });


    // Check both stdout and stderr for the error message
      const combinedOutput = result.stdout + result.stderr;
      assert(
        combinedOutput.includes('Available languages:') ||
          combinedOutput.includes('Please specify a language')
      );
      assert(combinedOutput.includes('typescript'));
    }
  );

  await t.test('should handle invalid language gracefully', async () => {
    // Use the workspace from previous test
    const result = await runCLI(
      ['fetch', 'two-sum', '--language', 'invalidlang'],
      { expectError: true }
    );

    const combinedOutput = result.stdout + result.stderr;
    assert(
      combinedOutput.includes("Language 'invalidlang' not supported") ||
        combinedOutput.includes('not supported')
    );
    assert(combinedOutput.includes('Available languages:'));
  });

  await t.test('should handle invalid problem slug gracefully', async () => {
    const result = await runCLI(
      [
        'fetch',
        'invalid-problem-that-does-not-exist',
        '--language',
        'typescript',
      ],
      { expectError: true }
    );

    assert(result.stderr.includes('Error:'));
    // Should handle LeetCode API errors
  });

  await t.test('should initialize empty workspace successfully', async () => {
    // Setup fresh test workspace
    await fs.rm(testWorkspace, { recursive: true, force: true });
    await fs.mkdir(testWorkspace, { recursive: true });
    process.chdir(testWorkspace);

    const result = await runCLI(['init']);

    assert(result.stdout.includes('Creating leetkick workspace'));
    assert(result.stdout.includes('Workspace initialized'));

    // Verify workspace marker was created
    const workspaceExists = await fs
      .access(join(testWorkspace, '.leetkick.json'))
      .then(() => true)
      .catch(() => false);
    assert(workspaceExists);
  });

  await t.test('should add language to workspace successfully', async () => {
    // First initialize workspace
    await runCLI(['init']);

    // Then add typescript
    const result = await runCLI(['add', 'typescript']);

    assert(result.stdout.includes('Adding typescript workspace'));
    assert(result.stdout.includes('Created typescript workspace'));

    // Verify typescript workspace was created
    const typescriptExists = await fs
      .access(join(testWorkspace, 'typescript'))
      .then(() => true)
      .catch(() => false);
    assert(typescriptExists);
  });

  await t.test('should require workspace for add command', async () => {
    // Setup fresh directory without workspace
    const noWorkspaceDir = join(tmpdir(), 'no-workspace-test');
    await fs.rm(noWorkspaceDir, { recursive: true, force: true });
    await fs.mkdir(noWorkspaceDir, { recursive: true });
    process.chdir(noWorkspaceDir);

    const result = await runCLI(['add', 'typescript'], { expectError: true });

    const output = result.stdout || result.stderr;
    assert(output.includes('No leetkick workspace found'));
    assert(output.includes('Run "leetkick init" first'));

    // Cleanup
    await fs.rm(noWorkspaceDir, { recursive: true, force: true });
  });

  // Cleanup
  await fs.rm(testWorkspace, { recursive: true, force: true });
});

// Helper function to run CLI commands
async function runCLI(
  args: string[],
  options: { expectError?: boolean; timeout?: number } = {}
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
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
        reject(
          new Error(
            `CLI command failed with exit code ${code}\nstdout: ${stdout}\nstderr: ${stderr}`
          )
        );
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
