# Go LeetCode Practice

This workspace is configured for solving LeetCode problems in Go.

## Setup
- **Built-in testing** with `go test`
- **Go modules** for dependency management
- **Go 1.21+** for modern language features

## Prerequisites

Make sure you have Go installed:

### macOS
```bash
# Using Homebrew
brew install go

# Or download from golang.org
```

### Linux
```bash
# Ubuntu/Debian
sudo apt install golang-go

# Or download from golang.org
```

### Windows
Download from [golang.org](https://golang.org/dl/)

## Project Structure

```
go/
├── go.mod                    # Module definition
├── problem_0001/             # Each problem is its own package
│   ├── solution.go           # Solution implementation
│   └── solution_test.go      # Test cases
├── problem_0704/
│   ├── solution.go
│   └── solution_test.go
└── ...
```

## Generated Code Examples

Each problem generates solution and test files:

**Solution file (`solution.go`):**
```go
/*
 * [1] Two Sum
 * Given an array of integers nums and an integer target...
 * Difficulty: Easy
 */

package problem_0001

func twoSum(nums []int, target int) []int {
    // Your solution here
    return []int{}
}
```

**Test file (`solution_test.go`):**
```go
package problem_0001

import "testing"

func TestTwoSum(t *testing.T) {
    result := twoSum([]int{2, 7, 11, 15}, 9)
    expected := []int{0, 1}
    
    // TODO: Add proper assertions
    if len(result) != len(expected) {
        t.Errorf("Expected %v, got %v", expected, result)
    }
}
```

## Usage

```bash
# Run tests for a specific problem
leetkick test two-sum --language go

# Or manually run tests
cd problem_0001
go test

# Run tests with verbose output
go test -v

# Run all tests in the workspace
go test ./...

# Format code
go fmt ./...

# Vet code for potential issues
go vet ./...
```

## Tips

- Use `make([]int, 0)` or `[]int{}` for empty slices
- Remember Go's zero values: `0` for ints, `""` for strings, `nil` for slices/maps
- Use `fmt.Printf` for debugging: `fmt.Printf("Debug: %+v\n", variable)`
- Go has excellent built-in data structures: slices, maps, channels
- Consider using `strings` package for string manipulation problems
- Use `sort` package for sorting problems