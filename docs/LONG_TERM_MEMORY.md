# Long-Term Memory Architecture

**Status:** IMPLEMENTING
**Updated:** 2026-02-11

---

## Problem

AI dev agents forget everything between sessions. Current mitigations (CLAUDE.md, .aurora/config) are manually maintained and project-scoped. Cross-project preferences, past decisions, and learned lessons are lost unless the user re-states them.

## Design Principles

1. **Three independent actions** — `/stash`, `/friction`, `/remember` — no coupling
2. **All project-local** — memory lives in `.claude/`, travels with the project
3. **No session-end hook** — there is no reliable session boundary
4. **No per-turn extraction** — 90% of dev turns are mechanical noise
5. **Curation > retrieval** — store less, store better, load everything
6. **No vector store** — the curated set is small enough to load as a preamble
7. **Portable** — plain markdown files, works with any agent
8. **JS runtime** — friction script in Node.js (guaranteed available with Claude Code)
9. **Single file** — one MEMORY.md with sections, not multiple files

## Architecture

```
ACTIONS (independent)          STORAGE (project-local)        RETRIEVAL
─────────────────────          ────────────────────────       ─────────

/stash                         .claude/stash/*.md
  (capture session,              (raw material,
   unchanged from today)          accumulates)
                                      │
/friction <path>                      │
  (analyze behavior,           .claude/friction/
   JS script, produces           antigen_review.md
   antigen_review)                    │
                                      │
/remember ────────────────────────────┤
  (consolidate all sources)           │
                                      ▼
                               .claude/memory/
                                 MEMORY.md        ──→ CLAUDE.md
                                 (## Facts            (@MEMORY.md ref +
                                  ## Episodes          MEMORY:START/END
                                  ## Preferences)      markers)
```

### Key Separation

| Action | Job | Weight | Frequency |
|---|---|---|---|
| `/stash` | Capture session context | Light (haiku, one file) | Multiple times/day |
| `/friction` | Analyze behavioral signals | Medium (JS script) | Every 1-2 weeks |
| `/remember` | Consolidate → MEMORY.md → CLAUDE.md | Heavy (reads all, multiple LLM calls) | Weekly or on-demand |

Each action is independent. `/stash` and `/friction` produce raw material. `/remember` consumes it.

---

## Decisions Made

| Decision | Choice | Rationale |
|---|---|---|
| Storage format | Single MEMORY.md with 3 sections | Simpler than 3 files, one source of truth |
| CLAUDE.md loading | @MEMORY.md reference + injected content | Direct loading via @ ref, content between MEMORY:START/END markers |
| @ exception | @MEMORY.md is the ONLY allowed @ reference | All other file refs remain plain text paths |
| Friction JS | Single file, embedded config, no deps | Lightweight, vanilla Node.js, portable |
| Friction JS location | `packages/claude/commands/friction/friction.js` (dev), `.claude/commands/friction/friction.js` (installed) | Package-first development |
| Principles | Static section in CLAUDE.md, manually maintained | Not auto-managed — stable, rarely changes |
| Blueprint | New artifact in docs-builder at `docs/00-context/blueprint.md` | Overarching project doc, created by /docs-builder |

---

## User Types

Two paths to the same memory system:

| | Liteagents user | Aurora user |
|---|---|---|
| Capture sessions | `/stash` (skill/command) | `/stash` (same) |
| Analyze behavior | `/friction` (command, runs `friction.js`) | `aur friction` (CLI, runs `friction.py`) |
| Consolidate memory | `/remember` (command) | `/remember` (same) |
| Friction output | `.claude/friction/` | `.aurora/friction/` (legacy) or `.claude/friction/` |

Both produce the same output format. `/remember` checks both locations.

### Friction Script: JS vs Python

