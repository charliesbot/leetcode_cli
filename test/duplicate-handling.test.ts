import test from 'node:test';
import assert from 'node:assert';
import {promises as fs} from 'fs';
import {join} from 'path';
import {tmpdir} from 'os';
import {spawn} from 'node:child_process';

const CLI_PATH = join(process.cwd(), 'build', 'src', 'index.js');

test('duplicate exercise handling test suite', async (t) => {
  const testWorkspace = join(tmpdir(), 'leetcode-cli-duplicate-test');

  await t.beforeEach(async () => {
    // Clean up and create fresh test workspace
    await fs.rm(testWorkspace, {recursive: true, force: true});
    await fs.mkdir(testWorkspace, {recursive: true});
    process.chdir(testWorkspace);
  });

  await t.test('should detect existing exercise directory', async () => {
    // First, create a TypeScript workspace with an existing problem
    await fs.mkdir(join(testWorkspace, 'typescript'), {recursive: true});
    await fs.mkdir(join(testWorkspace, 'typescript', '0001_two_sum'), {recursive: true});
    
    // Create existing files to simulate already solved problem
    await fs.writeFile(
      join(testWorkspace, 'typescript', '0001_two_sum', 'two_sum.ts'),
      'export function twoSum(nums: number[], target: number): number[] {\n  // Some existing solution\n  return [];\n}'
    );
    await fs.writeFile(
      join(testWorkspace, 'typescript', '0001_two_sum', 'two_sum.test.ts'),
      'import test from "node:test";\nimport { twoSum } from "./two_sum.ts";\n// Some existing tests'
    );

    // Now try to fetch the same problem again
    const result = await runCLI(['fetch', 'two-sum', '--language', 'typescript'], {expectError: true});
    
    const output = result.stderr || result.stdout;
    assert(
      output.includes('already exists') || 
      output.includes('Exercise already exists') ||
      output.includes('0001_two_sum'),
      `Expected output to mention existing exercise, got: ${output}`
    );
  });

  await t.test('should offer options when exercise exists', async () => {
    // Setup existing exercise
    await fs.mkdir(join(testWorkspace, 'typescript', '0001_two_sum'), {recursive: true});
    await fs.writeFile(
      join(testWorkspace, 'typescript', '0001_two_sum', 'two_sum.ts'),
      'export function twoSum() { return []; }'
    );

    const result = await runCLI(['fetch', 'two-sum', '--language', 'typescript'], {expectError: true});
    
    const output = result.stderr || result.stdout;
    // Should offer some kind of guidance about what to do
    assert(
      output.includes('exists') || 
      output.includes('already') ||
      output.includes('force') ||
      output.includes('overwrite'),
      `Expected output to offer options for existing exercise, got: ${output}`
    );
  });

  await t.test('should handle --force flag to overwrite existing exercise', async () => {
    // Setup existing exercise
    await fs.mkdir(join(testWorkspace, 'typescript', '0001_two_sum'), {recursive: true});
    await fs.writeFile(
      join(testWorkspace, 'typescript', '0001_two_sum', 'two_sum.ts'),
      'export function twoSum() { /* old implementation */ return []; }'
    );

    // Try to fetch with force flag (we'll need to implement this)
    const result = await runCLI(['fetch', 'two-sum', '--language', 'typescript', '--force']);
    
    // Should succeed and overwrite
    assert(result.exitCode === 0 || result.stdout.includes('✓'));
    
    // Check that file was overwritten
    const newContent = await fs.readFile(
      join(testWorkspace, 'typescript', '0001_two_sum', 'two_sum.ts'), 
      'utf-8'
    );
    assert(!newContent.includes('old implementation'));
    assert(newContent.includes('function twoSum'));
  });

  await t.test('should preserve existing files when exercise exists without force', async () => {
    // Setup existing exercise with custom content
    await fs.mkdir(join(testWorkspace, 'typescript', '0001_two_sum'), {recursive: true});
    const originalContent = 'export function twoSum() { /* my solution */ return [1, 2]; }';
    await fs.writeFile(
      join(testWorkspace, 'typescript', '0001_two_sum', 'two_sum.ts'),
      originalContent
    );

    // Try to fetch without force - should fail/warn but not overwrite
    await runCLI(['fetch', 'two-sum', '--language', 'typescript'], {expectError: true});
    
    // Check that original content is preserved
    const preservedContent = await fs.readFile(
      join(testWorkspace, 'typescript', '0001_two_sum', 'two_sum.ts'), 
      'utf-8'
    );
    assert.strictEqual(preservedContent, originalContent);
  });

  await t.test('should work normally when exercise does not exist', async () => {
    // Ensure clean workspace - no existing exercise
    const exerciseDir = join(testWorkspace, 'typescript', '0001_two_sum');
    const exists = await fs.access(exerciseDir).then(() => true).catch(() => false);
    assert(!exists);

    // Should work normally
    const result = await runCLI(['fetch', 'two-sum', '--language', 'typescript']);
    
    assert(result.exitCode === 0);
    assert(result.stdout.includes('✓ Created typescript exercise'));
    
    // Verify files were created
    const exerciseExists = await fs.access(exerciseDir).then(() => true).catch(() => false);
    assert(exerciseExists);
  });

  // Cleanup
  await t.afterEach(async () => {
    await fs.rm(testWorkspace, {recursive: true, force: true});
  });
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