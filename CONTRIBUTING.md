# Contributing to Terminal of BONK

Thank you for your interest in contributing to Terminal of BONK! This guide will help you get started.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/terminal-of-bonk.git
   cd terminal-of-bonk
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables** (copy `.env.example` to `.env` and fill in values)
5. **Start development server**:
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code patterns and structure
- Use meaningful variable and function names
- Add comments for complex logic

### BONK Theme Guidelines
- All content should maintain the BONK theme and energy
- Use hammer (🔨) emojis instead of other symbols where appropriate
- Keep the chaotic, high-energy personality consistent
- ASCII art should be BONK-themed or related to blockchain/crypto

### Adding New Commands
1. Add your command to `client/src/lib/terminal-commands.ts`
2. Follow the existing pattern:
   ```typescript
   "your-command": async (cryptoData?: CryptoData) => {
     return "\r\n" + colorText("Your output here", "color") + "\r\n";
   }
   ```
3. Update the help system if needed
4. Test your command thoroughly

### Adding New API Endpoints
1. Add endpoints to `server/routes.ts`
2. Follow RESTful patterns
3. Include proper error handling
4. Validate input data with Zod schemas

### Security Considerations
- Never commit API keys, private keys, or sensitive data
- Use environment variables for all secrets
- Validate all user inputs
- Follow security best practices for wallet operations

## Testing

- Test your changes thoroughly before submitting
- Ensure the terminal interface works on both desktop and mobile
- Test with and without API keys configured
- Verify wallet operations work correctly

## Submitting Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** following the guidelines above
3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```
4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create a Pull Request** on GitHub

## Pull Request Guidelines

- **Clear Title**: Use a descriptive title for your PR
- **Description**: Explain what changes you made and why
- **Screenshots**: Include screenshots for UI changes
- **Testing**: Describe how you tested your changes
- **Breaking Changes**: Note any breaking changes

## Types of Contributions

### 🔨 New Commands
- Terminal commands that fit the BONK theme
- Utility functions for blockchain operations
- Fun interactive features

### 🎨 ASCII Art & Memes
- BONK-themed ASCII art
- Crypto/blockchain related memes
- Terminal-native art pieces

### 🛠 Bug Fixes
- Fix existing functionality
- Improve error handling
- Performance improvements

### 📱 Mobile Improvements
- Better mobile responsiveness
- Touch-friendly interactions
- Mobile-specific optimizations

### 🤖 AI Features
- Improve the BONK AI agent
- Better meme generation
- Enhanced personality responses

## Code of Conduct

- Be respectful and inclusive
- Keep discussions focused on the project
- Maintain the fun, high-energy BONK spirit
- Help others learn and contribute

## Questions?

- Open an issue for questions about contributing
- Use the terminal's `ai` command for help with features
- Check existing issues and PRs before creating new ones

**Let's build the ultimate BONK terminal together!** 🔨