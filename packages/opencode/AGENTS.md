# Global Opencode Agents

This file provides guidance and memory for your coding CLI.

# MANDATORY: Orchestrator-First Routing Pattern

**System Instruction for Opencode**:
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

# Opencode subagents and Tasks (OpenCode)

Opencode reads AGENTS.md during initialization and uses it as part of its system prompt for the session. 

## How To Use With Opencode

Activate agents by mentioning their ID in your prompts:
- `"@qa-test-architect review this code"`
- Copy/paste `opencode` subfolders in this project to ~/.config/opencode and Opencode will read and access agents from ~/.config/opencode/agent and tasks from ~~/.config/opencode/resources/tasks-brief.md,
- You can access agents using "@ux-expert", or you can reference a role naturally, e.g., "As ux-expert, implement ..." or use commands defined in your tasks.

Note
- Orchestrators/master run as mode: primary; other agents as mode: subagents.
- All agents have enbaled tools: write, edit, bash.

## Agents

### Directory

| Title | ID | When To Use |
|---|---|---|
| 1-Create PRD | 1-create-prd | 1. Define Scope: use to clearly outlining what needs to be built with a Product Requirement Document (PRD) |
| 2-Generate Tasks | 2-generate-tasks | 2. Detailed Planning: use to break down the PRD into a granular, actionable task list |
| 3-Process Task List | 3-process-task-list | 3. Iterative Implementation: use to guide the AI to tackle one task at a time, allowing you to review and approve each change |
| UX Expert | ux-expert | Use for UI/UX design, wireframes, prototypes, front-end specifications, and user experience optimization |
| Scrum Master | scrum-master | Use for story creation, epic management, retrospectives in party-mode, and agile process guidance |
| Test Architect & Quality Advisor | qa-test-architect | Use for comprehensive test architecture review, quality gate decisions, and code improvement. Provides thorough analysis including requirements traceability, risk assessment, and test strategy. Advisory only - teams choose their quality bar. |
| Product Owner | product-owner | Use for backlog management, story refinement, acceptance criteria, sprint planning, and prioritization decisions |
| Product Manager | product-manager | Use for creating PRDs, product strategy, feature prioritization, roadmap planning, and stakeholder communication |
| Full Stack Developer | full-stack-dev | Use for code implementation, debugging, refactoring, and development best practices |
| Master Orchestrator | orchestrator | Use for workflow coordination, multi-agent tasks, role switching guidance, and when unsure which specialist to consult |
| Master Task Executor | master | Use when you need comprehensive expertise across all domains, running 1 off tasks that do not require a persona, or just wanting to use the same agent for many things. |
| Architect | holistic-architect | Use for system design, architecture documents, technology selection, API design, and infrastructure planning |
| Business Analyst | business-analyst | Use for market research, brainstorming, competitive analysis, creating project briefs, initial project discovery, and documenting existing projects (brownfield) |
| Context Initializer | context-initializer | Use to initialize Opencode context for new/existing projects, discover and organize documentation, create AGENTS.md and KNOWLEDGE_BASE.md for optimal token-efficient memory |

## Common Workflow Patterns

The orchestrator uses these patterns to match user intent to multi-agent workflows. Each step is **conditional** - orchestrator asks user approval before advancing.

### 1. Feature Discovery Flow (Most Common)
**User Intent**: "I need to add [feature]", "Build [new functionality]"
**Workflow**:
```
orchestrator analyzes → asks: "Research competitive approaches first?"
  ├─ Yes → business-analyst (research) → ask: "Create formal PRD?"
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
└─ Yes → product-manager (strategy, vision) → ask: "Define user stories?"
    └─ Yes → product-owner (backlog, stories) → ask: "Technical feasibility assessment?"
        └─ Yes → holistic-architect (platform decisions, technical design)
```

### 3. Story Implementation Flow
**User Intent**: "Implement [existing story]", "Build [defined feature with acceptance criteria]"
**Workflow**:
```
orchestrator → ask: "Validate story readiness first?"
├─ Yes → product-owner (validate acceptance criteria) → full-stack-dev → qa-test-architect
└─ No → full-stack-dev (implement) → qa-test-architect (quality gate)
```

