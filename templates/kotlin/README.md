# LeetKick Kotlin Workspace

This workspace is configured for solving LeetCode problems in Kotlin.

## Requirements

- **JDK 17 or higher** (uses your system's installed JDK)
- (Optional) IntelliJ IDEA or Android Studio for IDE support

**Note:** This project will use whatever JDK version you have installed. While we officially support JDK 17+, it may work with older versions.

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

## Generated Code Examples

Each problem generates solution and test files with the problem description and starter code:

**Solution file (`TwoSum.kt`):**
```kotlin
package problem0001

/**
 * [1] Two Sum
 * Given an array of integers nums and an integer target...
 * Difficulty: Easy
 */
class Solution {
    fun twoSum(nums: IntArray, target: Int): IntArray {
        // Your solution here
        return intArrayOf()
    }
}
```

**Test file (`TwoSumTest.kt`):**
```kotlin
package problem0001

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*

class TwoSumTest {
    private val solution = Solution()

    @Test
    fun `should solve twoSum`() {
        val nums = intArrayOf(2, 7, 11, 15)
        val result = solution.twoSum(nums, 9)
        
        assertArrayEquals(intArrayOf(0, 1), result)
    }
}
```

## Test Framework

Tests use JUnit 5 with standard assertions. You can also use AssertJ for fluent assertions:

```kotlin
import org.assertj.core.api.Assertions.assertThat

assertThat(solution.solve()).isEqualTo(expected)
```