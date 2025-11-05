# Migration Guide - Agentic Kit

## Overview

This guide helps you migrate from older versions of Agentic Kit to the new interactive installer system. The new system introduces variant-based installations (Lite/Standard/Pro) and improved multi-tool support.

## What's New in Version 1.2.0

### Major Changes
1. **Variant System**: Choose between Lite, Standard, or Pro packages
2. **Multi-Tool Support**: Install multiple AI tools (Claude, Opencode, Ampcode, Droid)
3. **Interactive Installer**: Step-by-step guided installation process
4. **Manifest Files**: Each installation now includes a manifest.json for tracking
5. **Resume Capability**: Interrupted installations can be resumed
6. **Rollback Support**: Failed installations automatically roll back

### File Structure Changes

**Old Structure** (< 1.2.0):
```
~/.claude/
├── agents/
├── skills/
├── resources/
└── hooks/
```

**New Structure** (>= 1.2.0):
```
~/.claude/
├── agents/
├── skills/
├── resources/
├── hooks/
└── manifest.json  ← NEW: Installation metadata
```

## Automatic Migration Detection

### How It Works

When you run the new installer, it automatically:
1. Checks for existing installations at default paths
2. Detects if they're from older versions (no manifest.json)
3. Prompts you to migrate: `"Legacy installation detected. Migrate to new installer? (Y/n)"`

### Migration Process

If you choose to migrate (`Y`), the installer will:

1. **Scan Existing Files**
   - Counts agents, skills, resources, hooks in current installation
   - Analyzes directory structure

2. **Classify Variant**
   - 3 agents, 0 skills → Classified as **Lite**
   - 13 agents, 1-8 skills → Classified as **Standard**
   - 13 agents, 9+ skills → Classified as **Pro**
   - Custom configurations → Classified as **Custom** (closest match)

3. **Create Manifest**
   - Generates manifest.json with detected configuration
   - Records file counts and paths
   - Preserves installation timestamp

4. **Preserve Customizations**
   - Existing files are not modified
   - Custom agents/skills are retained
   - User-created content is preserved

5. **Validation**
   - Verifies all files are accessible
   - Checks manifest integrity
   - Reports any issues

### Example Migration

```bash
$ node installer/cli.js

Welcome to Agentic Kit Installer v1.2.0

⚠ Legacy installation detected at ~/.claude
  Found: 13 agents, 5 skills, 1 resource, 2 hooks
  This appears to be from version < 1.2.0 (no manifest.json)

Migrate to new installer? (Y/n): y

Analyzing installation...
  ✓ Classified as: Standard variant
  ✓ All files accessible

Creating manifest...
  ✓ manifest.json created

Migration complete!
  Your installation is now compatible with v1.2.0
  You can now use upgrade/downgrade features
```

## Manual Migration

If you prefer to migrate manually or the automatic migration fails:

### Step 1: Backup Your Installation

```bash
# Backup Claude installation
cp -r ~/.claude ~/.claude.backup

# Backup other tools if installed
cp -r ~/.config/opencode ~/.config/opencode.backup
cp -r ~/.amp ~/.amp.backup
cp -r ~/.factory ~/.factory.backup
```

### Step 2: Count Your Components

```bash
# Count agents
ls ~/.claude/agents/*.md | wc -l

# Count skills
ls ~/.claude/skills/*.md 2>/dev/null | wc -l

# Count resources
ls ~/.claude/resources/* 2>/dev/null | wc -l

# Count hooks
ls ~/.claude/hooks/*.js 2>/dev/null | wc -l
```

### Step 3: Determine Your Variant

Based on component counts:
- **Lite**: 3 agents, 0 skills
- **Standard**: 13 agents, 1-8 skills
- **Pro**: 13 agents, 9+ skills

### Step 4: Create Manifest Manually

Create `~/.claude/manifest.json`:

```json
{
  "tool": "claude",
  "variant": "standard",
  "version": "1.2.0",
  "installed_at": "2025-01-15T10:00:00Z",
  "migrated_from": "legacy",
  "components": {
    "agents": 13,
    "skills": 5,
    "resources": 1,
    "hooks": 2
  },
  "paths": {
    "agents": "~/.claude/agents",
    "skills": "~/.claude/skills",
    "resources": "~/.claude/resources",
    "hooks": "~/.claude/hooks"
  },
  "files": {
    "total": 21,
    "size": "1.5MB"
  },
  "migration": {
    "from_version": "unknown",
    "migrated_at": "2025-01-15T10:00:00Z",
    "migration_type": "manual"
  }
}
```

### Step 5: Verify Migration

Run the installer to verify:

```bash
node installer/cli.js

# Installer should recognize your installation
# and offer upgrade/downgrade options
```

## Migrating Custom Configurations

### Custom Agents

If you have custom agents:

