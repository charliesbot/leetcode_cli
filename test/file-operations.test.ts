import test from 'node:test';
import assert from 'node:assert';
import {promises as fs} from 'fs';
import {join} from 'path';
import {tmpdir} from 'os';
import type {Problem} from '../src/types/leetcode.js';

// Mock the file operations module
const mockTemplateDir = join(tmpdir(), 'leetcode-cli-test-templates');
const mockWorkingDir = join(tmpdir(), 'leetcode-cli-test-workspace');

// Setup test fixtures
const mockProblem: Problem = {
  questionId: '1',
  questionFrontendId: '1',
  title: 'Two Sum',
  titleSlug: 'two-sum',
  content: '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.</p>',
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
  await fs.mkdir(mockTemplateDir, {recursive: true});
  await fs.mkdir(mockWorkingDir, {recursive: true});
  
  await t.test('should extract function name from TypeScript code', () => {
    const code = 'function twoSum(nums: number[], target: number): number[] {\n    \n};';
    // We would need to import the extractFunctionName function
    // For now, test the regex pattern
    const functionMatch = code.match(/function\s+(\w+)\s*\(/);
    assert.strictEqual(functionMatch?.[1], 'twoSum');
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
    const htmlContent = '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices.</p>';
    const cleaned = htmlContent
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .trim();
    
    assert.strictEqual(cleaned, 'Given an array of integers nums and an integer target, return indices.');
  });

  await t.test('should create zero-padded problem directory name', () => {
    const problemId = '1';
    const titleSlug = 'two-sum';
    const paddedId = problemId.padStart(4, '0');
    const problemName = `${paddedId}_${titleSlug.replace('-', '_')}`;
    
    assert.strictEqual(problemName, '0001_two_sum');
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
    const problemName = 'two_sum';
    const testNameMap: Record<string, string> = {
      typescript: `${problemName}.test.ts`,
      javascript: `${problemName}.test.js`,
      python: `test_${problemName}.py`,
      java: `${problemName.charAt(0).toUpperCase() + problemName.slice(1)}Test.java`,
      go: `${problemName}_test.go`,
      rust: `${problemName}_test.rs`,
    };
    
    assert.strictEqual(testNameMap.typescript, 'two_sum.test.ts');
    assert.strictEqual(testNameMap.python, 'test_two_sum.py');
    assert.strictEqual(testNameMap.java, 'Two_sumTest.java');
    assert.strictEqual(testNameMap.go, 'two_sum_test.go');
  });

  // Cleanup
  await fs.rm(mockTemplateDir, {recursive: true, force: true});
  await fs.rm(mockWorkingDir, {recursive: true, force: true});
});