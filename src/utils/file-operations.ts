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
  const problemDirName = `problem_${paddedId}`;
  const languageDir = join(process.cwd(), language);

  // For Kotlin and Java, we need to create src/main/{lang} and src/test/{lang} structure
  // For Rust, we need src/ directory for Cargo
  let problemDir: string;
  let testDir: string;
  if (language === 'kotlin' || language === 'java') {
    const problemPackage = `problem${paddedId}`;
    problemDir = join(languageDir, 'src', 'main', language, problemPackage);
    testDir = join(languageDir, 'src', 'test', language, problemPackage);
    await mkdir(problemDir, { recursive: true });
    await mkdir(testDir, { recursive: true });
  } else if (language === 'rust') {
    problemDir = join(languageDir, 'src');
    testDir = problemDir;
    await mkdir(problemDir, { recursive: true });
  } else {
    problemDir = join(languageDir, problemDirName);
    testDir = problemDir;
    await mkdir(problemDir, { recursive: true });
  }

  // Find the code snippet for this language
  const codeSnippet = problem.codeSnippets.find(
    (snippet) => snippet.langSlug === getLanguageSlug(language)
  );

  const defaultCode =
    codeSnippet?.code || getDefaultCodeForLanguage(language, problem.title);

  // Generate clean names based on language conventions
  const className = formatClassName(problem.title);
  const snakeCaseName = formatSnakeCase(problem.title);
  const camelCaseName = formatProblemName(problem.title);

  // Extract function name from the code snippet
  const functionName = extractFunctionName(defaultCode) || camelCaseName;

  // Template replacements
  const replacements = {
    __PROBLEM_ID__: problem.questionFrontendId,
    __PROBLEM_TITLE__: problem.title,
    __PROBLEM_DESC__: cleanDescription(problem.content),
    __PROBLEM_DIFFICULTY__: problem.difficulty,
    __PROBLEM_DEFAULT_CODE__: defaultCode,
    __PROBLEM_NAME_FORMATTED__: functionName,
    __CLASS_NAME__: className,
    __SNAKE_CASE_NAME__: snakeCaseName,
    __PROBLEM_PACKAGE__:
      language === 'kotlin' || language === 'java' ? `problem${paddedId}` : '',
    __PROBLEM_CLASS_NAME__: className,
    __EXERCISE_FILE_NAME__: getExerciseFileName(
      className,
      snakeCaseName,
      language,
      paddedId
    ),
    __EXERCISE_FILE_NAME_NO_EXT__: getExerciseFileNameNoExt(
      className,
      snakeCaseName,
      language,
      paddedId
    ),
  };

  // Create exercise file
  const exerciseTemplate = await readFile(
    join(templateDir, 'exercise_template.' + getFileExtension(language)),
    'utf-8'
  );
  const exerciseContent = replaceTemplateVars(exerciseTemplate, replacements);
  await writeFile(
    join(
      problemDir,
      getExerciseFileName(className, snakeCaseName, language, paddedId)
    ),
    exerciseContent
  );

  // For Rust, add module declaration to lib.rs
  if (language === 'rust') {
    await addModuleToLibRs(languageDir, `problem_${paddedId}`);
  }

  // Create test file (skip for Rust as tests are in the same file)
  if (language !== 'rust') {
    const testTemplate = await readFile(
      join(templateDir, 'test_template.' + getFileExtension(language)),
      'utf-8'
    );
    const testContent = replaceTemplateVars(testTemplate, replacements);
    await writeFile(
      join(testDir, getTestFileName(className, snakeCaseName, language)),
      testContent
    );
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
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&amp;/g, '&') // Keep this last as other entities contain &
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

function formatClassName(title: string): string {
  // Convert "Two Sum" to "TwoSum" for class names
  return title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function formatSnakeCase(title: string): string {
  // Convert "Two Sum" to "two_sum" for C++ files
  return title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .join('_');
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
    kotlin: 'kotlin',
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
    kotlin: 'kt',
  };
  return extMap[language] || 'txt';
}

