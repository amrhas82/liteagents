# Subagentic Manual

Production-ready AI agent framework providing specialized subagents, workflow commands, and development skills for **Claude Code**, **OpenCode**, **Amp**, and **Droid**. Deploy expert AI personas instantly with zero configuration.

---

## Why Subagentic?

**The Challenge**: Generic AI assistants lack specialized expertise and systematic workflows, leading to inconsistent results and context overload.

**The Solution**: Subagentic provides:
- **Role-Specialized Agents** - Expert personas (architect, QA, product manager) with domain-specific knowledge
- **Systematic Workflows** - Proven development patterns (PRD → Tasks → Implementation)
- **Progressive Token Loading** - Lightweight stubs (~950 tokens) until agents are invoked
- **Orchestrator-First Routing** - Automatic workflow matching based on user intent
- **Platform Agnostic** - Works across Claude Code, OpenCode, Amp, and Droid

**The Result**: Predictable, high-quality outputs from specialized agents following best practices, without manually switching contexts or crafting complex prompts.

---

## 🚀 Quick Start

Clone the toolkit:
```bash
git clone https://github.com/amrhas82/agentic-toolkit
cd agentic-toolkit
```

Install for your platform:

| Platform | Installation | Invocation |
|----------|--------------|-----------|
| **Claude Code** | `cp -rv ai/subagentic/claude/* ~/.claude/` | Automatic via orchestrator or `@agent-name` |
| **OpenCode** | `cp -rv ai/subagentic/opencode/* ~/.config/opencode/` | Automatic via orchestrator or `@agent-name` |
| **Amp** | `cp -rv ai/subagentic/ampcode/* ~/.config/amp/` | Automatic via orchestrator or `As agent-name` |
| **Droid** | `cp -rv ai/subagentic/droid/* ~/.factory/` + enable in settings | Automatic via orchestrator or `invoke droid agent-name` |

---

## 📦 What's Included

### Per-Platform Contents

**14 Subagents**
- 3 Workflow Agents (PRD → Tasks → Implementation)
- 11 Specialist Agents (UX, QA, Architecture, Product, etc.)

**Commands/Skills**
- **Claude Code**: 11 skills + 9 commands (20 total)
- **OpenCode, Droid, Amp**: 20 commands

**Orchestration System**
- Automatic intent matching to optimal workflows
- 9 pre-defined workflow patterns
- Conditional decision points with user approval gates

**Zero Configuration**
- Copy files and start immediately
- No API keys, settings, or dependencies required

---

## 🤖 14 Subagents

### Workflow Agents (3)

Create systematic development processes with built-in review gates.

| Agent | Purpose | Token Load* |
|-------|---------|------------|
| **1-create-prd** | Define scope with structured Product Requirement Documents | ~889 tokens |
| **2-generate-tasks** | Break PRDs into granular, actionable task lists | ~1,029 tokens |
| **3-process-task-list** | Execute tasks iteratively with progress tracking and review checkpoints | ~1,004 tokens |

**Workflow Pattern**: PRD → Tasks → Iterative Implementation → Review → Complete

### Specialist Agents (11)

Domain experts for every phase of software development.

| Agent | Purpose | Token Load* |
|-------|---------|------------|
| **orchestrator** | Analyze intent, coordinate workflows, route to optimal agent sequences | ~902 tokens |
| **master** | General-purpose executor with comprehensive expertise across domains | ~1,073 tokens |
| **ui-designer** | UI/UX design, wireframes, prototypes, accessibility, design systems | ~1,113 tokens |
| **code-developer** | Implementation, debugging, refactoring, code best practices | ~1,025 tokens |
| **quality-assurance** | Test architecture, quality gates, requirements traceability, risk assessment | ~1,351 tokens |
| **system-architect** | System design, technology selection, API design, scalability planning | ~1,427 tokens |
| **feature-planner** | Product strategy, PRDs, feature prioritization, roadmap planning | ~1,243 tokens |
| **backlog-manager** | Backlog refinement, story writing, acceptance criteria, sprint planning | ~1,299 tokens |
| **story-writer** | User stories, epic management, agile ceremonies, retrospectives | ~927 tokens |
| **market-researcher** | Market analysis, competitive research, project discovery, stakeholder mapping | ~1,295 tokens |
| **context-builder** | Initialize project context, discover documentation, create knowledge bases | ~1,614 tokens |

