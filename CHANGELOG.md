# Changelog

All notable changes to the Kora programming language will be documented in this file.

## [0.1.0] - 2024-12-19

### Added

#### Core Language
- **Tokenizer/Lexer** - Full tokenization implementation for Kora source code
  - Supports all keywords, operators, literals
  - Handles strings, numbers, identifiers
  - JSX token support
  - Comment support (line and block)

- **Parser** - Complete parsing implementation
  - Domain module parsing
  - API module parsing
  - UI/Page module parsing
  - Type annotation parsing (primitives, custom, generics, optional)
  - Expression parsing with operator precedence
  - Statement parsing (variable, assignment, return, if, for)
  - JSX element parsing
  - Block and parameter list parsing

- **Compiler** - Full compilation to TypeScript
  - Domain modules → TypeScript interfaces
  - API modules → TypeScript types and handler functions
  - Page modules → React components with load functions
  - Expression compilation
  - JSX compilation to React JSX
  - Type mapping (Kora types → TypeScript types)

#### CLI
- `kora new <name>` - Create new Kora project
- `kora build` - Build project (placeholder)
- `kora dev` - Development server (placeholder)
- `kora check <file>` - Check Kora code for errors
- `kora compile <file>` - Compile single file to TypeScript

#### Documentation
- Official README manifesto
- Grammar specification (BNF)
- Keywords reference
- CLI documentation
- Publishing strategy guide
- Quick start guide
- Contributing guidelines
- Code of conduct

#### Legal
- Apache 2.0 License
- Code of Conduct
- Contributing guidelines

#### Project Structure
- TypeScript configuration
- npm package configuration
- Example files
- Proper .gitignore and .npmignore

### Technical Details

#### Tokenizer Features
- Handles all Kora keywords
- Supports string literals (single and double quotes)
- Number literals (integers and floats)
- Operator tokenization
- JSX-specific tokens
- Proper error reporting with line/column numbers

#### Parser Features
- Recursive descent parser
- Operator precedence handling
- Expression parsing (binary, unary, function calls, member access)
- JSX parsing with attributes and children
- Type system parsing (primitives, custom, generics, optional)
- Statement parsing (all control flow constructs)

#### Compiler Features
- TypeScript code generation
- React component generation
- JSX to React JSX conversion
- Type mapping (String → string, UUID → string, etc.)
- Proper indentation and formatting

### Status

**Phase 1: Language Core** - ✅ Complete
- [x] Grammar definition
- [x] Language keywords
- [x] Tokenizer implementation
- [x] Parser implementation
- [x] Compiler implementation
- [x] Type system
- [x] CLI foundation

**Next Steps (Phase 2)**
- [ ] Full build system
- [ ] Development server with hot reload
- [ ] File watching
- [ ] Error recovery
- [ ] Better error messages
- [ ] Source maps

---

## Notes

This is the initial release of Kora. The language is in **Phase 1 (Language Core)** and is **not yet ready for production use**.

The compiler can parse and compile basic Kora code to TypeScript, but many features are still in development.


