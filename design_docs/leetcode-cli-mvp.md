# LeetCode CLI MVP {#leetcode-cli-mvp}

**Author(s):** Charlie  
**Status:** Draft  
**Last Updated:** Jul 21, 2025

## Table of Contents

1. [Summary](#summary)
2. [Context](#context)
3. [Detailed Design](#detailed-design)
   - [Proposed Solution 1: Simple CLI with Core Features](#proposed-solution-1)
   - [Proposed Solution 2: Plugin-based Architecture](#proposed-solution-2)
   - [Proposed Solution 3: Web-based Interface](#proposed-solution-3)
4. [Testing and Validation](#testing-and-validation)
5. [Future Considerations](#future-considerations)

---

## Summary {#summary}

A TypeScript-based command-line interface (CLI) tool that helps developers set up and organize LeetCode exercises in a monorepo structure with language-specific configurations. The MVP will focus on scaffolding new exercises with proper testing setup per programming language.

## Context {#context}

LeetCode practice requires consistent setup and organization across multiple programming languages. A CLI tool would streamline the workflow by allowing developers to:

- Quickly scaffold new exercise templates with proper directory structure
- Set up language-specific testing frameworks (e.g., Vitest for TypeScript, pytest for Python)
- Maintain consistent organization across a monorepo
- Run tests across different languages with unified commands

This is a restart of a previous project, focusing on delivering a simple, functional MVP using TypeScript with monorepo management.

## Detailed Design {#detailed-design}

### Proposed Solution 1: Simple CLI with Core Features {#proposed-solution-1}

A straightforward CLI tool for scaffolding LeetCode exercises with language-specific testing setups, organized by programming language at the root level.

**Core Commands:**
- `leetcode fetch <problem-slug> --language=<lang>` - Fetch problem from LeetCode and create exercise
- `leetcode test <problem-id> --language=<lang>` - Run tests for specific problem
- `leetcode init <language>` - Manually initialize language workspace

**Fetch Workflow:**
1. **Fetch from LeetCode**: Use GraphQL API to get problem details (title, description, code snippets)
2. **Check language setup**: If `<language>/` directory doesn't exist, initialize from templates
3. **Create problem directory**: Generate folder with problem-specific name
4. **Template replacement**: Fill placeholders with fetched data and generate files

**LeetCode GraphQL Integration:**
- **Endpoint**: `https://leetcode.com/graphql`
- **Query**: Fetch problem by `titleSlug` (e.g., "two-sum")
- **Response**: Problem metadata, code snippets per language, test cases

**Repository Structure:**
```
├── python/
│   ├── requirements.txt
│   └── two_sum/
│       ├── solution.py
│       └── test_solution.py
├── typescript/
│   ├── package.json
│   ├── vitest.config.ts
│   └── two-sum/
│       ├── solution.ts
│       └── solution.test.ts
├── java/
│   ├── pom.xml
│   └── two-sum/
│       ├── Solution.java
│       └── SolutionTest.java
├── go/
│   ├── go.mod
│   └── two_sum/
│       ├── solution.go
│       └── solution_test.go
└── rust/
    ├── Cargo.toml
    └── two_sum/
        ├── lib.rs
        └── tests.rs
```

**Language-Specific Build Tools:**
- **Python**: pytest (no build needed, instant execution)
- **TypeScript**: Vitest + tsx for immediate testing
- **Java**: Maven with JUnit for testing
- **Go**: Built-in `go test` command
- **Rust**: Cargo with built-in testing

**Architecture:**
- TypeScript with Node.js CLI
- Commander.js for command parsing
- GraphQL client for LeetCode API integration
- Template-based extensible language system
- Language templates in `templates/<language>/` directories
- File system operations for scaffolding from templates
- No monorepo tooling - each language uses its native conventions

**Template Structure:**
```
templates/
├── typescript/
│   ├── package.json              # Language workspace setup
│   ├── vitest.config.ts          # Test configuration
│   ├── tsconfig.json             # TypeScript compiler config
│   ├── .prettierrc.json          # Code formatting rules
│   ├── exercise_template.ts      # Problem solution template
│   └── test_template.ts          # Test file template
├── python/
│   ├── requirements.txt          # Dependencies
│   ├── pytest.ini               # Test configuration
│   ├── exercise_template.py      # Problem solution template
│   └── test_template.py          # Test file template
├── java/
│   ├── pom.xml                   # Maven configuration
│   ├── ExerciseTemplate.java     # Problem solution template
│   └── TestTemplate.java        # Test file template
└── go/
    ├── go.mod                    # Go module definition
    ├── exercise_template.go      # Problem solution template
    └── test_template.go          # Test file template
```

**Extensibility:**
- Adding new language = create `templates/<language>/` with all required files
- CLI auto-discovers available languages from templates directory
- Templates include both config files and code templates with placeholders
- Placeholder system uses `__PLACEHOLDER__` format (e.g., `__PROBLEM_NAME__`, `__PROBLEM_ID__`)

**Template File Types:**
- **Config files**: Copied once during language initialization (package.json, tsconfig.json, etc.)
- **Template files**: Used for each problem with placeholder replacement (*_template.* files)

| Pros | Cons |
| ---- | ---- |
| Simple to implement and understand | Limited to scaffolding only |
| Fast development time | No problem fetching from LeetCode API |
| No monorepo complexity | Manual problem setup |
| Language-native testing | Each language workspace separate |
| Instant playground per language | No cross-language coordination |

### Proposed Solution 2: Plugin-based Architecture {#proposed-solution-2}

A more extensible CLI with plugin support for different coding platforms and features.

**Architecture:**
- Core CLI framework
- Plugin system for different platforms (LeetCode, HackerRank, etc.)
- Configuration system
- Extensible command structure

| Pros | Cons |
| ---- | ---- |
| Highly extensible | Over-engineered for MVP |
| Future-proof design | Longer development time |
| Supports multiple platforms | Added complexity |
| Community contributions possible | More dependencies |

### Proposed Solution 3: Web-based Interface {#proposed-solution-3}

A hybrid approach with a local web server providing a browser-based interface.

**Architecture:**
- Express.js server
- React frontend
- REST API for problem management
- Database for local storage

| Pros | Cons |
| ---- | ---- |
| Rich user interface | Not a true CLI tool |
| Better visualization | Requires browser |
| Easier to implement complex features | More complex deployment |
| Modern development experience | Higher resource usage |

---

## Testing and Validation {#testing-and-validation}

**MVP Testing Strategy:**
- Unit tests for core functions using Jest
- Integration tests for API calls
- CLI command testing with mock data
- Manual testing with real LeetCode problems

**Test Coverage:**
- Problem fetching and parsing
- Local file operations
- Command-line argument parsing
- Error handling and edge cases

**Validation Metrics:**
- Successful problem fetch rate
- Command execution time
- Error rate and handling
- User workflow completion time

---

## Future Considerations {#future-considerations}

**Excluded from MVP:**
- Multiple language support (start with JavaScript/TypeScript only)
- Advanced analytics and progress tracking
- Integration with IDEs
- Social features (sharing solutions, discussions)
- Complex caching mechanisms

**Considered but not implemented:**
- Database storage (using file system for simplicity)
- Authentication persistence (require login each session)
- Advanced filtering and search
- Custom test case creation

**Trade-offs:**
- Chose simplicity over extensibility for faster MVP delivery
- File-based storage over database for reduced complexity
- Limited language support to focus on core functionality
- Basic error handling over comprehensive validation

---