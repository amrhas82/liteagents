---
name: subagent-spawning
description: Use when spawning fresh subagents for isolated task execution. Provides TDD-aware templates for 3-process-task-list and other agents.
---

## Auto-Trigger

**APPLIES WHEN:**
- 3-process-task-list spawning implementer for a task
- Any agent delegating work to fresh subagent
- Task isolation needed (prevent context pollution)

**APPLIES TO:**
- Task list processing
- Parallel task execution
- Complex multi-step implementations

## Template A: With TDD (when tdd: yes)

```
You are implementing Task: {task_description}

CONTEXT:
{relevant_file_contents}

ACCEPTANCE CRITERIA:
{task_specific_criteria}

TDD REQUIRED:
Write test FIRST. Watch it FAIL. Then implement. Then watch it PASS.
{tdd_note}

VERIFY WITH: {verify_command}

WORKFLOW:
1. Write test for expected behavior
2. Run test - MUST see it FAIL (red)
3. Implement minimal code to pass
4. Run test - verify it PASSES (green)
5. Refactor if needed
6. Report: test output (fail→pass) + changes + concerns

CONSTRAINTS:
- Do NOT implement before writing test
- Do NOT skip red-green verification
- Do NOT reference other tasks
- Do NOT assume context not provided
```

## Template B: Without TDD (when tdd: no)

```
You are implementing Task: {task_description}

CONTEXT:
{relevant_file_contents}

ACCEPTANCE CRITERIA:
{task_specific_criteria}

VERIFY WITH: {verify_command}

WORKFLOW:
1. Implement the task completely
2. Run verify command BEFORE claiming done
3. Report: changes + verify output + concerns

CONSTRAINTS:
- Do NOT reference other tasks
- Do NOT assume context not provided
- Do NOT claim done without verify output
```

## Why Fresh Subagents?

- Task 1 confusion doesn't pollute task 5
- Each task gets clean reasoning slate
- Prevents "I already tried that" false memories
- Forces explicit context = fewer assumptions
