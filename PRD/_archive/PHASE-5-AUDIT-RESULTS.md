# Phase 5a: Audit & Document - COMPREHENSIVE REFERENCE MAPPING

**Execution Date:** 2025-11-01
**Phase:** 5a - Audit & Document
**Status:** COMPLETE

## CRITICAL FINDING

Good news: The consolidation is nearly complete. The agents have already been cleaned of old references. Only 1 reference found that needs updating.

---

## 1. OLD PATH PATTERN SEARCH RESULTS

### Search Pattern: `../templates/`

**Files with matches:** 11 files
- **Agent files:** 0 references (CLEAN)
- **Resource files:** 1 reference (task-briefs.md)
- **PRD files:** 10+ references (documentation only, not critical for plugin)
- **Skills:** 0 references (CLEAN)

### Search Pattern: `../workflows/`

**Files with matches:** 8 files
- **Agent files:** 0 references (CLEAN)
- **Resource files:** 0 references (CLEAN)
- **PRD files:** 8+ references (documentation only)
- **Skills:** 0 references (CLEAN)

### Search Pattern: `../checklists/`

**Files with matches:** 6 files
- **Agent files:** 0 references (CLEAN)
- **Resource files:** 0 references (CLEAN)
- **PRD files:** 6+ references (documentation only)
- **Skills:** 0 references (CLEAN)

### Search Pattern: `../data/`

**Files with matches:** 6 files
- **Agent files:** 0 references (CLEAN)
- **Resource files:** 0 references (CLEAN)
- **PRD files:** 6+ references (documentation only)
- **Skills:** 0 references (CLEAN)

### Search Pattern: `../tasks/`

**Files with matches:** 4 files
- **Agent files:** 0 references (CLEAN)
- **Resource files:** 0 references (CLEAN)
- **PRD files:** 4+ references (documentation only)
- **Skills:** 0 references (CLEAN)

---

## 2. CRITICAL REFERENCE TO UPDATE

### Location: `/home/hamr/PycharmProjects/agentic-toolkit/ai/agentic-kit/resources/task-briefs.md`
**Line:** 3151
**Current:** `- Render from \`../templates/qa-gate-tmpl.yaml\``
**New:** `- Render from \`../resources/templates.yaml#/templates/qa-gate-tmpl\``
**Reason:** YAML anchors use path notation; key is under `templates.qa-gate-tmpl`
**Impact:** HIGH - Plugin depends on correct reference

---

## 3. FILE STRUCTURE ANALYSIS

### Agents (13 files)
- Status: **CLEAN** ✓
- Files: 1-create-prd.md, 2-generate-tasks.md, 3-process-task-list.md, business-analyst.md, full-stack-dev.md, holistic-architect.md, master.md, orchestrator.md, product-manager.md, product-owner.md, qa-test-architect.md, scrum-master.md, ux-expert.md
- Old references found: 0
- Updates needed: 0

### Resources (6 files)
- Status: **NEEDS 1 UPDATE** ⚠️
- Files analyzed:
  - task-briefs.md: 1 old reference found (line 3151)
  - templates.yaml: YAML structure, no old path references
  - workflows.yaml: YAML structure, no old path references
  - checklists.md: Markdown structure, no old path references
  - data.md: Markdown structure, no old path references
  - agent-teams.yaml: YAML structure, no old path references
- Updates needed: 1

### Skills (14 files)
- Status: **CLEAN** ✓
- SKILL.md files checked: all self-contained
- Old references found: 0
- Updates needed: 0

### PRD Files (documentation, not critical)
- Status: Multiple old references found but not critical
- Impact: LOW - These are documentation/planning files, not operational
- Updates: Optional (recommend updating for consistency)

---

## 4. CONSOLIDATED REFERENCE MAPPING

The new consolidated structure is:

| Old Structure | New Structure | Reference Type | Notes |
|---|---|---|---|
| `../templates/prd-tmpl.yaml` | `../resources/templates.yaml#/templates/prd-tmpl` | YAML path anchor | Key is under `templates.prd-tmpl` |
| `../templates/qa-gate-tmpl.yaml` | `../resources/templates.yaml#/templates/qa-gate-tmpl` | YAML path anchor | CRITICAL: 1 instance in task-briefs.md line 3151 |
| `../workflows/greenfield.yaml` | `../resources/workflows.yaml#/workflows/greenfield` | YAML path anchor | Key is under `workflows.greenfield` |
| `../checklists/xxx` | `../resources/checklists.md#section-header` | Markdown anchor | Use markdown section headers |
| `../data/xxx` | `../resources/data.md#section-header` | Markdown anchor | Use markdown section headers |
| `../tasks/xxx` | `../resources/task-briefs.md#task-section-header` | Markdown anchor | Within-file reference to task sections |

---

## 5. ANCHOR NAME CONVERSION RULES

For YAML files (templates.yaml, workflows.yaml):
- Original filename: `qa-gate-tmpl.yaml` → Key in YAML: `qa-gate-tmpl`
- Reference format: `../resources/templates.yaml#/templates/qa-gate-tmpl`
- Reason: YAML structure has root `templates:` key, then individual template keys under it

For Markdown files (checklists.md, data.md, task-briefs.md):
- Original filename: `checklists/xxx.md` → Markdown section header
- Reference format: `../resources/checklists.md#section-header`
- Reason: Markdown uses heading anchors

---

## 6. SUMMARY OF WORK REMAINING

### Phase 5b: Update by File Group

**Group 1: Agents (13 files)** - 0 updates needed ✓
**Group 2: Task Briefs** - 1 critical update needed ⚠️
**Group 3: Resource Files** - 0 updates needed ✓
**Group 4: Skills (14 files)** - 0 updates needed ✓
**Group 5: PRD Files** - Optional (not critical for plugin)

### Total Critical References to Update: 1
### Total Optional References in PRD: 10+ (documentation only)

---

## 7. VALIDATION CHECKLIST

- [ ] Update task-briefs.md line 3151 (../templates/qa-gate-tmpl.yaml)
- [ ] Verify no instances of `../templates/` in working code
- [ ] Verify no instances of `../workflows/` in working code
- [ ] Verify no instances of `../checklists/` in working code
- [ ] Verify no instances of `../data/` in working code
- [ ] Run grep validation script
- [ ] Test anchor links manually
- [ ] Commit changes

---

## 8. KEY INSIGHT

The previous phases (0-4) did excellent work consolidating files. The agents are already clean with no old references. Only the task-briefs.md file has 1 critical reference that needs updating. The PRD files contain references, but these are planning/documentation artifacts and don't affect plugin functionality.

**Recommendation:** Focus Phase 5b on the critical 1 update in task-briefs.md, then run validation to confirm clean state.
