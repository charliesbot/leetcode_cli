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

- ✅ **TypeScript** - Ready to use with Node.js built-in testing
- 🚧 **Python, Java, Go, Rust** - Coming soon!

> **Note**: Currently only TypeScript is fully supported. Other languages are planned for future releases.

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

## 🎯 What You Get

After fetching a problem, you'll have a complete setup:

**Generated solution file (`two_sum.ts`):**
```typescript
/*
 * [1] Two Sum
 * Given an array of integers nums and an integer target...
 * Difficulty: Easy
 */
export function twoSum(nums: number[], target: number): number[] {
    // Your solution here
};
```

**Generated test file (`two_sum.test.ts`):**
```typescript
import test from 'node:test';
import assert from 'node:assert';
import { twoSum } from './two_sum.ts';

test('twoSum', () => {
  // TODO: Add test cases
  assert.equal(1, 1);
});
```

Then just:
1. Implement your solution
2. Add test cases  
3. Run `npm test` to verify
4. Success! 🎉

---

## 🔧 Development

### Building from Source

```bash
git clone https://github.com/charliesbot/leetkick.git
cd leetkick
npm install
npm run build
npm link  # For global development access
```

### Development Commands

```bash
npm test              # Run all tests
npm run lint          # Check code style
npm run fix           # Auto-fix style issues
```

---

## 🤝 Contributing

Want to help make LeetKick better? We'd love your contributions!

### Quick Contribution

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/awesome-feature`
3. Make your changes following the existing code style
4. Run tests: `npm test` and linting: `npm run lint`
5. Submit a pull request

### Adding New Language Support

The easiest way to contribute is adding new language templates! 

**Quick Setup:**
1. Create `templates/<language>/` directory
2. Add `exercise_template.*` and `test_template.*` files
3. Include any config files (package.json, requirements.txt, etc.)
4. The CLI automatically discovers new languages!

<details>
<summary>📖 <strong>Detailed Guide: Adding Language Support</strong></summary>

#### Template Structure

```bash
templates/python/
├── requirements.txt          # Dependencies
├── pytest.ini              # Test configuration  
├── exercise_template.py     # Solution template
└── test_template.py         # Test template
```

#### Template Files

**`exercise_template.py`:**
```python
"""
[__PROBLEM_ID__] __PROBLEM_TITLE__

__PROBLEM_DESC__

Difficulty: __PROBLEM_DIFFICULTY__
"""

__PROBLEM_DEFAULT_CODE__
```

**`test_template.py`:**
```python
import pytest
from __EXERCISE_FILE_NAME__ import __PROBLEM_NAME_FORMATTED__

def test___PROBLEM_NAME_FORMATTED__():
    # TODO: Add test cases
    assert 1 == 1
```

#### Template Placeholders

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `__PROBLEM_ID__` | LeetCode problem number | `1` |
| `__PROBLEM_TITLE__` | Problem title | `Two Sum` |
| `__PROBLEM_DESC__` | Problem description | `Given an array...` |
| `__PROBLEM_DIFFICULTY__` | Difficulty level | `Easy` |
| `__PROBLEM_DEFAULT_CODE__` | LeetCode starter code | `function twoSum(...)` |
| `__PROBLEM_NAME_FORMATTED__` | Function name (camelCase) | `twoSum` |
| `__EXERCISE_FILE_NAME__` | Generated file name | `two_sum.py` |

#### Code Updates (if needed)

Update `src/utils/file-operations.ts` for language-specific conventions:

```typescript
// Add file extension
python: 'py',

// Add test file naming convention  
python: `test_${problemName}.${ext}`,

// Add LeetCode language slug (if different)
python: 'python3',
```

#### Testing Your Language

```bash
npm run compile
npm link
leetkick fetch two-sum --language python
```

</details>

### Architecture

- **CLI Framework**: Commander.js
- **Language**: TypeScript with Google TypeScript Style
- **API**: LeetCode GraphQL API  
- **Template System**: File-based with placeholder replacement

## 📝 License

MIT

## 🙏 Acknowledgments

- Inspired by the original [charliesbot/leetcode_cli](https://github.com/charliesbot/leetcode_cli) Rust implementation
- Built with [Google TypeScript Style (gts)](https://github.com/google/gts)
- Uses LeetCode's GraphQL API for problem fetching

---

**Happy Coding!** 🚀 Start practicing with organized, testable LeetCode solutions.