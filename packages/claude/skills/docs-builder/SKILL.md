---
name: docs-builder
description: Create comprehensive project documentation with structured /docs hierarchy
---

# Documentation Architecture Skill

Create systematic /docs structure following this 5-tier hierarchy:

```
/docs
├── 00-context/              # WHY and WHAT EXISTS RIGHT NOW
├── 01-product/              # WHAT the product must do
├── 02-features/             # HOW features are designed & built
├── 03-logs/                 # MEMORY (what changed over time)
├── 04-process/              # HOW to work with this system
└── README.md                # Navigation guide
```

## Workflow

### 1. Discover Project
- Scan: README, existing /docs, package.json/pyproject.toml, src/, tests/
- Map existing docs: commands/ → where? development/ → where?
- Ask: "What's built? What's planned? What's missing?"

### 2. Create Directories
```bash
mkdir -p docs/{00-context,01-product,02-features,03-logs,04-process}
```

### 3. Create Files with TodoWrite

Track progress:
- [ ] 00-context (3 files: vision.md, assumptions.md, system-state.md)
- [ ] 01-product (1 file: prd.md)
- [ ] 02-features (per feature discovered: feature-spec.md, tech-design.md, dev-tasks.md, test-plan.md)
- [ ] 03-logs (5 files: implementation-log.md, decisions-log.md, bug-log.md, validation-log.md, insights.md)
- [ ] 04-process (3 files: dev-workflow.md, definition-of-done.md, llm-prompts.md)
- [ ] docs/README.md

Mark each **completed** before next.

For detailed templates, see: `references/templates.md`

### 4. Integrate with Existing Docs

**If CLAUDE.md/KNOWLEDGE_BASE.md exist**:
Update KNOWLEDGE_BASE.md to reference new structure:
```markdown
## Project Documentation
Full /docs structure with context, product, features, logs, process
→ `docs/README.md`
```

**If existing /docs subdirs exist**:
- Don't delete - add migration note in docs/README.md
- Reference existing content where relevant
- Note in system-state.md that migration in progress

### 5. Validate

```bash
# Check structure
ls -la docs/{00-context,01-product,02-features,03-logs,04-process}

# Count minimum files
find docs/00-context -name "*.md" | wc -l  # >= 3
find docs/03-logs -name "*.md" | wc -l     # >= 5
find docs/04-process -name "*.md" | wc -l  # >= 3
test -f docs/01-product/prd.md && echo "✓ PRD exists"
test -f docs/README.md && echo "✓ README exists"
```

## Rules

**DO**:
- Complete one section fully before next
- Use TodoWrite to track progress
- Populate files (don't leave empty templates)
- Use discovered content from project
- Create feature-<name>/ for each major feature found
- Initialize all 5 log files with format
- Mark todos completed immediately after finishing

**DON'T**:
- Skip sections
- Create empty placeholders
- Duplicate content across files
- Delete existing docs
- Forget to validate at end

## Success Criteria

✅ All 5 tier directories created
✅ Minimum files in each (00-context: 3, 01-product: 1, 03-logs: 5, 04-process: 3)
✅ Files populated with project-specific content
✅ Feature folders created for discovered features
✅ docs/README.md complete with navigation
✅ Integration with CLAUDE.md/KNOWLEDGE_BASE.md done
✅ Validation checks pass
✅ All todos marked completed

Complete when /docs structure is fully populated and navigable.
