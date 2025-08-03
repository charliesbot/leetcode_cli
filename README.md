# LeetKick

A modern CLI tool for scaffolding LeetCode exercises with language-specific testing setups. Fetch problems, auto-generate boilerplate, and start coding immediately!

> **🚧 Heads up!**  
> LeetKick is still pretty new and changing fast. Things might break between updates as I add support for more programming languages. Once it hits v1.0, it'll be much more stable!

## Features

- **Fetch problems directly from LeetCode** - no copy/paste needed
- **Auto-scaffolding** - solution + test files generated instantly
- **Clean organization** - problems organized by language and number
- **Zero-config testing** - just run `leetkick test` from anywhere
- **Smart problem matching** - run tests by number, slug, or name
- **Multi-language support** - 5 languages supported, 10+ planned (goal: all LeetCode languages)

## Quick Start

```bash
# Setup once
leetkick init my-practice && cd my-practice
leetkick add typescript

# Use daily
leetkick fetch two-sum --language typescript    # Auto-generates solution + test files
leetkick test two-sum --language typescript     # Run tests instantly
```

**What you get:** Ready-to-code files with problem description, starter code, and test setup. No configuration needed!

## Installation

**Prerequisites:** Node.js 18+

```bash
# Install from npm (recommended)
npm install -g leetkick

# Or build from source
git clone https://github.com/charliesbot/leetkick.git
cd leetkick && npm install && npm run compile && npm link

# Verify installation
leetkick --help
```

## Language Support

Our goal is to support all languages that LeetCode offers. Here's our current progress:

| Language       | Status           | Testing Framework | Formatter    | Linter         | Notes                           |
| -------------- | ---------------- | ----------------- | ------------ | -------------- | ------------------------------- |
| **TypeScript** | ✅ **Supported** | Vitest            | Prettier     | —              | Full support with type checking |
| **C++**        | ✅ **Supported** | Catch2 (bundled)  | clang-format | —              | C++17 standard                  |
| **Kotlin**     | ✅ **Supported** | JUnit 5 + Gradle  | —            | —              | Full Gradle integration         |
| **Java**       | ✅ **Supported** | JUnit 5 + Gradle  | —            | —              | Full Gradle integration         |
| **Rust**       | ✅ **Supported** | cargo test        | —            | —              | Rust 2021 edition               |
| **Python**     | 🚧 **Planned**   | —                 | —            | —              | Coming soon                     |
| **JavaScript** | 🚧 **Planned**   | —                 | —            | —              | Coming soon                     |
| **Go**         | 🚧 **Planned**   | —                 | —            | —              | Coming soon                     |
| **C**          | 🚧 **Planned**   | —                 | —            | —              | Coming soon                     |
| **C#**         | 🚧 **Planned**   | —                 | —            | —              | Coming soon                     |
| **Ruby**       | 🚧 **Planned**   | —                 | —            | —              | Coming soon                     |
| **Swift**      | 🚧 **Planned**   | —                 | —            | —              | Coming soon                     |
| **Scala**      | 🚧 **Planned**   | —                 | —            | —              | Coming soon                     |
| **PHP**        | 🚧 **Planned**   | —                 | —            | —              | Coming soon                     |
| **Dart**       | 🚧 **Planned**   | —                 | —            | —              | Coming soon                     |

**Legend:**

- ✅ **Supported** - Full integration with templates, testing, and tooling
- 🚧 **Planned** - On our roadmap, contributions welcome!

Each supported language workspace includes setup instructions, prerequisites, and testing guides in its own README.

## Command Reference

| Command                             | Purpose              | Example                                        |
| ----------------------------------- | -------------------- | ---------------------------------------------- |
| `init [dir]`                        | Create workspace     | `leetkick init my-practice`                    |
| `add <lang>`                        | Add language support | `leetkick add typescript`                      |
| `fetch <problem> --language <lang>` | Get LeetCode problem | `leetkick fetch two-sum --language typescript` |
| `test <problem> --language <lang>`  | Run tests            | `leetkick test 1 --language typescript`        |
| `help [cmd]`                        | Show help            | `leetkick help fetch`                          |