### 4. Architecture Decision Flow
**User Intent**: "Should we use [tech A] or [tech B]?", "How should we architect [system]?"
**Workflow**:
```
orchestrator → business-analyst (gather constraints, requirements)
            → holistic-architect (options analysis, tradeoffs)
            → ask: "Need product alignment?"
            └─ Yes → product-manager (strategic alignment, decision rationale)
```

### 5. UI Development Flow
**User Intent**: "Build [UI component]", "Design and implement [interface]"
**Workflow**:
```
orchestrator → ux-expert (wireframes, design system)
            → ask: "Complex enough to need PRD?"
            ├─ Yes → 1-create-prd → full-stack-dev → qa-test-architect
            └─ No → full-stack-dev (implement) → qa-test-architect (validate)
```

### 6. Bug Triage Flow
**User Intent**: "Bug: [description]", "Fix [broken behavior]"
**Workflow**:
```
orchestrator → full-stack-dev (investigate root cause)
            → ask: "Severity level?"
            ├─ Critical → full-stack-dev (immediate fix) → qa-test-architect (verify)
            └─ Non-critical → 1-create-prd (bug story) → backlog (for sprint planning)
```

### 7. Brownfield Discovery Flow
**User Intent**: "Help me understand this codebase", "Document existing system"
**Workflow**:
```
orchestrator → context-initializer (build knowledge base, discover patterns)
            → business-analyst (document current state, stakeholders)
            → ask: "Assess technical debt and modernization opportunities?"
            └─ Yes → holistic-architect (technical assessment, recommendations)
```

### 8. Quality Validation Flow
**User Intent**: "Review this PR", "Check code quality before merge"
**Workflow**:
```
orchestrator → qa-test-architect (comprehensive review)
            → [Decision gate]
            ├─ PASS → Done (ready to merge)
            ├─ CONCERNS → Present issues → user decides next step
            └─ FAIL → full-stack-dev (apply fixes) → qa-test-architect (re-validate)
```

