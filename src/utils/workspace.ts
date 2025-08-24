import {existsSync, readFileSync, writeFileSync} from 'fs';
import {readdir} from 'fs/promises';
import {join, dirname} from 'path';

export interface WorkspaceConfig {
  version: string;
  createdAt: string;
}

const WORKSPACE_CONFIG_FILE = '.leetkick.json';
const SUPPORTED_LANGUAGES = [
  'typescript',
  'javascript',
  'python',
  'java',
  'cpp',
  'go',
  'rust',
];

export function findWorkspaceRoot(
  startDir: string = process.cwd(),
): string | null {
  let currentDir = startDir;

  while (currentDir !== '/') {
    const configPath = join(currentDir, WORKSPACE_CONFIG_FILE);
    if (existsSync(configPath)) {
      return currentDir;
    }
    currentDir = dirname(currentDir);
  }

  return null;
}

export function isWorkspaceInitialized(dir: string = process.cwd()): boolean {
  return existsSync(join(dir, WORKSPACE_CONFIG_FILE));
}

export function createWorkspace(dir: string = process.cwd()): void {
  const config: WorkspaceConfig = {
    version: '0.1.0',
    createdAt: new Date().toISOString(),
  };

  const configPath = join(dir, WORKSPACE_CONFIG_FILE);
  writeFileSync(configPath, JSON.stringify(config, null, 2));

  // Create README.md
  const readmePath = join(dir, 'README.md');
  const readmeContent = `# LeetCode Practice Workspace

This workspace was created with [leetkick](https://github.com/charliesbot/leetkick) - a CLI tool for organizing LeetCode practice.

## Usage

### Fetch a new problem
\`\`\`bash
leetkick fetch two-sum --language typescript
\`\`\`

### Run tests
\`\`\`bash
leetkick test 1 --language typescript
leetkick test two-sum --language typescript
\`\`\`

### Add a new language
\`\`\`bash
leetkick add python
\`\`\`

## Commands

- \`leetkick init\` - Initialize empty workspace
- \`leetkick add <language>\` - Add language workspace
- \`leetkick fetch <problem> --language <lang>\` - Fetch problem
- \`leetkick test <problem> --language <lang>\` - Run tests

Happy coding! 🚀
`;

  writeFileSync(readmePath, readmeContent);

  // Create .gitignore
  const gitignorePath = join(dir, '.gitignore');
  const gitignoreContent = `# Dependencies
node_modules/
target/
__pycache__/
*.pyc

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Build outputs
dist/
build/
*.class
*.o
*.exe
`;

  writeFileSync(gitignorePath, gitignoreContent);
}

export async function getWorkspaceLanguages(
  workspaceRoot: string,
): Promise<string[]> {
  try {
    const entries = await readdir(workspaceRoot, {withFileTypes: true});
    return entries
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
      .filter(entry => SUPPORTED_LANGUAGES.includes(entry.name))
      .map(entry => entry.name);
  } catch (error) {
    return [];
  }
}

export function readWorkspaceConfig(
  workspaceRoot: string,
): WorkspaceConfig | null {
  try {
    const configPath = join(workspaceRoot, WORKSPACE_CONFIG_FILE);
    const content = readFileSync(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}
