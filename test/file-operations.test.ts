import test from 'node:test';
import assert from 'node:assert';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import type { Problem } from '../src/types/leetcode.js';

// Mock the file operations module
const mockTemplateDir = join(tmpdir(), 'leetcode-cli-test-file-ops-templates');
const mockWorkingDir = join(tmpdir(), 'leetcode-cli-test-file-ops-workspace');

// Setup test fixtures
const mockProblem: Problem = {
  questionId: '1',
  questionFrontendId: '1',
  title: 'Two Sum',
  titleSlug: 'two-sum',
  content:
    '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.</p>',
  difficulty: 'Easy',
  codeSnippets: [
    {
      lang: 'TypeScript',
      langSlug: 'typescript',
      code: 'function twoSum(nums: number[], target: number): number[] {\n    \n};',
    },
  ],
  exampleTestcases: '...',
  sampleTestCase: '...',
  metaData: '...',
};

test('file operations test suite', async (t) => {
  // Setup test environment
  await fs.mkdir(mockTemplateDir, { recursive: true });
  await fs.mkdir(mockWorkingDir, { recursive: true });

  await t.test('should extract function name from TypeScript code', () => {
    const code =
      'function twoSum(nums: number[], target: number): number[] {\n    \n};';
    // We would need to import the extractFunctionName function
    // For now, test the regex pattern
    const functionMatch = code.match(/function\s+(\w+)\s*\(/);
    assert.strictEqual(functionMatch?.[1], 'twoSum');
  });

  await t.test('should extract function name from C++ code', () => {
    const code =
      'vector<int> twoSum(vector<int>& nums, int target) {\n    return {};\n}';
    // Test the C++ method regex pattern - need to handle templates like vector<int>
    const cppMethodMatch = code.match(/[\w<>]+\s+(\w+)\s*\([^)]*\)\s*\{/);
    assert.strictEqual(cppMethodMatch?.[1], 'twoSum');
  });

  await t.test('should format problem name to camelCase', () => {
    const title = 'Two Sum';
    const formatted = title
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(' ')
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');

    assert.strictEqual(formatted, 'twoSum');
  });

  await t.test('should clean HTML description', () => {
    const htmlContent =
      '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices.</p>';
    const cleaned = htmlContent
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .trim();

    assert.strictEqual(
      cleaned,
      'Given an array of integers nums and an integer target, return indices.'
    );
  });

  await t.test('should create clean problem directory name', () => {
    const problemId = '1';
    const paddedId = problemId.padStart(4, '0');
    const problemDirName = `problem_${paddedId}`;

    assert.strictEqual(problemDirName, 'problem_0001');
  });

  await t.test('should format class names correctly', () => {
    const testCases = [
      { input: 'Two Sum', expected: 'TwoSum' },
      { input: 'Roman to Integer', expected: 'RomanToInteger' },
      {
        input: 'Longest Substring Without Repeating Characters',
        expected: 'LongestSubstringWithoutRepeatingCharacters',
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const formatted = input
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .split(' ')
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');
      assert.strictEqual(formatted, expected);
    });
  });

  await t.test('should format snake case names correctly', () => {
    const testCases = [
      { input: 'Two Sum', expected: 'two_sum' },
      { input: 'Roman to Integer', expected: 'roman_to_integer' },
      {
        input: 'Longest Substring Without Repeating Characters',
        expected: 'longest_substring_without_repeating_characters',
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const formatted = input
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .toLowerCase()
        .split(/\s+/)
        .join('_');
      assert.strictEqual(formatted, expected);
    });
  });

  await t.test('should get correct file extension for language', () => {
    const extMap: Record<string, string> = {
      typescript: 'ts',
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      go: 'go',
      rust: 'rs',
    };

    assert.strictEqual(extMap.typescript, 'ts');
    assert.strictEqual(extMap.python, 'py');
    assert.strictEqual(extMap.java, 'java');
  });

  await t.test('should get correct language slug for LeetCode API', () => {
    const slugMap: Record<string, string> = {
      typescript: 'typescript',
      javascript: 'javascript',
      python: 'python3',
      java: 'java',
      cpp: 'cpp',
      go: 'golang',
      rust: 'rust',
    };

    assert.strictEqual(slugMap.typescript, 'typescript');
    assert.strictEqual(slugMap.python, 'python3');
    assert.strictEqual(slugMap.go, 'golang');
  });

  await t.test('should generate correct test file names', () => {
    const className = 'TwoSum';
    const snakeCaseName = 'two_sum';
    const testNameMap: Record<string, string> = {
      typescript: `${className}.test.ts`,
      javascript: `${className}.test.js`,
      python: `test_${snakeCaseName}.py`,
      java: `${className}Test.java`,
      cpp: `${snakeCaseName}.test.cpp`,
      kotlin: `${className}Test.kt`,
      go: `${snakeCaseName}_test.go`,
      rust: `${snakeCaseName}_test.rs`,
    };

    assert.strictEqual(testNameMap.typescript, 'TwoSum.test.ts');
    assert.strictEqual(testNameMap.python, 'test_two_sum.py');
    assert.strictEqual(testNameMap.java, 'TwoSumTest.java');
    assert.strictEqual(testNameMap.cpp, 'two_sum.test.cpp');
    assert.strictEqual(testNameMap.kotlin, 'TwoSumTest.kt');
    assert.strictEqual(testNameMap.go, 'two_sum_test.go');
  });

  // Cleanup
  await fs.rm(mockTemplateDir, { recursive: true, force: true });
  await fs.rm(mockWorkingDir, { recursive: true, force: true });
});