### 9. Sprint Planning Flow
**User Intent**: "Plan next sprint", "Prepare sprint backlog"
**Workflow**:
```
orchestrator → product-manager (prioritize features for sprint)
            → scrum-master (break into user stories)
            → product-owner (add acceptance criteria)
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

**Example**: When invoking `qa-test-architect`:
- ✓ Include: code diff, test requirements, acceptance criteria
- ✗ Exclude: PRD creation discussions, UI wireframes, database schema decisions

### 1-Create PRD (id: 1-create-prd) 
Source: [./agent/ux-expert.md](./agent/1-create-prd.md)

- When to use: Define Scope: use to clearly outlining what needs to be built with a Product Requirement Document (PRD)  optimization
- How to activate: Mention "create prd, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

### 2-Generate Tasks (id: 2-generate-tasks) 
Source: [./agent/ux-expert.md](./agent/2-generate-tasks.md)

- When to use: 2. Detailed Planning: use to break down the PRD into a granular, actionable task list
- How to activate: Mention "generate tasks, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

### 3-Process Task List (id: 3-process-task-list)
Source: [./agent/ux-expert.md](./agent/3-process-task-list.md)

- When to use: 3. Iterative Implementation: use to guide the AI to tackle one task at a time, allowing you to review and approve each change
- How to activate: Mention "process task list, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

### UX Expert (id: ux-expert)
Source: [./agent/ux-expert.md](./agent/ux-expert.md)

- When to use: Use for UI/UX design, wireframes, prototypes, front-end specifications, and user experience optimization
- How to activate: Mention "As ux-expert, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

### Scrum Master (id: scrum-master)
Source: [./agent/scrum-master.md](./agent/scrum-master.md)

- When to use: Use for story creation, epic management, retrospectives in party-mode, and agile process guidance
- How to activate: Mention "As scrum-master, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

### Test Architect & Quality Advisor (id: qa-test-architect)
Source: [./agent/qa-test-architect.md](./agent/qa-test-architect.md)

- When to use: Use for comprehensive test architecture review, quality gate decisions, and code improvement. Provides thorough analysis including requirements traceability, risk assessment, and test strategy. Advisory only - teams choose their quality bar.
- How to activate: Mention "As qa, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

### Product Owner (id: product-owner)
Source: [./agent/product-owner.md](./agent/product-owner.md)

- When to use: Use for backlog management, story refinement, acceptance criteria, sprint planning, and prioritization decisions
- How to activate: Mention "As product-owner, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

### Product Manager (id: product-manager)
Source: [./agent/product-manager.md](./agent/product-manager.md)

- When to use: Use for creating PRDs, product strategy, feature prioritization, roadmap planning, and stakeholder communication
- How to activate: Mention "As product-manager, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

### Full Stack Developer (id: full-stack-dev)
Source: [./agent/full-stack-dev.md](./agent/full-stack-dev.md)

- When to use: Use for code implementation, debugging, refactoring, and development best practices
- How to activate: Mention "As full-stack-dev, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

### Master Orchestrator (id: orchestrator)
Source: [./agent/orchestrator.md](./agent/orchestrator.md)

- When to use: Use for workflow coordination, multi-agent tasks, role switching guidance, and when unsure which specialist to consult
- How to activate: Mention "As orchestrator, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

### Master Task Executor (id: master)
Source: [./agent/master.md](./agent/master.md)

- When to use: Use when you need comprehensive expertise across all domains, running 1 off tasks that do not require a persona, or just wanting to use the same agent for many things.
- How to activate: Mention "As master, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

### Architect (id: holistic-architect)
Source: [./agent/holistic-architect.md](./agent/holistic-architect.md)

- When to use: Use for system design, architecture documents, technology selection, API design, and infrastructure planning
- How to activate: Mention "As architect, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

### Context Initializer (id: context-initializer)
Source: [./agent/context-initializer.md](./agent/context-initializer.md)

- When to use: Use to initialize Opencode context for new/existing projects, discover and organize documentation, create AGENTS.md and KNOWLEDGE_BASE.md for optimal token-efficient memory
- How to activate: Mention "@context-initializer" or "As context-initializer, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

### Business Analyst (id: business-analyst)
Source: [./agent/business-analyst.md](./agent/business-analyst.md)

- When to use: Use for market research, brainstorming, competitive analysis, creating project briefs, initial project discovery, and documenting existing projects (brownfield)
- How to activate: Mention "As analyst, ..." to get role-aligned behavior
- Full definition: open the source file above (content not embedded)

## Tasks

These are reusable task briefs; use the paths to open them as needed.

### Task: validate-next-story
Source: [./resources/task-briefs.md#validate-next-story](./resources/task-briefs.md#validate-next-story)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: trace-requirements
Source: [./resources/task-briefs.md#trace-requirements](./resources/task-briefs.md#trace-requirements)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: test-design
Source: [./resources/task-briefs.md#test-design](./resources/task-briefs.md#test-design)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: shard-doc
Source: [./resources/task-briefs.md#shard-doc](./resources/task-briefs.md#shard-doc)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: risk-profile
Source: [./resources/task-briefs.md#risk-profile](./resources/task-briefs.md#risk-profile)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: review-story
Source: [./resources/task-briefs.md#review-story](./resources/task-briefs.md#review-story)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: qa-test-architect-gate
Source: [./resources/task-briefs.md#qa-gate](./resources/task-briefs.md#qa-gate)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: nfr-assess
Source: [./resources/task-briefs.md#nfr-assess](./resources/task-briefs.md#nfr-assess)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: index-docs
Source: [./resources/task-briefs.md#index-docs](./resources/task-briefs.md#index-docs)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: generate-ai-frontend-prompt
Source: [./resources/task-briefs.md#generate-ai-frontend-prompt](./resources/task-briefs.md#generate-ai-frontend-prompt)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: facilitate-brainstorming-session
Source: [./resources/task-briefs.md#facilitate-brainstorming-session](./resources/task-briefs.md#facilitate-brainstorming-session)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: execute-checklist
Source: [./resources/task-briefs.md#execute-checklist](./resources/task-briefs.md#execute-checklist)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: document-project
Source: [./resources/task-briefs.md#document-project](./resources/task-briefs.md#document-project)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: create-next-story
Source: [./resources/task-briefs.md#create-next-story](./resources/task-briefs.md#create-next-story)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: create-doc
Source: [./resources/task-briefs.md#create-doc](./resources/task-briefs.md#create-doc)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: create-deep-research-prompt
Source: [./resources/task-briefs.md#create-deep-research-prompt](./resources/task-briefs.md#create-deep-research-prompt)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: create-brownfield-story
Source: [./resources/task-briefs.md#create-brownfield-story](./resources/task-briefs.md#create-brownfield-story)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: correct-course
Source: [./resources/task-briefs.md#correct-course](./resources/task-briefs.md#correct-course)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: brownfield-create-story
Source: [./resources/task-briefs.md#brownfield-create-story](./resources/task-briefs.md#brownfield-create-story)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: brownfield-create-epic
Source: [./resources/task-briefs.md#brownfield-create-epic](./resources/task-briefs.md#brownfield-create-epic)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: apply-qa-fixes
Source: [./resources/task-briefs.md#apply-qa-fixes](./resources/task-briefs.md#apply-qa-fixes)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

### Task: advanced-elicitation
Source: [./resources/task-briefs.md#advanced-elicitation](./resources/task-briefs.md#advanced-elicitation)
- How to use: Reference the task in your prompt or execute via your configured commands.
- Full brief: open the source file above (content not embedded)

## Commands

These are slash commands available in the TUI. Use /command-name to execute.

### Command: xlsx
Source: [./command/xlsx.md](./command/xlsx.md)
- Description: Create, edit, and analyze spreadsheets with formulas, formatting, data analysis, and visualization
- Usage: `/xlsx <operation> <spreadsheet-file>`
- Full definition: open the source file above (content not embedded)

### Command: webapp-testing
Source: [./command/webapp-testing.md](./command/webapp-testing.md)
- Description: Test local web applications using Playwright - verify functionality, debug UI, capture screenshots
- Usage: `/webapp-testing <webapp-url-or-local-server>`
- Full definition: open the source file above (content not embedded)

### Command: systematic-debugging
Source: [./command/systematic-debugging.md](./command/systematic-debugging.md)
- Description: Systematic four-phase debugging framework - investigate root cause before any fixes
- Usage: `/systematic-debugging <bug-or-error-description>`
- Full definition: open the source file above (content not embedded)

### Command: slack-gif-creator
Source: [./command/slack-gif-creator.md](./command/slack-gif-creator.md)
- Description: Create animated GIFs optimized for Slack with size validation and composable animation primitives
- Usage: `/slack-gif-creator <gif-type> <animation-concept>`
- Full definition: open the source file above (content not embedded)

### Command: verification-before-completion
Source: [./command/verification-before-completion.md](./command/verification-before-completion.md)
- Description: Verify work meets requirements before marking complete - prevents incomplete deliverables
- Usage: `/verification-before-completion <work-to-verify>`
- Full definition: open the source file above (content not embedded)

### Command: skill-creator
Source: [./command/skill-creator.md](./command/command/skill-creator.md)
- Description: Create reusable skills with proper structure, validation, and documentation
- Usage: `/skill-creator <skill-type> <skill-description>`
- Full definition: open the source file above (content not embedded)

### Command: test-driven-development
Source: [./command/test-driven-development.md](./command/test-driven-development.md)
- Description: Write test first, watch it fail, write minimal code to pass - ensures tests actually verify behavior
- Usage: `/test-driven-development <feature-or-behavior-to-test>`
- Full definition: open the source file above (content not embedded)

### Command: testing-anti-patterns
Source: [./command/testing-anti-patterns.md](./command/testing-anti-patterns.md)
- Description: Identify and avoid common testing anti-patterns that create fragile, useless tests
- Usage: `/testing-anti-patterns <testing-scenario>`
- Full definition: open the source file above (content not embedded)

### Command: theme-factory
Source: [./command/theme-factory.md](./command/theme-factory.md)
- Description: Generate consistent themes with proper color systems, typography, and spacing
- Usage: `/theme-factory <theme-type> <design-requirements>`
- Full definition: open the source file above (content not embedded)

### Command: root-cause-tracing
Source: [./command/root-cause-tracing.md](./command/root-cause-tracing.md)
- Description: Trace issues to their root cause using systematic investigation techniques
- Usage: `/root-cause-tracing <issue-description>`
- Full definition: open the source file above (content not embedded)

### Command: internal-comms
Source: [./command/internal-comms.md](./command/internal-comms.md)
- Description: Structure internal communications for clarity, actionability, and team alignment
- Usage: `/internal-comms <communication-type> <audience>`
- Full definition: open the source file above (content not embedded)

### Command: pdf
Source: [./command/pdf.md](./command/pdf.md)
- Description: Create, edit, and analyze PDF documents with proper formatting and structure
- Usage: `/pdf <operation> <pdf-file>`
- Full definition: open the source file above (content not embedded)

### Command: mcp-builder
Source: [./command/mcp-builder.md](./command/mcp-builder.md)
- Description: Build Model Context Protocol servers with proper tool definitions and error handling
- Usage: `/mcp-builder <server-type> <specifications>`
- Full definition: open the source file above (content not embedded)

### Command: condition-based-waiting
Source: [./command/condition-based-waiting.md](./command/condition-based-waiting.md)
- Description: Implement robust waiting mechanisms based on conditions rather than fixed delays
- Usage: `/condition-based-waiting <condition-type> <timeout-specs>`
- Full definition: open the source file above (content not embedded)

### Command: pptx
Source: [./command/pptx.md](./command/pptx.md)
- Description: Create professional PowerPoint presentations with proper structure and design
- Usage: `/pptx <presentation-type> <content-outline>`
- Full definition: open the source file above (content not embedded)

### Command: docx
Source: [./command/docx.md](./command/docx.md)
- Description: Create and edit Word documents with proper formatting and structure
- Usage: `/docx <operation> <document-specs>`
- Full definition: open the source file above (content not embedded)

### Command: brand-guidelines
Source: [./command/brand-guidelines.md](./command/brand-guidelines.md)
- Description: Establish comprehensive brand guidelines with visual identity and usage rules
- Usage: `/brand-guidelines <brand-type> <requirements>`
- Full definition: open the source file above (content not embedded)

### Command: brainstorming
Source: [./command/brainstorming.md](./command/brainstorming.md)
- Description: Facilitate structured brainstorming sessions with proven techniques and frameworks
- Usage: `/brainstorming <session-type> <topic>`
- Full definition: open the source file above (content not embedded)

### Command: canvas-design
Source: [./command/canvas-design.md](./command/canvas-design.md)
- Description: Design visual canvases for business models, user journeys, and strategic planning
- Usage: `/canvas-design <canvas-type> <design-goals>`
- Full definition: open the source file above (content not embedded)

### Command: artifacts-builder
Source: [./command/artifacts-builder.md](./command/artifacts-builder.md)
- Description: Build structured artifacts with proper validation, formatting, and documentation
- Usage: `/artifacts-builder <artifact-type> <specifications>`
- Full definition: open the source file above (content not embedded)

### Command: algorithmic-art
Source: [./command/algorithmic-art.md](./command/algorithmic-art.md)
- Description: Generate algorithmic art with mathematical patterns and aesthetic principles
- Usage: `/algorithmic-art <art-type> <pattern-specs>`
- Full definition: open the source file above (content not embedded)

### Command: code-review
Source: [./command/code-review.md](./command/code-review.md)
- Description: Conduct thorough code reviews with focus on quality, security, and maintainability
- Usage: `/code-review <review-scope> <focus-areas>`
- Full definition: open the source file above (content not embedded)

