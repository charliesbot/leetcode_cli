# TypeScript LeetCode Practice

This workspace uses:
- **Vitest** for testing and test runner
- **Prettier** for code formatting
- **TypeScript** for type safety and modern JavaScript features

## Prerequisites

Make sure you have Node.js 18+ installed:

### macOS/Linux
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### Windows
Download from [nodejs.org](https://nodejs.org/) or use:
```bash
# Using winget
winget install OpenJS.NodeJS
```

## Usage

```bash
# Run tests for a specific problem
leetkick test two-sum --language typescript

# Or manually run tests
cd problem_0001
npm test

# Run tests in watch mode
npx vitest
```

## Development

```bash
# Install dependencies (if needed)
npm install

# Type checking
npx tsc --noEmit

# Format code
npx prettier --write *.ts
```