---
id: ship
name: ship
description: Check pre-deployment
usage: /ship
allowed-tools: Bash(npm *), Bash(git *)
---
Pre-deploy checklist:

- [ ] Tests pass (`npm test`)
- [ ] Lint clean (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console.log/debugger statements
- [ ] Env vars documented
- [ ] No hardcoded secrets
- [ ] Error handling complete
- [ ] Migrations ready

Run checks and report: Ready 🚀 or Blocked 🛑 with issues.
