---
name: docs-builder
description: Create or reorganize project documentation with structured /docs hierarchy
usage: /docs-builder
auto_trigger: false
---

# Documentation Architecture Skill

Create or reorganize `/docs` following a 5-tier hierarchy:

```
/docs
├── 00-context/              # WHY and WHAT EXISTS RIGHT NOW
├── 01-product/              # WHAT the product must do
├── 02-features/             # HOW features are designed & built
├── 03-logs/                 # MEMORY (what changed over time)
├── 04-process/              # HOW to work with this system
├── archive/                 # Old/unclear docs preserved here
└── README.md                # Navigation guide
```

---

## Step 1: Detect Mode

Check if `/docs` exists and has content:

```bash
find docs -name "*.md" 2>/dev/null | wc -l
```

- **0 files** → **Fresh Mode** (skip to Step 3)
- **1+ files** → **Existing Mode** (continue to Step 2)

---

## Step 2: Existing Mode - Analyze First

### 2.1 Inventory

List all markdown files:
```bash
find docs -name "*.md" -exec wc -l {} \; | sort -n
```

### 2.2 Read and Categorize

**For each file**, read first 50-100 lines and categorize:

| Category | Criteria | Action |
|----------|----------|--------|
| **KEEP** | Evergreen guides, references, architecture, troubleshooting | Move to appropriate tier |
| **CONSOLIDATE** | Duplicate/overlapping content | Merge into one, originals to archive |
| **ARCHIVE** | Work logs, status reports, old phase docs, unclear purpose | Move to `/docs/archive/` |

### 2.3 Categorization Heuristics

**Likely KEEP/MOVE:**
- Filename contains: GUIDE, REFERENCE, HOWTO, ARCHITECTURE, COMMANDS, TROUBLESHOOTING, QUICKSTART
- Content: Has TOC, structured sections, explains "how to" or "what is"
- Purpose: Teaches something reusable

**Likely ARCHIVE:**
- Filename contains: REPORT, STATUS, SUMMARY, FIX_, PHASE_, SPRINT_, _LOG, DRAFT, WIP, OLD, TEMP
- Filename has dates: 2024-01-15-meeting.md
- Located in: archive/, old/, reports/, fixes/, phases/
- Content: Dated entries, task IDs, one-time status updates
- Under ~20 lines and looks like placeholder

**When uncertain → ARCHIVE** (can always recover later)

### 2.4 Present Plan to User

Before making changes, show categorization:

```
KEEP → Move to new structure (X files):
- guides/COMMANDS.md → 02-features/cli/COMMANDS.md
- reference/CONFIG.md → 04-process/reference/CONFIG.md
...

CONSOLIDATE (X groups):
- architecture.md + ARCHITECTURE.md → 00-context/system-state.md
...

ARCHIVE (X files):
- PHASE1_STATUS.md
- FIX_SUMMARY_2024.md
- reports/old-metrics.md
...
```

**Wait for user approval before proceeding.**

### 2.5 Execute Reorganization

1. Create directory structure (including archive):
```bash
mkdir -p docs/{00-context,01-product,02-features,03-logs,04-process,archive}
```

2. Move ARCHIVE files first:
```bash
mv docs/old-file.md docs/archive/
```

3. Move KEEP files to appropriate tiers

4. For CONSOLIDATE: read both files, merge content into new file, move originals to archive

5. Remove empty old directories

---

## Step 3: Create Structure

### 3.1 Create Directories

```bash
mkdir -p docs/{00-context,01-product,02-features,03-logs,04-process,archive}
```

### 3.2 Required Files

Create these files (see `references/templates.md` for content):

**00-context/** (3 files):
- [ ] `vision.md` - Product purpose & boundaries
- [ ] `assumptions.md` - Constraints, risks, unknowns
- [ ] `system-state.md` - What's currently built

**01-product/** (1 file):
- [ ] `prd.md` - Product requirements

**02-features/** (per feature):
- [ ] `feature-<name>/` subdirectories as needed
- [ ] Or flat files for simpler projects

**03-logs/** (5 files):
- [ ] `implementation-log.md`
- [ ] `decisions-log.md`
- [ ] `bug-log.md`
- [ ] `validation-log.md`
- [ ] `insights.md`

**04-process/** (3+ files):
- [ ] `dev-workflow.md`
- [ ] `definition-of-done.md`
- [ ] `llm-prompts.md`

**Root:**
- [ ] `README.md` - Navigation guide

---

## Step 4: Populate Files

### Content Sources

Pull content from:
- Project README.md
- Package files (package.json, pyproject.toml)
- Existing code comments/docstrings
- Existing docs being reorganized

### For Existing Mode

When moving files:
- Update any internal links to match new locations
- Merge duplicate content thoughtfully
- Preserve useful information, don't just copy-paste

---

## Step 5: Integration

**If CLAUDE.md exists:**
Add or update documentation pointer:
```markdown
## Documentation
See `docs/README.md` for full documentation structure.
```

**If KNOWLEDGE_BASE.md exists:**
Update to reference new structure with quick links.

---

## Step 6: Validate

```bash
# Check structure exists
ls -la docs/{00-context,01-product,02-features,03-logs,04-process,archive}

# Verify minimum files
test -f docs/00-context/vision.md && echo "✓ vision.md"
test -f docs/00-context/system-state.md && echo "✓ system-state.md"
test -f docs/01-product/prd.md && echo "✓ prd.md"
test -f docs/README.md && echo "✓ README.md"

# Count files per tier
find docs/00-context -name "*.md" | wc -l  # >= 3
find docs/03-logs -name "*.md" | wc -l     # >= 5
find docs/04-process -name "*.md" | wc -l  # >= 3
```

---

## Rules

**DO:**
- Read files before categorizing (don't guess from filename alone)
- Present plan to user before bulk changes
- Archive instead of delete
- Complete one section before moving to next
- Populate files with real content (not empty templates)
- Preserve original files in archive when consolidating

**DON'T:**
- Delete any files (archive instead)
- Move files without reading them first
- Make bulk changes without user approval
- Create empty placeholder files
- Skip the analysis phase for existing docs

---

## Success Criteria

✅ Mode correctly detected (fresh vs existing)
✅ For existing: categorization presented and approved
✅ All 5 tier directories created (+ archive)
✅ Minimum files in each tier
✅ Files populated with project-specific content
✅ Archive contains old/unclear docs (not deleted)
✅ docs/README.md with navigation
✅ Validation checks pass

---

## Quick Reference

### Tier Mapping

| Old Location | New Location |
|--------------|--------------|
| guides/, howto/ | 02-features/ or 04-process/ |
| reference/, api/ | 04-process/reference/ |
| architecture/ | 00-context/ |
| commands/ | 02-features/cli/ |
| development/ | 04-process/development/ |
| troubleshooting/ | 04-process/troubleshooting/ |
| reports/, status/, phases/ | archive/ |

### File Templates

See: `references/templates.md`