function getExerciseFileName(
  className: string,
  snakeCaseName: string,
  language: string,
  paddedId?: string
): string {
  const ext = getFileExtension(language);
  switch (language) {
    case 'typescript':
    case 'javascript':
      return `${className}.${ext}`;
    case 'cpp':
    case 'c':
      return `${snakeCaseName}.${ext}`;
    case 'kotlin':
    case 'java':
      return `${className}.${ext}`;
    case 'rust':
      return `problem_${paddedId || '0001'}.rs`;
    default:
      return `${className}.${ext}`;
  }
}

function getExerciseFileNameNoExt(
  className: string,
  snakeCaseName: string,
  language: string,
  paddedId?: string
): string {
  switch (language) {
    case 'typescript':
    case 'javascript':
      return className;
    case 'cpp':
    case 'c':
      return snakeCaseName;
    case 'kotlin':
    case 'java':
      return className;
    case 'rust':
      return `problem_${paddedId || '0001'}`;
    default:
      return className;
  }
}

function getTestFileName(
  className: string,
  snakeCaseName: string,
  language: string
): string {
  const ext = getFileExtension(language);
  switch (language) {
    case 'typescript':
    case 'javascript':
      return `${className}.test.${ext}`;
    case 'cpp':
    case 'c':
      return `${snakeCaseName}.test.${ext}`;
    case 'kotlin':
      return `${className}Test.${ext}`;
    case 'java':
      return `${className}Test.${ext}`;
    case 'python':
      return `test_${snakeCaseName}.${ext}`;
    case 'go':
      return `${snakeCaseName}_test.${ext}`;
    case 'rust':
      return 'lib.rs'; // Tests are in the same file for Rust
    default:
      return `${className}.test.${ext}`;
  }
}

function getDefaultCodeForLanguage(language: string, title: string): string {
  switch (language) {
    case 'kotlin':
      return `class Solution {
    // TODO: Implement solution for ${title}
}`;
    case 'java':
      return `class Solution {
    // TODO: Implement solution for ${title}
}`;
    case 'typescript':
    case 'javascript':
      return `// TODO: Implement solution for ${title}`;
    case 'cpp':
      return `class Solution {
public:
    // TODO: Implement solution for ${title}
};`;
    default:
      return `// TODO: Implement solution for ${title}`;
  }
}

async function addModuleToLibRs(
  languageDir: string,
  moduleName: string
): Promise<void> {
  const libPath = join(languageDir, 'src', 'lib.rs');

  try {
    let libContent = await readFile(libPath, 'utf-8');

    // Check if module is already declared
    const moduleDeclaration = `pub mod ${moduleName};`;
    if (libContent.includes(moduleDeclaration)) {
      return; // Module already declared
    }

    // Add module declaration at the end
    libContent += `\npub mod ${moduleName};\n`;

    await writeFile(libPath, libContent);
  } catch (error) {
    throw new Error(`Failed to update lib.rs: ${error}`);
  }
}

function extractFunctionName(code: string): string | null {
  // Extract function name from C++ code (class method) - handle templates like vector<int>
  const cppMethodMatch = code.match(/[\w<>]+\s+(\w+)\s*\([^)]*\)\s*\{/);
  if (cppMethodMatch) {
    return cppMethodMatch[1];
  }

  // Extract function name from Java code (public method in class)
  const javaMethodMatch = code.match(
    /public\s+[\w<>[\]]+\s+(\w+)\s*\([^)]*\)\s*\{/
  );
  if (javaMethodMatch) {
    return javaMethodMatch[1];
  }

  // Extract function name from Kotlin code
  const kotlinFunMatch = code.match(/fun\s+(\w+)\s*\(/);
  if (kotlinFunMatch) {
    return kotlinFunMatch[1];
  }

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
