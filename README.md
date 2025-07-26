# LeetKick

A modern CLI tool for scaffolding LeetCode exercises with language-specific testing setups. Fetch problems, auto-generate boilerplate, and start coding immediately!

## Quick Demo

```bash
# Setup once
leetkick init my-practice && cd my-practice
leetkick add typescript

# Use daily 
leetkick fetch two-sum --language typescript    # Auto-generates solution + test files
leetkick test two-sum --language typescript     # Run tests instantly

# Or use C++
leetkick fetch two-sum --language cpp          # Auto-generates C++ solution + test files
leetkick test two-sum --language cpp           # Compile and run tests instantly
```

**What you get:** Ready-to-code files with problem description, starter code, and test setup. No configuration needed!

## Features

- **Fetch problems directly from LeetCode** - no copy/paste needed
- **Auto-scaffolding** - solution + test files generated instantly  
- **Clean organization** - problems organized by language and number
- **Zero-config testing** - just run `leetkick test` from anywhere
- **Smart problem matching** - run tests by number, slug, or name
- **Extensible** - easily add new language support

## Installation

**Prerequisites:** Node.js 18+

### Option 1: Install from npm (Recommended)

```bash
npm install -g leetkick

# Verify installation
leetkick --help
```

### Option 2: Build from source

```bash
git clone https://github.com/charliesbot/leetkick.git
cd leetkick
npm install
npm run compile
npm link

# Verify installation
leetkick --help
```

## Getting Started

```bash
# 1. Create workspace
mkdir my-practice && cd my-practice
leetkick init

# 2. Add language support
leetkick add typescript
# OR: leetkick add cpp

# 3. Fetch your first problem
leetkick fetch two-sum --language typescript
# OR: leetkick fetch two-sum --language cpp

# 4. Start coding!
cd typescript/0001_two_sum  # OR: cd cpp/0001_two_sum
# Edit 0001_two_sum.ts with your solution (OR: 0001_two_sum.cpp)
# Edit 0001_two_sum.test.ts to add real test cases (OR: 0001_two_sum.test.cpp)

# 5. Test your solution  
leetkick test two-sum --language typescript
# OR: leetkick test two-sum --language cpp
```

**That's it!** Your solution and test files are auto-generated with problem description and starter code.

## Command Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `init [dir]` | Create workspace | `leetkick init my-practice` |
| `add <lang>` | Add language support | `leetkick add typescript` |
| `fetch <problem> -l <lang>` | Get LeetCode problem | `leetkick fetch two-sum -l typescript` |
| `test <problem> -l <lang>` | Run tests | `leetkick test 1 -l typescript` |
| `help [cmd]` | Show help | `leetkick help fetch` |

### Key Features

**Smart Problem Matching**
```bash
leetkick test 1 -l typescript           # By number
leetkick test two-sum -l typescript     # By slug  
leetkick test 0001_two_sum -l typescript # By exact name
```

**Works Anywhere**
Run commands from any directory in your workspace - no need to navigate to specific folders.

**Safe Overwrites**  
CLI warns before overwriting existing solutions. Use `--force` to override.

<details>
<summary><strong>Detailed Command Options</strong></summary>

#### `fetch` options
- `--language, -l`: Programming language (required)
- `--force, -f`: Overwrite existing exercise

#### `test` options  
- `--language, -l`: Programming language (required)
- Finds problems flexibly by number, slug, or exact directory name

#### `init` options
- `[directory]`: Optional directory name (creates if doesn't exist)

</details>

### Supported Languages

- **TypeScript** - Ready to use with Vitest testing framework
- **C++** - Ready to use with Catch2 testing framework (bundled)
- **Python, Java, Go, Rust** - Coming soon!

#### Prerequisites

**C++ Requirements:**
- **macOS**: Xcode command line tools (`xcode-select --install`)
- **Linux**: Build essentials (`sudo apt install build-essential` or equivalent)
- Any C++17-compatible compiler (g++, clang++)

## Project Structure

After using the CLI, your project will look like this:

```
your-project/
├── .leetkick.json            # Workspace configuration
├── README.md                 # Workspace documentation
├── .gitignore                # Git ignore rules
├── typescript/
│   ├── package.json          # TypeScript workspace config
│   ├── tsconfig.json         # TypeScript compiler config
│   ├── .prettierrc.json      # Code formatting rules
│   ├── .gitignore            # Git ignore rules
│   ├── 0001_two_sum/
│   │   ├── two_sum.ts        # Your solution
│   │   └── two_sum.test.ts   # Test cases
│   ├── 0704_binary_search/
│   │   ├── binary_search.ts
│   │   └── binary_search.test.ts
│   └── ...
├── cpp/
│   ├── catch_amalgamated.hpp # Catch2 testing framework (bundled)
│   ├── .clang-format         # Code formatting rules
│   ├── .gitignore            # Git ignore rules
│   ├── README.md             # C++ workspace documentation
│   ├── 0001_two_sum/
│   │   ├── 0001_two_sum.cpp      # Your solution
│   │   └── 0001_two_sum.test.cpp # Test cases
│   ├── 0704_binary_search/
│   │   ├── 0704_binary_search.cpp
│   │   └── 0704_binary_search.test.cpp
│   └── ...
├── python/                   # Future: Python workspace
├── java/                     # Future: Java workspace
└── ...
```

## What You Get

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
import { test, expect } from 'vitest';
import { twoSum } from './two_sum.ts';

test('twoSum', () => {
  // TODO: Add test cases
  expect(1).toBe(1);
});
```

**Generated C++ solution file (`0001_two_sum.cpp`):**
```cpp
/*
 * [1] Two Sum
 * Given an array of integers nums and an integer target...
 * Difficulty: Easy
 */
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your solution here
        return {};
    }
};
```

**Generated C++ test file (`0001_two_sum.test.cpp`):**
```cpp
#define CATCH_CONFIG_MAIN
#include "../catch_amalgamated.hpp"
#include "0001_two_sum.cpp"

TEST_CASE("twoSum", "[0001_two_sum]") {
    // TODO: Add test cases
    REQUIRE(1 == 1);
}
```

Then just:
1. Implement your solution in the solution file
2. Add real test cases in the test file
3. Run `leetkick test two-sum --language <language>` to verify
4. Success!

---

## Development

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
npm run compile       # Build TypeScript to JavaScript
npm run test          # Run all tests
npm run lint          # Check code style
npm run fix           # Auto-fix style issues
```

---

## Contributing

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
<summary><strong>Detailed Guide: Adding Language Support</strong></summary>

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

## License

MIT

## Acknowledgments

- Inspired by the original [charliesbot/leetcode_cli](https://github.com/charliesbot/leetcode_cli) Rust implementation
- Built with [Google TypeScript Style (gts)](https://github.com/google/gts)
- Uses LeetCode's GraphQL API for problem fetching

---

**Happy Coding!** Start practicing with organized, testable LeetCode solutions.