| | `friction.js` (liteagents) | `friction.py` (aurora) |
|---|---|---|
| Runtime | Node.js (guaranteed with Claude Code) | Python (may not be installed) |
| Invoked by | `/friction` command | `aur friction` CLI |
| Location | `packages/claude/commands/friction/friction.js` | `scripts/friction.py` |
| Output format | Same: `.claude/friction/` | Same: `.aurora/friction/` |
| Logic | Same 14 signals, same weights, same scoring | Original implementation |
| Structure | Single file, embedded config | 3 files (friction.py + friction_analyze.py + antigen_extract.py) |

---

## Actions

### /stash — Capture session (unchanged)

What it does today. No changes needed.

```
1. User runs /stash at natural breakpoints
2. Haiku summarizes session context
3. Writes .claude/stash/<name>.md
4. Done. No extraction, no consolidation.
```

Stash files accumulate as raw material for `/remember`.

### /friction — Analyze behavior

Runs friction analysis via Node.js script. Takes session path as required argument.

```
1. User runs /friction <sessions-path>
   e.g. /friction ~/.claude/projects/-home-hamr-PycharmProjects-aurora/

2. Looks for friction.js:
   - packages/claude/commands/friction/friction.js (development)
   - .claude/commands/friction/friction.js (installed)
   - Falls back to manual analysis if neither found

3. Script analyzes Claude session JSONL files:
   - Reads session files from <path>
   - Detects 14 signal types (same as friction.py)
   - Scores sessions, identifies BAD/FRICTION/ROUGH/OK
   - Extracts antigen candidates from BAD sessions

4. Output writes to .claude/friction/ (project-local):
   - friction_analysis.json    per-session breakdown
   - friction_summary.json     aggregate stats + verdict
   - friction_raw.jsonl        raw signals
   - antigen_candidates.json   extracted patterns
   - antigen_review.md         human-readable review

5. Done. No memory consolidation yet.
```

### /remember — Consolidate into MEMORY.md and CLAUDE.md

Reads all sources, extracts what matters, writes single MEMORY.md, injects into CLAUDE.md.

```
/remember pseudocode:

  # 1. Gather sources
  stashes = glob(".claude/stash/*.md")

  friction = find_first([
      ".claude/friction/antigen_review.md",    # liteagents output
      ".aurora/friction/antigen_review.md"     # aurora output (legacy)
  ])

  existing_memory = read(".claude/memory/MEMORY.md")  # parse 3 sections
  processed = read(".claude/memory/.processed")

  # 2. Extract facts + episodes from unprocessed stashes
  unprocessed = filter(stashes, not_in=processed)

  for stash in unprocessed:
      extraction = haiku.call(
          system = """Extract from this session stash:

          FACTS (atomic, one-line):
          - Stable preferences (tools, languages, style)
          - Decisions made ("chose X over Y because Z")
          - Corrections ("no, I meant...", "don't do that")
          - Explicit "remember this"

          EPISODE (3-5 bullet narrative):
          - What was the problem/goal?
          - What approaches were tried?
          - What was the outcome and lesson?

          SKIP: code details, file paths, errors, mechanical steps,
                LLM responses, one-off details""",
          content = stash.content
      )

      new_facts += extraction.facts
      new_episodes += extraction.episode

  # 3. Merge facts (deduplicate)
  facts = haiku.call(
      system = """Merge new facts with existing. Rules:
      - New updates replace old, contradictions keep new
      - Duplicates dropped, keep atomic one-line each""",
      existing = existing_memory.facts,
      new = new_facts
  )

  # 4. Append episodes (no dedup, append-only)
  episodes = existing_memory.episodes + new_episodes

  # 5. Distill friction into preferences (if output exists)
  if friction.exists:
      preferences = haiku.call(
          system = """Extract BEHAVIORAL preferences (demonstrated, not stated).
          High Confidence: 5+ observations (loaded into CLAUDE.md)
          Medium Confidence: 3+ observations (observing)
          Low Confidence: <3 observations (needs more data)
          Promote/demote based on new evidence.""",
          friction_review = friction.content,
          existing_prefs = existing_memory.preferences
      )

  # 6. Write single MEMORY.md
  write(".claude/memory/MEMORY.md", format(facts, episodes, preferences))

  # 7. Inject into CLAUDE.md between MEMORY:START/END markers
  # Include @MEMORY.md reference for direct loading
  update_section("CLAUDE.md", "MEMORY:START", "MEMORY:END", {
      facts: all,
      preferences: high_confidence_only,
      episodes: last_5
  })

  # 8. Mark stashes as processed
  append(".claude/memory/.processed", [s.path for s in unprocessed])
```