**Progressive Loading**: Base conversation loads lightweight stubs (~50-90 tokens each, ~950 tokens total). Full agent content loads only when invoked. Check actual usage with `/context` command.

---

## 🛠 Commands & Skills

### Claude Code: 11 Skills + 9 Commands

**Skills** (from ./skills/ directory)
- brainstorming - Structured brainstorming with proven frameworks
- code-review - Quality, security, maintainability review
- condition-based-waiting - Polling-based waits to eliminate flaky tests
- docs-builder - Comprehensive project documentation generation
- root-cause-tracing - Trace bugs backward through call stack
- skill-creator - Create custom reusable skills
- subagent-spawning - TDD-aware subagent templates
- systematic-debugging - Four-phase debugging framework
- test-driven-development - Red-green-refactor TDD cycle
- testing-anti-patterns - Avoid fragile, ineffective tests
- verification-before-completion - Evidence-based task completion

**Commands** (from ./commands/ directory)
- debug - Systematic issue investigation
- explain - Code explanation for newcomers
- git-commit - Intelligent commit message generation
- optimize - Performance analysis and optimization
- refactor - Behavior-preserving refactoring
- review - Comprehensive code review
- security - Vulnerability scanning
- ship - Pre-deployment verification checklist
- test-generate - Comprehensive test suite generation

### OpenCode, Droid, Amp: 20 Commands

All commands from ./commands/ directory across three categories:

**Development & Testing (10)**
- test-driven-development, testing-anti-patterns, test-generate, code-review, systematic-debugging, root-cause-tracing, debug, condition-based-waiting, verification-before-completion, subagent-spawning

**Code Operations (6)**
- refactor, optimize, explain, review, security, ship

**Strategy & Planning (4)**
- brainstorming, skill-creator, docs-builder, git-commit

**Progressive Loading**: Commands load on-demand when invoked. Until activated, they consume minimal tokens as metadata.

---

## 🎯 Usage Patterns

### Orchestrator-First (Recommended)

The orchestrator analyzes your request and routes to optimal workflows automatically.

**How it works**:
1. Make natural requests: "Add login feature", "Review this PR", "Plan next sprint"
2. Orchestrator matches intent to workflow patterns
3. Conditional gates ask for approval before each phase
4. Specialists execute with domain expertise
5. Results delivered with minimal context switching

**Example Flow - Feature Development**:
```
User: "Add authentication feature"
  ↓
Orchestrator: "Research competitive approaches first?" [Yes/No]
  ↓ Yes
Market Researcher: [Gathers auth patterns, OAuth vs JWT tradeoffs]
  ↓
Orchestrator: "Create formal PRD?" [Yes/No]
  ↓ Yes
1-Create-PRD: [Structured requirements document]
  ↓
Orchestrator: "Generate implementation tasks?" [Yes/No]
  ↓ Yes
2-Generate-Tasks: [20 granular tasks with acceptance criteria]
  ↓
Orchestrator: "Start systematic implementation?" [Yes/No]
  ↓ Yes
3-Process-Task-List: [Iterative implementation with review gates]
```

**Bypass Options**:
- Direct agent: `@quality-assurance review this code`
- Role syntax: `As system-architect, design the API layer`
- Explicit routing: Use agent mentions to skip orchestrator

### 9 Pre-Defined Workflow Patterns

Available in CLAUDE.md/AGENT.md files:

