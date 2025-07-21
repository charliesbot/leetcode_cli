# LeetKick 🚀

A modern TypeScript CLI tool for scaffolding LeetCode exercises with language-specific testing setups. Kick-start your coding practice in a structured way across multiple programming languages!

## ✨ Features

- 🚀 **Fetch problems directly from LeetCode** via GraphQL API
- 🔧 **Auto-scaffolding** with language-specific templates
- 📁 **Clean organization** by programming language
- ⚡ **Instant testing** with pre-configured test frameworks
- 🎯 **Extensible** - easily add new language support
- 📝 **Google TypeScript Style** compliant codebase

## 🛠️ Installation

### Quick Install (Recommended)

```bash
# Install globally from npm
npm install -g leetkick

# Start using immediately
leetkick fetch two-sum --language typescript
```

### Building from Source

If you want to contribute or modify the tool:

#### Prerequisites

- Node.js 18+ (for ES2022 features and built-in fetch)
- npm or yarn

#### Steps

```bash
git clone https://github.com/charliesbot/leetkick.git
cd leetkick
npm install
npm run build
```

#### Local Development Setup

```bash
npm link
# Now you can use `leetkick` command globally during development
```

## 🚀 Quick Start

### 1. Fetch Your First Problem

```bash
# Fetch the classic "Two Sum" problem for TypeScript
leetkick fetch two-sum --language typescript
```

This will:
- Create a `typescript/` workspace with proper configuration
- Fetch problem details from LeetCode
- Generate `0001_two_sum/two_sum.ts` with the problem description and starter code
- Generate `0001_two_sum/two_sum.test.ts` with basic test setup

### 2. Start Coding

```bash
cd typescript/0001_two_sum
# Edit two_sum.ts to implement your solution
```

### 3. Run Tests

```bash
cd typescript
npm test  # Runs all tests
# or
npm test 0001_two_sum/two_sum.test.ts  # Run specific test
```

## 📖 Usage

### Commands

#### `fetch <problem-slug> --language <lang> [--force]`

Fetch a LeetCode problem and create exercise files.

```bash
leetkick fetch binary-search --language typescript
leetkick fetch valid-parentheses --language python
leetkick fetch reverse-linked-list --language java

# Overwrite existing exercise
leetkick fetch two-sum --language typescript --force
```

**Options:**
- `<problem-slug>`: LeetCode problem slug (e.g., "two-sum", "binary-search")
- `--language, -l`: Programming language (see supported languages below)
- `--force, -f`: Overwrite existing exercise if it already exists

**Duplicate Handling:**
If you try to fetch a problem you've already solved, the CLI will:
- ❌ **Warn you** that the exercise already exists
- 💡 **Show options** for what to do next
- 🛡️ **Protect your work** by not overwriting without permission
- ⚡ **Allow override** with the `--force` flag if you want to start fresh

#### `init <language>`

Initialize a language workspace manually.

```bash
leetkick init typescript
leetkick init python
```

#### `help [command]`

Show help information.

```bash
leetkick help
leetkick help fetch
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
│   ├── 0001_two_sum/
│   │   ├── two_sum.ts        # Your solution
│   │   └── two_sum.test.ts   # Test cases
│   ├── 0704_binary_search/
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
leetkick fetch two-sum --language typescript

# 2. Navigate to the generated code
cd typescript/0001_two_sum
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

## 🔧 Development & Contributing

### Building from Source

After cloning the repository:

```bash
npm run build     # or npm run compile
```

### Development Workflow

```bash
# Testing
npm test              # Run all tests (unit + integration)
npm run test:unit     # Run only unit tests
npm run test:integration  # Run only integration tests
npm run test:watch    # Run tests in watch mode

# Code Quality
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

### Adding New Language Support

The easiest way to contribute is by adding new language templates! The CLI automatically discovers new languages from the `templates/` directory.

#### Step-by-Step Guide

1. **Create the language directory:**
   ```bash
   mkdir templates/python
   ```

2. **Add configuration files** (language workspace setup):
   ```bash
   # Example for Python
   templates/python/
   ├── requirements.txt          # Dependencies
   ├── pytest.ini              # Test configuration  
   ├── .gitignore              # Language-specific ignores
   └── pyproject.toml          # Modern Python config (optional)
   ```

3. **Create template files** with placeholders:

   **`templates/python/exercise_template.py`:**
   ```python
   """
   [__PROBLEM_ID__] __PROBLEM_TITLE__
   
   __PROBLEM_DESC__
   
   Difficulty: __PROBLEM_DIFFICULTY__
   """
   
   __PROBLEM_DEFAULT_CODE__
   ```

   **`templates/python/test_template.py`:**
   ```python
   import pytest
   from __EXERCISE_FILE_NAME__ import __PROBLEM_NAME_FORMATTED__
   
   def test___PROBLEM_NAME_FORMATTED__():
       # TODO: Add test cases based on problem examples
       assert 1 == 1
   ```

4. **Update file operations** (if needed) in `src/utils/file-operations.ts`:
   ```typescript
   // Add to getLanguageSlug() if LeetCode uses different slug
   python: 'python3',
   
   // Add to getFileExtension()
   python: 'py',
   
   // Add to getTestFileName() for language conventions
   python: `test_${problemName}.${ext}`,
   ```

5. **Test your new language:**
   ```bash
   npm run compile
   npm link  # For local development
   leetkick fetch two-sum --language python
   ```

#### Template Placeholders Reference

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `__PROBLEM_ID__` | LeetCode problem number | `1` |
| `__PROBLEM_TITLE__` | Problem title | `Two Sum` |
| `__PROBLEM_DESC__` | Problem description (HTML cleaned) | `Given an array...` |
| `__PROBLEM_DIFFICULTY__` | Difficulty level | `Easy` |
| `__PROBLEM_DEFAULT_CODE__` | Starter code from LeetCode | `function twoSum(...)` |
| `__PROBLEM_NAME_FORMATTED__` | Function name (camelCase) | `twoSum` |
| `__EXERCISE_FILE_NAME__` | Generated file name | `two_sum.py` |

#### Language-Specific Conventions

**File Naming:**
- TypeScript: `problem_name.ts`, `problem_name.test.ts`
- Python: `problem_name.py`, `test_problem_name.py`
- Java: `ProblemName.java`, `ProblemNameTest.java`
- Go: `problem_name.go`, `problem_name_test.go`

**Example: Complete Python Template**

```bash
templates/python/
├── requirements.txt
├── pytest.ini
├── exercise_template.py
└── test_template.py
```

**`requirements.txt`:**
```
pytest>=7.0.0
```

**`pytest.ini`:**
```ini
[tool:pytest]
testpaths = .
python_files = test_*.py
python_functions = test_*
```

Once you create the templates, the CLI will automatically discover Python as an available language!

## 📝 License

MIT

## 🙏 Acknowledgments

- Inspired by the original [charliesbot/leetcode_cli](https://github.com/charliesbot/leetcode_cli) Rust implementation
- Built with [Google TypeScript Style (gts)](https://github.com/google/gts)
- Uses LeetCode's GraphQL API for problem fetching

---

**Happy Coding!** 🚀 Start practicing with organized, testable LeetCode solutions.