---

## MEMORY.md — Single Source of Truth

One file with three sections. Auto-generated by `/remember`. Do not edit manually.

```markdown
# Project Memory
> Auto-generated by /remember. Do not edit manually.

## Facts
- timezone: EST
- python projects: always use hatchling
- commit style: conventional commits, no co-author line
- preferred test runner: pytest with -x flag
- switched from setuptools to hatchling for cli package (2026-01)

## Episodes
### 2026-02-03 aurora/lsp-hook
- tried text fallback when LSP cold — caused noise from keyword extraction
- root cause: symbol extraction from arbitrary lines picks up keywords not symbols
- solution: only show count+risk when LSP works, text fallback only for 0 refs
- lesson: don't mix search strategies in same code path

### 2026-01-28 aurora/friction-pipeline
- explored 3 approaches to friction scoring: flat weights, decay, tier-based
- picked tier-based because it maps to confidence levels naturally
- key insight: gold signals (user_intervention) are 95% predictive alone

## Preferences
### High Confidence
- never add docstrings unless asked (rejected 12/15 times)
- prefer editing existing files over creating new (rejected new file 8/10)
- keep commit messages short, one line (rewrote 4/7 verbose ones)

### Medium Confidence
- may prefer tabs over spaces (2 observations)

### Low Confidence
- possible preference for click over argparse (1 observation)
```

**Promotion:** low → medium at 3 obs, medium → high at 5+ obs

---

## Retrieval: CLAUDE.md + @MEMORY.md

Memory is loaded two ways:
1. **@MEMORY.md** — direct file reference in CLAUDE.md, points to `.claude/memory/MEMORY.md`
2. **MEMORY:START/END markers** — injected summary (facts + high-confidence prefs + last 5 episodes)

This is the ONLY file that uses the @ reference pattern. All other file references remain plain text paths.

### What Gets Loaded

```markdown
<!-- MEMORY:START -->
# Project Memory (auto-generated by /remember)
@MEMORY.md

## Facts
- timezone: EST
- python: hatchling, pytest -x, make
- commit: conventional, no co-author

## Preferences
- never add docstrings unless asked
- prefer editing existing files over creating new
- keep commit messages short

## Recent Episodes
### 2026-02-03 aurora/lsp-hook
- tried text fallback when LSP cold — noise
- lesson: don't mix search strategies
<!-- MEMORY:END -->
```

### Why This Works

- **MEMORY.md** — single file, ~100-200 lines, all sections
- **CLAUDE.md injection** — summary only (facts + high prefs + last 5 episodes), ~100-150 lines
- **@MEMORY.md** — full file available for deep context when needed

---

## Why Not Per-Turn Extraction?

Dev sessions are different from chatbots:
- "Edit line 42 of foo.py" — not memorable
- "Run pytest" — not memorable
- 90%+ of turns are mechanical tool invocations

Per-turn extraction burns an LLM call per turn to store nothing.

## Why Not Session-End Hooks?

There is no reliable "session end" event in Claude Code:
- `/clear` — new session, no hook fires
- Close terminal — process killed, no hook
- Idle for hours — no timeout event

The only reliable triggers are explicit: `/stash`, `/friction`, `/remember`.

## Why Not Global Memory?

- Project-local memory moves with the project (git, clone, share)
- Cross-project preferences are rare (~15 lines) and stable
- Cross-project preferences belong in `~/.claude/MEMORY.md` (manually maintained, tiny)
- Project-specific context is 90% of what matters