1. **Feature Discovery Flow** - Research → PRD → Tasks → Implementation
2. **Product Definition Flow** - Strategy → Stories → Technical Assessment
3. **Story Implementation Flow** - Validate → Implement → QA Gate
4. **Architecture Decision Flow** - Constraints → Analysis → Alignment
5. **UI Development Flow** - Design → PRD (optional) → Implement → Validate
6. **Bug Triage Flow** - Investigate → Severity Assessment → Fix/Backlog
7. **Brownfield Discovery Flow** - Context Building → Documentation → Assessment
8. **Quality Validation Flow** - Review → Pass/Concerns/Fail → Remediation
9. **Sprint Planning Flow** - Prioritize → Stories → Criteria → Tasks

Each pattern includes conditional decision points requiring user approval.

---

## 📊 Value Proposition

### For Individual Developers
- **Instant Expertise** - Access 11 specialist agents without hiring
- **Consistent Quality** - Best practices built into every agent
- **Faster Iteration** - Systematic workflows reduce trial-and-error
- **Learning Tool** - Observe expert patterns and decision-making

### For Teams
- **Standardized Processes** - Shared agent definitions ensure consistency
- **Onboarding Acceleration** - New members learn patterns through agent interactions
- **Documentation Culture** - Context-builder and docs-builder promote knowledge capture
- **Cross-Functional Collaboration** - Product, design, and engineering agents work together

### For Technical Leaders
- **Scalable Expertise** - Multiply senior-level guidance across projects
- **Quality Gates** - Built-in review and validation checkpoints
- **Architectural Consistency** - System-architect ensures coherent design decisions
- **Reduced Context Switching** - Specialists handle domain-specific work

---

## 🔧 Platform-Specific Notes

### Claude Code
- **Skills vs Commands**: 11 skills (subdirectories) + 9 commands (.md files)
- **Orchestrator Integration**: Reads CLAUDE.md for routing decisions
- **Progressive Disclosure**: Uses Task tool for agent invocation

### OpenCode
- **Command-Only**: 20 commands in ./command/ directory
- **Config Path**: ~/.config/opencode/
- **Agent Path**: ./agent/ subdirectory

### Amp
- **Command-Only**: 20 commands in ./commands/ directory
- **Config Path**: ~/.config/amp/
- **Agent Path**: ./agents/ subdirectory

### Droid
- **Command-Only**: 20 commands in ./commands/ directory
- **Config Path**: ~/.factory/
- **Agent Path**: ./droids/ subdirectory
- **Settings**: Requires enabling in ~/.factory/settings.json

---

## 📚 Additional Resources

**Repository Structure**:
```
ai/subagentic/
├── claude/          # Claude Code kit
│   ├── CLAUDE.md    # Agent registry + workflows
│   ├── agents/      # 14 agent definitions
│   ├── skills/      # 11 skills (subdirs)
│   └── commands/    # 9 commands (.md files)
├── ampcode/         # Amp kit
│   ├── AGENT.md     # Agent registry + workflows
│   ├── agents/      # 14 agent definitions
│   └── commands/    # 20 commands
├── droid/           # Droid kit
│   ├── AGENTS.md    # Agent registry + workflows
│   ├── droids/      # 14 agent definitions
│   └── commands/    # 20 commands
└── opencode/        # OpenCode kit
    ├── AGENTS.md    # Agent registry + workflows
    ├── agent/       # 14 agent definitions
    └── command/     # 20 commands
```

**Key Files**:
- **CLAUDE.md / AGENT.md / AGENTS.md** - Agent registries with orchestrator workflows
- **Agent definitions** - Full prompt templates with role descriptions
- **Skills/Commands** - Reusable workflow components

**Token Management**:
- All counts shown are **full load when invoked**
- Base conversation loads only stubs (~950 tokens for 14 agents)
- Use `/context` command to monitor actual usage
- Progressive disclosure prevents token bloat

---

## 🤝 Contributing

Contributions welcome for:
- New specialist agents for additional domains
- Additional workflow patterns
- Platform-specific optimizations
- Documentation improvements

See repository for contribution guidelines.

---

**License**: [Specify license]
**Repository**: https://github.com/amrhas82/agentic-toolkit
**Issues**: https://github.com/amrhas82/agentic-toolkit/issues