1. Keep them in the `agents/` directory
2. They will be preserved during migration
3. Update manifest.json to include them in count
4. Consider adding them to a custom variant in `variants.json`

### Custom Skills

Custom skills are preserved automatically:

1. Left in `skills/` directory
2. Counted in manifest
3. Can be used with any variant

### Custom Paths

If you installed to custom paths (not default locations):

1. Migration will detect the installation location
2. Manifest will record the custom path
3. Future upgrades will respect the custom path

Example for custom path `/custom/path/claude`:

```bash
node installer/cli.js
# When prompted, enter your custom path
# Migration will detect and preserve it
```

## Troubleshooting Migration

### Issue: Migration Not Detected

**Symptom**: Installer doesn't detect legacy installation

**Solutions**:
1. Check installation path is correct:
   ```bash
   ls ~/.claude/agents/*.md
   ```

2. Verify directory structure:
   ```bash
   find ~/.claude -type d
   ```

3. Check permissions:
   ```bash
   ls -la ~/.claude
   ```

### Issue: Variant Classification Wrong

**Symptom**: Installer classifies your installation as wrong variant

**Solution**: Manually create manifest with correct variant:
```bash
# Edit ~/.claude/manifest.json
# Change "variant" field to correct value
nano ~/.claude/manifest.json
```

### Issue: Custom Files Not Detected

**Symptom**: Custom agents/skills not counted in migration

**Solution**:
1. Ensure files have correct extensions (.md for agents/skills)
2. Verify files are in correct directories
3. Check file permissions are readable

### Issue: Migration Fails

**Symptom**: Migration process encounters errors

**Solutions**:
1. Run with verbose logging:
   ```bash
   DEBUG=* node installer/cli.js
   ```

2. Try manual migration (see above)

3. Restore from backup and try again:
   ```bash
   rm -rf ~/.claude
   cp -r ~/.claude.backup ~/.claude
   ```

4. Report issue on GitHub with error message

## Rollback to Old Version

If you need to rollback to pre-1.2.0 version:

### Option 1: Remove Manifest Only

```bash
# Remove manifest.json only
rm ~/.claude/manifest.json

# Your installation will still work with older tools
# But won't be recognized by new installer
```

### Option 2: Full Restore from Backup

```bash
# Remove new installation
rm -rf ~/.claude

# Restore backup
cp -r ~/.claude.backup ~/.claude

# Reinstall old version
npm install -g @amrhas82/agentic-kit@1.1.0
```

## Migration Checklist

Before migrating, verify:

- [ ] Backup of current installation exists
- [ ] All custom agents/skills are backed up
- [ ] Current installation is working correctly
- [ ] Have disk space for temporary files
- [ ] Node.js version is compatible (v14+)

After migrating, verify:

- [ ] manifest.json exists in installation directory
- [ ] All agents are still present
- [ ] All skills are still present
- [ ] Custom files are preserved
- [ ] Tool still works correctly
- [ ] Can run upgrade/downgrade commands

## FAQ

### Q: Will migration delete my custom agents/skills?

**A**: No. Migration preserves all existing files. It only adds a manifest.json.

### Q: Can I migrate multiple tools at once?

**A**: Yes. Run the installer once, and it will detect and migrate all legacy installations.

### Q: What if I have a very old version (< 1.0.0)?

**A**: The migration process works for all versions. Very old versions may require manual manifest creation.

### Q: Will migration affect my running tools?

**A**: No. Migration doesn't restart or modify running processes. Your tools continue working during migration.

### Q: Can I undo a migration?

**A**: Yes. Simply delete the manifest.json file to "unmigrate". Or restore from backup.

### Q: Do I need to migrate?

**A**: Not required if you're happy with your current setup. However, migration enables:
- Upgrade/downgrade between variants
- Better uninstall support
- Resume capability for updates
- Multi-tool management

### Q: Will future updates require migration?

**A**: Once migrated to v1.2.0+, future updates will use the new system. No further migrations needed.

## Support

If you encounter issues during migration:

1. **Check Documentation**: Review this guide and INSTALLER_GUIDE.md
2. **GitHub Issues**: https://github.com/amrhas82/agentic-kit/issues
3. **Debug Mode**: Run with `DEBUG=* node installer/cli.js`
4. **Manual Migration**: Follow manual migration steps above

## Version Compatibility

| Old Version | New Version | Migration | Notes |
|-------------|-------------|-----------|-------|
| < 1.0.0 | 1.2.0+ | Supported | May require manual manifest |
| 1.0.0 - 1.1.x | 1.2.0+ | Automatic | Fully supported |
| 1.2.0+ | 1.2.0+ | Not needed | Already using new system |

---

**Last Updated**: January 2025
**Version**: 1.0
**Applies to**: Agentic Kit v1.2.0+
