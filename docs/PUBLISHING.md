# Publishing Guide - Agentic Kit

This guide documents how to publish the Agentic Kit plugin to npm and Claude Code marketplaces.

---

## Table of Contents

1. [Publishing to npm](#publishing-to-npm)
2. [Publishing to Claude Code Marketplace](#publishing-to-claude-code-marketplace)
3. [Version Management](#version-management)
4. [Troubleshooting](#troubleshooting)

---

## Publishing to npm

### Prerequisites

- npm account (create at https://www.npmjs.com/signup)
- Access to the `@amrhas82/agentic-kit` package
- All changes committed to git

### Step-by-Step Process

[agentic-kit npx listing](https://www.npmjs.com/package/@amrhas82/agentic-kit)


#### 0. Publishing to npm

- **npm page:** https://www.npmjs.com/package/@amrhas82/agentic-kit

   ```bash
cd ~/PycharmProjects/agentic-kit

# Login to npm (if not already logged in)
npm login

# Publish package
npm publish --access public

After publishing, users will be able to:

#via npx
- npx @amrhas82/agentic-kit standard
- npx @amrhas82/agentic-kit --variant=lite
- npx @amrhas82/agentic-kit --variant=pro

@ or shorter
- npx agentic-kit standard
- npx agentic-kit --variant=lite
- npx agentic-kit --variant=pro

   ```

#### 1. Login to npm

```bash
npm login
```

Enter your npm credentials when prompted.

#### 2. Validate Package

Run the pre-publish validation script:

```bash
npm run validate
```

This checks:
- ✅ All manifest files exist and are valid JSON
- ✅ Variant configurations are correct (Lite: 3 agents/0 skills, Standard: 13 agents/8 skills, Pro: 13 agents/14 skills)
- ✅ All required files are present
- ✅ CLI script has proper shebang and is executable

Fix any errors before proceeding.

#### 3. Test Package Contents

Preview what will be published:

```bash
npm pack --dry-run
```

This shows all files that will be included in the package.

#### 4. Publish to npm

**For scoped packages, you MUST use `--access public`:**

```bash
npm publish --access public
```

#### 5. Verify Publication

Check your package page:
- https://www.npmjs.com/package/@amrhas82/agentic-kit

Test installation:

```bash
# Test from outside the repo
cd /tmp
npx @amrhas82/agentic-kit --help
npx agentic-kit --variant=lite
```

### Common npm Publishing Errors

#### Error: 403 Forbidden - Package name taken
```
npm error 403 You do not have permission to publish "agentic-kit"
```

**Solution:** Use a scoped package name instead:
```json
{
  "name": "@your-username/agentic-kit"
}
```

#### Error: 402 Payment Required
```
npm error 402 You must sign up for private packages
```

**Solution:** Add `--access public` flag:
```bash
npm publish --access public
```

#### Error: Validation Failed
```
npm error prepublishOnly script failed
```

**Solution:** Fix validation errors reported by `npm run validate`, then try again.

---

## Publishing to Claude Code Marketplace

### Current Options (2025)

Claude Code doesn't have a centralized official Anthropic marketplace yet. There are three distribution methods:

### Option 1: Direct GitHub Installation ⭐ (Recommended - Works Immediately!)

Users can install directly from your GitHub repository without any marketplace approval:

```
/plugin add github:amrhas82/agentic-kit
```

**No submission required!** This works as soon as you push to GitHub.

**Requirements:**
- ✅ GitHub repository must be public
- ✅ Repository must contain `.claude-plugin/` directory with manifests
- ✅ All plugin files must be in the repository root

### Option 2: Create Your Own Marketplace

Host your own marketplace catalog in your repository.

#### Steps:

1. **Create marketplace manifest** at `.claude-plugin/marketplace.json`:

```json
{
  "name": "Agentic Kit Official",
  "owner": "amrhas82",
  "description": "Official marketplace for Agentic Kit plugin variants",
  "plugins": [
    {
      "name": "agentic-kit-standard",
      "source": "github:amrhas82/agentic-kit",
      "description": "Standard variant with 13 agents and 8 skills (recommended)"
    },
    {
      "name": "agentic-kit-lite",
      "source": "github:amrhas82/agentic-kit",
      "description": "Lite variant with 3 core agents for minimal dependencies"
    },
    {
      "name": "agentic-kit-pro",
      "source": "github:amrhas82/agentic-kit",
      "description": "Pro variant with all 13 agents and 14 skills for maximum capabilities"
    }
  ]
}
```

2. **Commit and push** the marketplace.json file

3. **Users install via:**
```
/plugin marketplace add github:amrhas82/agentic-kit
```

### Option 3: Submit to Community Marketplaces

Submit your plugin to community-maintained marketplaces for broader discovery:

#### claudecodecommands.directory (Largest Community Marketplace)

1. **Visit submission portal:**
   - https://claudecodecommands.directory/submit

2. **Fill out submission form** with:
   - Plugin name: `agentic-kit`
   - GitHub URL: `https://github.com/amrhas82/agentic-kit`
   - Description: Your plugin description
   - Category: Development Tools / Agents
   - Tags: agents, skills, development, product-management, agile

3. **Wait for review** (typically 1-3 days)

4. **After approval**, users can install via:
   ```
   /plugin marketplace add claudecodecommands
   # Then search for "agentic-kit"
   ```

#### Other Community Marketplaces

- **claudecodemarketplace.net** - Alternative submission portal
- Check their respective websites for submission forms

---

## Version Management

### Updating the Version

Before publishing updates:

1. **Update version in package.json:**
   ```bash
   npm version patch  # For bug fixes (1.0.0 -> 1.0.1)
   npm version minor  # For new features (1.0.0 -> 1.1.0)
   npm version major  # For breaking changes (1.0.0 -> 2.0.0)
   ```

2. **Update version in all manifest files:**
   - `.claude-plugin/plugin.json`
   - `.claude-plugin/plugin-lite.json`
   - `.claude-plugin/plugin-standard.json`
   - `.claude-plugin/plugin-pro.json`

3. **Commit changes:**
   ```bash
   git add .
   git commit -m "Bump version to X.Y.Z"
   git tag vX.Y.Z
   git push origin main --tags
   ```

4. **Publish to npm:**
   ```bash
   npm publish --access public
   ```

### Changelog Best Practices

Maintain a CHANGELOG.md file with all notable changes:

```markdown
## [1.1.0] - 2025-01-15

### Added
- New skill: Data Visualization
- CLI flag: --verbose for detailed output

### Fixed
- Variant isolation bug in Pro tier
- Documentation typos in QUICK-START.md

### Changed
- Updated README installation instructions
```

---

## Troubleshooting

### Validation Fails

**Problem:** `npm run validate` reports errors

**Solutions:**
- Check all manifest files have correct agent/skill counts
- Ensure all agent files exist in `agents/` directory
- Verify all skill directories exist in `skills/`
- Check cli.js has shebang (`#!/usr/bin/env node`) and is executable

### GitHub Install Not Working

**Problem:** Users can't install via `/plugin add github:amrhas82/agentic-kit`

**Checklist:**
- [ ] Repository is public
- [ ] `.claude-plugin/` directory exists in repo root
- [ ] `plugin.json` and variant manifests are valid JSON
- [ ] All agent and skill files are present
- [ ] Latest changes are pushed to GitHub

### npm Package Not Installing

**Problem:** `npx @amrhas82/agentic-kit` fails

**Solutions:**
- Wait 5-10 minutes after publishing (npm CDN propagation)
- Check package page: https://www.npmjs.com/package/@amrhas82/agentic-kit
- Try with full version: `npx @amrhas82/agentic-kit@1.0.0`
- Clear npx cache: `rm -rf ~/.npm/_npx`

### Permission Denied on Publish

**Problem:** npm says you don't have permission

**Solutions:**
- Verify you're logged in: `npm whoami`
- Check you're using the correct account
- For scoped packages, ensure you're the owner
- Contact npm support if package was previously published by another account

---

## Distribution Checklist

Before publishing a new release:

- [ ] All tests pass
- [ ] `npm run validate` succeeds with no errors
- [ ] Version bumped in package.json and all manifests
- [ ] CHANGELOG.md updated
- [ ] README.md reflects current features
- [ ] All changes committed and pushed to GitHub
- [ ] Git tag created for version
- [ ] Published to npm with `--access public`
- [ ] Tested installation via npx
- [ ] Tested installation via GitHub direct
- [ ] Community marketplaces notified (if applicable)

---

## Support & Resources

- **npm Package:** https://www.npmjs.com/package/@amrhas82/agentic-kit
- **GitHub Repo:** https://github.com/amrhas82/agentic-kit
- **npm Documentation:** https://docs.npmjs.com/cli/v10/commands/npm-publish
- **Claude Code Plugin Docs:** https://docs.claude.com/en/docs/claude-code/plugin-marketplaces

---

**Last Updated:** November 2025
