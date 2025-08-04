import test from 'node:test';
import assert from 'node:assert';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

void test('templates test suite', async (t) => {
  const mockTemplatesDir = join(tmpdir(), 'leetcode-cli-test-templates');
  const mockTargetDir = join(tmpdir(), 'leetcode-cli-test-target');

  // Setup test environment before each test
  await t.beforeEach(async () => {
    // Clean up any existing test directories
    await fs.rm(mockTemplatesDir, { recursive: true, force: true });
    await fs.rm(mockTargetDir, { recursive: true, force: true });

    // Setup fresh test environment
    await fs.mkdir(mockTemplatesDir, { recursive: true });
    await fs.mkdir(join(mockTemplatesDir, 'typescript'), { recursive: true });
    await fs.mkdir(join(mockTemplatesDir, 'javascript'), { recursive: true });
    await fs.mkdir(join(mockTemplatesDir, 'python'), { recursive: true });
    await fs.mkdir(join(mockTemplatesDir, 'kotlin'), { recursive: true });
    await fs.mkdir(join(mockTemplatesDir, 'java'), { recursive: true });
    await fs.mkdir(join(mockTemplatesDir, 'rust'), { recursive: true });

    // Create mock template files
    await fs.writeFile(
      join(mockTemplatesDir, 'typescript', 'package.json'),
      JSON.stringify({ name: 'test-package' })
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'typescript', 'exercise_template.ts'),
      'export __PROBLEM_DEFAULT_CODE__'
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'typescript', 'test_template.ts'),
      'import { __PROBLEM_NAME_FORMATTED__ } from "./__EXERCISE_FILE_NAME__";'
    );

    // Create mock JavaScript template files
    await fs.writeFile(
      join(mockTemplatesDir, 'javascript', 'package.json'),
      JSON.stringify({ name: 'leetcode-javascript', type: 'module' })
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'javascript', 'exercise_template.js'),
      '__PROBLEM_DEFAULT_CODE__'
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'javascript', 'test_template.js'),
      'import { __PROBLEM_NAME_FORMATTED__ } from "./__EXERCISE_FILE_NAME__";'
    );

    // Create mock Kotlin template files
    await fs.writeFile(
      join(mockTemplatesDir, 'kotlin', 'build.gradle.kts'),
      'plugins { kotlin("jvm") version "2.2.0" }'
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'kotlin', 'exercise_template.kt'),
      'package __PROBLEM_PACKAGE__\n__PROBLEM_DEFAULT_CODE__'
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'kotlin', 'test_template.kt'),
      'package __PROBLEM_PACKAGE__\nclass __PROBLEM_CLASS_NAME__Test'
    );

    // Create mock Java template files
    await fs.writeFile(
      join(mockTemplatesDir, 'java', 'build.gradle.kts'),
      'plugins { id("java") }'
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'java', 'exercise_template.java'),
      'package __PROBLEM_PACKAGE__;\n__PROBLEM_DEFAULT_CODE__'
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'java', 'test_template.java'),
      'package __PROBLEM_PACKAGE__;\npublic class __PROBLEM_CLASS_NAME__Test {}'
    );

    // Create mock Python template files
    await fs.writeFile(
      join(mockTemplatesDir, 'python', 'requirements.txt'),
      'pytest>=7.0.0\nruff>=0.1.0\nmypy>=1.0.0'
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'python', 'pyproject.toml'),
      '[tool.pytest.ini_options]\ntestpaths = ["tests"]'
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'python', 'exercise_template.py'),
      '"""\n[__PROBLEM_ID__] __PROBLEM_TITLE__\n\n__PROBLEM_DESC__\n"""\n\nfrom typing import List, Optional\n\n__PROBLEM_DEFAULT_CODE__\n        pass  # TODO: Implement solution'
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'python', 'test_template.py'),
      'import sys\nfrom pathlib import Path\n\nsys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))\n\nimport pytest\nfrom __PROBLEM_PACKAGE__.__EXERCISE_FILE_NAME_NO_EXT__ import Solution\n\ndef test___PROBLEM_NAME_FORMATTED__() -> None:\n    solution = Solution()\n    assert True'
    );

    // Create mock Rust template files
    await fs.writeFile(
      join(mockTemplatesDir, 'rust', 'Cargo.toml'),
      '[package]\nname = "leetkick-rust"\nversion = "0.1.0"\nedition = "2021"'
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'rust', 'exercise_template.rs'),
      'pub struct Solution;\n__PROBLEM_DEFAULT_CODE__\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn test___SNAKE_CASE_NAME__() {\n        assert_eq!(1, 1);\n    }\n}'
    );
    await fs.writeFile(
      join(mockTemplatesDir, 'rust', 'test_template.rs'),
      '// Tests are included in the main exercise file for Rust'
    );
  });

  await t.test(
    'should discover available languages from templates directory',
    async () => {
      // Add cpp to the mock setup
      await fs.mkdir(join(mockTemplatesDir, 'cpp'), { recursive: true });
      await fs.writeFile(
        join(mockTemplatesDir, 'cpp', 'exercise_template.cpp'),
        '__PROBLEM_DEFAULT_CODE__'
      );

      // Also add files to python directory to make it a valid language
      await fs.writeFile(
        join(mockTemplatesDir, 'python', 'exercise_template.py'),
        '__PROBLEM_DEFAULT_CODE__'
      );

      const entries = await fs.readdir(mockTemplatesDir, {
        withFileTypes: true,
      });
      const languages = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);

      assert(languages.includes('typescript'));
      assert(languages.includes('javascript'));
      assert(languages.includes('python'));
      assert(languages.includes('cpp'));
      assert(languages.includes('kotlin'));
      assert(languages.includes('java'));
      assert(languages.includes('rust'));
      assert.strictEqual(languages.length, 7);
    }
  );

  await t.test('should identify template files vs config files', async () => {
    const files = await fs.readdir(join(mockTemplatesDir, 'typescript'));

    const templateFiles = files.filter((file) => file.includes('_template.'));
    const configFiles = files.filter((file) => !file.includes('_template.'));

    assert(templateFiles.includes('exercise_template.ts'));
    assert(templateFiles.includes('test_template.ts'));
    assert(configFiles.includes('package.json'));
  });

  await t.test(
    'should copy config files during language initialization',
    async () => {
      const sourceFile = join(mockTemplatesDir, 'typescript', 'package.json');
      const targetFile = join(mockTargetDir, 'package.json');

      // Simulate copying config files (non-template files)
      await fs.mkdir(mockTargetDir, { recursive: true });
      await fs.copyFile(sourceFile, targetFile);

      const exists = await fs
        .access(targetFile)
        .then(() => true)
        .catch(() => false);
      assert(exists);

      const content = await fs.readFile(targetFile, 'utf-8');
      const parsed = JSON.parse(content);
      assert.strictEqual(parsed.name, 'test-package');
    }
  );

  await t.test('should replace template placeholders correctly', () => {
    const template =
      'export function __PROBLEM_NAME_FORMATTED__(nums: number[]): number[] { /* __PROBLEM_TITLE__ */ }';
    const replacements = {
      __PROBLEM_NAME_FORMATTED__: 'twoSum',
      __PROBLEM_TITLE__: 'Two Sum',
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

  await t.test(
    'should handle missing template directory gracefully',
    async () => {
      const nonExistentDir = join(tmpdir(), 'non-existent-templates');

      try {
        await fs.readdir(nonExistentDir);
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert(error instanceof Error);
        assert((error as NodeJS.ErrnoException).code === 'ENOENT');
      }
    }
  );

  await t.test('should validate template file structure', async () => {
    // Check that required template files exist
    const typescriptDir = join(mockTemplatesDir, 'typescript');
    const files = await fs.readdir(typescriptDir);

    const hasExerciseTemplate = files.some((f) =>
      f.includes('exercise_template')
    );
    const hasTestTemplate = files.some((f) => f.includes('test_template'));

    assert(hasExerciseTemplate, 'Should have exercise template');
    assert(hasTestTemplate, 'Should have test template');
  });

  await t.test(
    'should generate correct file paths for different languages',
    () => {
      const problemName = 'two_sum';
      const languages = [
        'typescript',
        'python',
        'java',
        'go',
        'kotlin',
        'rust',
      ];

      const fileExtensions = {
        typescript: 'ts',
        python: 'py',
        java: 'java',
        go: 'go',
        kotlin: 'kt',
        rust: 'rs',
      };

      languages.forEach((lang) => {
        const ext = fileExtensions[lang as keyof typeof fileExtensions];

        if (lang === 'rust') {
          // Rust always uses lib.rs
          const exerciseFile = 'lib.rs';
          assert.strictEqual(exerciseFile, 'lib.rs');
        } else {
          const exerciseFile = `${problemName}.${ext}`;
          assert(exerciseFile.endsWith(`.${ext}`));
          assert(exerciseFile.startsWith(problemName));
        }
      });
    }
  );

  await t.test(
    'should handle Python template structure correctly',
    async () => {
      const pythonDir = join(mockTemplatesDir, 'python');
      const files = await fs.readdir(pythonDir);

      // Check that Python has the required files
      assert(
        files.includes('requirements.txt'),
        'Should have requirements.txt'
      );
      assert(files.includes('pyproject.toml'), 'Should have pyproject.toml');
      assert(
        files.includes('exercise_template.py'),
        'Should have exercise template'
      );
      assert(files.includes('test_template.py'), 'Should have test template');

      // Check that requirements.txt has correct dependencies
      const requirementsContent = await fs.readFile(
        join(pythonDir, 'requirements.txt'),
        'utf-8'
      );
      assert(requirementsContent.includes('pytest>=7.0.0'));
      assert(requirementsContent.includes('ruff>=0.1.0'));
      assert(requirementsContent.includes('mypy>=1.0.0'));

      // Check that exercise template has correct Python structure
      const exerciseContent = await fs.readFile(
        join(pythonDir, 'exercise_template.py'),
        'utf-8'
      );
      assert(exerciseContent.includes('from typing import List, Optional'));
      assert(exerciseContent.includes('__PROBLEM_DEFAULT_CODE__'));
      assert(exerciseContent.includes('pass  # TODO: Implement solution'));

      // Check that test template has correct import structure
      const testContent = await fs.readFile(
        join(pythonDir, 'test_template.py'),
        'utf-8'
      );
      assert(testContent.includes('import sys'));
      assert(testContent.includes('from pathlib import Path'));
      assert(testContent.includes('import pytest'));
      assert(
        testContent.includes(
          'from __PROBLEM_PACKAGE__.__EXERCISE_FILE_NAME_NO_EXT__ import Solution'
        )
      );
    }
  );

  await t.test(
    'should handle JavaScript template structure correctly',
    async () => {
      const jsDir = join(mockTemplatesDir, 'javascript');
      const files = await fs.readdir(jsDir);

      // Check that JavaScript has the required files
      assert(files.includes('package.json'), 'Should have package.json');
      assert(
        files.includes('exercise_template.js'),
        'Should have exercise template'
      );
      assert(files.includes('test_template.js'), 'Should have test template');

      // Check that package.json has correct content
      const packageContent = await fs.readFile(
        join(jsDir, 'package.json'),
        'utf-8'
      );
      const packageObj = JSON.parse(packageContent);
      assert.strictEqual(packageObj.name, 'leetcode-javascript');
      assert.strictEqual(packageObj.type, 'module');

      // Check that exercise template has correct placeholder
      const exerciseContent = await fs.readFile(
        join(jsDir, 'exercise_template.js'),
        'utf-8'
      );
      assert(exerciseContent.includes('__PROBLEM_DEFAULT_CODE__'));

      // Check that test template has correct import structure
      const testContent = await fs.readFile(
        join(jsDir, 'test_template.js'),
        'utf-8'
      );
      assert(testContent.includes('import { __PROBLEM_NAME_FORMATTED__ }'));
      assert(testContent.includes('from "./__EXERCISE_FILE_NAME__"'));
    }
  );

  await t.test('should handle Rust template structure correctly', async () => {
    const rustDir = join(mockTemplatesDir, 'rust');
    const files = await fs.readdir(rustDir);

    // Check that Rust has the required files
    assert(files.includes('Cargo.toml'), 'Should have Cargo.toml');
    assert(
      files.includes('exercise_template.rs'),
      'Should have exercise template'
    );
    assert(
      files.includes('test_template.rs'),
      'Should have test template placeholder'
    );

    // Check that Cargo.toml has correct content
    const cargoContent = await fs.readFile(
      join(rustDir, 'Cargo.toml'),
      'utf-8'
    );
    assert(cargoContent.includes('name = "leetkick-rust"'));
    assert(cargoContent.includes('edition = "2021"'));

    // Check that exercise template includes struct Solution and tests
    const exerciseContent = await fs.readFile(
      join(rustDir, 'exercise_template.rs'),
      'utf-8'
    );
    assert(exerciseContent.includes('pub struct Solution;'));
    assert(exerciseContent.includes('#[cfg(test)]'));
    assert(exerciseContent.includes('mod tests'));
  });

  // Cleanup after each test
  await t.afterEach(async () => {
    await fs.rm(mockTemplatesDir, { recursive: true, force: true });
    await fs.rm(mockTargetDir, { recursive: true, force: true });
  });
});
