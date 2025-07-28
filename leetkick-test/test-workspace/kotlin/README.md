# LeetKick Kotlin Workspace

This workspace is configured for solving LeetCode problems in Kotlin.

## Requirements

- JDK 17 or higher
- (Optional) IntelliJ IDEA or Android Studio for IDE support

## Project Structure

```
kotlin/
├── src/
│   ├── main/kotlin/         # Solutions
│   │   └── problem0001/     # Package per problem
│   │       └── TwoSum.kt
│   └── test/kotlin/         # Tests
│       └── problem0001/
│           └── TwoSumTest.kt
└── build/                   # Build output (git ignored)
```

## Commands

Run all tests:
```bash
./gradlew test
```

Run specific problem tests:
```bash
./gradlew test --tests "problem0001.*"
```

Run with detailed output:
```bash
./gradlew test --info
```

Clean build:
```bash
./gradlew clean
```

## IDE Setup

Open this `kotlin/` directory directly in IntelliJ IDEA or Android Studio. The IDE will automatically import the Gradle project.

## Test Framework

Tests use JUnit 5 with AssertJ for fluent assertions:

```kotlin
import org.junit.jupiter.api.Test
import org.assertj.core.api.Assertions.assertThat

class ExampleTest {
    @Test
    fun `should solve the problem`() {
        assertThat(solution.solve()).isEqualTo(expected)
    }
}
```