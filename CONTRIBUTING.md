# Contributing to Kora

Thank you for your interest in contributing to Kora! This document provides guidelines and information for contributors.

## Philosophy

Kora is built on the principle: **"Architectural correctness by default."**

When contributing, keep in mind:

- Kora is a **language**, not a framework
- Output should be **standard TypeScript/JavaScript**
- **Convention over configuration**
- **Compile-time safety** over runtime flexibility

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Run tests:
   ```bash
   npm test
   ```

## Project Structure

```
kora/
├── src/           # Source code
│   ├── parser.ts  # Parser implementation
│   ├── compiler.ts # Compiler implementation
│   ├── types.ts   # Type definitions
│   └── cli.ts     # CLI interface
├── grammar/       # Grammar specifications
├── examples/      # Example Kora code
└── dist/          # Compiled output
```

## Areas for Contribution

### Phase 1: Language Core (Current Focus)

- [ ] Complete parser implementation
- [ ] Full tokenizer/lexer
- [ ] Type system implementation
- [ ] Compiler to TypeScript

### Phase 2: Backend

- [ ] API route generation
- [ ] Input validation
- [ ] Error handling

### Phase 3: UI

- [ ] JSX compilation
- [ ] React component generation
- [ ] Next.js integration

### Phase 4: Ecosystem

- [ ] Package manager
- [ ] IDE support
- [ ] Documentation

## Code Style

- Use TypeScript strict mode
- Follow existing code style
- Add comments for complex logic
- Keep functions focused and small

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test edge cases

## Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request with a clear description

## Questions?

Feel free to open an issue for questions or discussions.


