# 🔨 Terminal of BONK

<div align="center">

[![BONK Terminal](https://img.shields.io/badge/BONK-Terminal-orange?style=for-the-badge&logo=terminal)](https://bonkterminal.app/)
[![X Follow](https://img.shields.io/badge/Follow-@BonkTerminalapp-1DA1F2?style=for-the-badge&logo=x)](https://x.com/BonkTerminalapp)
[![Website](https://img.shields.io/badge/Website-bonkterminal.app-4285f4?style=for-the-badge&logo=google-chrome)](https://bonkterminal.app/)

*A dynamic and playful web-based terminal for blockchain development, featuring BONK branding with authentic terminal interactions and comprehensive command system.*

[🚀 **Try Live Demo**](https://bonkterminal.app/) | [📱 **Follow on X**](https://x.com/BonkTerminalapp) | [📖 **Documentation**](#available-commands)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🖥️ **Terminal Experience**
- 🎯 Interactive terminal with 30+ commands
- 🎨 90+ BONK-themed ASCII memes and art
- 📱 Mobile-optimized responsive design
- ⚡ Real-time WebSocket updates

</td>
<td width="50%">

### 🤖 **AI & Blockchain**
- 🧠 GPT-4 powered BONK AI agent
- 💰 Solana wallet integration
- 📊 Real-time crypto data feeds
- 🔨 BONKOS chaotic meme system

</td>
</tr>
</table>

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** (optional - uses in-memory storage by default)

### 🔧 Installation

```bash
# 1️⃣ Clone the repository
git clone <your-repo-url>
cd terminal-of-bonk

# 2️⃣ Install dependencies
npm install

# 3️⃣ Set up environment variables (optional)
cp .env.example .env
# Edit .env with your API keys

# 4️⃣ Start development server
npm run dev

# 5️⃣ Open in browser
# 🌐 http://localhost:5000
```

### ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# 🤖 OpenAI API key for AI agent and meme generation
OPENAI_API_KEY=your_openai_api_key_here

# 🔗 Helius API key for enhanced Solana connectivity
HELIUS_API_KEY=your_helius_api_key_here

# 🗄️ Database URL (optional - uses in-memory storage if not provided)
DATABASE_URL=postgresql://user:password@localhost:5432/bonk_terminal
```

---

## 🎮 Available Commands

<details>
<summary>🔧 <strong>Core Commands</strong></summary>

| Command | Description |
|---------|-------------|
| `help` | 📖 Show all available commands |
| `clear` | 🧹 Clear the terminal screen |
| `date` | 📅 Show current date and time |
| `whoami` | 👤 Display current user information |

</details>

<details>
<summary>🔨 <strong>BONK Commands</strong></summary>

| Command | Description |
|---------|-------------|
| `bonk` | 🎨 Display random BONK ASCII art |
| `meme` | 😂 Generate AI-powered BONK memes |
| `hammer` | ⚡ Activate BONK hammer energy |
| `energy` | 🔋 Check current BONK power levels |

</details>

<details>
<summary>🤖 <strong>AI Assistant</strong></summary>

| Command | Description |
|---------|-------------|
| `ai <question>` | 🧠 Ask the BONK AI agent anything |
| `agent <question>` | 🤖 Alternative AI command |
| `ask <question>` | ❓ Get help with terminal features |

</details>

<details>
<summary>💰 <strong>Wallet Commands</strong></summary>

| Command | Description |
|---------|-------------|
| `wallet create` | 🆕 Generate a new Solana wallet |
| `wallet import` | 📥 Import existing wallet with seed phrase |
| `wallet balance` | 💳 Check wallet balance *(coming soon)* |
| `wallet address` | 📍 Display wallet address *(coming soon)* |

</details>

<details>
<summary>📈 <strong>Crypto & Market</strong></summary>

| Command | Description |
|---------|-------------|
| `price` | 💹 Show BONK price data *(placeholder mode)* |
| `chart` | 📊 Display price chart *(coming soon)* |
| `market` | 📈 Market analysis *(coming soon)* |

</details>

<details>
<summary>🎭 <strong>Lore & Fun</strong></summary>

| Command | Description |
|---------|-------------|
| `bonk-lore` | 📚 Read BONK chronicles and legends |
| `awaken` | 🌟 Awaken the BONK energy |
| `power` | ⚡ Display BONK power information |
| `rebuild` | 🔄 BONK reconstruction themes |

</details>

---

## 🏗️ Architecture

```mermaid
graph TB
    A[🌐 React Frontend] --> B[🚀 Express Backend]
    B --> C[🗄️ PostgreSQL Database]
    B --> D[🤖 OpenAI GPT-4]
    B --> E[⛓️ Solana Web3.js]
    A --> F[🔌 WebSocket Connection]
    F --> B
```

### 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | ⚛️ React + TypeScript |
| **Backend** | 🚀 Express.js + WebSocket |
| **Database** | 🐘 PostgreSQL + Drizzle ORM |
| **AI** | 🧠 OpenAI GPT-4 |
| **Blockchain** | ⛓️ Solana Web3.js |

---

## 📁 Project Structure

```
📦 terminal-of-bonk
├── 📂 client/              # ⚛️ React frontend
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   └── 📂 lib/
├── 📂 server/              # 🚀 Express backend
│   ├── 📂 lib/
│   └── 📂 routes/
├── 📂 shared/              # 🔄 Shared types and schemas
├── 📂 wallets/             # 💰 Generated wallet files (git-ignored)
└── 📂 attached_assets/     # 🎨 Static assets
```

### 🔑 Key Files

| File | Purpose |
|------|---------|
| `client/src/components/Terminal.tsx` | 🖥️ Main terminal interface |
| `client/src/lib/terminal-commands.ts` | ⚙️ Command implementations |
| `server/routes.ts` | 🛣️ API endpoints |
| `server/lib/bonk-agent.ts` | 🤖 AI agent implementation |
| `server/lib/openai-memes.ts` | 😂 Meme generation system |

---

## 🔧 Development

### 📜 Available Scripts

```bash
npm run dev      # 🔥 Start development server
npm run build    # 📦 Build for production
npm run db:push  # 🗄️ Push database schema changes
```

### 🤝 Contributing

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **✨ Make** your changes
4. **🧪 Add** tests if applicable
5. **📤 Submit** a pull request

---

## 🔒 Security Notes

> ⚠️ **Important Security Reminders**
> 
> - 🔐 **Never commit private keys or seed phrases**
> - 🔑 **Use environment variables for all sensitive data**
> - 🛡️ **Keep API keys secure and rotate regularly**

---

## 📞 Support & Community

<div align="center">

### 🤝 Get Help

[![X Follow](https://img.shields.io/badge/Follow_Updates-@BonkTerminalapp-1DA1F2?style=for-the-badge&logo=x)](https://x.com/BonkTerminalapp)
[![Website](https://img.shields.io/badge/Visit_Website-bonkterminal.app-4285f4?style=for-the-badge&logo=google-chrome)](https://bonkterminal.app/)

**Need assistance?**
- 💬 Use the `ai` command in the terminal for instant help
- 📖 Check the `help` command for available features
- 🐛 Open an issue on GitHub for bug reports
- 🚀 Follow us on X for updates and announcements

</div>

---

## 📄 License

**MIT License** - see [LICENSE](LICENSE) file for details

---

<div align="center">

**🔨 Built with BONK energy 🔨**

*Empowering the next generation of blockchain developers with chaotic meme energy*

[![Star this project](https://img.shields.io/github/stars/your-username/terminal-of-bonk?style=social)](https://github.com/your-username/terminal-of-bonk)

</div>
