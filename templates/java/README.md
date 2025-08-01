# Java LeetCode Setup

This directory contains your LeetCode solutions in Java.

## Structure

- `src/main/java/` - Solution files organized by problem
- `src/test/java/` - Test files for each solution

## Running Tests

```bash
# Run all tests
./gradlew test

# Run tests for a specific problem
./gradlew test --tests "com.leetkick.twosum.*"

# Run with more verbose output
./gradlew test --info
```

## Requirements

- Java 11 or higher
- Gradle (included via wrapper)