# LeetKick CLI Tool

A TypeScript CLI for scaffolding LeetCode exercises with language-specific testing setups. Fetches problems from LeetCode's GraphQL API and generates solution + test files using templates.

## Bash Commands

- `npm run build`: Compile TypeScript and copy templates to build/ 
- `npm run compile`: TypeScript compilation only
- `npm run test`: Run all tests (unit + integration) then lint
- `npm run test:unit`: Run unit tests only
- `npm run test:integration`: Run CLI integration tests only  
- `npm run test:watch`: Run tests in watch mode
- `npm run lint`: Check code style with gts
- `npm run fix`: Auto-fix linting issues
- `npm run format`: Format code with prettier
- `npm run dev`: Run CLI in development mode with tsx

## Project Structure

- `src/commands/`: CLI command implementations (add.ts, fetch.ts, init.ts, test.ts)
- `src/utils/`: Core utilities (leetcode-api.ts, templates.ts, workspace.ts, file-operations.ts)
- `src/types/`: TypeScript type definitions
- `templates/`: Language-specific templates (typescript/, cpp/, kotlin/)
- `test/`: Unit and integration tests with excellent coverage
- `build/`: Compiled output with templates copied over

## Architecture

- **Commands**: Each CLI command is a separate Commander.js file in src/commands/
- **Templates**: Language templates use placeholders like `__PROBLEM_TITLE__`, `__CLASS_NAME__`, `__PROBLEM_PACKAGE__`
- **API**: Uses LeetCode's GraphQL API for fetching problems and code snippets
- **Workspace**: Projects have `.leetkick.json` config file for workspace detection
- **Language-Specific Logic**: Follows each language's conventions (Kotlin uses src/main/kotlin structure, others are flat)

## Template System

- Each language directory in `templates/` contains:
  - `exercise_template.*` and `test_template.*` (required)
  - Config files (package.json, build.gradle.kts, etc.)
  - `README.md` with language-specific setup instructions
- Placeholders vary by language needs (e.g., `__PROBLEM_PACKAGE__` for Kotlin packages)
- Template replacement handles HTML cleaning, name formatting (camelCase, PascalCase, snake_case)
- Function names extracted from LeetCode code snippets using language-specific regex

## Code Style

- Uses Google TypeScript Style (gts)
- ES modules (import/export) syntax  
- Async/await for promises
- Commander.js for CLI parsing
- Descriptive error messages with context

## Testing Strategy

- **Unit tests**: Test individual functions (templates.test.ts, file-operations.test.ts)
- **Integration tests**: Test full CLI workflows (cli-integration.test.ts)
- Excellent test coverage for template generation, name formatting, file operations
- Tests run against built CLI in `build/src/index.js`
- Always run `npm run lint` after tests (automated in npm scripts)

## Agent Collaboration Guidelines

### Planning and Agreement Phase
- **CRITICAL**: Do not write any code until reaching explicit agreement on the implementation plan
- Start with understanding requirements and exploring the codebase
- Present a clear, detailed plan before implementation
- Wait for user confirmation and approval of the plan
- Clarify any ambiguities or missing requirements upfront
- Use TodoWrite tool to track agreed-upon tasks

### Implementation Approach
- Break complex tasks into smaller, manageable steps
- Implement incrementally with frequent validation
- Follow existing code patterns and conventions strictly
- Test each component as you build it
- Keep the user informed of progress and any deviations from plan

### Quality Assurance
- Run tests after each significant change
- Use `npm run lint` to ensure code style compliance
- Verify template generation works end-to-end
- Test IDE compatibility for applicable languages (Kotlin, Java)
- Validate against existing integration tests

## Development Workflow

### Template Development
- Manual testing is crucial: `leetkick fetch two-sum --language <lang>` 
- For TypeScript/C++: Test fetch + test cycle repeatedly
- For Kotlin: Also open generated project in IntelliJ to verify IDE recognition
- Update both main README.md and language-specific template README.md files

### Testing Changes
- Run `npm run test` for comprehensive validation
- Use `npm run dev` for development CLI testing
- Build process copies templates to build/ and makes binary executable
- Manual testing often needed alongside unit tests

### Quality Gates
- `npm test` (unit + integration tests + lint)
- Manual CLI testing for template generation
- Verify IDE compatibility for languages that need it (Kotlin, Java)

## Language Support

- **TypeScript**: Vitest testing, flat structure
- **C++**: Catch2 testing (bundled), flat structure, compile with g++
- **Kotlin**: JUnit 5 + Gradle, Maven-style src/main/kotlin structure, prefers `./gradlew` over `gradle`
- Each language follows its ecosystem's conventions and IDE expectations
- LeetCode provides code snippets for all supported languages

## Common Workflows

### Adding New Language
1. Create `templates/<language>/` directory
2. Add required template files: `exercise_template.*`, `test_template.*`, `README.md`
3. Include config files (package.json, build.gradle.kts, etc.)
4. Test template generation manually: `leetkick fetch <problem> --language <new-lang>`
5. Verify IDE/tooling compatibility if applicable
6. Update main README.md and add language-specific documentation

### Debugging Issues
- Check workspace detection: ensure `.leetkick.json` exists
- Verify template files exist and have correct placeholders
- Test template replacement with manual `leetkick fetch`
- For build issues: check that templates are copied to build/
- Language-specific: verify directory structure matches expectations

### Testing Template Changes
- Run unit tests: `npm run test:unit`
- Manual fetch testing: create workspace, fetch problem, run tests
- For Kotlin/Java: open in IDE to verify project structure
- Check that generated files compile and tests run

## File Operations

- Workspace detection walks up directories looking for `.leetkick.json`
- Problem matching supports: exact name, padded numbers (0001), slugs
- Template replacement handles multiple naming conventions per language
- Special handling for Kotlin package structure vs flat structure for others

## Important Notes

### Versioning
- Uses semantic versioning, but since highly experimental, major changes bump minor version (0.3.0 → 0.4.0)
- **Version sync issue**: package.json version vs CLI hardcoded version in src/index.ts need to stay in sync
- Update both when bumping versions

### Documentation
- Documentation split: main README.md vs language-specific template README.md files
- CLI binary: `build/src/index.js` with Node.js shebang
- Build process: TypeScript compilation + template copying + executable permissions

### Testing Commands by Language
- TypeScript: `npx vitest run`
- C++: `g++ -I.. -std=c++17 *.test.cpp -o test_runner && ./test_runner`
- Kotlin: `./gradlew test --tests <package>.*` (or `gradle` if gradlew not available)