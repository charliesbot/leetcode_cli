# LeetCode CLI

This CLI tool sets up a [Bazel](https://bazel.build/) monorepo for LeetCode exercises.
It's built for simplicity and reproducibility, letting you tackle problems in multiple
languages all in one place.

Bazel handles the sandboxing, and the CLI sorts out configs for each language.
No fuss with setting up your local dev environment – it's all taken care of.

## Installation

### Prerequisites

- Rust and Cargo (latest stable version)

### Building from Source

1. Clone the repository:

   ```
   git clone https://github.com/charliesbot/leetcode_cli
   cd leetcode-cli
   ```

2. Build the project:

   ```
   cargo build --release
   ```

### Adding to PATH

For easier access, you can add the CLI to your PATH. Add the following function to your `.bashrc` or `.zshrc`:

```bash
leetcode-cli() {
    cargo run --manifest-path="$HOME/path/to/leetcode-cli/Cargo.toml" -- "$@"
}
```

Replace `$HOME/path/to/leetcode-cli` with the actual path where you clone this project.

After adding this, source your shell configuration file or restart your terminal.

## Usage

LeetCode CLI provides two main commands: `init` and `fetch`.

### Initialize a LeetCode workspace

To set up a new LeetCode practice workspace:

```
leetcode-cli init [PATH]
```

If `PATH` is not specified, it will use the current directory.

### Fetch a LeetCode problem

To fetch a LeetCode problem and create exercise files:

```
leetcode-cli fetch <problem-id-or-slug> <language>
```

For example:

```
leetcode-cli fetch two-sum ts
```

### Running Tests

After fetching a problem, the CLI will provide instructions on
how to run the associated test using Bazel.

For example:

```
Run `bazel test //typescript:0001_two_sum_test`
```

## Language-Specific Instructions

Each language directory in the monorepo comes with its own README.

Check these READMEs for the nitty-gritty on working with each language in the Bazel setup.

## Supported Languages

- TypeScript
- More languages comming in the future!
