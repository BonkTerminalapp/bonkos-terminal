# Deployment Guide

## GitHub Setup & Push

Your code is now ready to be pushed to GitHub with all secrets properly excluded.

### 1. Check Git Status
```bash
git status
```

### 2. Add All Files (secrets are excluded by .gitignore)
```bash
git add .
git add .gitignore
git add .env.example
git add README.md
git add CONTRIBUTING.md
```

### 3. Commit Your Changes
```bash
git commit -m "feat: Terminal of BONK - Complete BONK-themed blockchain terminal

- Interactive terminal with 30+ commands
- BONK AI agent powered by GPT-4
- Solana wallet creation and management
- 90+ ASCII art memes and BONK themes
- Mobile-optimized responsive design
- WebSocket real-time updates
- PostgreSQL integration with fallback storage
- Complete security setup with proper .gitignore"
```

### 4. Create GitHub Repository
1. Go to GitHub.com
2. Click "New Repository"
3. Name it "terminal-of-bonk" or similar
4. Don't initialize with README (you already have one)
5. Copy the repository URL

### 5. Add Remote and Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/terminal-of-bonk.git
git branch -M main
git push -u origin main
```

## What's Excluded from Git

The following sensitive files are automatically excluded:
- `.env` files (contains API keys)
- `boNk*.json` files (wallet keypairs)
- `node_modules/` and build files

## For Users Who Clone Your Repo

They will need to:
1. Copy `.env.example` to `.env`
2. Add their own API keys:
   - `OPENAI_API_KEY` for AI features
   - `HELIUS_API_KEY` for enhanced Solana connectivity (optional)
   - `DATABASE_URL` for PostgreSQL (optional, uses memory storage otherwise)
3. Run `npm install`
4. Run `npm run dev`

## Security Notes

✅ **Safe to share:**
- All source code
- Configuration files
- Documentation
- Package.json dependencies

❌ **Never in git:**
- API keys or secrets
- Private keys or seed phrases
- Wallet files
- Environment variables with real values

Your repository is now ready for public sharing!
