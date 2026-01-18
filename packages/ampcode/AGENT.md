# Global Amp Agents

This file defines specialized agent personas available globally across all Amp workspaces, and provides guidance and memory for your coding CLI.

# MANDATORY: Orchestrator-First Routing Pattern

**System Instruction for Ampcode**:
When processing ANY user request, invoke the `orchestrator` agent FIRST unless:
- User explicitly mentions a specific agent: `@agent-id` or `As agent-id, ...`
- User invokes a command: `/command-name`
- User gives a direct command: `npm test`, `git status`, file operations, etc.

**Why orchestrator first?**
- Analyzes user intent and matches to optimal workflow
- Asks clarifying questions for conditional workflow steps (e.g., "Research first?")
- Coordinates multi-agent sequences with minimal context passing
- Ensures systematic approach to complex tasks

**Orchestrator reads this registry** to match requests to specialists and invoke via Task tool with selective context injection.

# AmpCode subagents and Commands (Amp)

Ampcode reads AGENT.md during initialization and uses it as part of its system prompt for the session. 

## How To Use with Amp

Activate agents by mentioning their ID in your prompts:
- `"@quality-assurance review this code"`
- Copy/paste `ampcode` subfolders in this project to ~/.config/amp and Ampcode will read and access agents from ~/.config/amp/agents and tasks from ~~/.config/amp/resources/tasks-brief.md,
- You can access agents using "@ui-designer", or you can reference a role naturally, e.g., "As ui-designer, implement ..." or use commands defined in your tasks.

Note
- Orchestrators/master run as mode: primary; other agents as mode: subagents.
- All agents have enbaled tools: write, edit, bash.

## Agents

### Directory

| Title | ID | When To Use |
|---|---|---|
| 1-Create PRD | 1-create-prd | Define scope with a Product Requirement Document (PRD) |
| 2-Generate Tasks | 2-generate-tasks | Break down PRD into granular, actionable task list |
| 3-Process Task List | 3-process-task-list | Guide AI to tackle tasks iteratively with review |
| UX Expert | ui-designer | UI/UX design, wireframes, prototypes, front-end specs |
| Scrum Master | story-writer | Story creation, epic management, agile process guidance |
| Test Architect & Quality Advisor | quality-assurance | Test architecture review, quality gates, code improvement |
| Product Owner | backlog-manager | Backlog management, story refinement, acceptance criteria |
| Product Manager | feature-planner | PRDs, product strategy, feature prioritization, roadmaps |
| Full Stack Developer | code-developer | Code implementation, debugging, refactoring |
| Master Orchestrator | orchestrator | Workflow coordination, multi-agent tasks, role switching |
| Master Task Executor | master | Comprehensive expertise across all domains |
| Architect | system-architect | System design, architecture docs, API design |
| Business Analyst | market-researcher | Market research, competitive analysis, project briefs |
| Context Initializer | context-builder | Use to initialize Ampcode context for new/existing projects, discover and organize documentation, create AGENT.md and KNOWLEDGE_BASE.md for optimal token-efficient memory |

## Common Workflow Patterns

The orchestrator uses these patterns to match user intent to multi-agent workflows. Each step is **conditional** - orchestrator asks user approval before advancing.

### 1. Feature Discovery Flow (Most Common)
**User Intent**: "I need to add [feature]", "Build [new functionality]"
**Workflow**:
```
orchestrator analyzes → asks: "Research competitive approaches first?"
  ├─ Yes → market-researcher (research) → ask: "Create formal PRD?"
  │   ├─ Yes → 1-create-prd → ask: "Generate implementation tasks?"
  │   │   ├─ Yes → 2-generate-tasks → ask: "Start systematic implementation?"
  │   │   │   ├─ Yes → 3-process-task-list
  │   │   │   └─ No → Done (user has task list for review)
  │   │   └─ No → Done (user has PRD for review)
  │   └─ No → Done (user has research for review)
  └─ No → 1-create-prd → (same conditional tree from PRD onward)
```

