# TypeScript LeetCode Practice

This workspace is configured for solving LeetCode problems in TypeScript.

## Setup
- **Vitest** for testing and test runner
- **ESLint** with TypeScript support for code quality
- **Prettier** for consistent code formatting
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

## Generated Code Examples

Each problem generates solution and test files with the problem description and starter code:

**Solution file (`TwoSum.ts`):**
```typescript
/*
 * [1] Two Sum
 * Given an array of integers nums and an integer target...
 * Difficulty: Easy
 */
export function twoSum(nums: number[], target: number): number[] {
    // Your solution here
    return [];
}
```

**Test file (`TwoSum.test.ts`):**
```typescript
import { test, expect } from 'vitest';
import { twoSum } from './TwoSum.ts';

test('twoSum', () => {
  // TODO: Add test cases
  expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
});
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

# Type checking
npx tsc --noEmit

# Lint and format code
npm run lint          # Check for linting issues
npm run lint:fix      # Fix linting issues automatically
npm run format        # Format code with Prettier
npm run format:check  # Check if code is formatted
```