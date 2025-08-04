import test from 'node:test';
import assert from 'node:assert';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { spawn } from 'node:child_process';

const CLI_PATH = join(process.cwd(), 'build', 'src', 'index.js');

void test('duplicate exercise handling test suite', async (t) => {
  const testWorkspace = join(tmpdir(), 'leetcode-cli-duplicate-test');

  await t.beforeEach(async () => {
    // Clean up and create fresh test workspace
    await fs.rm(testWorkspace, { recursive: true, force: true });
    await fs.mkdir(testWorkspace, { recursive: true });
    process.chdir(testWorkspace);

    // Initialize workspace
    await fs.writeFile(join(testWorkspace, '.leetkick.json'), '{}');

    // Add typescript workspace
    await fs.mkdir(join(testWorkspace, 'typescript'), { recursive: true });
  });

  await t.test('should detect existing exercise directory', async () => {
    // First, create a TypeScript workspace with an existing problem
    await fs.mkdir(join(testWorkspace, 'typescript'), { recursive: true });
    await fs.mkdir(join(testWorkspace, 'typescript', 'problem_0001'), {
      recursive: true,
    });

    // Create existing files to simulate already solved problem
    await fs.writeFile(
      join(testWorkspace, 'typescript', 'problem_0001', 'TwoSum.ts'),
      '/*\n * [1] Two Sum\n * Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n * Difficulty: Easy\n */\nexport function twoSum(nums: number[], target: number): number[] {\n  // Some existing solution\n  return [];\n}',
    );
    await fs.writeFile(
      join(testWorkspace, 'typescript', 'problem_0001', 'TwoSum.test.ts'),
      'import test from "node:test";\nimport { twoSum } from "./TwoSum.js";\n// Some existing tests',
    );

    // Now try to fetch the same problem again
    const result = await runCLI(
      ['fetch', 'two-sum', '--language', 'typescript'],
      { expectError: true },
    );

    const output = result.stderr || result.stdout;
    assert(
      output.includes('already exists') ||
        output.includes('Exercise already exists') ||
        output.includes('problem_0001'),
      `Expected output to mention existing exercise, got: ${output}`,
    );
  });

  await t.test('should offer options when exercise exists', async () => {
    // Setup existing exercise
    await fs.mkdir(join(testWorkspace, 'typescript', 'problem_0001'), {
      recursive: true,
    });
    await fs.writeFile(
      join(testWorkspace, 'typescript', 'problem_0001', 'TwoSum.ts'),
      '/*\n * [1] Two Sum\n * Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n * Difficulty: Easy\n */\nexport function twoSum() { return []; }',
    );

    const result = await runCLI(
      ['fetch', 'two-sum', '--language', 'typescript'],
      { expectError: true },
    );

    const output = result.stderr || result.stdout;
    // Should offer some kind of guidance about what to do
    assert(
      output.includes('exists') ||
        output.includes('already') ||
        output.includes('force') ||
        output.includes('overwrite'),
      `Expected output to offer options for existing exercise, got: ${output}`,
    );
  });

  await t.test(
    'should handle --force flag to overwrite existing exercise',
    async () => {
      // Setup existing exercise
      await fs.mkdir(join(testWorkspace, 'typescript', 'problem_0001'), {
        recursive: true,
      });
      await fs.writeFile(
        join(testWorkspace, 'typescript', 'problem_0001', 'TwoSum.ts'),
        '/*\n * [1] Two Sum\n * Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n * Difficulty: Easy\n */\nexport function twoSum() { /* UNIQUE_TEST_MARKER_12345 */ return []; }',
      );

      // Try to fetch with force flag
      const result = await runCLI([
        'fetch',
        'two-sum',
        '--language',
        'typescript',
        '--force',
      ]);

      // Should succeed and overwrite
      assert(
        result.exitCode === 0,
        `Command failed with exit code ${result.exitCode}. stdout: ${result.stdout}, stderr: ${result.stderr}`,
      );
      assert(
        result.stdout.includes('✓'),
        `Expected success message in output: ${result.stdout}`,
      );

      // Check that file was overwritten - new content should not contain our old comment
      const newContent = await fs.readFile(
        join(testWorkspace, 'typescript', 'problem_0001', 'TwoSum.ts'),
        'utf-8',
      );
      assert(
        !newContent.includes('UNIQUE_TEST_MARKER_12345'),
        `File was not overwritten. Content: ${newContent}`,
      );
      // The new file should have the LeetCode problem header
      assert(
        newContent.includes('[1] Two Sum') || newContent.includes('Two Sum'),
        `New content should have problem title. Content: ${newContent}`,
      );
    },
  );

  await t.test(
    'should preserve existing files when exercise exists without force',
    async () => {
      // Setup existing exercise with custom content
      await fs.mkdir(join(testWorkspace, 'typescript', 'problem_0001'), {
        recursive: true,
      });
      const originalContent =
        '/*\n * [1] Two Sum\n * Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n * Difficulty: Easy\n */\nexport function twoSum() { /* my solution */ return [1, 2]; }';
      await fs.writeFile(
        join(testWorkspace, 'typescript', 'problem_0001', 'TwoSum.ts'),
        originalContent,
      );

      // Try to fetch without force - should fail/warn but not overwrite
      await runCLI(['fetch', 'two-sum', '--language', 'typescript'], {
        expectError: true,
      });

      // Check that original content is preserved
      const preservedContent = await fs.readFile(
        join(testWorkspace, 'typescript', 'problem_0001', 'TwoSum.ts'),
        'utf-8',
      );
      assert.strictEqual(preservedContent, originalContent);
    },
  );

  await t.test(
    'should work normally when exercise does not exist',
    async () => {
      // Ensure clean workspace - no existing exercise
      const exerciseDir = join(testWorkspace, 'typescript', 'problem_0001');
      const exists = await fs
        .access(exerciseDir)
        .then(() => true)
        .catch(() => false);
      assert(!exists);

      // Should work normally
      const result = await runCLI([
        'fetch',
        'two-sum',
        '--language',
        'typescript',
      ]);

      assert(result.exitCode === 0);
      assert(result.stdout.includes('✓ Created typescript exercise'));

      // Verify files were created
      const exerciseExists = await fs
        .access(exerciseDir)
        .then(() => true)
        .catch(() => false);
      assert(exerciseExists);
    },
  );

  // Rust-specific tests for file-based overwrite protection
  await t.test('should detect existing Rust exercise file', async () => {
    // Setup Rust workspace structure
    await fs.mkdir(join(testWorkspace, 'rust'), { recursive: true });
    await fs.mkdir(join(testWorkspace, 'rust', 'src'), { recursive: true });

    // Create Cargo.toml
    await fs.writeFile(
      join(testWorkspace, 'rust', 'Cargo.toml'),
      '[package]\nname = "leetkick-rust"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]',
    );

    // Create lib.rs
    await fs.writeFile(
      join(testWorkspace, 'rust', 'src', 'lib.rs'),
      '// LeetKick Rust Workspace\npub mod problem_0001;\n',
    );

    // Create existing problem file to simulate already solved problem
    await fs.writeFile(
      join(testWorkspace, 'rust', 'src', 'problem_0001.rs'),
      '/*\n * [1] Two Sum\n * Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n * Difficulty: Easy\n */\npub struct Solution;\n\nimpl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        // Some existing solution\n        vec![]\n    }\n}',
    );

    // Now try to fetch the same problem again
    const result = await runCLI(['fetch', 'two-sum', '--language', 'rust'], {
      expectError: true,
    });

    const output = result.stderr || result.stdout;
    assert(
      output.includes('already exists') ||
        output.includes('Exercise already exists') ||
        output.includes('problem_0001.rs'),
      `Expected output to mention existing exercise file, got: ${output}`,
    );
  });

  await t.test(
    'should preserve existing Rust file when exercise exists without force',
    async () => {
      // Setup Rust workspace
      await fs.mkdir(join(testWorkspace, 'rust', 'src'), { recursive: true });
      await fs.writeFile(
        join(testWorkspace, 'rust', 'Cargo.toml'),
        '[package]\nname = "leetkick-rust"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]',
      );
      await fs.writeFile(
        join(testWorkspace, 'rust', 'src', 'lib.rs'),
        '// LeetKick Rust Workspace\npub mod problem_0001;\n',
      );

      // Create existing exercise with custom content
      const originalContent =
        '/*\n * [1] Two Sum\n * Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n * Difficulty: Easy\n */\npub struct Solution;\n\nimpl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        /* RUST_UNIQUE_MARKER_67890 my solution */\n        vec![1, 2]\n    }\n}';
      await fs.writeFile(
        join(testWorkspace, 'rust', 'src', 'problem_0001.rs'),
        originalContent,
      );

      // Try to fetch without force - should fail/warn but not overwrite
      await runCLI(['fetch', 'two-sum', '--language', 'rust'], {
        expectError: true,
      });

      // Check that original content is preserved
      const preservedContent = await fs.readFile(
        join(testWorkspace, 'rust', 'src', 'problem_0001.rs'),
        'utf-8',
      );
      assert.strictEqual(preservedContent, originalContent);
    },
  );

  await t.test(
    'should handle --force flag to overwrite existing Rust exercise',
    async () => {
      // Setup Rust workspace
      await fs.mkdir(join(testWorkspace, 'rust', 'src'), { recursive: true });
      await fs.writeFile(
        join(testWorkspace, 'rust', 'Cargo.toml'),
        '[package]\nname = "leetkick-rust"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]',
      );
      await fs.writeFile(
        join(testWorkspace, 'rust', 'src', 'lib.rs'),
        '// LeetKick Rust Workspace\npub mod problem_0001;\n',
      );

      // Setup existing exercise
      await fs.writeFile(
        join(testWorkspace, 'rust', 'src', 'problem_0001.rs'),
        '/*\n * [1] Two Sum\n * Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n * Difficulty: Easy\n */\npub struct Solution;\n\nimpl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        /* RUST_FORCE_TEST_MARKER_54321 */\n        vec![]\n    }\n}',
      );

      // Try to fetch with force flag
      const result = await runCLI([
        'fetch',
        'two-sum',
        '--language',
        'rust',
        '--force',
      ]);

      // Should succeed and overwrite
      assert(
        result.exitCode === 0,
        `Command failed with exit code ${result.exitCode}. stdout: ${result.stdout}, stderr: ${result.stderr}`,
      );
      assert(
        result.stdout.includes('✓'),
        `Expected success message in output: ${result.stdout}`,
      );

      // Check that file was overwritten - new content should not contain our old marker
      const newContent = await fs.readFile(
        join(testWorkspace, 'rust', 'src', 'problem_0001.rs'),
        'utf-8',
      );
      assert(
        !newContent.includes('RUST_FORCE_TEST_MARKER_54321'),
        `File was not overwritten. Content: ${newContent}`,
      );
      // The new file should have the problem structure
      assert(
        newContent.includes('pub struct Solution') &&
          newContent.includes('[1] Two Sum'),
        `New content should have Rust problem structure. Content: ${newContent}`,
      );
    },
  );

  await t.test(
    'should work normally when Rust exercise does not exist',
    async () => {
      // Setup clean Rust workspace - no existing exercise
      await fs.mkdir(join(testWorkspace, 'rust', 'src'), { recursive: true });
      await fs.writeFile(
        join(testWorkspace, 'rust', 'Cargo.toml'),
        '[package]\nname = "leetkick-rust"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]',
      );
      await fs.writeFile(
        join(testWorkspace, 'rust', 'src', 'lib.rs'),
        '// LeetKick Rust Workspace\n// Problem modules will be automatically declared here when you fetch problems\n',
      );

      const exerciseFile = join(
        testWorkspace,
        'rust',
        'src',
        'problem_0001.rs',
      );
      const exists = await fs
        .access(exerciseFile)
        .then(() => true)
        .catch(() => false);
      assert(!exists);

      // Should work normally
      const result = await runCLI(['fetch', 'two-sum', '--language', 'rust']);

      assert(result.exitCode === 0);
      assert(result.stdout.includes('✓ Created rust exercise'));

      // Verify file was created
      const exerciseExists = await fs
        .access(exerciseFile)
        .then(() => true)
        .catch(() => false);
      assert(exerciseExists);

      // Verify lib.rs was updated with module declaration
      const libContent = await fs.readFile(
        join(testWorkspace, 'rust', 'src', 'lib.rs'),
        'utf-8',
      );
      assert(
        libContent.includes('pub mod problem_0001;'),
        `lib.rs should include module declaration. Content: ${libContent}`,
      );
    },
  );

  // Go-specific tests for directory-based overwrite protection
  await t.test('should detect existing Go exercise directory', async () => {
    // Setup Go workspace structure
    await fs.mkdir(join(testWorkspace, 'go'), { recursive: true });
    await fs.mkdir(join(testWorkspace, 'go', 'problem_0001'), {
      recursive: true,
    });

    // Create go.mod
    await fs.writeFile(
      join(testWorkspace, 'go', 'go.mod'),
      'module leetkick-go\n\ngo 1.21',
    );

    // Create existing problem files to simulate already solved problem
    await fs.writeFile(
      join(testWorkspace, 'go', 'problem_0001', 'two_sum.go'),
      '/*\n * [1] Two Sum\n * Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n * Difficulty: Easy\n */\n\npackage problem_0001\n\nfunc twoSum(nums []int, target int) []int {\n    // Some existing solution\n    return []int{}\n}',
    );
    await fs.writeFile(
      join(testWorkspace, 'go', 'problem_0001', 'two_sum_test.go'),
      'package problem_0001\n\nimport "testing"\n\nfunc TestTwoSum(t *testing.T) {\n    // Some existing tests\n    t.Log("Existing test")\n}',
    );

    // Now try to fetch the same problem again
    const result = await runCLI(['fetch', 'two-sum', '--language', 'go'], {
      expectError: true,
    });

    const output = result.stderr || result.stdout;
    assert(
      output.includes('already exists') ||
        output.includes('Exercise already exists') ||
        output.includes('problem_0001'),
      `Expected output to mention existing exercise directory, got: ${output}`,
    );
  });

  await t.test(
    'should preserve existing Go files when exercise exists without force',
    async () => {
      // Setup Go workspace
      await fs.mkdir(join(testWorkspace, 'go', 'problem_0001'), {
        recursive: true,
      });
      await fs.writeFile(
        join(testWorkspace, 'go', 'go.mod'),
        'module leetkick-go\n\ngo 1.21',
      );

      // Create existing exercise with custom content
      const originalContent =
        '/*\n * [1] Two Sum\n * Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n * Difficulty: Easy\n */\n\npackage problem_0001\n\nfunc twoSum(nums []int, target int) []int {\n    /* GO_UNIQUE_MARKER_12345 my solution */\n    return []int{1, 2}\n}';
      await fs.writeFile(
        join(testWorkspace, 'go', 'problem_0001', 'two_sum.go'),
        originalContent,
      );

      // Try to fetch without force - should fail/warn but not overwrite
      await runCLI(['fetch', 'two-sum', '--language', 'go'], {
        expectError: true,
      });

      // Check that original content is preserved
      const preservedContent = await fs.readFile(
        join(testWorkspace, 'go', 'problem_0001', 'two_sum.go'),
        'utf-8',
      );
      assert.strictEqual(preservedContent, originalContent);
    },
  );

  await t.test(
    'should handle --force flag to overwrite existing Go exercise',
    async () => {
      // Setup Go workspace
      await fs.mkdir(join(testWorkspace, 'go', 'problem_0001'), {
        recursive: true,
      });
      await fs.writeFile(
        join(testWorkspace, 'go', 'go.mod'),
        'module leetkick-go\n\ngo 1.21',
      );

      // Setup existing exercise
      await fs.writeFile(
        join(testWorkspace, 'go', 'problem_0001', 'two_sum.go'),
        '/*\n * [1] Two Sum\n * Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n * Difficulty: Easy\n */\n\npackage problem_0001\n\nfunc twoSum(nums []int, target int) []int {\n    /* GO_FORCE_TEST_MARKER_67890 */\n    return []int{}\n}',
      );

      // Try to fetch with force flag
      const result = await runCLI([
        'fetch',
        'two-sum',
        '--language',
        'go',
        '--force',
      ]);

      // Should succeed and overwrite
      assert(
        result.exitCode === 0,
        `Command failed with exit code ${result.exitCode}. stdout: ${result.stdout}, stderr: ${result.stderr}`,
      );
      assert(
        result.stdout.includes('✓'),
        `Expected success message in output: ${result.stdout}`,
      );

      // Check that file was overwritten - new content should not contain our old marker
      const newContent = await fs.readFile(
        join(testWorkspace, 'go', 'problem_0001', 'two_sum.go'),
        'utf-8',
      );
      assert(
        !newContent.includes('GO_FORCE_TEST_MARKER_67890'),
        `File was not overwritten. Content: ${newContent}`,
      );
      // The new file should have the problem structure
      assert(
        newContent.includes('package problem_0001') &&
          newContent.includes('[1] Two Sum'),
        `New content should have Go problem structure. Content: ${newContent}`,
      );
    },
  );

  await t.test(
    'should work normally when Go exercise does not exist',
    async () => {
      // Setup clean Go workspace - no existing exercise
      await fs.mkdir(join(testWorkspace, 'go'), { recursive: true });
      await fs.writeFile(
        join(testWorkspace, 'go', 'go.mod'),
        'module leetkick-go\n\ngo 1.21',
      );

      const exerciseDir = join(testWorkspace, 'go', 'problem_0001');
      const exists = await fs
        .access(exerciseDir)
        .then(() => true)
        .catch(() => false);
      assert(!exists);

      // Should work normally
      const result = await runCLI(['fetch', 'two-sum', '--language', 'go']);

      assert(result.exitCode === 0);
      assert(result.stdout.includes('✓ Created go exercise'));

      // Verify directory and files were created
      const exerciseExists = await fs
        .access(exerciseDir)
        .then(() => true)
        .catch(() => false);
      assert(exerciseExists);

      // Verify two_sum.go was created
      const solutionExists = await fs
        .access(join(exerciseDir, 'two_sum.go'))
        .then(() => true)
        .catch(() => false);
      assert(solutionExists);

      // Verify two_sum_test.go was created
      const testExists = await fs
        .access(join(exerciseDir, 'two_sum_test.go'))
        .then(() => true)
        .catch(() => false);
      assert(testExists);
    },
  );

  // Cleanup
  await t.afterEach(async () => {
    await fs.rm(testWorkspace, { recursive: true, force: true });
  });
});

// Helper function to run CLI commands
async function runCLI(
  args: string[],
  options: { expectError?: boolean; timeout?: number } = {},
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
            `CLI command failed with exit code ${code}\nstdout: ${stdout}\nstderr: ${stderr}`,
          ),
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
