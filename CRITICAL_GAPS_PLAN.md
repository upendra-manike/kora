# Critical Gaps - Implementation Plan

This document outlines the plan to address all critical gaps before production readiness.

---

## 1. Test Suite 🔴 CRITICAL

### Current Status
- ❌ Zero tests
- ❌ No test framework
- ❌ No CI/CD

### Implementation Plan

#### Phase 1: Test Infrastructure (Week 1)
```bash
# Setup
npm install --save-dev vitest @vitest/ui
npm install --save-dev @types/node
```

**Files to Create:**
- `vitest.config.ts` - Test configuration
- `tests/` directory structure
- `.github/workflows/test.yml` - CI/CD

#### Phase 2: Unit Tests (Week 2-3)
- [ ] `tests/tokenizer.test.ts` - Tokenizer tests
- [ ] `tests/parser.test.ts` - Parser tests  
- [ ] `tests/compiler.test.ts` - Compiler tests
- [ ] `tests/types.test.ts` - Type system tests

#### Phase 3: Integration Tests (Week 4)
- [ ] `tests/integration/compile.test.ts` - Full compilation
- [ ] `tests/integration/samples.test.ts` - Sample projects
- [ ] `tests/integration/cli.test.ts` - CLI commands

**Target Coverage:** 80%+

---

## 2. Incomplete CLI 🟡 HIGH PRIORITY

### Current Status
- ❌ `kora build` - Not implemented (TODO)
- ❌ `kora dev` - Not implemented (TODO)

### Implementation Plan

#### 2.1: `kora build` Command

**Requirements:**
- Compile all `.kora` files in project
- Handle dependencies between files
- Generate TypeScript output
- Generate CSS files
- Create proper directory structure

**Implementation:**
```typescript
// src/cli.ts - build command
.command('build')
.description('Build Kora project to TypeScript/JavaScript')
.option('-o, --out <dir>', 'Output directory', 'dist')
.option('-w, --watch', 'Watch for changes')
.action(async (options) => {
  // 1. Find all .kora files
  // 2. Parse dependencies
  // 3. Compile in order
  // 4. Write output files
})
```

**Files to Modify:**
- `src/cli.ts` - Add build implementation
- `src/build.ts` - New file for build logic

**Timeline:** 1 week

#### 2.2: `kora dev` Command

**Requirements:**
- Watch for file changes
- Incremental compilation
- Fast rebuilds
- Clear error messages

**Implementation:**
```typescript
// src/cli.ts - dev command
.command('dev')
.description('Start development server with hot reload')
.option('-p, --port <port>', 'Port number', '3000')
.action(async (options) => {
  // 1. Initial build
  // 2. Watch for changes
  // 3. Incremental compilation
  // 4. Show compilation status
})
```

**Dependencies:**
- `chokidar` - File watching
- `chalk` - Colored output

**Timeline:** 1 week

---

## 3. Type Checking System 🟡 HIGH PRIORITY

### Current Status
- ❌ No type validation
- ❌ No type inference
- ❌ No cross-module type resolution

### Implementation Plan

#### Phase 1: Type Collector (Week 1)
- Collect all type definitions from domain modules
- Build type registry
- Resolve type references

#### Phase 2: Type Validator (Week 2)
- Validate field types
- Check type compatibility
- Validate function signatures

#### Phase 3: Type Inference (Week 3)
- Infer types from expressions
- Type narrowing
- Generic type resolution

**Files to Create:**
- `src/type-checker.ts` - Type checking logic
- `src/type-registry.ts` - Type registry
- `src/type-inference.ts` - Type inference

**Timeline:** 3 weeks

---

## 4. Import System 🟡 HIGH PRIORITY

### Current Status
- ❌ Cannot import from other files
- ❌ No module resolution
- ❌ No dependency management

### Implementation Plan

#### Phase 1: Import Syntax (Week 1)
```kora
// Add to grammar
import User from './domain/user.kora'
import { Post, Comment } from './domain/blog.kora'
```

#### Phase 2: Module Resolution (Week 2)
- Resolve import paths
- Handle relative/absolute paths
- Support npm packages (future)

#### Phase 3: Dependency Graph (Week 3)
- Build dependency graph
- Detect circular dependencies
- Compile in correct order

**Files to Create:**
- `src/resolver.ts` - Module resolution
- `src/dependency-graph.ts` - Dependency management

**Timeline:** 3 weeks

---

## 5. Error Handling Improvements 🟡 MEDIUM PRIORITY

### Current Status
- ⚠️ Basic error messages exist
- ❌ No suggestions
- ❌ Limited context

### Implementation Plan

#### Improvements:
1. **Better Error Messages**
   - Show code snippet with error
   - Highlight exact location
   - Show surrounding context

2. **Suggestions**
   - "Did you mean...?" for typos
   - Common mistake detection
   - Auto-fix suggestions

3. **Error Categories**
   - Syntax errors
   - Type errors
   - Semantic errors
   - Import errors

**Files to Modify:**
- `src/parser.ts` - Better parse errors
- `src/compiler.ts` - Better compile errors
- `src/errors.ts` - New error types

**Timeline:** 2 weeks

---

## 6. Performance Testing 🟡 MEDIUM PRIORITY

### Current Status
- ❌ No benchmarks
- ❌ Unknown performance

### Implementation Plan

#### Setup:
1. **Benchmark Suite**
   - Compilation speed
   - Memory usage
   - Large file handling

2. **Performance Monitoring**
   - Track compilation time
   - Memory profiling
   - Identify bottlenecks

3. **Optimization**
   - Optimize hot paths
   - Add caching
   - Incremental compilation

**Files to Create:**
- `benchmarks/` - Benchmark suite
- `scripts/benchmark.ts` - Benchmark runner

**Timeline:** 2 weeks

---

## 7. Security Audit 🟡 MEDIUM PRIORITY

### Current Status
- ❌ No security review
- ❌ No dependency audit

### Implementation Plan

#### Steps:
1. **Dependency Audit**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Code Review**
   - Input validation
   - XSS prevention
   - Injection attacks
   - File system access

3. **Security Tools**
   - Snyk
   - Dependabot
   - CodeQL

**Timeline:** 1 week

---

## Implementation Priority

### Sprint 1 (Weeks 1-2): Foundation
1. ✅ Test suite infrastructure
2. ✅ Basic unit tests
3. ✅ `kora build` command

### Sprint 2 (Weeks 3-4): Core Features
1. ✅ `kora dev` command
2. ✅ Integration tests
3. ✅ Basic type checking

### Sprint 3 (Weeks 5-6): Advanced Features
1. ✅ Import system
2. ✅ Type inference
3. ✅ Error handling improvements

### Sprint 4 (Weeks 7-8): Quality
1. ✅ Performance testing
2. ✅ Security audit
3. ✅ Documentation updates

---

## Success Metrics

- [ ] Test coverage > 80%
- [ ] All CLI commands functional
- [ ] Type checking catches errors
- [ ] Import system works
- [ ] Error messages helpful
- [ ] Performance benchmarks pass
- [ ] Security audit clean

---

## Next Steps

1. Start with test suite (foundation)
2. Complete CLI commands (usability)
3. Add type checking (safety)
4. Implement imports (scalability)
5. Improve errors (DX)
6. Performance & security (quality)

---

**Estimated Total Time:** 8 weeks (2 months)