### Advanced Features

**Smart Problem Matching**

```bash
leetkick test 1 --language typescript           # By number
leetkick test two-sum --language typescript     # By slug
leetkick test problem0001 --language typescript # By exact package name
```

**Works Anywhere:** Run commands from any directory in your workspace  
**Safe Overwrites:** CLI warns before overwriting existing solutions. Use `--force` to override  
**Shortcuts:** Use `-l` instead of `--language`, `-f` instead of `--force`

## Project Structure

After using the CLI, your project will be organized by language:

```
your-project/
├── .leetkick.json            # Workspace configuration
├── typescript/               # TypeScript workspace
│   ├── problem_0001/
│   │   ├── TwoSum.ts         # Your solution
│   │   └── TwoSum.test.ts    # Test cases
│   └── problem_0704/
│       ├── BinarySearch.ts
│       └── BinarySearch.test.ts
├── cpp/                      # C++ workspace
│   ├── problem_0001/
│   │   ├── two_sum.cpp       # Your solution
│   │   └── two_sum.test.cpp  # Test cases
│   └── catch_amalgamated.hpp # Bundled testing framework
├── kotlin/                   # Kotlin workspace
│   ├── src/main/kotlin/      # Solutions
│   │   └── problem0001/TwoSum.kt
│   ├── src/test/kotlin/      # Tests
│   │   └── problem0001/TwoSumTest.kt
│   └── build.gradle.kts      # Gradle configuration
└── ...
```

Each language workspace includes all necessary configuration files, testing frameworks, and formatting rules.

## What You Get

Each problem generates solution and test files with:

- Problem description and difficulty
- LeetCode starter code
- Test framework setup ready to use
- Language-specific project structure

**Workflow:** Implement solution → Add test cases → Run `leetkick test` → Success!

## Troubleshooting

**Installation Issues:**

- Ensure Node.js 18+ is installed: `node --version`
- Clear npm cache: `npm cache clean --force`
- Use `npm install -g leetkick --force` to reinstall

**Command Issues:**

- Run `leetkick --help` to verify installation
- Check you're in a leetkick workspace (contains `.leetkick.json`)
- Use full problem names if short names don't work

**Language Issues:**

- Check language-specific README for setup instructions and prerequisites
- Ensure required compilers/runtimes are installed

**Update LeetKick:**

```bash
npm update -g leetkick
leetkick --version
```

---

## Contributing

We'd love your contributions! Here's how to help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/awesome-feature`
3. Make your changes following the existing code style
4. Run tests: `npm test` and linting: `npm run lint`
5. Submit a pull request

### Development Setup

```bash
git clone https://github.com/charliesbot/leetkick.git
cd leetkick && npm install && npm run compile && npm link
```

**Commands:** `npm run compile` (build) | `npm test` (test) | `npm run lint` (style check)

### Adding New Language Support

Add new language templates easily:

1. Create `templates/<language>/` directory
2. Add `exercise_template.*` and `test_template.*` files with placeholders
3. Include config files (package.json, requirements.txt, etc.)
4. CLI automatically discovers new languages!

**Template placeholders:** `__PROBLEM_ID__`, `__PROBLEM_TITLE__`, `__PROBLEM_DESC__`, `__PROBLEM_DEFAULT_CODE__`, etc.

See existing templates in `templates/` for examples.

## License

MIT

## Acknowledgments

- Inspired by the original [charliesbot/leetcode_cli](https://github.com/charliesbot/leetcode_cli) Rust implementation
- Built with [Google TypeScript Style (gts)](https://github.com/google/gts)
- Uses LeetCode's GraphQL API for problem fetching

---

**Happy Coding!** Start practicing with organized, testable LeetCode solutions.
