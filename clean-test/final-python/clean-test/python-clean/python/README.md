# Python LeetCode Workspace

## Setup

### Prerequisites
- Python 3.8 or higher

### Installation
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Running Tests

```bash
# Run all tests
pytest

# Run specific problem tests
pytest tests/problem_0001/

# Run with coverage
pytest --cov=src
```

## Code Quality

```bash
# Format code
ruff format

# Lint code
ruff check --fix

# Type checking
mypy src/
```

## Development Workflow

```bash
# Run all quality checks
ruff format && ruff check --fix && mypy src/ && pytest
```

## Project Structure

```
workspace/
├── src/
│   └── problem_XXXX/
│       ├── __init__.py
│       └── solution_name.py
└── tests/
    └── problem_XXXX/
        ├── __init__.py
        └── test_solution_name.py
```

Each problem is organized in its own package with the problem ID for easy navigation.