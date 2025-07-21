# LeetCode CLI

A modern TypeScript CLI tool for scaffolding LeetCode exercises with language-specific testing setups. Organize your coding practice in a structured way across multiple programming languages.

## ✨ Features

- 🚀 **Fetch problems directly from LeetCode** via GraphQL API
- 🔧 **Auto-scaffolding** with language-specific templates
- 📁 **Clean organization** by programming language
- ⚡ **Instant testing** with pre-configured test frameworks
- 🎯 **Extensible** - easily add new language support
- 📝 **Google TypeScript Style** compliant codebase

## 🛠️ Installation

### Prerequisites

- Node.js 18+ (for ES2022 features and built-in fetch)
- npm or yarn

### Install

```bash
git clone https://github.com/charliesbot/leetcode_cli.git
cd leetcode_cli
npm install
npm run build
```

### Global Installation (Optional)

```bash
npm link
# Now you can use `leetcode` command globally
```

## 🚀 Quick Start

### 1. Fetch Your First Problem

```bash
# Fetch the classic "Two Sum" problem for TypeScript
node build/src/index.js fetch two-sum --language typescript

# Or if globally installed:
leetcode fetch two-sum --language typescript
```

This will:
- Create a `typescript/` workspace with proper configuration
- Fetch problem details from LeetCode
- Generate `two_sum/solution.ts` with the problem description and starter code
- Generate `two_sum/solution.test.ts` with basic test setup

### 2. Start Coding

```bash
cd typescript/two_sum
# Edit two_sum.ts to implement your solution
```

### 3. Run Tests

```bash
cd typescript
npm test  # Runs all tests
# or
npm test two_sum/two_sum.test.ts  # Run specific test
```

## 📖 Usage

### Commands

#### `fetch <problem-slug> --language <lang>`

Fetch a LeetCode problem and create exercise files.

```bash
leetcode fetch binary-search --language typescript
leetcode fetch valid-parentheses --language python
leetcode fetch reverse-linked-list --language java
```

**Options:**
- `<problem-slug>`: LeetCode problem slug (e.g., "two-sum", "binary-search")
- `--language, -l`: Programming language (see supported languages below)

#### `init <language>`

Initialize a language workspace manually.

```bash
leetcode init typescript
leetcode init python
```

#### `help [command]`

Show help information.

```bash
leetcode help
leetcode help fetch
```

### Supported Languages

Currently supported:
- ✅ **TypeScript** - Vitest, Node.js built-in testing, modern ES2022
- 🚧 **Python** - Coming soon (pytest)
- 🚧 **Java** - Coming soon (JUnit + Maven)
- 🚧 **Go** - Coming soon (built-in testing)
- 🚧 **Rust** - Coming soon (Cargo)

## 📁 Project Structure

After using the CLI, your project will look like this:

```
your-project/
├── typescript/
│   ├── package.json          # TypeScript workspace config
│   ├── tsconfig.json         # TypeScript compiler config
│   ├── .prettierrc.json      # Code formatting rules
│   ├── two_sum/
│   │   ├── two_sum.ts        # Your solution
│   │   └── two_sum.test.ts   # Test cases
│   ├── binary_search/
│   │   ├── binary_search.ts
│   │   └── binary_search.test.ts
│   └── ...
├── python/                   # Future: Python workspace
├── java/                     # Future: Java workspace
└── ...
```

## 🎯 Example Workflow

```bash
# 1. Fetch a problem
leetcode fetch two-sum --language typescript

# 2. Navigate to the generated code
cd typescript/two_sum
```

**Generated `two_sum.ts`:**
```typescript
/*
 * [1] Two Sum
 *
 * Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
 *
 * You may assume that each input would have exactly one solution, and you may not use the same element twice.
 *
 * Difficulty: Easy
 */

export function twoSum(nums: number[], target: number): number[] {
    
};
```

**Generated `two_sum.test.ts`:**
```typescript
import test from 'node:test';
import assert from 'node:assert';
import { twoSum } from './two_sum.ts';

test('twoSum', () => {
  // TODO: Add test cases based on problem examples
  assert.equal(1, 1);
});
```

```bash
# 3. Implement your solution and add test cases
# 4. Run tests
cd ..
npm test

# 5. Success! 🎉
```

## 🔧 Development

### Building the CLI

```bash
npm run build     # or npm run compile
```

### Code Quality

```bash
npm run lint      # Check code style
npm run fix       # Auto-fix style issues
npm run clean     # Clean build artifacts
```

### Adding New Language Support

1. Create a new template directory: `templates/<language>/`
2. Add required files:
   - Configuration files (e.g., `package.json`, `pom.xml`)
   - `exercise_template.*` - Template for solution files
   - `test_template.*` - Template for test files
3. The CLI will automatically discover the new language!

**Template Placeholders:**
- `__PROBLEM_ID__` - LeetCode problem ID (e.g., "1")
- `__PROBLEM_TITLE__` - Problem title (e.g., "Two Sum")
- `__PROBLEM_DESC__` - Problem description
- `__PROBLEM_DIFFICULTY__` - Difficulty level
- `__PROBLEM_DEFAULT_CODE__` - Starter code from LeetCode
- `__PROBLEM_NAME_FORMATTED__` - Camelcase function name
- `__EXERCISE_FILE_NAME__` - Generated file name

## 🏗️ Architecture

- **CLI Framework**: Commander.js
- **Language**: TypeScript with Google TypeScript Style (gts)
- **API**: LeetCode GraphQL API
- **Template System**: File-based with placeholder replacement
- **Testing**: Node.js built-in testing (for TypeScript templates)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-language`
3. Make your changes following Google TypeScript Style
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Submit a pull request

### Adding Language Templates

The easiest way to contribute is by adding new language templates! Check the `templates/typescript/` directory for examples and create similar structures for other languages.

## 📝 License

MIT

## 🙏 Acknowledgments

- Inspired by the original [charliesbot/leetcode_cli](https://github.com/charliesbot/leetcode_cli) Rust implementation
- Built with [Google TypeScript Style (gts)](https://github.com/google/gts)
- Uses LeetCode's GraphQL API for problem fetching

---

**Happy Coding!** 🚀 Start practicing with organized, testable LeetCode solutions.