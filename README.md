# Terminal of BONK

A dynamic and playful web-based terminal for blockchain development, featuring BONK branding with authentic terminal interactions and comprehensive command system.

## Features

- **Interactive Terminal Interface**: Full-featured terminal with 30+ commands
- **BONK AI Agent**: GPT-4 powered assistant for terminal guidance and support
- **ASCII Art Collection**: 90+ BONK-themed ASCII memes and art pieces
- **Solana Wallet Integration**: Create and manage Solana wallets directly in the terminal
- **Real-time Data**: WebSocket updates for crypto data (placeholder mode)
- **Mobile Optimized**: Responsive design with mobile-first approach
- **BONKOS System**: Chaotic meme-generating operating system personality

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (optional, uses in-memory storage by default)

### Environment Variables

Create a `.env` file in the root directory:

```env
# Optional: OpenAI API key for AI agent and meme generation
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Helius API key for enhanced Solana connectivity
HELIUS_API_KEY=your_helius_api_key_here

# Optional: Database URL (uses in-memory storage if not provided)
DATABASE_URL=postgresql://user:password@localhost:5432/bonk_terminal
```

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd terminal-of-bonk
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5000`

## Available Commands

### Core Commands
- `help` - Show all available commands
- `clear` - Clear the terminal screen
- `date` - Show current date and time
- `whoami` - Display current user information

### BONK Commands
- `bonk` - Display random BONK ASCII art
- `meme` - Generate AI-powered BONK memes
- `hammer` - Activate BONK hammer energy
- `energy` - Check current BONK power levels

### AI Assistant
- `ai <question>` - Ask the BONK AI agent anything
- `agent <question>` - Alternative AI command
- `ask <question>` - Get help with terminal features

### Wallet Commands
- `wallet create` - Generate a new Solana wallet
- `wallet import` - Import existing wallet with seed phrase
- `wallet balance` - Check wallet balance (coming soon)
- `wallet address` - Display wallet address (coming soon)

### Crypto & Market
- `price` - Show BONK price data (placeholder mode)
- `chart` - Display price chart (coming soon)
- `market` - Market analysis (coming soon)

### Lore & Fun
- `bonk-lore` - Read BONK chronicles and legends
- `awaken` - Awaken the BONK energy
- `power` - Display BONK power information
- `rebuild` - BONK reconstruction themes

## Architecture

- **Frontend**: React with TypeScript, terminal interface
- **Backend**: Express.js with WebSocket support
- **Database**: PostgreSQL with Drizzle ORM (optional)
- **AI Integration**: OpenAI GPT-4 for meme generation and chat
- **Blockchain**: Solana Web3.js for wallet operations

## Development

### Project Structure
```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and schemas
├── wallets/         # Generated wallet files (git-ignored)
└── attached_assets/ # Static assets
```

### Key Files
- `client/src/components/Terminal.tsx` - Main terminal interface
- `client/src/lib/terminal-commands.ts` - Command implementations
- `server/routes.ts` - API endpoints
- `server/lib/bonk-agent.ts` - AI agent implementation
- `server/lib/openai-memes.ts` - Meme generation system

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes (if using PostgreSQL)

## Security Notes

- **Wallet Files**: All generated wallets are saved locally and git-ignored
- **Private Keys**: Never commit private keys or seed phrases
- **API Keys**: Use environment variables for all sensitive data
- **Local Storage**: Wallet data is stored securely in the `wallets/` directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support:
- Open an issue on GitHub
- Use the `ai` command in the terminal for help
- Check the `help` command for available features

---

**Built with BONK energy** 🔨