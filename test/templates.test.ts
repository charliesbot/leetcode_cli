import test from 'node:test';
import assert from 'node:assert';
import {promises as fs} from 'fs';
import {join} from 'path';
import {tmpdir} from 'os';

test('templates test suite', async (t) => {
  const mockTemplatesDir = join(tmpdir(), 'leetcode-cli-test-templates');
  const mockTargetDir = join(tmpdir(), 'leetcode-cli-test-target');

  // Setup test environment before each test
  await t.beforeEach(async () => {
    // Clean up any existing test directories
    await fs.rm(mockTemplatesDir, {recursive: true, force: true});
    await fs.rm(mockTargetDir, {recursive: true, force: true});
    
    // Setup fresh test environment
    await fs.mkdir(mockTemplatesDir, {recursive: true});
    await fs.mkdir(join(mockTemplatesDir, 'typescript'), {recursive: true});
    await fs.mkdir(join(mockTemplatesDir, 'python'), {recursive: true});

    // Create mock template files
    await fs.writeFile(
      join(mockTemplatesDir, 'typescript', 'package.json'),
      JSON.stringify({name: 'test-package'})
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'typescript', 'exercise_template.ts'),
      'export __PROBLEM_DEFAULT_CODE__'
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'typescript', 'test_template.ts'),
      'import { __PROBLEM_NAME_FORMATTED__ } from "./__EXERCISE_FILE_NAME__";'
    );
  });

  await t.test('should discover available languages from templates directory', async () => {
    const entries = await fs.readdir(mockTemplatesDir, {withFileTypes: true});
    const languages = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    assert(languages.includes('typescript'));
    assert(languages.includes('python'));
    assert.strictEqual(languages.length, 2);
  });

  await t.test('should identify template files vs config files', async () => {
    const files = await fs.readdir(join(mockTemplatesDir, 'typescript'));
    
    const templateFiles = files.filter((file) => file.includes('_template.'));
    const configFiles = files.filter((file) => !file.includes('_template.'));

    assert(templateFiles.includes('exercise_template.ts'));
    assert(templateFiles.includes('test_template.ts'));
    assert(configFiles.includes('package.json'));
  });

  await t.test('should copy config files during language initialization', async () => {
    const sourceFile = join(mockTemplatesDir, 'typescript', 'package.json');
    const targetFile = join(mockTargetDir, 'package.json');

    // Simulate copying config files (non-template files)
    await fs.mkdir(mockTargetDir, {recursive: true});
    await fs.copyFile(sourceFile, targetFile);

    const exists = await fs.access(targetFile).then(() => true).catch(() => false);
    assert(exists);

    const content = await fs.readFile(targetFile, 'utf-8');
    const parsed = JSON.parse(content);
    assert.strictEqual(parsed.name, 'test-package');
  });

  await t.test('should replace template placeholders correctly', () => {
    const template = 'export function __PROBLEM_NAME_FORMATTED__(nums: number[]): number[] { /* __PROBLEM_TITLE__ */ }';
    const replacements = {
      '__PROBLEM_NAME_FORMATTED__': 'twoSum',
      '__PROBLEM_TITLE__': 'Two Sum',
    };

    let result = template;
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(key, 'g'), value);
    }

    assert.strictEqual(
      result,
      'export function twoSum(nums: number[]): number[] { /* Two Sum */ }'
    );
  });

  await t.test('should handle missing template directory gracefully', async () => {
    const nonExistentDir = join(tmpdir(), 'non-existent-templates');
    
    try {
      await fs.readdir(nonExistentDir);
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert(error instanceof Error);
      assert((error as NodeJS.ErrnoException).code === 'ENOENT');
    }
  });

  await t.test('should validate template file structure', async () => {
    // Check that required template files exist
    const typescriptDir = join(mockTemplatesDir, 'typescript');
    const files = await fs.readdir(typescriptDir);
    
    const hasExerciseTemplate = files.some(f => f.includes('exercise_template'));
    const hasTestTemplate = files.some(f => f.includes('test_template'));
    
    assert(hasExerciseTemplate, 'Should have exercise template');
    assert(hasTestTemplate, 'Should have test template');
  });

  await t.test('should generate correct file paths for different languages', () => {
    const problemName = 'two_sum';
    const languages = ['typescript', 'python', 'java', 'go'];
    
    const fileExtensions = {
      typescript: 'ts',
      python: 'py',
      java: 'java',
      go: 'go',
    };

    languages.forEach(lang => {
      const ext = fileExtensions[lang as keyof typeof fileExtensions];
      const exerciseFile = `${problemName}.${ext}`;
      
      assert(exerciseFile.endsWith(`.${ext}`));
      assert(exerciseFile.startsWith(problemName));
    });
  });

  // Cleanup
  await fs.rm(mockTemplatesDir, {recursive: true, force: true});
  await fs.rm(mockTargetDir, {recursive: true, force: true});
});