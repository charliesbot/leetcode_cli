# C++ LeetCode Practice

This workspace is configured for solving LeetCode problems in C++.

## Setup
- **Catch2** for testing (bundled single-header)
- **clang-format** for code formatting (Google C++ style)  
- **C++17** standard

## Prerequisites

Make sure you have a C++ compiler installed:

### macOS
```bash
xcode-select --install
```

### Linux
```bash
# Ubuntu/Debian
sudo apt install build-essential

# CentOS/RHEL
sudo yum groupinstall "Development Tools"
```

## Generated Code Examples

Each problem generates solution and test files with the problem description and starter code:

**Solution file (`two_sum.cpp`):**
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

**Test file (`two_sum.test.cpp`):**
```cpp
#define CATCH_CONFIG_MAIN
#include "../catch_amalgamated.hpp"
#include "two_sum.cpp"

TEST_CASE("twoSum", "[two_sum]") {
    Solution solution;
    vector<int> nums = {2, 7, 11, 15};
    vector<int> result = solution.twoSum(nums, 9);
    
    REQUIRE(result.size() == 2);
    REQUIRE(result[0] == 0);
    REQUIRE(result[1] == 1);
}
```

## Usage

```bash
# Run tests for a specific problem
leetkick test two-sum --language cpp

# Or manually compile and run
cd problem_0001
g++ -std=c++17 two_sum.test.cpp -o test_runner && ./test_runner

# Format code
clang-format -i *.cpp
```