### 2. Product Definition Flow
**User Intent**: "We're considering a new product/initiative", "Strategic product planning"
**Workflow**:
```
orchestrator → ask: "Follow product definition workflow?"
└─ Yes → feature-planner (strategy, vision) → ask: "Define user stories?"
    └─ Yes → backlog-manager (backlog, stories) → ask: "Technical feasibility assessment?"
        └─ Yes → system-architect (platform decisions, technical design)
```

### 3. Story Implementation Flow
**User Intent**: "Implement [existing story]", "Build [defined feature with acceptance criteria]"
**Workflow**:
```
orchestrator → ask: "Validate story readiness first?"
├─ Yes → backlog-manager (validate acceptance criteria) → code-developer → quality-assurance
└─ No → code-developer (implement) → quality-assurance (quality gate)
```

### 4. Architecture Decision Flow
**User Intent**: "Should we use [tech A] or [tech B]?", "How should we architect [system]?"
**Workflow**:
```
orchestrator → market-researcher (gather constraints, requirements)
            → system-architect (options analysis, tradeoffs)
            → ask: "Need product alignment?"
            └─ Yes → feature-planner (strategic alignment, decision rationale)
```

### 5. UI Development Flow
**User Intent**: "Build [UI component]", "Design and implement [interface]"
**Workflow**:
```
orchestrator → ui-designer (wireframes, design system)
            → ask: "Complex enough to need PRD?"
            ├─ Yes → 1-create-prd → code-developer → quality-assurance
            └─ No → code-developer (implement) → quality-assurance (validate)
```

### 6. Bug Triage Flow
**User Intent**: "Bug: [description]", "Fix [broken behavior]"
**Workflow**:
```
orchestrator → code-developer (investigate root cause)
            → ask: "Severity level?"
            ├─ Critical → code-developer (immediate fix) → quality-assurance (verify)
            └─ Non-critical → 1-create-prd (bug story) → backlog (for sprint planning)
```

### 7. Brownfield Discovery Flow
**User Intent**: "Help me understand this codebase", "Document existing system"
**Workflow**:
```
orchestrator → context-builder (build knowledge base, discover patterns)
            → market-researcher (document current state, stakeholders)
            → ask: "Assess technical debt and modernization opportunities?"
            └─ Yes → system-architect (technical assessment, recommendations)
```

### 8. Quality Validation Flow
**User Intent**: "Review this PR", "Check code quality before merge"
**Workflow**:
```
orchestrator → quality-assurance (comprehensive review)
            → [Decision gate]
            ├─ PASS → Done (ready to merge)
            ├─ CONCERNS → Present issues → user decides next step
            └─ FAIL → code-developer (apply fixes) → quality-assurance (re-validate)
```

### 9. Sprint Planning Flow
**User Intent**: "Plan next sprint", "Prepare sprint backlog"
**Workflow**:
```
orchestrator → feature-planner (prioritize features for sprint)
            → story-writer (break into user stories)
            → backlog-manager (add acceptance criteria)
            → 2-generate-tasks (create sprint backlog with tasks)
```

### Selective Context Injection

When orchestrator invokes specialists, it passes **minimal necessary context**:

**✓ Include**:
- Direct user requirements for the specific task
- Outputs from immediate workflow dependencies only
- Relevant domain-specific files/data

**✗ Exclude**:
- Full conversation history
- Unrelated workflow step outputs
- Tangential project context

**Example**: When invoking `quality-assurance`:
- ✓ Include: code diff, test requirements, acceptance criteria
- ✗ Exclude: PRD creation discussions, UI wireframes, database schema decisions

## Agent Details

### 1-Create PRD (id: 1-create-prd)
Source: [./agents/1-create-prd.md](./agents/1-create-prd.md)

- When to use: Define scope by creating Product Requirement Documents
- How to activate: "create prd, ..." or "As 1-create-prd, ..."

### 2-Generate Tasks (id: 2-generate-tasks)
Source: [./agents/2-generate-tasks.md](./agents/2-generate-tasks.md)

- When to use: Break down PRD into granular, actionable task list
- How to activate: "generate tasks, ..." or "As 2-generate-tasks, ..."

