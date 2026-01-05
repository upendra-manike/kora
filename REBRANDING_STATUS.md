# Stratum Rebranding Status

## ✅ Completed

### Core Source Files
- ✅ `package.json` - Updated name, bin command, description, keywords, URLs
- ✅ `src/cli.ts` - All commands updated (kora → stratum, .kora → .stratum)
- ✅ `src/build.ts` - File extension changed (.kora → .stratum)
- ✅ `src/dev.ts` - Watcher pattern and messages updated
- ✅ `src/parser.ts` - Comments updated
- ✅ `src/compiler.ts` - Comments updated
- ✅ `src/tokenizer.ts` - Comments updated

### Key Changes Made
- Package name: `@kora-lang/kora` → `@stratum-lang/stratum`
- CLI command: `kora` → `stratum`
- File extension: `.kora` → `.stratum`
- Function names: `findKoraFiles` → `findStratumFiles`
- All user-facing messages updated

---

## 🔄 Remaining Work

### Documentation Files (Need Update)
- [ ] `README.md`
- [ ] `TUTORIAL.md`
- [ ] `APPLICATION_TYPES.md`
- [ ] `ARCHITECTURE_PATTERNS.md`
- [ ] `RUNTIME_ARCHITECTURE.md`
- [ ] `USE_CASES.md`
- [ ] `GETTING_STARTED.md`
- [ ] `QUICKSTART.md`
- [ ] All files in `docs/` directory
- [ ] All files in `samples/` directory
- [ ] All files in `examples/` directory
- [ ] All files in `demo/` directory

### Configuration Files
- [ ] `.github/workflows/*.yml` (if any reference Kora)
- [ ] Any CI/CD configuration files

### Sample Projects
- [ ] Rename all `.kora` files to `.stratum` in:
  - `samples/` directory
  - `examples/` directory
  - `demo/` directory
  - `tmp/` directory

---

## 🔧 Quick Update Script

To update all documentation files, you can use find/replace:

```bash
# Find all files with "kora" or "Kora" references
find . -type f \( -name "*.md" -o -name "*.html" -o -name "*.json" \) \
  -not -path "./node_modules/*" \
  -not -path "./dist/*" \
  -exec grep -l -i "kora" {} \;

# Replace in files (be careful - review first!)
# find . -type f \( -name "*.md" -o -name "*.html" \) \
#   -not -path "./node_modules/*" \
#   -not -path "./dist/*" \
#   -exec sed -i '' 's/kora/stratum/g' {} \;
#   -exec sed -i '' 's/Kora/Stratum/g' {} \;
#   -exec sed -i '' 's/KORA/STRATUM/g' {} \;
#   -exec sed -i '' 's/\.kora/\.stratum/g' {} \;
```

---

## 📋 Manual Updates Needed

### High Priority
1. **README.md** - Main project readme
2. **docs/index.html** - Website homepage
3. **TUTORIAL.md** - Main tutorial

### Medium Priority
4. All sample projects
5. All example files
6. Documentation in `docs/` directory

### Low Priority
7. Internal documentation
8. Comments in test files

---

## 🎯 Next Steps

1. **Update README.md** - Critical for first impressions
2. **Update docs/index.html** - Website needs to reflect new name
3. **Update TUTORIAL.md** - Main learning resource
4. **Rename sample files** - Change `.kora` to `.stratum`
5. **Test compilation** - Ensure everything still works
6. **Update npm package** - Publish new package name

---

## ⚠️ Important Notes

- **Don't forget**: Update GitHub repository name/organization
- **Don't forget**: Update npm package (may need new package)
- **Don't forget**: Update all external links
- **Test thoroughly**: Make sure compilation still works
- **Backup**: Consider keeping old package for migration period

---

**Status**: Core rebranding complete ✅ | Documentation pending 🔄

