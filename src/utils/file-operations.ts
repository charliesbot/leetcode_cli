import { readFile, writeFile, mkdir, readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Problem } from '../types/leetcode.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '../../templates');

export async function createProblemFiles(
  problem: Problem,
  language: string
): Promise<void> {
  const templateDir = join(TEMPLATES_DIR, language);

  const paddedId = problem.questionFrontendId.padStart(4, '0');
  const problemName = `${paddedId}_${problem.titleSlug.replace('-', '_')}`;
  const languageDir = join(process.cwd(), language);

  // Create problem directory (this will work even if it exists)
  //await mkdir(problemDir, { recursive: true });

  // Find the code snippet for this language
  const codeSnippet = problem.codeSnippets.find(
    (snippet) => snippet.langSlug === getLanguageSlug(language)
  );

  const defaultCode =
    codeSnippet?.code || `// TODO: Implement solution for ${problem.title}`;

  // Use the padded ID + base name for file names
  const baseProblemName = `${paddedId}_${problem.titleSlug.replace('-', '_')}`;

  // Extract function name from the code snippet
  const functionName =
    extractFunctionName(defaultCode) ||
    formatProblemName(problem.title, language);

  // Template replacements
  const replacements = {
    __PROBLEM_ID__: problem.questionFrontendId,
    __PROBLEM_TITLE__: problem.title,
    __PROBLEM_DESC__: cleanDescription(problem.content),
    __PROBLEM_DIFFICULTY__: problem.difficulty,
    __PROBLEM_DEFAULT_CODE__: defaultCode,
    __PROBLEM_NAME_FORMATTED__: functionName,
    __EXERCISE_FILE_NAME__: getExerciseFileName(baseProblemName, language),
    __EXERCISE_TEST_FILE_NAME__: getTestFileName(baseProblemName, language),
    __LANGUAGE_EXT__: getFileExtension(language),
  };

  await createFolderContents(
    languageDir,
    baseProblemName,
    templateDir,
    language,
    replacements
  );

  if (language === 'rust') {
    const mainFolder = join(languageDir, 'src/main.rs');
    const original = await readFile(mainFolder, 'utf8');

    const a = 'pub mod ' + replacements.__EXERCISE_FILE_NAME__ + '\n';
    const b = 'pub mod ' + replacements.__EXERCISE_TEST_FILE_NAME__ + '\n\n';

    writeFile(mainFolder, a + b + original);
  }
}

async function createFolderContents(
  path: string,
  baseProblemName: string,
  templateDir: string,
  language: string,
  replacements: Record<string, string>
) {
  // We read the template files in case we need to copy some additional template files
  const templateFiles = await readdir(templateDir);

  for (const file of templateFiles) {
    const templateFilePath = join(templateDir, file);
    const fileInfo = await stat(templateFilePath);

    if (fileInfo.isDirectory()) {
      let folderName = file;
      if (file === '__FOLDER_TEMPLATE__') {
        folderName = getProblemFolderName(baseProblemName, language);
      }

      const nextTemplateDirPath = join(templateDir, file);
      const nextProblemDirPath = join(path, folderName);

      await mkdir(nextProblemDirPath, { recursive: true });

      await createFolderContents(
        nextProblemDirPath,
        baseProblemName,
        nextTemplateDirPath,
        language,
        replacements
      );
      continue;
    }

    if (file.endsWith('_template.' + getFileExtension(language))) {
      const templateFile = await readFile(templateFilePath, 'utf-8');
      const templateContents = replaceTemplateVars(templateFile, replacements);
      const ext = getFileExtension(language);

      let name = '';

      if (file.startsWith('test_')) {
        name = getTestFileName(baseProblemName, language) + '.' + ext;
      } else if (file.startsWith('exercise_')) {
        name = getExerciseFileName(baseProblemName, language) + '.' + ext;
      } else {
        const parts = file.split('_template');
        name = parts.join('');
      }

      await writeFile(join(path, name), templateContents);
    }
  }
}

function replaceTemplateVars(
  template: string,
  replacements: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(key, 'g'), value);
  }
  return result;
}

function cleanDescription(htmlContent: string): string {
  // Remove HTML tags and clean up the description
  return htmlContent
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

function formatProblemName(title: string, language: string): string {
  const words = title
    .replace(/[^a-zA-Z0-9\s]/g, '') // remove special characters
    .split(' ')
    .filter(Boolean);

  const camelCase = words
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');

  const snake_case = words.map((w) => w.toLowerCase()).join('_');

  const PascalCase = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');

  switch (language.toLowerCase()) {
    case 'ts':
    case 'js':
      return camelCase; // e.g., "twoSum"
    case 'python':
      return snake_case; // e.g., "two_sum"
    case 'java':
      return camelCase; // e.g., "twoSum" (method name style)
    case 'go':
      return PascalCase; // e.g., "TwoSum" (exported function)
    case 'rust':
      return snake_case; // e.g., "two_sum" (function name style)
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

function getLanguageSlug(language: string): string {
  const slugMap: Record<string, string> = {
    typescript: 'typescript',
    javascript: 'javascript',
    python: 'python3',
    java: 'java',
    cpp: 'cpp',
    go: 'golang',
    rust: 'rust',
  };
  return slugMap[language] || language;
}

function getFileExtension(language: string): string {
  const extMap: Record<string, string> = {
    typescript: 'ts',
    javascript: 'js',
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    go: 'go',
    rust: 'rs',
  };
  return extMap[language] || 'txt';
}

function getExerciseFileName(problemName: string, language: string): string {
  const fileNameMap: Record<string, string> = {
    rust: `problem_${problemName}`,
  };

  return fileNameMap[language] || `${problemName}`;
}

function getProblemFolderName(problemName: string, language: string): string {
  const fileNameMap: Record<string, string> = {
    rust: `problem_${problemName}`,
  };

  return fileNameMap[language] || `${problemName}`;
}

function getTestFileName(problemName: string, language: string): string {
  const testNameMap: Record<string, string> = {
    typescript: `${problemName}.test`,
    javascript: `${problemName}.test`,
    python: `test_${problemName}`,
    java: `${problemName.charAt(0).toUpperCase() + problemName.slice(1)}Test`,
    go: `${problemName}_test`,
    rust: `test_${problemName}`,
  };
  return testNameMap[language] || `${problemName}.test`;
}

function extractFunctionName(code: string): string | null {
  // Extract function name from TypeScript/JavaScript code
  const functionMatch = code.match(/function\s+(\w+)\s*\(/);
  if (functionMatch) {
    return functionMatch[1];
  }

  // Extract function name from arrow function or method
  const arrowMatch = code.match(/(\w+)\s*[=:]\s*\(/);
  if (arrowMatch) {
    return arrowMatch[1];
  }

  return null;
}
