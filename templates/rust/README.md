# Rust LeetCode Practice

This workspace is configured for solving LeetCode problems in Rust.

## Setup
- **cargo test** for running tests
- **rustfmt** for code formatting  
- **clippy** for linting and best practices
- **Rust 2021 edition** for modern language features

## Prerequisites

Make sure you have Rust installed:

### macOS/Linux/Windows
```bash
# Using rustup (recommended)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Or visit https://rustup.rs/
```

## Generated Code Examples

Each problem generates solution and test files with the problem description and starter code:

**Solution file (`lib.rs`):**
```rust
/*
 * [1] Two Sum
 * Given an array of integers nums and an integer target...
 * Difficulty: Easy
 */

impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        // Your solution here
        vec![]
    }
}
```

**Test file (included in `lib.rs`):**
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_two_sum() {
        assert_eq!(Solution::two_sum(vec![2, 7, 11, 15], 9), vec![0, 1]);
    }
}
```

## Usage

```bash
# Run tests for a specific problem
leetkick test two-sum --language rust

# Or manually run tests
cd problem_0001
cargo test

# Run tests with output
cargo test -- --nocapture

# Format code
cargo fmt

# Run linter
cargo clippy

# Build in release mode
cargo build --release
```

## Tips

- Use `Vec<T>` for dynamic arrays
- Use `String` for owned strings, `&str` for string slices
- Remember to handle edge cases (empty inputs, single elements, etc.)
- Rust's ownership system prevents many common bugs - embrace it!
- Use `HashMap` from `std::collections` for hash table problems
- Consider using `BTreeMap` when order matters