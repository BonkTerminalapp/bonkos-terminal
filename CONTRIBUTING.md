# 🚀 BonkOS Terminal - Deployment Guide

<div align="center">

![Bonk Terminal Banner](images/Untitled-1.png)

[![BONK Terminal](https://img.shields.io/badge/Bonk-Terminal-orange?style=for-the-badge&logo=terminal)](https://bonkterminal.app/)
[![X Follow](https://img.shields.io/badge/Follow-@BonkTerminalapp-1DA1F2?style=for-the-badge&logo=x)](https://x.com/BonkTerminalapp)
[![X Community](https://img.shields.io/badge/X-Community-1DA1F2?style=for-the-badge&logo=x)](https://x.com/i/communities/1949345113047486917/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/BonkTerminalapp/bonkos-terminal)
[![Website](https://img.shields.io/badge/Website-bonkterminal.app-4285f4?style=for-the-badge&logo=google-chrome)](https://bonkterminal.app/)
[![Fair Launch](https://img.shields.io/badge/Fair_Launch-letsbonk.fun-FF6B35?style=for-the-badge&logo=solana)](https://letsbonk.fun)
[![Contributing](https://img.shields.io/badge/Contributing-Guide-28A745?style=for-the-badge&logo=git)](https://github.com/BonkTerminalapp/bonkos-terminal/blob/main/CONTRIBUTING.md)

*Complete deployment guide for the advanced React-based terminal emulator with Solana blockchain integration and AI-powered development tools.*

</div>

---

## 📋 Prerequisites

- **Node.js** 18+ (LTS recommended)
- **Git** 2.30+ with LFS support
- **GitHub Account** for repository hosting
- **API Keys** (OpenAI, Helius - optional)
- **Docker** (optional, for containerized deployment)

---

## 🔧 GitHub Setup & Repository Creation

### 1. Verify Project Status
```bash
# Check current directory and git status
pwd
git status

# Ensure all required files are present
ls -la | grep -E "(README|package|\.env\.example|\.gitignore)"
```

### 2. Initialize Git Repository (if not already done)
```bash
# Initialize repository
git init

# Set default branch to main
git branch -M main

# Add .gitignore first to ensure proper exclusions
git add .gitignore
git commit -m "chore: add gitignore for security"
```

### 3. Stage All Project Files
```bash
# Add all files (secrets automatically excluded by .gitignore)
git add .
git add .env.example
git add README.md
git add CONTRIBUTING.md
git add DEPLOY.md

# Verify staging (should NOT include .env, *.json wallet files, node_modules)
git status
```

### 4. Create Comprehensive Commit
```bash
git commit -m "feat: BonkOS Terminal - Advanced blockchain development environment

🎯 Core Features:
- React-based terminal emulator with xterm.js
- 30+ interactive commands with technical implementations
- GPT-4 powered AI agent for development assistance
- Solana Web3.js integration for blockchain interactions
- Real-time WebSocket data streams
- 90+ BONK-themed ASCII art assets

🛠️ Technical Stack:
- Frontend: React 18, TypeScript, Tailwind CSS
- Backend: Express.js, Socket.io, PostgreSQL
- Blockchain: Solana Web3.js, Jupiter API, Helius RPC
- AI/ML: OpenAI GPT-4, TensorFlow.js
- Security: JWT authentication, rate limiting, input validation

🔒 Security Implementation:
- Non-custodial wallet architecture
- Environment variable isolation
- Comprehensive .gitignore for sensitive data
- HTTPS enforcement and security headers

📚 Documentation:
- Complete README with technical architecture
- Contributing guidelines for developers
- Deployment guide with multiple options
- API documentation and code examples

Ready for fair launch on letsbonk.fun platform"
```

---

## 🌐 GitHub Repository Setup

### 1. Create New Repository
1. **Navigate to GitHub.com**
2. **Click "New Repository"**
3. **Repository Settings:**
   - **Name:** `bonkos-terminal` or `terminal-of-bonk`
   - **Description:** "Advanced React-based terminal emulator for BONK ecosystem with AI-powered blockchain development tools"
   - **Visibility:** Public
   - **Initialize:** Leave unchecked (you have existing files)

### 2. Add Remote and Push
```bash
# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/bonkos-terminal.git

# Verify remote
git remote -v

# Push to GitHub
git push -u origin main
```

### 3. Repository Configuration
```bash
# Set up repository metadata
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add repository topics (for discoverability)
# Go to GitHub > Settings > General > Topics
# Add: solana, bonk, terminal, blockchain, defi, ai, typescript, react
```

---

## 🐳 Docker Deployment

### 1. Build Production Image
```bash
# Build optimized Docker image
docker build -t bonkos-terminal:latest .

# Verify image size and layers
docker images bonkos-terminal:latest
docker history bonkos-terminal:latest
```

### 2. Local Docker Development
```bash
# Run with development environment
docker run -d \
  --name bonkos-terminal-dev \
  -p 5000:5000 \
  -e NODE_ENV=development \
  -e OPENAI_API_KEY=${OPENAI_API_KEY} \
  -e HELIUS_API_KEY=${HELIUS_API_KEY} \
  bonkos-terminal:latest

# View logs
docker logs -f bonkos-terminal-dev

# Access application: http://localhost:5000
```

### 3. Production Docker Deployment
```bash
# Create production environment file
cat > .env.production << EOF
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=your_production_key
HELIUS_API_KEY=your_production_key
DATABASE_URL=postgresql://user:pass@postgres:5432/bonk_terminal
REDIS_URL=redis://redis:6379
JWT_SECRET=your_jwt_secret_min_32_chars
CORS_ORIGINS=https://yourdomain.com,https://bonkterminal.app
EOF

# Run with production configuration
docker run -d \
  --name bonkos-terminal-prod \
  -p 80:5000 \
  --env-file .env.production \
  --restart unless-stopped \
  bonkos-terminal:latest
```

---

## 🏗️ Docker Compose Deployment

### 1. Multi-Service Setup
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/bonk_terminal
      - REDIS_URL=redis://redis:6379
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=bonk_terminal
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 2. Deploy with Docker Compose
```bash
# Start all services
docker-compose up -d

# View service status
docker-compose ps

# View logs
docker-compose logs -f app

# Scale application
docker-compose up -d --scale app=3
```

---

## ☁️ Cloud Platform Deployment

### 1. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Configure environment variables in Vercel dashboard
# Add: OPENAI_API_KEY, HELIUS_API_KEY, DATABASE_URL
```

### 2. Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy

# Set environment variables
railway variables set OPENAI_API_KEY=your_key
railway variables set HELIUS_API_KEY=your_key
```

### 3. Heroku Deployment
```bash
# Install Heroku CLI and login
heroku login

# Create application
heroku create bonkos-terminal-app

# Configure environment variables
heroku config:set OPENAI_API_KEY=your_key
heroku config:set HELIUS_API_KEY=your_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Scale dynos
heroku ps:scale web=1
```

---

## 🔧 Development Environment Setup

### 1. Local Development
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/bonkos-terminal.git
cd bonkos-terminal

# Install dependencies
npm ci

# Set up environment
cp .env.example .env

# Edit .env with your API keys
nano .env

# Start development server
npm run dev

# Access at http://localhost:5000
```

### 2. Environment Configuration
```bash
# Required environment variables
cat > .env << EOF
# 🤖 AI Services
OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=4096

# 🔗 Blockchain Services  
HELIUS_API_KEY=your_helius_api_key_here
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
JUPITER_API_URL=https://quote-api.jup.ag/v6

# 🗄️ Database (optional - uses in-memory if not provided)
DATABASE_URL=postgresql://user:password@localhost:5432/bonk_terminal
REDIS_URL=redis://localhost:6379

# 🔐 Security
JWT_SECRET=your_jwt_secret_minimum_32_characters_long
CORS_ORIGINS=http://localhost:3000,http://localhost:5000

# 📊 Monitoring (optional)
SENTRY_DSN=your_sentry_dsn_here
LOG_LEVEL=info
EOF
```

---

## 🌐 Production Deployment Checklist

### 🔒 Security Configuration
- [ ] **Environment Variables:** All secrets in environment, not code
- [ ] **HTTPS Enforcement:** SSL/TLS certificates configured
- [ ] **CORS Policy:** Proper origin restrictions
- [ ] **Rate Limiting:** API endpoint protection
- [ ] **Input Validation:** All user inputs sanitized
- [ ] **Authentication:** JWT tokens with proper expiration
- [ ] **Security Headers:** CSP, HSTS, X-Frame-Options
- [ ] **Database Security:** Connection encryption, limited permissions

### 🚀 Performance Optimization
- [ ] **Asset Optimization:** Images compressed, CSS/JS minified
- [ ] **CDN Configuration:** Static assets served from CDN
- [ ] **Database Indexing:** Proper indexes on query columns
- [ ] **Caching Strategy:** Redis for sessions and rate limiting
- [ ] **Connection Pooling:** Database connection optimization
- [ ] **Memory Management:** Heap size monitoring and limits
- [ ] **WebSocket Scaling:** Load balancer with sticky sessions

### 📊 Monitoring & Observability
- [ ] **Error Tracking:** Sentry or similar service configured
- [ ] **Performance Monitoring:** Response time and throughput metrics
- [ ] **Uptime Monitoring:** Health check endpoints
- [ ] **Log Aggregation:** Centralized logging with retention policy
- [ ] **Alert Configuration:** Critical error notifications
- [ ] **Backup Strategy:** Database and asset backup procedures

---

## 🔐 Security & Secrets Management

### Files EXCLUDED from Git (via .gitignore)
```bash
# Environment files
.env
.env.local
.env.production

# Wallet files (CRITICAL - never commit)
*.json
bonk*.json
wallet*.json
keypair*.json

# Dependencies and builds
node_modules/
dist/
build/
.next/

# OS and editor files
.DS_Store
Thumbs.db
*.log
.vscode/
.idea/

# Database
*.sqlite
*.db
```

### API Key Security
```bash
# ✅ SAFE - Environment variables
OPENAI_API_KEY=sk-...

# ❌ DANGEROUS - Never in code
const apiKey = "sk-proj-abc123...";

# ✅ SAFE - Runtime access
const apiKey = process.env.OPENAI_API_KEY;
```

### Wallet Security Best Practices
```typescript
// ✅ SAFE - Generate client-side
const keypair = Keypair.generate();

// ✅ SAFE - Store encrypted
const encryptedKey = encrypt(keypair.secretKey, userPassword);

// ❌ DANGEROUS - Never log or store plain text
console.log(keypair.secretKey); // DON'T DO THIS
```

---

## 👥 User Setup Instructions

### For Developers Cloning the Repository

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BonkTerminalapp/bonkos-terminal.git
   cd bonkos-terminal
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Required API Keys:**
   - **OpenAI API Key:** For AI agent functionality
     - Get from: https://platform.openai.com/api-keys
     - Required for: `ai`, `meme`, `debug` commands
   
   - **Helius API Key:** For enhanced Solana connectivity (optional)
     - Get from: https://www.helius.dev/
     - Improves: RPC performance, WebSocket subscriptions

5. **Start development:**
   ```bash
   npm run dev
   # Access at http://localhost:5000
   ```

### For Users (Non-developers)

1. **Visit the deployed application:**
   - **Official Site:** https://bonkterminal.app/
   - **Fair Launch:** https://letsbonk.fun (for token)

2. **No installation required** - runs in web browser

3. **Basic usage:**
   - Type `help` for available commands
   - Use `ai <question>` for assistance
   - Try `bonk` for ASCII art
   - Explore with `bonk-lore` and `energy`

---

## 🎯 Fair Launch Integration

### letsbonk.fun Platform Setup
```bash
# After successful deployment, prepare for fair launch:

# 1. Ensure application is production-ready
npm run build
npm run test
npm run audit

# 2. Verify security implementation
npm run security-check

# 3. Prepare token metadata
cat > token-metadata.json << EOF
{
  "name": "BonkOS Terminal Token",
  "symbol": "BONKOS",
  "description": "Native token for the BonkOS Terminal ecosystem - empowering blockchain developers with AI-powered tools",
  "image": "https://bonkterminal.app/images/token-logo.png",
  "external_url": "https://bonkterminal.app",
  "attributes": [
    {"trait_type": "Platform", "value": "Solana"},
    {"trait_type": "Type", "value": "Utility Token"},
    {"trait_type": "Launch", "value": "Fair Launch"}
  ]
}
EOF

# 4. Submit to letsbonk.fun team for review and launch coordination
```

---

## 🆘 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=3000 npm run dev
```

**Missing API keys:**
```bash
# Check environment variables
echo $OPENAI_API_KEY
# Should not be empty

# Verify .env file exists and has content
cat .env | grep -E "(OPENAI|HELIUS)"
```

**Database connection issues:**
```bash
# Use in-memory storage (no DATABASE_URL needed)
unset DATABASE_URL

# Or verify PostgreSQL is running
pg_isready -h localhost -p 5432
```

**WebSocket connection failures:**
```bash
# Check firewall settings
sudo ufw status

# Verify port accessibility
netstat -tulpn | grep :5000
```

### Performance Issues
```bash
# Monitor memory usage
node --max-old-space-size=4096 server.js

# Check process performance
top -p $(pgrep node)

# Analyze bundle size
npm run analyze
```

---

## 📞 Support & Resources

- **GitHub Issues:** [Report bugs and request features](https://github.com/BonkTerminalapp/bonkos-terminal/issues)
- **Contributing:** [Read the contributing guide](https://github.com/BonkTerminalapp/bonkos-terminal/blob/main/CONTRIBUTING.md)
- **X Community:** [Join developer discussions](https://x.com/i/communities/1949345113047486917/)
- **Official Website:** [Documentation and guides](https://bonkterminal.app/)

---

## ✅ Deployment Success Verification

After deployment, verify everything works:

```bash
# Check application health
curl -f http://localhost:5000/health || echo "Health check failed"

# Test API endpoints
curl -X GET http://localhost:5000/api/status

# Verify WebSocket connection
wscat -c ws://localhost:5000

# Test terminal commands (if API available)
curl -X POST http://localhost:5000/api/command \
  -H "Content-Type: application/json" \
  -d '{"command": "help"}'
```

**🎉 Your BonkOS Terminal is now deployed and ready for the BONK community!**

---

## 📄 License

This deployment guide is part of the **BonkOS Terminal** project, released under the **MIT License**.

See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Special thanks to:
- **Solana Foundation** for the incredible blockchain infrastructure
- **BONK Community** for the endless meme energy and support
- **letsbonk.fun team** for providing the fair launch platform and supporting development
- **OpenAI** for powering our AI features
- **Jupiter Team** for DEX aggregation capabilities
- **DevOps Community** for deployment best practices and tooling
- **All Contributors** who make this project possible

---

<div align="center">

**🔨 Built with BONK energy and terminal magic 🔨**

*Empowering the next generation of blockchain developers with chaotic meme energy and professional-grade tools*

[![Star this project](https://img.shields.io/github/stars/BonkTerminalapp/bonkos-terminal?style=social)](https://github.com/BonkTerminalapp/bonkos-terminal)
[![Fork this project](https://img.shields.io/github/forks/BonkTerminalapp/bonkos-terminal?style=social)](https://github.com/BonkTerminalapp/bonkos-terminal/fork)
[![Watch this project](https://img.shields.io/github/watchers/BonkTerminalapp/bonkos-terminal?style=social)](https://github.com/BonkTerminalapp/bonkos-terminal)

**Deploy with confidence. Scale with BONK. Ship responsibly.** 🚀

### 📞 Need Help with Deployment?

- **🐛 Issues:** [GitHub Issues](https://github.com/BonkTerminalapp/bonkos-terminal/issues)
- **💬 Community:** [X Developer Community](https://x.com/i/communities/1949345113047486917/)
- **🌐 Docs:** [bonkterminal.app](https://bonkterminal.app/)
- **🔧 Contributing:** [CONTRIBUTING.md](https://github.com/BonkTerminalapp/bonkos-terminal/blob/main/CONTRIBUTING.md)

</div>
