import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Problem } from '../types/leetcode.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '../../../templates');

export async function createProblemFiles(
  problem: Problem,
  language: string
): Promise<void> {
  const templateDir = join(TEMPLATES_DIR, language);
  const paddedId = problem.questionFrontendId.padStart(4, '0');
  const problemName = `${paddedId}_${problem.titleSlug.replace('-', '_')}`;
  const languageDir = join(process.cwd(), language);
  const problemDir = join(languageDir, problemName);

  // Create problem directory (this will work even if it exists)
  await mkdir(problemDir, { recursive: true });

  // Find the code snippet for this language
  const codeSnippet = problem.codeSnippets.find(
    (snippet) => snippet.langSlug === getLanguageSlug(language)
  );

  const defaultCode =
    codeSnippet?.code || `// TODO: Implement solution for ${problem.title}`;

  // Use the base name (without padding) for file names
  const baseProblemName = problem.titleSlug.replace('-', '_');

  // Extract function name from the code snippet
  const functionName =
    extractFunctionName(defaultCode) || formatProblemName(problem.title);

  // Template replacements
  const replacements = {
    __PROBLEM_ID__: problem.questionFrontendId,
    __PROBLEM_TITLE__: problem.title,
    __PROBLEM_DESC__: cleanDescription(problem.content),
    __PROBLEM_DIFFICULTY__: problem.difficulty,
    __PROBLEM_DEFAULT_CODE__: defaultCode,
    __PROBLEM_NAME_FORMATTED__: functionName,
    __EXERCISE_FILE_NAME__: getExerciseFileName(baseProblemName, language),
  };

  // Create exercise file
  const exerciseTemplate = await readFile(
    join(templateDir, 'exercise_template.' + getFileExtension(language)),
    'utf-8'
  );
  const exerciseContent = replaceTemplateVars(exerciseTemplate, replacements);
  await writeFile(
    join(problemDir, getExerciseFileName(baseProblemName, language)),
    exerciseContent
  );

  // Create test file
  const testTemplate = await readFile(
    join(templateDir, 'test_template.' + getFileExtension(language)),
    'utf-8'
  );
  const testContent = replaceTemplateVars(testTemplate, replacements);
  await writeFile(
    join(problemDir, getTestFileName(baseProblemName, language)),
    testContent
  );
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

function formatProblemName(title: string): string {
  // Convert "Two Sum" to "twoSum" for function names
  return title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(' ')
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
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
  const ext = getFileExtension(language);
  return `${problemName}.${ext}`;
}

function getTestFileName(problemName: string, language: string): string {
  const ext = getFileExtension(language);
  const testNameMap: Record<string, string> = {
    typescript: `${problemName}.test.${ext}`,
    javascript: `${problemName}.test.${ext}`,
    python: `test_${problemName}.${ext}`,
    java: `${problemName.charAt(0).toUpperCase() + problemName.slice(1)}Test.${ext}`,
    go: `${problemName}_test.${ext}`,
    rust: `${problemName}_test.${ext}`,
  };
  return testNameMap[language] || `${problemName}.test.${ext}`;
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
