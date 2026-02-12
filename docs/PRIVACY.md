# Privacy Policy - Agentic Kit Telemetry

## Overview

Agentic Kit respects your privacy. This document explains our optional telemetry system and what data we collect (and don't collect) to help improve the software.

## Important Principles

1. **Opt-In Only**: Telemetry is completely optional. We will never collect data without your explicit consent.
2. **Anonymous**: All data collected is anonymous and cannot be linked to you personally.
3. **Transparent**: We clearly document what we collect and don't collect.
4. **Respectful**: You can change your mind anytime - opt-in or opt-out at will.

## Telemetry Consent

When you first run the Agentic Kit installer, you'll be asked:

```
Would you like to share anonymous usage statistics to help improve liteagents? (y/N)
```

- **Default is NO**: If you just press Enter, telemetry is disabled
- **Explicit Consent**: You must type 'y' to enable telemetry
- **One-Time Prompt**: We only ask once; your choice is saved
- **Easy to Change**: You can modify your consent anytime

## What Data We Collect

When you **opt-in**, we collect the following anonymous data:

### Installation Events
- **Package variant selected**: Which variant you chose (lite, standard, or pro)
- **Tool count**: How many tools you installed (not which specific tools)
- **Installation time**: How long the installation took (in milliseconds)
- **Success status**: Whether installation succeeded or failed
- **Error count**: Number of errors encountered (not the error details)
- **Warning count**: Number of warnings encountered

### System Information
- **Operating system type**: Platform name (e.g., linux, darwin, win32)
- **Node.js version**: The version of Node.js you're using
- **Agentic Kit version**: The version of liteagents you installed

### Upgrade Events
- **From variant**: The variant you upgraded from
- **To variant**: The variant you upgraded to
- **Success status**: Whether upgrade succeeded or failed

### Uninstallation Events
- **Success status**: Whether uninstallation succeeded or failed

## What Data We DON'T Collect

We explicitly **do not** collect:

- ❌ **File paths**: No installation directories or file locations
- ❌ **Personal information**: No usernames, emails, or identifying information
- ❌ **System details**: No detailed hardware specs, memory usage, or system configuration
- ❌ **Specific tool names**: We don't track which specific tools you selected
- ❌ **User-created content**: No code, files, or data you create
- ❌ **Network information**: No IP addresses or network identifiers
- ❌ **Installation location**: No absolute or relative paths
- ❌ **Error messages**: No detailed error text or stack traces

## How Data is Stored

Currently, telemetry data is stored locally on your machine at:

```
~/.liteagents-telemetry.log
```

In future versions, with your consent, this data may be sent to a secure analytics endpoint to help aggregate usage patterns. Any such change will:
- Be clearly communicated in release notes
- Require you to re-confirm your consent
- Use secure, encrypted transmission (HTTPS)
- Store data in a privacy-respecting manner

## Managing Your Consent

### Check Current Status

Your telemetry consent is stored in:
```
~/.liteagents-config.json
```

You can view this file to see your current setting:
```json
{
  "telemetry": true,
  "telemetryConsentDate": "2025-01-15T10:30:00Z"
}
```

### Disable Telemetry

You have several options to disable telemetry:

#### Option 1: Edit Config File
Edit `~/.liteagents-config.json` and set:
```json
{
  "telemetry": false
}
```

#### Option 2: Use --no-telemetry Flag
Run the installer with the flag:
```bash
node installer/cli.js --no-telemetry
```

This flag:
- Disables telemetry for this installation only
- Doesn't change your saved consent setting
- Can be used anytime

#### Option 3: Delete Config File
Remove the config file completely:
```bash
rm ~/.liteagents-config.json
```

You'll be prompted again on next installation.

### Enable Telemetry

To enable telemetry after previously declining:

1. Edit `~/.liteagents-config.json` and set `"telemetry": true`
2. Or delete the config file and run installer again to be re-prompted

## View Collected Data

All locally collected telemetry is stored in plaintext at:
```
~/.liteagents-telemetry.log
```

You can view this file anytime to see exactly what data has been collected:
```bash
cat ~/.liteagents-telemetry.log
```

Each entry is a JSON object on a single line, for example:
```json
{"timestamp":"2025-01-15T10:30:00Z","event":"installation","variant":"standard","toolCount":2,"installationTimeMs":45000,"success":true,"errorCount":0,"warningCount":0,"osType":"linux","nodeVersion":"v18.0.0","agenticKitVersion":"1.2.0"}
```

## Delete All Telemetry Data

To completely remove all telemetry data from your system:

```bash
rm ~/.liteagents-telemetry.log
rm ~/.liteagents-config.json
```

This removes:
- All collected telemetry data
- Your consent setting
- The config file

## Why We Collect This Data

Anonymous usage statistics help us:

1. **Understand Usage Patterns**: Know which variants are most popular
2. **Improve Installation Experience**: Track installation success rates and times
3. **Prioritize Development**: Focus on the features users actually use
4. **Fix Issues**: Identify common installation problems
5. **Platform Support**: Understand which platforms need better support

## Questions or Concerns

If you have questions about our privacy policy or data collection:

- **GitHub Issues**: https://github.com/hamr0/liteagents/issues
- **Review Code**: Our telemetry code is open source in `installer/telemetry.js`
- **Request Clarification**: Open an issue if anything is unclear

## Updates to This Policy

We may update this privacy policy as we add features. Any changes will:
- Be documented in CHANGELOG.md
- Require re-consent if data collection changes significantly
- Be clearly communicated in release notes

## Summary

**TL;DR:**
- ✅ Telemetry is opt-in only (default: disabled)
- ✅ Data is completely anonymous
- ✅ You can opt-out anytime with `--no-telemetry`
- ✅ All collected data is stored locally and viewable
- ✅ We never collect personal information or file paths
- ✅ The code is open source - you can audit it

---

**Last Updated**: January 2025
**Version**: 1.0
