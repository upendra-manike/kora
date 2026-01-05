# Stratum Rebranding Analysis

## Research Findings

### ✅ "Stratum" Name Availability

**Good News**: "Stratum" is **NOT** used as a general-purpose programming language name.

**Existing Uses of "Stratum"**:
- ✅ **Stratum Networks** - Network solutions company (different domain)
- ✅ **Stratum Mining** - Cryptocurrency mining protocol (different domain)
- ✅ **Stratum Systems** - AI governance platform (different domain)
- ✅ **Stratum (Open Networking)** - Switch operating system (different domain)
- ✅ **Stratum Logic** - Software consulting (different domain)

**Conclusion**: No direct conflict with a programming language. The name is available for a programming language.

---

### ⚠️ File Extension ".st" Conflicts

**CRITICAL ISSUE**: The `.st` extension is **already used** by:

1. **Structured Text (.st)** - Programming language for Programmable Logic Controllers (PLCs)
   - Industrial automation
   - Used in Siemens, Allen-Bradley systems
   - Well-established in manufacturing

2. **Smalltalk (.st)** - Object-oriented programming language
   - Classic programming language
   - Still in use today
   - Has dedicated community

3. **SuperCollider (.st)** - Audio programming language
   - Used for sound synthesis
   - Niche but established

**Impact**: Using `.st` will cause:
- ❌ Editor syntax highlighting conflicts
- ❌ File association issues
- ❌ Developer confusion
- ❌ Search engine confusion

---

## Recommendations

### Option 1: Keep "Stratum", Change Extension ⭐ (Recommended)

**Name**: Stratum  
**Extension**: `.stratum` or `.stm`

**Pros**:
- ✅ Unique, no conflicts
- ✅ Clearly identifies the language
- ✅ Professional appearance

**Cons**:
- ⚠️ Longer extension (but acceptable)

**Examples**:
- `user.stratum`
- `get-user.stm`

---

### Option 2: Keep "Stratum", Use `.str`

**Name**: Stratum  
**Extension**: `.str`

**Pros**:
- ✅ Short and clean
- ✅ Less common extension
- ✅ Easy to type

**Cons**:
- ⚠️ Might conflict with "string" files in some contexts
- ⚠️ Less descriptive

---

### Option 3: Alternative Names with `.st`

If you really want `.st` extension:

1. **Stratify** + `.st` → `.sfy` (better)
2. **Stratix** + `.st` → `.stx` (better)
3. **Stratos** + `.st` → `.sos` (better)

---

## Final Recommendation

### ✅ **Stratum with `.stratum` extension**

**Why**:
1. ✅ Name "Stratum" is available for programming languages
2. ✅ `.stratum` extension is unique and descriptive
3. ✅ No conflicts with existing technologies
4. ✅ Professional and clear
5. ✅ Easy to search for

**Example Files**:
```
domain/
  - user.stratum
  - product.stratum

api/
  - get-user.stratum
  - create-product.stratum

ui/
  - user-profile.stratum
  - product-list.stratum
```

---

## Rebranding Checklist

### Phase 1: Core Changes
- [ ] Update package.json name: `@stratum-lang/stratum`
- [ ] Update npm package name
- [ ] Change file extension from `.kora` to `.stratum`
- [ ] Update tokenizer to recognize `.stratum` files
- [ ] Update parser/compiler references
- [ ] Update CLI commands and messages

### Phase 2: Documentation
- [ ] Update README.md
- [ ] Update all documentation files
- [ ] Update tutorial examples
- [ ] Update sample projects
- [ ] Update website/docs

### Phase 3: Repository & Distribution
- [ ] Rename GitHub repository (or create new)
- [ ] Update GitHub organization/username
- [ ] Update npm package
- [ ] Update GitHub Pages site
- [ ] Update all links and references

### Phase 4: Marketing
- [ ] Update website domain (if applicable)
- [ ] Update social media handles
- [ ] Create migration guide for existing users
- [ ] Announce rebrand

---

## Migration Path for Existing Users

If there are existing Kora users:

1. **Deprecation Period**: Keep `@kora-lang/kora` package with deprecation notice
2. **Migration Tool**: Create script to convert `.kora` files to `.stratum`
3. **Documentation**: Clear migration guide
4. **Support**: Help users transition

---

## Domain & Package Availability

**Check These**:
- [ ] `stratum-lang.com` / `.dev` / `.io`
- [ ] `@stratum-lang/stratum` on npm
- [ ] `stratum-lang` GitHub organization
- [ ] Twitter/X handle `@stratumlang`
- [ ] Trademark search (if planning commercial use)

---

## Next Steps

1. **Decide on file extension**: `.stratum` (recommended) or `.str`
2. **Check domain/package availability**
3. **Start Phase 1 rebranding** (core changes)
4. **Test thoroughly** before public release
5. **Announce rebrand** with migration guide

---

## Quick Start: Rebranding Commands

```bash
# 1. Update package.json
npm pkg set name="@stratum-lang/stratum"
npm pkg set description="Stratum - A full-stack programming language"

# 2. Rename files (example)
find . -name "*.kora" -exec sh -c 'mv "$1" "${1%.kora}.stratum"' _ {} \;

# 3. Update all references
# Use find/replace: kora → stratum, .kora → .stratum
```

---

**Recommendation**: Use **Stratum** with **`.stratum`** extension for maximum clarity and zero conflicts! 🎯

