# Quick Start: Publishing with `pass`

You're using `pass` to securely store your GitHub token. Here's everything you need!

---

## ✅ Your Setup

**Token Location in pass:** `amr/github`

---

## 🚀 Publishing (3 Simple Ways)

### Method 1: Fully Automatic (Easiest) ⭐

The `publish.sh` script automatically retrieves your token from `pass`:

```bash
./publish.sh
```

**That's it!** No need to export anything manually.

### Method 2: One-Line Publish

```bash
export GITHUB_TOKEN=$(pass show amr/github) && npm run publish:both
```

### Method 3: Helper Script

```bash
source ./set-github-token.sh
npm run publish:both
```

---

## 📋 Common Commands

### View your token
```bash
pass show amr/github
```

### Export token for current session
```bash
export GITHUB_TOKEN=$(pass show amr/github)
```

### Verify token is set
```bash
echo $GITHUB_TOKEN | cut -c1-10
# Should show: ghp_...
```

### Update token in pass
```bash
pass edit amr/github
# Or insert new one
pass insert -f amr/github
```

---

## 🔄 Complete Release Workflow

```bash
# 1. Update version
./UPDATE_VERSION.sh 1.2.0

# 2. Update CHANGELOG.md
# (Edit with your changes)

# 3. Commit and tag
git add .
git commit -m "Bump version to 1.2.0"
git tag v1.2.0
git push origin main --tags

# 4. Publish (automatic pass retrieval!)
./publish.sh

# 5. Verify
# - npm.js: https://www.npmjs.com/package/liteagents
# - GitHub: https://github.com/hamr0/liteagents/packages
```

---

## 🔐 Security Tips

✅ Your token is encrypted with GPG
✅ Never stored in plain text
✅ Not in shell history or config files
✅ Scripts retrieve it automatically when needed

---

## 🆘 Troubleshooting

### "pass: command not found"
```bash
sudo apt install pass  # Ubuntu/Debian
brew install pass      # macOS
```

### "amr/github is not in the password store"
```bash
pass insert amr/github
# Enter your token when prompted
```

### Token not working
```bash
# Verify token in pass
pass show amr/github

# Should start with ghp_
pass show amr/github | head -c 4
```

### Need to regenerate token
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Scopes: `write:packages`, `read:packages`
4. Update in pass:
   ```bash
   pass insert -f amr/github
   ```

---

## 📚 Full Documentation

- **Pass Integration Guide:** [docs/PASS_INTEGRATION.md](PASS_INTEGRATION.md)
- **GitHub Setup:** [docs/GITHUB_SETUP.md](GITHUB_SETUP.md)
- **Publishing Guide:** [docs/PUBLISHING.md](PUBLISHING.md)

---

## ⚡ TL;DR

**Just run:**
```bash
./publish.sh
```

**The script does everything automatically!** 🎉