---

## Workflow

```
Day-to-day:
  /stash, /stash, /stash              accumulate raw material
  (natural breakpoints: feature done, bug solved, decision made)

Every 1-2 weeks:
  /friction <sessions-path>           analyze behavioral patterns
  (or: aur friction for aurora users)

When ready:
  /remember                           consolidate → MEMORY.md → CLAUDE.md
  (reads stashes + friction, extracts, dedupes, writes MEMORY.md, injects into CLAUDE.md)
```

Three independent actions. No dependencies between them. One output file.

---

## File Locations

```
.claude/                          # All project-local
  stash/                          # Raw session captures
    lsp-poc-complete.md
    headless-removal.md
  friction/                       # Friction analysis output
    friction_analysis.json
    friction_summary.json
    friction_raw.jsonl
    antigen_candidates.json
    antigen_review.md
  memory/                         # Consolidated memory
    MEMORY.md                     # Single source of truth (referenced as @MEMORY.md)
    .processed                    # Manifest of processed stashes

packages/claude/
  commands/
    remember.md                   # /remember command
    friction.md                   # /friction command
  scripts/
    friction.js                   # Friction analysis script (Node.js)

CLAUDE.md                         # Project preamble (has MEMORY section with @MEMORY.md ref)
```

---

## Friction Script: JS Port

Single `friction.js` file — Node.js port of the existing Python pipeline (~2000 lines across `friction_analyze.py` + `antigen_extract.py`).

### Why JS

- Node.js is guaranteed available (Claude Code requires it)
- Python is NOT guaranteed (Windows, minimal Linux)
- The script uses only: file I/O, regex, JSON, string matching
- No ML, no heavy deps — trivial port to Node stdlib

### What It Does

```
Input:  Session JSONL files from <sessions-path>
Output: .claude/friction/ (analysis, summary, raw signals, antigens, review)

1. Read session JSONL files (fs.readFileSync)
2. Extract 14 signal types per turn (regex, string match)
3. Score sessions (weighted accumulation, same config)
4. Classify quality (BAD/FRICTION/ROUGH/OK)
5. Aggregate stats (daily trends, best/worst)
6. Extract antigen candidates from BAD sessions
7. Write all output files
```

### Signals (same as Python, same weights)

| Signal | Weight | Detection |
|---|---|---|
| `user_intervention` | 10 | `/stash` in user message |
| `session_abandoned` | 10 | High friction at end, no resolution |
| `false_success` | 8 | LLM claimed success but tool failed |
| `no_resolution` | 8 | Errors without subsequent success |
| `tool_loop` | 6 | Same tool called 3+ times identically |
| `rapid_exit` | 6 | <3 turns, ends with error |
| `interrupt_cascade` | 5 | Multiple ESC/Ctrl+C within 60s |
| `user_curse` | 5 | Profanity detected |
| `request_interrupted` | 2.5 | User hit ESC/Ctrl+C |
| `exit_error` | 1 | Command failed (non-zero exit) |
| `repeated_question` | 1 | Same question asked twice |
| `long_silence` | 0.5 | >10 min gap |
| `user_negation` | 0.5 | "no", "didn't work" |
| `compaction` | 0.5 | Context overflow |

---

## Open Questions (Remaining)

1. **Episode pruning** — last N entries? Age-based? Or keep all and only load recent 5 into CLAUDE.md?
2. **CLAUDE.md section size** — if memory grows beyond ~150 lines, should `/remember` compress older facts?
3. **Stash gitignore** — should `.claude/stash/` and `.claude/memory/` be git-tracked or gitignored?

---

## Related

- [FRICTION_DETECTION.md](../FRICTION_DETECTION.md) — friction pipeline (Python version, aurora users)
- [MEM_INDEXING.md](MEM_INDEXING.md) — code memory indexing (separate system)
- [ACTR_ACTIVATION.md](ACTR_ACTIVATION.md) — activation scoring (could inform episode relevance)
