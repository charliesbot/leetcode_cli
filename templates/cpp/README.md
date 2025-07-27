# C++ LeetCode Practice

This workspace uses:
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

## Usage

```bash
# Run tests for a specific problem
leetkick test two-sum --language cpp

# Or manually compile and run
cd problem_0001
g++ -std=c++17 two_sum.test.cpp -o test_runner && ./test_runner
```

## Code Style

Format your code with clang-format:
```bash
clang-format -i *.cpp
```