# Agentic Kit

> **AI-powered development toolkit with 14 specialized agents and 20 workflow commands**

[![npm version](https://img.shields.io/npm/v/@amrhas82/agentic-kit)](https://www.npmjs.com/package/@amrhas82/agentic-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Supported Tools:**
[![Claude](https://img.shields.io/badge/Claude-Supported-blue?logo=anthropic)](https://claude.ai)
[![Opencode](https://img.shields.io/badge/Opencode-Supported-green)](https://github.com/amrhas82/opencode)
[![Ampcode](https://img.shields.io/badge/Ampcode-Supported-orange)](https://github.com/amrhas82/ampcode)
[![Droid](https://img.shields.io/badge/Droid-Supported-red)](https://github.com/amrhas82/droid)

Comprehensive toolkit featuring specialized AI agents and workflow commands for product management, agile development, and software engineering. **Interactive multi-tool installer** supports Claude, Opencode, Ampcode, and Droid.

---

## 🚀 Quick Start

### Interactive Installer (Recommended)

```bash
# Install globally
npm install -g @amrhas82/agentic-kit

# Run interactive installer
agentic-kit install
```

The installer guides you through:
1. **Select Variant** - Lite, Standard, or Pro
2. **Select Tools** - Claude, Opencode, Ampcode, Droid (or all)
3. **Configure Paths** - Use defaults or customize
4. **Install** - Watch real-time progress

**Silent Installation (CI/CD):**
```bash
agentic-kit install --silent --variant=standard --tools=claude
```

📖 **[Full Installation Guide →](docs/INSTALLER_GUIDE.md)**

### Variants

| Variant | Agents | Commands/Skills | Size | Best For |
|---------|--------|-----------------|------|----------|
| **Lite** | 5 | 20 | ~500 KB | Minimal setup, CI/CD |
| **Standard** ⭐ | 10 | 20 | ~1 MB | Most users |
| **Pro** | 14 | 20 | ~1.5 MB | Full features |

### Supported Tools

- **Claude** - Skills + Commands (separate categories)
- **Opencode** - Commands (unified)
- **Ampcode** - Commands (unified)
- **Droid** - Commands (unified)

### Start Using

```bash
# Get help
@master help

# Create a Product Requirements Document
@1-create-prd Create a PRD for a task management app

# Generate development tasks
@2-generate-tasks Break down this feature into tasks

# Process task list
@3-process-task-list Execute this task list
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| **[INSTALLER_GUIDE.md](docs/INSTALLER_GUIDE.md)** | Complete installation guide with troubleshooting |
| **[KNOWLEDGE_BASE.md](docs/KNOWLEDGE_BASE.md)** | Complete reference: all agents, commands, architecture |
| **[QUICK-START.md](QUICK-START.md)** | 15-minute onboarding guide |
| **[VARIANTS.md](VARIANTS.md)** | Compare variants and choose the right one |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | Common issues and solutions |

---

## 🤖 What's Included

### Agents (14 Total)

**Workflow Agents:**
- **1-create-prd** - Generate product requirements documents
- **2-generate-tasks** - Break down features into tasks
- **3-process-task-list** - Execute task lists systematically

**Core Team:**
- **master** - General task executor
- **orchestrator** - Workflow coordination
- **code-developer** - Implementation and debugging
- **quality-assurance** - Testing and quality gates
- **context-builder** - Project initialization and documentation

**Product & Planning:**
- **feature-planner** - Product strategy and roadmap
- **backlog-manager** - Backlog management
- **story-writer** - User stories and agile workflows
- **market-researcher** - Research and analysis

**Architecture & Design:**
- **system-architect** - System design and architecture
- **ui-designer** - UI/UX design and wireframes

### Commands & Skills (20 Total)

**Core Workflow Skills (Claude: skills/, Others: commands/):**
- **brainstorming** - Structured brainstorming sessions
- **code-review** - Comprehensive code reviews
- **condition-based-waiting** - Robust waiting mechanisms for tests
- **docs-builder** - Project documentation generation
- **root-cause-tracing** - Debug tracing and investigation
- **skill-creator** - Create new reusable skills
- **subagent-spawning** - Fresh subagent templates for task isolation
- **systematic-debugging** - Four-phase debugging framework
- **test-driven-development** - TDD workflow enforcement
- **testing-anti-patterns** - Identify and avoid test anti-patterns
- **verification-before-completion** - Verify before claiming done

**Development Commands (Claude: commands/, Others: commands/):**
- **debug** - Systematic issue investigation
- **explain** - Explain code for new team members
- **git-commit** - Intelligent git commits
- **optimize** - Performance analysis and optimization
- **refactor** - Safe refactoring with behavior preservation
- **review** - Comprehensive code review
- **security** - Security vulnerability scanning
- **ship** - Pre-deployment verification
- **test-generate** - Generate comprehensive test suites

---

## 🔧 Installation Options

### Option 1: Interactive Installer ⭐ (Recommended)

```bash
npm install -g @amrhas82/agentic-kit
agentic-kit install
```

**Features:**
- Choose variant (Lite/Standard/Pro)
- Select tools (Claude, Opencode, Ampcode, Droid)
- Configure installation paths
- Real-time progress tracking
- Automatic verification
- Rollback on failure

**Advanced Options:**
```bash
# Silent installation
agentic-kit install --silent --variant=standard --tools=claude

# Multiple tools
agentic-kit install --variant=pro --tools=claude,opencode

# Custom path
agentic-kit install --tools=claude --path claude=/custom/path

# Uninstall
agentic-kit install --uninstall --tools=claude
```

### Option 2: Claude Code via GitHub

```bash
/plugin add github:amrhas82/agentic-kit
```

### Option 3: npx (Run Temporarily)

```bash
npx @amrhas82/agentic-kit
```

---

## 💡 Example Workflows

**Feature Development:**
```
@orchestrator I need to add user authentication to my app
# Orchestrator analyzes → routes to appropriate agents
# → market-researcher (research approaches)
# → 1-create-prd (formal requirements)
# → 2-generate-tasks (implementation tasks)
# → 3-process-task-list (systematic execution)
```

**Code Quality:**
```
@quality-assurance Review this PR before merge
/code-review Check security and performance
/systematic-debugging Investigate this race condition
```

**Architecture & Design:**
```
@system-architect Design a microservices architecture for this monolith
@ui-designer Create wireframes for the mobile checkout flow
```

---

## 📦 npm Scripts

### Installation
```bash
npm run install-interactive  # Run interactive installer
npm run uninstall-tool       # Uninstall a tool
```

### Testing
```bash
npm test                # Run all tests
npm run test-installer  # Run installer tests
```

### Validation
```bash
npm run validate         # Validate package structure
npm run validate-packages # Validate all tool packages
```

### Publishing
```bash
npm run publish:npm      # Publish to npm
npm run publish:github   # Publish to GitHub packages
npm run publish:both     # Publish to both registries
```

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

1. Fork the repo
2. Create a feature branch
3. Add your agent or command
4. Submit a pull request

---

## 📊 Stats

- **14** Specialized Agents
- **20** Workflow Commands & Skills
- **3** Variants (Lite/Standard/Pro)
- **4** Supported Tools (Claude, Opencode, Ampcode, Droid)
- **MIT** License

---

## 🔗 Links

- **npm:** https://www.npmjs.com/package/@amrhas82/agentic-kit
- **GitHub:** https://github.com/amrhas82/agentic-kit
- **Issues:** https://github.com/amrhas82/agentic-kit/issues

---

## 📄 License

MIT © 2025 amrhas82

---

**Need help?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or [open an issue](https://github.com/amrhas82/agentic-kit/issues)
