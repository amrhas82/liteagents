# Publishing Guide - liteagents

This guide documents how to publish liteagents to npm and Claude Code marketplaces.

---

## Table of Contents

1. [Quick Publishing](#quick-publishing)
2. [Publishing to npm](#publishing-to-npm)
3. [Publishing to Claude Code Marketplace](#publishing-to-claude-code-marketplace)
4. [Version Management](#version-management)
5. [Troubleshooting](#troubleshooting)

---

## Quick Publishing

### Publish to npm

```bash
# Using the publish script
./scripts/publish.sh

# Or directly
npm publish --access public
```

**Requirements:**
- Logged into npm: `npm login`
- All changes committed to git
- Package validation passes: `npm run validate`

---

## Publishing to npm

### Prerequisites

- npm account (create at https://www.npmjs.com/signup)
- Access to the `liteagents` package
- All changes committed to git

### Publishing Process

#### 1. Login to npm

```bash
npm login
```

#### 2. Validate Package

```bash
npm run validate
```

This checks:
- ✅ All manifest files exist and are valid JSON
- ✅ Variant configurations are correct
- ✅ All required files are present
- ✅ CLI script has proper shebang

#### 3. Publish

```bash
./scripts/publish.sh
```

Or manually:
```bash
npm publish --access public
```

#### 4. Verify Publication

Check your package page:
- https://www.npmjs.com/package/liteagents

Test installation:
```bash
npm install -g liteagents
liteagents --help
```

---

## Publishing to Claude Code Marketplace

### Current Options (2025)

Claude Code doesn't have a centralized official Anthropic marketplace yet. There are three distribution methods:

### Option 1: Direct GitHub Installation ⭐ (Recommended)

Users can install directly from GitHub without marketplace approval:

```
/plugin add github:hamr0/liteagents
```

**No submission required!** Works as soon as you push to GitHub.

**Requirements:**
- ✅ Repository must be public
- ✅ `.claude-plugin/` directory with manifests
- ✅ All plugin files in repository root

### Option 2: Create Your Own Marketplace

Host your own marketplace catalog: `.claude-plugin/marketplace.json`

```json
{
  "name": "liteagents Official",
  "owner": "hamr0",
  "description": "Lightweight CLI agents for development",
  "plugins": [
    {
      "name": "liteagents",
      "source": "github:hamr0/liteagents",
      "description": "Lightweight deterministic CLI agents"
    }
  ]
}
```

Users install via:
```
/plugin marketplace add github:hamr0/liteagents
```

### Option 3: Submit to Community Marketplaces

**claudecodecommands.directory** (Largest Community Marketplace)

1. Visit: https://claudecodecommands.directory/submit
2. Fill out submission form
3. Wait for review (1-3 days)
4. Users can then search and install

---

## Version Management

### Using npm version command

```bash
# Update version
npm version patch  # 2.4.0 -> 2.4.1 (bug fixes)
npm version minor  # 2.4.0 -> 2.5.0 (new features)
npm version major  # 2.4.0 -> 3.0.0 (breaking changes)
```

### Complete Release Process

```bash
# 1. Update version
npm version patch  # or minor/major

# 2. Update CHANGELOG.md
# Add release notes for this version

# 3. Commit and tag
git add .
git commit -m "Bump version to 2.4.1"
git tag v2.4.1
git push origin main --tags

# 4. Publish to npm
./scripts/publish.sh

# 5. Verify
# Check npm: https://www.npmjs.com/package/liteagents
```

---

## Troubleshooting

### npm Issues

#### Error: 403 Forbidden - Package name taken
```
npm error 403 You do not have permission to publish
```

**Solution:** Package name is taken. Choose a different name or use scoped: `@username/package-name`

#### Error: 402 Payment Required
```
npm error 402 You must sign up for private packages
```

**Solution:** Add `--access public` flag:
```bash
npm publish --access public
```

#### Error: Not logged in
```
npm error need auth
```

**Solution:**
```bash
npm login
```

### Validation Issues

#### Validation Fails

**Problem:** `npm run validate` reports errors

**Solutions:**
- Check manifest files have correct agent/skill counts
- Ensure all agent files exist in `agents/` directory
- Verify all skill directories exist in `skills/`
- Check cli.js has shebang and is executable

#### GitHub Install Not Working

**Problem:** Users can't install via `/plugin add github:hamr0/liteagents`

**Checklist:**
- [ ] Repository is public
- [ ] `.claude-plugin/` directory exists
- [ ] Manifests are valid JSON
- [ ] All files are pushed to GitHub

---

## Distribution Checklist

Before publishing a new release:

- [ ] All tests pass
- [ ] `npm run validate` succeeds
- [ ] Version bumped with `npm version`
- [ ] CHANGELOG.md updated
- [ ] README.md reflects current features
- [ ] All changes committed to git
- [ ] Git tag created (`v2.x.x`)
- [ ] Changes pushed to GitHub with tags
- [ ] Published to npm: `./scripts/publish.sh`
- [ ] Verified npm installation: `npm install -g liteagents`
- [ ] Verified GitHub installation: `/plugin add github:hamr0/liteagents`

---

## Package URLs

After publishing, your package will be available at:

- **npm:** https://www.npmjs.com/package/liteagents
- **GitHub Repository:** https://github.com/hamr0/liteagents

## Support & Resources

- **npm Documentation:** https://docs.npmjs.com/cli/v10/commands/npm-publish
- **Claude Code Plugin Docs:** https://docs.claude.com/en/docs/claude-code/plugin-marketplaces

---

**Last Updated:** January 2025
