# Subagent Kits Manual

Complete ready-to-use package of AI subagents, skills, and task templates for **Claude Code**, **OpenCode**, **Amp**, and **Droid**. Production-tested agent definitions from Simple + BMAD methodologies, zero configuration needed.

---

## 🚀 Quick Start

Clone the toolkit:
```bash
git clone https://github.com/amrhas82/agentic-toolkit
cd agentic-toolkit
```

Install and invoke for your platform:

| Platform | Installation | Invocation |
|----------|--------------|-----------|
| **Claude Code** | `cp -rv ai/subagents/claude/* ~/.claude/` | `@agent-name` or `As agent-name, ...` |
| **OpenCode** | `cp -rv ai/subagents/opencode/* ~/.config/opencode/` | `@agent-name` or `As agent-name, ...` |
| **Amp** | `cp -rv ai/subagents/ampcode/* ~/.config/amp/` | `As agent-name, ...` |
| **Droid** | `cp -rv ai/subagents/droid/* ~/.factory/` + enable in `~/.factory/settings.json` | `invoke droid agent_name` |

---

## 📦 What's Included

**Per-kit contents** (14 subagents + 22 skills + 20+ tasks):
- **3 Workflow Subagents** – Three-phase development: 1-Create PRD → 2-Generate Tasks → 3-Process Task List
- **11 Specialist Subagents** – Expert roles (UX, QA, Product, Dev, Architecture, etc.)
- **22 Reusable Skills** – Code creation, testing, debugging, docs, design, file processing
- **20+ Task Templates** – Validation, planning, development, documentation, specialized workflows
- **Zero Configuration** – Ready to use immediately
---

## 🤖 14 Subagents

### Workflow Phase Agents (3)
| Agent | Purpose |
|-------|---------|
| **1-create-prd** | Create Product Requirement Documents with structured scope and requirements |
| **2-generate-tasks** | Break PRDs into granular, actionable task lists |
| **3-process-task-list** | Execute tasks iteratively with built-in review and progress tracking |

**Recommended Workflow:** PRD → Tasks → Process → Complete

### Specialist Agents (11)
| Agent | Purpose |
|-------|---------|
| **ux-expert** | UI/UX design, wireframes, prototypes, front-end specifications |
| **scrum-master** | User stories, epic management, agile process guidance |
| **qa-test-architect** | Test architecture, quality gates, code review feedback |
| **product-owner** | Backlog management, story refinement, acceptance criteria |
| **product-manager** | PRDs, product strategy, feature prioritization, roadmaps |
| **full-stack-dev** | Code implementation, debugging, refactoring |
| **holistic-architect** | System design, architecture docs, API design, scalability |
| **business-analyst** | Market research, competitive analysis, project discovery |
| **orchestrator** | Workflow coordination, multi-agent task management |
| **master** | Comprehensive expertise across all domains, universal executor |
| **context-initializer** | Project context setup, documentation discovery and organization |

---

## 🛠 22 Reusable Skills

### Development & Testing (7)
| Skill | Purpose |
|-------|---------|
| **test-driven-development** | Write tests first, red-green-refactor cycle ensures tests verify behavior |
| **testing-anti-patterns** | Avoid mock testing, test-only code, and mindless mocking |
| **code-review** | Structured code review workflow before merging |
| **systematic-debugging** | Four-phase debugging: investigate → analyze → hypothesize → implement |
| **root-cause-tracing** | Trace bugs backward through call stack to find original trigger |
| **condition-based-waiting** | Replace timeouts with polling to eliminate flaky tests |
| **verification-before-completion** | Verify claims with evidence before marking tasks complete |

### Design & Creativity (5)
| Skill | Purpose |
|-------|---------|
| **algorithmic-art** | Create generative art using p5.js with seeded randomness |
| **canvas-design** | Create visual art in PNG/PDF with design philosophy |
| **artifacts-builder** | Build React/TypeScript/Tailwind/shadcn artifacts with Parcel bundling |
| **theme-factory** | Apply 10 curated professional themes with color/font pairings |
| **slack-gif-creator** | Create optimized animated GIFs for Slack |

### Office & Document Processing (4)
| Skill | Purpose |
|-------|---------|
| **pdf** | Extract/create PDFs, merge/split, handle forms and tables |
| **docx** | Create/edit Word documents with tracked changes and comments |
| **pptx** | Create/edit PowerPoint with design-first approach and HTML conversion |
| **xlsx** | Create/edit spreadsheets with formulas, formatting, and data analysis |

### Strategy & Communication (4)
| Skill | Purpose |
|-------|---------|
| **brainstorming** | Collaborative design through questioning and exploration |
| **internal-comms** | Write internal communications with company-approved formats |
| **brand-guidelines** | Apply Anthropic's official brand colors and typography |
| **mcp-builder** | Create MCP servers for LLM-service integration |

### Specialized (2)
| Skill | Purpose |
|-------|---------|
| **webapp-testing** | Test local web apps with Playwright – verify, debug, screenshot |
| **skill-creator** | Create custom skills extending Claude's capabilities |

---

## 📋 20+ Reusable Task Templates

Pre-built workflows for common development patterns (available in all kits):

### Quality & Validation (5)
- **validate-next-story** – Validate user story before implementation
- **review-story** – Comprehensive story review and feedback
- **trace-requirements** – Map requirements to tests
- **qa-gate** – Quality gate decision (PASS/CONCERNS/FAIL)
- **apply-qa-fixes** – Apply QA feedback to code

### Planning & Analysis (4)
- **risk-profile** – Risk assessment matrix and mitigation
- **nfr-assess** – Non-functional requirements validation
- **advanced-elicitation** – Structured requirements discovery
- **test-design** – Test scenario creation

### Development (4)
- **create-next-story** – Generate user story from requirements
- **create-brownfield-story** – Story template for existing codebase
- **brownfield-create-epic** – Epic breakdown for existing systems
- **correct-course** – Realign strategy or approach mid-project

### Documentation (4)
- **create-doc** – Generate documentation from code/context
- **shard-doc** – Break large documents into focused sections
- **index-docs** – Create documentation indices
- **document-project** – Comprehensive project documentation

### Specialized (3+)
- **generate-ai-frontend-prompt** – v0 and Lovable UI generation prompts
- **facilitate-brainstorming-session** – Structured brainstorming workflow
- **create-deep-research-prompt** – Deep research and analysis workflow
- **execute-checklist** – Universal checklist execution

---

## 🎯 How to Use This Package

1. **Clone and Install** – Copy files to your CLI's config directory
2. **Start with Workflow** – Use 1-create-prd → 2-generate-tasks → 3-process-task-list
3. **Add Specialists** – Invoke agents by name for specific domain expertise
4. **Leverage Skills** – Use skills within agents for specialized capabilities
5. **Reuse Tasks** – Apply pre-built task templates for common patterns

**Across all four platforms:** Claude Code, OpenCode, Amp, Droid