### 3-Process Task List (id: 3-process-task-list)
Source: [./agents/3-process-task-list.md](./agents/3-process-task-list.md)

- When to use: Guide AI through iterative task implementation with review
- How to activate: "process task list, ..." or "As 3-process-task-list, ..."

### UX Expert (id: ui-designer)
Source: [./agents/ui-designer.md](./agents/ui-designer.md)

- When to use: UI/UX design, wireframes, prototypes, user experience
- How to activate: "As ui-designer, ..."

### Scrum Master (id: story-writer)
Source: [./agents/story-writer.md](./agents/story-writer.md)

- When to use: Story creation, epic management, agile guidance
- How to activate: "As story-writer, ..."

### Test Architect & Quality Advisor (id: quality-assurance)
Source: [./agents/quality-assurance.md](./agents/quality-assurance.md)

- When to use: Test architecture, quality gates, requirements traceability
- How to activate: "As quality-assurance, ..." or "As qa, ..."

### Product Owner (id: backlog-manager)
Source: [./agents/backlog-manager.md](./agents/backlog-manager.md)

- When to use: Backlog management, sprint planning, prioritization
- How to activate: "As backlog-manager, ..."

### Product Manager (id: feature-planner)
Source: [./agents/feature-planner.md](./agents/feature-planner.md)

- When to use: PRDs, product strategy, roadmap planning
- How to activate: "As feature-planner, ..."

### Full Stack Developer (id: code-developer)
Source: [./agents/code-developer.md](./agents/code-developer.md)

- When to use: Code implementation, debugging, refactoring
- How to activate: "As code-developer, ..."
- Commands: *develop-story, *help, *explain, *review-quality-assurance, *run-tests

### Master Orchestrator (id: orchestrator)
Source: [./agents/orchestrator.md](./agents/orchestrator.md)

- When to use: Workflow coordination, when unsure which specialist to use
- How to activate: "As orchestrator, ..."

### Master Task Executor (id: master)
Source: [./agents/master.md](./agents/master.md)

- When to use: One-off tasks, comprehensive expertise across domains
- How to activate: "As master, ..."

### Architect (id: system-architect)
Source: [./agents/system-architect.md](./agents/system-architect.md)

- When to use: System design, technology selection, API design
- How to activate: "As architect, ..." or "As system-architect, ..."

### Context Initializer (id: context-builder)
Source: [./agents/context-builder.md](./agents/context-builder.md)

- When to use: Use to initialize Ampcode context for new/existing projects, discover and organize documentation, create AGENT.md and KNOWLEDGE_BASE.md for optimal token-efficient memory
- How to activate: Mention "@context-builder" or "As context-builder, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

### Business Analyst (id: market-researcher)
Source: [./agents/market-researcher.md](./agents/market-researcher.md)

- When to use: Market research, competitive analysis, project discovery
- How to activate: "As analyst, ..." or "As market-researcher, ..."

## Commands

### Command: brainstorming
Source: [./commands/brainstorming.md](./commands/brainstorming.md)
- Description: Facilitate structured brainstorming sessions with proven techniques and frameworks
- Usage: `/brainstorming <session-type> <topic>`
- Full definition: open the source file above (content not embedded)

### Command: code-review
Source: [./commands/code-review.md](./commands/code-review.md)
- Description: Conduct thorough code reviews with focus on quality, security, and maintainability
- Usage: `/code-review <review-scope> <focus-areas>`
- Full definition: open the source file above (content not embedded)

### Command: condition-based-waiting
Source: [./commands/condition-based-waiting.md](./commands/condition-based-waiting.md)
- Description: Implement robust waiting mechanisms based on conditions rather than fixed delays
- Usage: `/condition-based-waiting <condition-type> <timeout-specs>`
- Full definition: open the source file above (content not embedded)

### Command: debug
Source: [./commands/debug.md](./commands/debug.md)
- Description: Debug an issue systematically using structured investigation techniques
- Usage: `/debug <issue-description>`
- Full definition: open the source file above (content not embedded)

### Command: docs-builder
Source: [./commands/docs-builder/SKILL.md](./commands/docs-builder/SKILL.md)
- Description: Create comprehensive project documentation with structured /docs hierarchy
- Usage: `/docs-builder`
- Full definition: open the source file above (content not embedded)

### Command: explain
Source: [./commands/explain.md](./commands/explain.md)
- Description: Explain code for someone new to the codebase
- Usage: `/explain <code-section>`
- Full definition: open the source file above (content not embedded)

### Command: git-commit
Source: [./commands/git-commit.md](./commands/git-commit.md)
- Description: Analyze changes and create intelligent git commits
- Usage: `/git-commit`
- Full definition: open the source file above (content not embedded)

### Command: optimize
Source: [./commands/optimize.md](./commands/optimize.md)
- Description: Analyze and optimize performance issues
- Usage: `/optimize <target-area>`
- Full definition: open the source file above (content not embedded)

### Command: refactor
Source: [./commands/refactor.md](./commands/refactor.md)
- Description: Refactor code while maintaining behavior and tests
- Usage: `/refactor <code-section>`
- Full definition: open the source file above (content not embedded)

### Command: review
Source: [./commands/review.md](./commands/review.md)
- Description: Comprehensive code review including quality, tests, and architecture
- Usage: `/review`
- Full definition: open the source file above (content not embedded)

### Command: root-cause-tracing
Source: [./commands/root-cause-tracing.md](./commands/root-cause-tracing.md)
- Description: Trace issues to their root cause using systematic investigation techniques
- Usage: `/root-cause-tracing <issue-description>`
- Full definition: open the source file above (content not embedded)

### Command: security
Source: [./commands/security.md](./commands/security.md)
- Description: Security vulnerability scan and analysis
- Usage: `/security`
- Full definition: open the source file above (content not embedded)

### Command: ship
Source: [./commands/ship.md](./commands/ship.md)
- Description: Pre-deployment verification checklist
- Usage: `/ship`
- Full definition: open the source file above (content not embedded)

### Command: skill-creator
Source: [./commands/skill-creator.md](./commands/skill-creator.md)
- Description: Create reusable skills with proper structure, validation, and documentation
- Usage: `/skill-creator <skill-type> <skill-description>`
- Full definition: open the source file above (content not embedded)

### Command: subagent-spawning
Source: [./commands/subagent-spawning.md](./commands/subagent-spawning.md)
- Description: Templates for spawning fresh subagents with TDD-aware task isolation
- Usage: Used by 3-process-task-list and other agents for clean subagent execution
- Full definition: open the source file above (content not embedded)

### Command: systematic-debugging
Source: [./commands/systematic-debugging.md](./commands/systematic-debugging.md)
- Description: Systematic four-phase debugging framework - investigate root cause before any fixes
- Usage: `/systematic-debugging <bug-or-error-description>`
- Full definition: open the source file above (content not embedded)

### Command: test-driven-development
Source: [./commands/test-driven-development.md](./commands/test-driven-development.md)
- Description: Write test first, watch it fail, write minimal code to pass - ensures tests actually verify behavior by requiring failure first. Auto-triggers when implementing features/bugfixes.
- Usage: `/test-driven-development <feature-or-behavior-to-test>`
- Full definition: open the source file above (content not embedded)

### Command: test-generate
Source: [./commands/test-generate.md](./commands/test-generate.md)
- Description: Generate comprehensive test suites for existing code
- Usage: `/test-generate <code-section>`
- Full definition: open the source file above (content not embedded)

### Command: testing-anti-patterns
Source: [./commands/testing-anti-patterns.md](./commands/testing-anti-patterns.md)
- Description: Identify and avoid common testing anti-patterns that create fragile, useless tests
- Usage: `/testing-anti-patterns <testing-scenario>`
- Full definition: open the source file above (content not embedded)

### Command: verification-before-completion
Source: [./commands/verification-before-completion.md](./commands/verification-before-completion.md)
- Description: Verify work meets requirements before marking complete - prevents incomplete deliverables. Auto-triggers before claiming done/fixed/complete/passing.
- Usage: `/verification-before-completion <work-to-verify>`
- Full definition: open the source file above (content not embedded)
