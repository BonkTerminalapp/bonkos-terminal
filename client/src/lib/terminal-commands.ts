import { getRandomBonkAsciiArt } from "./ascii-art";
import { 
  getSolanaBalance, 
  getSolanaAddress, 
  getSolanaConfig, 
  getClusterVersion, 
  getEpochInfo, 
  getValidators, 
  getSolanaHelp 
} from "./solana-client";
import { walletManager } from "./wallet";

// BONKOS Meme Generator
const generateBonkosMeme = (): string => {
  const characters = [
    "   /\\_/\\  \n  ( >.< )\n   > ^ <",
    "  (╬ಠ益ಠ)",
    "  ( ͡° ͜ʖ ͡°)",
    "  (ಠ_ಠ)",
    "  ¯\\_(ツ)_/¯",
    "  ლ(╹◡╹ლ)",
    "  (｡◕‿◕｡)",
    "  ಠ╭╮ಠ",
    "  (▼皿▼)",
    "  (ノಠ益ಠ)ノ",
    "  ┌( ಠ_ಠ)┘",
    "  ヽ(ಠ_ಠ)ノ"
  ];

  const bonkActions = [
    "    ===={BONK}====",
    "  \\\\     BONK!     //",
    "   ---> BONK <---",
    "  *** BONKED ***",
    "  >>>> BONK <<<<",
    "  [[[ BONK ]]]",
    "  === BONK ===",
    "  ||| BONK |||",
    "  /// BONK \\\\\\",
    "  ^^^ BONK ^^^"
  ];

  const targets = [
    "Exit Scammer",
    "Horny Jail",
    "Wen Moon Kid",
    "Paper Hands",
    "FUD Spreader",
    "Whale Manipulator",
    "Rug Puller",
    "Degen Gambler",
    "Chart Reader",
    "Trenches Soldier"
  ];

  const punchlines = [
    "Trenches secured.",
    "BONK deployed successfully.",
    "Target neutralized.",
    "Mission accomplished.",
    "System restored.",
    "Order maintained.",
    "Chaos eliminated.",
    "Protocol executed.",
    "BONK protocol active.",
    "Degen contained."
  ];

  const randomChar = characters[Math.floor(Math.random() * characters.length)];
  const randomAction = bonkActions[Math.floor(Math.random() * bonkActions.length)];
  const randomTarget = targets[Math.floor(Math.random() * targets.length)];
  const randomPunchline = punchlines[Math.floor(Math.random() * punchlines.length)];

  return `${randomChar}\r\n${randomAction}\r\n\r\nTarget: ${randomTarget}\r\n\r\n${randomPunchline}`;
};

interface CryptoData {
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  change24h: number;
}

const colorText = (text: string, color: string) => {
  const colors: Record<string, string> = {
    red: "\x1b[31m",
    green: "\x1b[32m", // Solana green
    yellow: "\x1b[33m", // BONK energy
    orange: "\x1b[38;5;208m", // BONK orange
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    reset: "\x1b[0m",
  };
  return colors[color] + text + colors.reset;
};

// BONK Splash Screen ASCII
const getBonkSplashScreen = (): string => {
  return `
██████╗  ██████╗ ███╗   ██╗██╗  ██╗ ██████╗ ███████╗
██╔══██╗██╔═══██╗████╗  ██║██║ ██╔╝██╔═══██╗██╔════╝
██║  ██║██║   ██║██╔██╗ ██║█████╔╝ ██║   ██║█████╗  
██║  ██║██║   ██║██║╚██╗██║██╔═██╗ ██║   ██║██╔══╝  
██████╔╝╚██████╔╝██║ ╚████║██║  ██╗╚██████╔╝███████╗
╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
           POWERED BY $BONK
`;
};

// BONKOS Logger
const bonkosLog = (message: string): string => {
  return colorText("[ BONKOS ]", "yellow") + " " + message;
};

export const commands: Record<string, (cryptoData?: CryptoData, userMessage?: string) => string | Promise<string>> = {
  help: () => {
    return "\r\n" + colorText("Available Commands:", "green") + "\r\n\r\n" +
           colorText("=== Solana CLI Commands ===", "yellow") + "\r\n" +
           colorText("solana", "cyan") + "              - Show Solana CLI help\r\n" +
           colorText("solana config get", "cyan") + "   - Show current config\r\n" +
           colorText("solana balance", "cyan") + "      - Show wallet balance\r\n" +
           colorText("solana address", "cyan") + "      - Show wallet address\r\n" +
           colorText("solana cluster-version", "cyan") + " - Show cluster version\r\n" +
           colorText("solana epoch-info", "cyan") + "   - Show epoch information\r\n" +
           colorText("solana validators", "cyan") + "   - Show validator info\r\n\r\n" +
           colorText("=== Wallet Commands ===", "yellow") + "\r\n" +
           colorText("wallet import", "cyan") + " - Import wallet from seed phrase\r\n" +
           colorText("wallet create", "cyan") + " - Create new wallet\r\n" +
           colorText("wallet balance", "cyan") + "- Show wallet balance\r\n" +
           colorText("wallet address", "cyan") + "- Show wallet address\r\n" +
           colorText("wallet export", "cyan") + " - Export private key (Base58)\r\n" +
           colorText("wallet disconnect", "cyan") + " - Disconnect wallet\r\n\r\n" +
           colorText("=== BONK Terminal Commands ===", "yellow") + "\r\n" +
           colorText("status", "cyan") + "       - Display BONK status (coming soon)\r\n" +
           colorText("meme", "cyan") + "         - BONKOS meme generator\r\n" +

           colorText("clear", "cyan") + "        - Clear terminal screen\r\n" +
           colorText("chat", "cyan") + "         - Access community chat\r\n" +
           colorText("buy", "cyan") + "          - Purchase BONK tokens\r\n" +
           colorText("news", "cyan") + "         - Latest BONK updates\r\n" +
           colorText("airdrop", "cyan") + "      - Claim BONK airdrop\r\n" +
           colorText("support", "cyan") + "      - Support the BONK project\r\n" +
           colorText("top-holders", "cyan") + "  - View top BONK holders\r\n\r\n" +
           colorText("=== Terminal Commands ===", "yellow") + "\r\n" +
           colorText("clear", "cyan") + "         - Clear terminal screen\r\n" +
           colorText("help", "cyan") + "          - Show this help menu\r\n" +
           colorText("history", "cyan") + "       - Show command history\r\n" +
           colorText("uptime", "cyan") + "        - Server status\r\n" +
           colorText("echo <text>", "cyan") + "   - Echo text\r\n" +
           colorText("sudo", "cyan") + "          - Easter egg\r\n" +
           colorText("404", "cyan") + "           - Glitch animation\r\n\r\n" +
           colorText("=== Lore Commands ===", "yellow") + "\r\n" +
           colorText("bonk-lore", "cyan") + " - BONK Chronicles\r\n" +
           colorText("hammer", "cyan") + "        - Hammer energy scene\r\n" +
           colorText("energy", "cyan") + "        - BONK power check\r\n" +
           colorText("power", "cyan") + "         - BONK sequence\r\n" +
           colorText("infection", "cyan") + "     - BONK protocol\r\n" +
           colorText("port69", "cyan") + "        - Hidden BONK data\r\n" +
           colorText("awaken", "cyan") + "        - BONK awakening\r\n" +
           colorText("rebuild", "cyan") + "       - BONK reconstruction\r\n" +
           colorText("init doom", "cyan") + "     - BONK apocalypse\r\n" +
           colorText("unlock", "cyan") + "        - BONK secret\r\n\r\n" +
           colorText("=== BONK Fun Commands ===", "yellow") + "\r\n" +
           colorText("bonk", "cyan") + "          - Show BONK meme\r\n" +
           colorText("bonk-party", "cyan") + "    - BONK celebration\r\n" +
           colorText("bonk-wisdom", "cyan") + "   - BONK philosophy\r\n" +
           colorText("bonk-energy", "cyan") + "   - Power up with BONK\r\n\r\n" +
           colorText("=== AI Assistant ===", "yellow") + "\r\n" +
           colorText("agent <question>", "cyan") + "   - Ask BONKOS AI for help\r\n" +
           colorText("ai <question>", "cyan") + "      - Alias for agent command\r\n" +
           colorText("ask <question>", "cyan") + "     - Another agent alias\r\n\r\n" +
           colorText("Hidden commands exist... try exploring! 🔨", "magenta") + "\r\n";
  },

  // Solana CLI Commands (using real mainnet data)
  solana: async (cryptoData?: CryptoData) => {
    const help = await getSolanaHelp();
    return "\r\n" + help + "\r\n";
  },

  "solana config get": async (cryptoData?: CryptoData) => {
    const config = await getSolanaConfig();
    return "\r\n" + config + "\r\n";
  },

  "solana address": async (cryptoData?: CryptoData) => {
    const address = await getSolanaAddress();
    return "\r\n" + colorText(address, "cyan") + "\r\n";
  },

  "solana balance": async (cryptoData?: CryptoData) => {
    const balance = await getSolanaBalance();
    return "\r\n" + colorText(balance, "green") + "\r\n";
  },

  "solana cluster-version": async (cryptoData?: CryptoData) => {
    const version = await getClusterVersion();
    return "\r\n" + colorText(version, "yellow") + "\r\n";
  },

  "solana epoch-info": async (cryptoData?: CryptoData) => {
    const epochInfo = await getEpochInfo();
    return "\r\n" + colorText(epochInfo, "white") + "\r\n";
  },

  "solana validators": async (cryptoData?: CryptoData) => {
    const validators = await getValidators();
    return "\r\n" + colorText(validators, "green") + "\r\n";
  },
  
  status: (cryptoData) => {
    return "\r\n" + colorText("🚀 TERMINAL OF BONK 🚀", "yellow") + "\r\n\r\n" +
           colorText("═══════════════════════════════════════", "cyan") + "\r\n" +
           colorText("🎯 COMING SOON!", "green") + "\r\n\r\n" +
           colorText("The ultimate BONK terminal experience", "white") + "\r\n" +
           colorText("is being built for the community!", "white") + "\r\n\r\n" +
           colorText("Features in development:", "yellow") + "\r\n" +
           colorText("• Real-time BONK price data", "cyan") + "\r\n" +
           colorText("• Advanced trading tools", "cyan") + "\r\n" +
           colorText("• Community features", "cyan") + "\r\n" +
           colorText("• Bonk-powered interactions", "cyan") + "\r\n" +
           colorText("• Meme generator system", "cyan") + "\r\n\r\n" +
           colorText("Network:", "white") + "         Solana\r\n" +
           colorText("═══════════════════════════════════════", "cyan") + "\r\n\r\n" +
           colorText("Status: UNDER CONSTRUCTION 🚧", "yellow") + "\r\n" +
           colorText("Stay tuned for the launch!", "green") + "\r\n";
  },
  
  meme: async () => {
    try {
      const response = await fetch('/api/generate-meme');
      const data = await response.json();
      
      if (data.meme) {
        return "\r\n" + bonkosLog("Fetching meme coin chaos from GPT-4...") + "\r\n\r\n" +
               colorText(data.meme, "green") + "\r\n\r\n" +
               bonkosLog("HIGH-QUALITY MEME DEPLOYED") + "\r\n" +
               bonkosLog("BONKOS AI CHAOS ACTIVATED") + "\r\n";
      } else {
        // Fallback to local generator
        const bonkosMeme = generateBonkosMeme();
        return "\r\n" + bonkosLog("GPT-4 unavailable - using local chaos...") + "\r\n" +
               colorText(bonkosMeme, "green") + "\r\n" +
               bonkosLog("LOCAL MEME DEPLOYED") + "\r\n" +
               bonkosLog("BONKOS BACKUP SYSTEMS ONLINE") + "\r\n";
      }
    } catch (error) {
      // Fallback to local generator
      const bonkosMeme = generateBonkosMeme();
      return "\r\n" + bonkosLog("API error - falling back to local chaos...") + "\r\n" +
             colorText(bonkosMeme, "green") + "\r\n" +
             bonkosLog("LOCAL MEME DEPLOYED") + "\r\n" +
             bonkosLog("BONKOS BACKUP SYSTEMS ONLINE") + "\r\n";
    }
  },

  // New BONK Commands
  honk: () => {
    return "\r\n" + colorText("HONK VS BONK BATTLE", "yellow") + "\r\n\r\n" +
           colorText("   HONK            VS             BONK", "cyan") + "\r\n" +
           colorText(" __(.)<                       / \\__", "white") + "\r\n" +
           colorText(" \\___) )                     (    @\\___", "white") + "\r\n" +
           colorText("                               /         O", "white") + "\r\n\r\n" +
           colorText("Result: BONK wins, as always.", "green") + "\r\n" +
           bonkosLog("DUCK HAS BEEN BONKED INTO SUBMISSION") + "\r\n";
  },

  "/trench": () => {
    return "\r\n" + colorText("SOLANA TRENCH WARFARE", "yellow") + "\r\n\r\n" +
           colorText("    ┌─────────────────┐", "green") + "\r\n" +
           colorText("    │ BONK BATTALION  │", "green") + "\r\n" +
           colorText("    └─────────────────┘", "green") + "\r\n" +
           colorText("  ╔══════════════════════╗", "cyan") + "\r\n" +
           colorText("  ║ ░░░░░░░░░░░░░░░░░░░░ ║", "white") + "\r\n" +
           colorText("  ║ ░ ◕  ◕  ◕  ◕  ◕ ░ ║", "white") + "\r\n" +
           colorText("  ║ ░░░░░░░░░░░░░░░░░░░░ ║", "white") + "\r\n" +
           colorText("  ║      TRENCHES       ║", "green") + "\r\n" +
           colorText("  ╚══════════════════════╝", "cyan") + "\r\n" +
           colorText("  Enemy: Exit Scammers", "red") + "\r\n" +
           colorText("  Status: HOLDING THE LINE", "green") + "\r\n" +
           bonkosLog("TRENCHES SECURED, ANON") + "\r\n";
  },

  battle: () => {
    return "\r\n" + colorText("HONK VS BONK BATTLE ROYALE", "yellow") + "\r\n\r\n" +
           colorText("   HONK            VS             BONK", "cyan") + "\r\n" +
           colorText(" __(.)<                       / \\__", "white") + "\r\n" +
           colorText(" \\___) )                     (    @\\___", "white") + "\r\n" +
           colorText("                               /         O", "white") + "\r\n" +
           colorText("                              /_____/   U", "white") + "\r\n\r\n" +
           colorText("🥊 FIGHT RESULTS:", "yellow") + "\r\n" +
           colorText("Round 1: BONK delivers devastating hammer blow", "green") + "\r\n" +
           colorText("Round 2: Duck attempts honk, gets bonked", "green") + "\r\n" +
           colorText("Round 3: BONK achieves total domination", "green") + "\r\n\r\n" +
           colorText("WINNER: BONK (as always)", "green") + "\r\n" +
           bonkosLog("BONK SUPREMACY MAINTAINED") + "\r\n";
  },
  

  
  chat: () => {
    return "\r\n" + colorText("🚀 BONK COMMUNITY CHAT 🚀", "yellow") + "\r\n\r\n" +
           colorText("[DEV] BONKDev:", "cyan") + " gm frens! BONK to the moon! 🚀\r\n" +
           colorText("[WHALE] DiamondHands:", "green") + " Loading up on more BONK! 💎\r\n" +
           colorText("[ANON] BONKFan69:", "white") + " This terminal is so cool! 👀\r\n" +
           colorText("[BOT] PriceAlert:", "magenta") + " BONK community growing strong! 📈\r\n\r\n" +
           colorText('Type "chat <message>" to participate (feature coming soon!)', "yellow") + "\r\n";
  },
  
  buy: () => {
    return "\r\n" + colorText("🚀 BONK TOKEN PURCHASE 🚀", "yellow") + "\r\n\r\n" +
           colorText("🎯 COMING SOON!", "green") + "\r\n\r\n" +
           colorText("BONK purchasing integration is being built!", "white") + "\r\n" +
           colorText("Features in development:", "yellow") + "\r\n" +
           colorText("• Direct wallet integration", "cyan") + "\r\n" +
           colorText("• Real-time price feeds", "cyan") + "\r\n" +
           colorText("• Instant BONK purchases", "cyan") + "\r\n" +
           colorText("• Portfolio tracking", "cyan") + "\r\n\r\n" +
           colorText("Network: Solana", "white") + "\r\n" +
           colorText("Status: UNDER CONSTRUCTION 🚧", "yellow") + "\r\n\r\n" +
           colorText("Stay tuned for the official launch!", "green") + "\r\n";
  },
  
  news: () => {
    const newsDate = new Date().toISOString().split("T")[0];
    return "\r\n" + colorText("📰 BONK TERMINAL NEWS 📰", "yellow") + "\r\n\r\n" +
           colorText("═══════════════════════════════════════", "cyan") + "\r\n" +
           colorText(`[${newsDate}]`, "white") + " Terminal of BONK announced! 🚀\r\n" +
           colorText("[2025-07-20]", "white") + " Development phase initiated ⚡\r\n" +
           colorText("[2025-07-19]", "white") + " Community-driven features planned 🎨\r\n" +
           colorText("[2025-07-18]", "white") + " BONK integration architecture designed 📊\r\n" +
           colorText("[2025-07-17]", "white") + " Terminal framework established 🚀\r\n" +
           colorText("═══════════════════════════════════════", "cyan") + "\r\n\r\n" +
           colorText("🎯 COMING SOON - Stay tuned for launch!", "green") + "\r\n";
  },
  
  airdrop: () => {
    return "\r\n" + colorText("🪂 BONK AIRDROP 🪂", "yellow") + "\r\n\r\n" +
           colorText("🎯 COMING SOON", "green") + "\r\n\r\n" +
           colorText("BONK airdrop features are in development!", "white") + "\r\n" +
           colorText("Stay tuned for announcements!", "cyan") + "\r\n\r\n" +
           colorText("Status: UNDER CONSTRUCTION 🚧", "yellow") + "\r\n";
  },

  support: () => {
    return "\r\n" + colorText("💎 SUPPORT BONK TERMINAL 💎", "yellow") + "\r\n\r\n" +
           colorText("🎯 COMING SOON!", "green") + "\r\n\r\n" +
           colorText("Support features in development:", "white") + "\r\n" +
           colorText("• Community contributions", "cyan") + "\r\n" +
           colorText("• BONK staking rewards", "cyan") + "\r\n" +
           colorText("• Developer donations", "cyan") + "\r\n" +
           colorText("• Premium terminal features", "cyan") + "\r\n\r\n" +
           colorText("Thank you for supporting Terminal of BONK!", "yellow") + "\r\n";
  },
  
  "top-holders": () => {
    return "\r\n" + colorText("👑 BONK HOLDERS LEADERBOARD 👑", "yellow") + "\r\n\r\n" +
           colorText("🎯 COMING SOON!", "green") + "\r\n\r\n" +
           colorText("Real-time BONK holder tracking in development!", "white") + "\r\n" +
           colorText("Features being built:", "yellow") + "\r\n" +
           colorText("• Live holder rankings", "cyan") + "\r\n" +
           colorText("• Portfolio analytics", "cyan") + "\r\n" +
           colorText("• Community badges", "cyan") + "\r\n" +
           colorText("• Whale watching alerts", "cyan") + "\r\n\r\n" +
           colorText("Status: UNDER CONSTRUCTION 🚧", "yellow") + "\r\n";
  },
  
  "bonk-lore": () => {
    return "\r\n" + colorText("🔨 THE BONK CHRONICLES 🔨", "magenta") + "\r\n\r\n" +
           colorText("Deep in the Solana trenches, where degens gather,", "magenta") + "\r\n" +
           colorText("BONK emerged as the ultimate meme weapon...", "magenta") + "\r\n\r\n" +
           
           colorText("Born from pure chaos and degen energy,", "magenta") + "\r\n" +
           colorText("BONK became the hammer of justice in crypto.", "magenta") + "\r\n" +
           colorText("Bonking scammers, exit liquidity, and paper hands.", "magenta") + "\r\n\r\n" +
           
           colorText("Legend speaks of the Great Bonk Convergence of 2022,", "magenta") + "\r\n" +
           colorText("when all meme energy concentrated into one token,", "magenta") + "\r\n" +
           colorText("giving birth to the bonkiest force: $BONK", "magenta") + "\r\n\r\n" +
           
           colorText("Those who HODL BONK are blessed with bonk energy,", "magenta") + "\r\n" +
           colorText("forever protected by the power of the hammer", "magenta") + "\r\n" +
           colorText("running eternally on Solana's blockchain...", "magenta") + "\r\n\r\n" +
           
           colorText('🔨 "BONK THE SYSTEM!" - The BONK Manifesto', "yellow") + "\r\n\r\n" +
           colorText("End of recorded lore. More bonk secrets await...", "cyan") + "\r\n";
  },

  "hammer": () => {
    return "\r\n" + colorText("🔨 BONK HAMMER ENERGY ACTIVATED! 🔨", "green") + "\r\n\r\n" +
           colorText("*BONK hammer gleaming in the terminal light*", "cyan") + "\r\n" +
           colorText("*Diamond hands gripping the ultimate weapon*", "yellow") + "\r\n" +
           colorText("*Preparing to bonk the next target*", "magenta") + "\r\n\r\n" +
           colorText("BONK SAYS:", "yellow") + "\r\n" +
           colorText("'TIME TO BONK THE SYSTEM!'", "white") + "\r\n" +
           colorText("'BONK OR BE BONKED!'", "white") + "\r\n" +
           colorText("'The bonk energy grows stronger!'", "green") + "\r\n\r\n" +
           colorText("🔨 Keep that bonk energy flowing! 🔨", "cyan") + "\r\n";
  },

  "energy": () => {
    return "\r\n" + colorText("⚡ ENERGY LEVELS: MAXIMUM BONK POWER ⚡", "yellow") + "\r\n\r\n" +
           colorText("Current BONK Energy:", "green") + " " + colorText("9000+ BONK UNITS", "cyan") + "\r\n" +
           colorText("Hammer Swing Speed:", "green") + " " + colorText("LIGHTNING FAST", "yellow") + "\r\n" +
           colorText("Bonkiness Level:", "green") + " " + colorText("MAXIMUM", "magenta") + "\r\n" +
           colorText("BONK Power Level:", "green") + " " + colorText("OVER 9000!", "red") + "\r\n\r\n" +
           colorText("🔨 Channel this bonk energy into $BONK! 🔨", "green") + "\r\n";
  },

  "awaken": () => {
    return "\r\n" + colorText("🔨 BONK AWAKENS! 🔨", "magenta") + "\r\n\r\n" +
           colorText("The BONK hammer emerges from the digital void...", "white") + "\r\n" +
           colorText("BONK's chaotic energy surveys the blockchain...", "cyan") + "\r\n" +
           colorText("It speaks in the ancient language of memes:", "yellow") + "\r\n\r\n" +
           colorText("'BONK THE SYSTEM!'", "green") + "\r\n" +
           colorText("'HODL OR BE BONKED!'", "green") + "\r\n" +
           colorText("'THE BONK IS ETERNAL!'", "green") + "\r\n\r\n" +
           colorText("You have been blessed by BONK's chaotic energy.", "magenta") + "\r\n" +
           colorText("Your BONK holdings are now protected by hammer magic.", "white") + "\r\n";
  },



  // Wallet Commands
  "wallet import": async (cryptoData?: CryptoData) => {
    return "\r\n" + colorText("🔐 WALLET IMPORT", "yellow") + "\r\n\r\n" +
           colorText("To import your wallet, enter your 12 or 24-word seed phrase:", "white") + "\r\n" +
           colorText("Type: wallet import <your-seed-phrase>", "cyan") + "\r\n\r\n" +
           colorText("Example:", "yellow") + "\r\n" +
           colorText("wallet import abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about", "cyan") + "\r\n\r\n" +
           colorText("⚠️ WARNING: Never share your seed phrase with anyone!", "red") + "\r\n";
  },

  "wallet create": async (cryptoData?: CryptoData) => {
    try {
      const response = await fetch('/api/create-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to create wallet');
      }
      
      const result = await response.json();
      
      if (result.success) {
        return "\r\n" + colorText("🎉 WALLET CREATED SUCCESSFULLY!", "green") + "\r\n\r\n" +
               colorText("Address: " + result.address, "cyan") + "\r\n" +
               colorText("Private Key: " + result.privateKey, "yellow") + "\r\n\r\n" +
               colorText("⚠️ IMPORTANT SECURITY NOTICE:", "red") + "\r\n" +
               colorText("• Save your private key in a secure location", "white") + "\r\n" +
               colorText("• Never share your private key with anyone", "white") + "\r\n" +
               colorText("• This key gives full access to your wallet", "white") + "\r\n\r\n" +
               colorText("Your wallet is ready to use!", "green") + "\r\n";
      } else {
        return "\r\n" + colorText("❌ Failed to create wallet", "red") + "\r\n";
      }
    } catch (error) {
      return "\r\n" + colorText("❌ Error creating wallet: " + error, "red") + "\r\n";
    }
  },

  "wallet balance": async (cryptoData?: CryptoData) => {
    return "\r\n" + colorText("💰 WALLET BALANCE", "yellow") + "\r\n\r\n" +
           colorText("Feature coming soon!", "white") + "\r\n" +
           colorText("Create a wallet first with: wallet create", "cyan") + "\r\n";
  },

  "wallet address": async (cryptoData?: CryptoData) => {
    return "\r\n" + colorText("📍 WALLET ADDRESS", "yellow") + "\r\n\r\n" +
           colorText("Feature coming soon!", "white") + "\r\n" +
           colorText("Create a wallet first with: wallet create", "cyan") + "\r\n";
  },

  "wallet disconnect": async (cryptoData?: CryptoData) => {
    return "\r\n" + colorText("🔌 WALLET DISCONNECT", "yellow") + "\r\n\r\n" +
           colorText("No wallet currently connected.", "white") + "\r\n";
  },

  "wallet export": async (cryptoData?: CryptoData) => {
    return "\r\n" + colorText("🔑 WALLET EXPORT", "yellow") + "\r\n\r\n" +
           colorText("Feature coming soon!", "white") + "\r\n" +
           colorText("Create a wallet first with: wallet create", "cyan") + "\r\n";
  },

  "clear": () => {
    return "\x1b[2J\x1b[H";
  },

  "history": () => {
    return "\r\n" + colorText("📋 COMMAND HISTORY", "yellow") + "\r\n\r\n" +
           colorText("Recent commands:", "white") + "\r\n" +
           colorText("1. help", "cyan") + "\r\n" +
           colorText("2. status", "cyan") + "\r\n" +
           colorText("3. meme", "cyan") + "\r\n" +
           colorText("4. bonk", "cyan") + "\r\n" +
           colorText("5. wallet balance", "cyan") + "\r\n\r\n" +
           colorText("Use 'clear' to clear terminal", "white") + "\r\n";
  },

  "uptime": () => {
    const uptimeHours = Math.floor(Math.random() * 720) + 24;
    const days = Math.floor(uptimeHours / 24);
    const hours = uptimeHours % 24;
    
    return "\r\n" + colorText("⏰ SERVER STATUS", "green") + "\r\n\r\n" +
           colorText(`Uptime: ${days} days, ${hours} hours`, "white") + "\r\n" +
           colorText("Status: RUNNING", "green") + "\r\n" +
           colorText("Load: 0.42, 0.69, 1.337", "cyan") + "\r\n" +
           colorText("Memory: 69% used", "yellow") + "\r\n" +
           colorText("Bonk Level: MAXIMUM", "magenta") + "\r\n\r\n" +
           colorText("🔨 All systems operational!", "green") + "\r\n";
  },

  "sudo": () => {
    return "\r\n" + colorText("🚫 ACCESS DENIED", "red") + "\r\n\r\n" +
           colorText("sudo: command not found", "red") + "\r\n" +
           colorText("You're not root here, human!", "yellow") + "\r\n" +
           colorText("This is BONK territory!", "green") + "\r\n\r\n" +
           colorText("BONK: Access denied! Maximum security activated!", "green") + "\r\n";
  },

  "404": () => {
    return "\r\n" + colorText("┌─────────────────┐", "red") + "\r\n" +
           colorText("│ ████ ████ ████ │", "red") + "\r\n" +
           colorText("│ █  █ █  █ █  █ │", "red") + "\r\n" +
           colorText("│ █  █ █  █ █  █ │", "red") + "\r\n" +
           colorText("│ ████ ████ ████ │", "red") + "\r\n" +
           colorText("└─────────────────┘", "red") + "\r\n" +
           colorText("ERROR 404: BONK NOT FOUND", "red") + "\r\n" +
           colorText("*glitch* *glitch* *glitch*", "magenta") + "\r\n" +
           colorText("System.out.trash();", "cyan") + "\r\n";
  },

  "power": () => {
    return "\r\n" + colorText("🔨 INITIALIZING BONK SEQUENCE 🔨", "green") + "\r\n\r\n" +
           colorText("Loading hammer energy...", "yellow") + " ████████████ 100%\r\n" +
           colorText("Spreading BONK power...", "yellow") + " ████████████ 100%\r\n" +
           colorText("Bonking the system...", "yellow") + " ████████████ 100%\r\n\r\n" +
           colorText("🔨 BONK SEQUENCE COMPLETE 🔨", "green") + "\r\n" +
           colorText("The BONK spreads through the digital realm...", "magenta") + "\r\n" +
           colorText("Your terminal has been charged with BONK ENERGY!", "green") + "\r\n";
  },

  "infection": () => {
    return "\r\n" + colorText("🔨 BONK PROTOCOL DETECTED 🔨", "red") + "\r\n\r\n" +
           colorText("SUCCESS: System infected with BONK.EXE", "green") + "\r\n" +
           colorText("BONK symptoms include:", "yellow") + "\r\n" +
           colorText("• Excessive meme generation", "white") + "\r\n" +
           colorText("• Uncontrollable HODL urges", "white") + "\r\n" +
           colorText("• Attraction to hammer energy", "white") + "\r\n" +
           colorText("• Diamond hand syndrome", "white") + "\r\n\r\n" +
           colorText("BONK recommendation: BUY MORE BONK", "green") + "\r\n" +
           colorText("*This is premium BONK enhancement*", "cyan") + "\r\n";
  },

  "port69": () => {
    return "\r\n" + colorText("🔌 ACCESSING HIDDEN PORT 69 🔌", "magenta") + "\r\n\r\n" +
           colorText("Connection established...", "cyan") + "\r\n" +
           colorText("Decrypting BONK stream...", "yellow") + "\r\n" +
           colorText("Loading secret payload...", "green") + "\r\n\r\n" +
           colorText("SECRET MESSAGE UNLOCKED:", "yellow") + "\r\n" +
           colorText("'The real treasure was the BONK we collected along the way'", "white") + "\r\n" +
           colorText("- BONK Ancient Wisdom", "magenta") + "\r\n\r\n" +
           colorText("Connection closed. Port 69 secured.", "cyan") + "\r\n";
  },

  "rebuild": () => {
    return "\r\n" + colorText("🔨 INITIATING BONK RECONSTRUCTION 🔨", "red") + "\r\n\r\n" +
           colorText("Terminal.exe is being bonked...", "yellow") + "\r\n" +
           colorText("████████▓▓▓▓░░░░", "red") + " 50%\r\n" +
           colorText("Files transforming to BONK energy...", "yellow") + "\r\n" +
           colorText("████████████▓▓▓▓", "red") + " 75%\r\n" +
           colorText("Embracing the beautiful chaos...", "yellow") + "\r\n" +
           colorText("████████████████", "green") + " 100%\r\n\r\n" +
           colorText("BONK RECONSTRUCTION COMPLETE", "green") + "\r\n" +
           colorText("System has achieved maximum BONK state", "white") + "\r\n" +
           colorText("BONK: Beautiful digital chaos!", "green") + "\r\n";
  },

  "init doom": () => {
    return "\r\n" + colorText("💥 ASCII BONKPOCALYPSE INITIATED 💥", "red") + "\r\n\r\n" +
           colorText("    ███████████████████████", "red") + "\r\n" +
           colorText("  ████                 ████", "red") + "\r\n" +
           colorText(" ████   BONK DOOM     ████", "red") + "\r\n" +
           colorText("████     ACTIVATED     ████", "red") + "\r\n" +
           colorText(" ████                 ████", "red") + "\r\n" +
           colorText("  ████               ████", "red") + "\r\n" +
           colorText("    ███████████████████████", "red") + "\r\n\r\n" +
           colorText("The BONK times have come...", "magenta") + "\r\n" +
           colorText("All data will return to BONK...", "yellow") + "\r\n" +
           colorText("BONK: The world is reaching maximum BONK!", "green") + "\r\n";
  },

  "unlock": () => {
    return "\r\n" + colorText("🔐 BONK SECRET UNLOCKED! 🔐", "yellow") + "\r\n\r\n" +
           colorText("🎉 BONK POWER ACTIVATED! 🎉", "yellow") + "\r\n" +
           colorText("You have discovered the true BONK wisdom!", "white") + "\r\n" +
           colorText("BONK blessing bestowed upon your holdings!", "green") + "\r\n";
  },

  // New BONK Commands
  "bonk": () => {
    const bonkMemes = [
      // Original memes
      `
    (•_•)
   <) )╯🔨 
    / \\
   BONK!
      `,
      `
    🐶
   🔨🤕
You have been BONKED
      `,
      `
   (⌐■_■)
   ( ╯°□°)╯︵ 🐶
         🔨
   BONK
      `,
      `
  (｀・ω・´)"
  /︻╦╤─ - - - 🐶
     BONKED
      `,
      `
        ／＞　 フ
       | 　_　_| 
 ／\` ミ＿xノ 
/　　　　 |
(　 ヽ＿ヽ_)__)
 ＼二)
     BONK
      `,
      `
🐕: me when i post a meme
👊: the internet
BONK
      `,
      `
（╬ಠ益ಠ)
⊃🔨
 🐶 — BONK
      `,
      `
👨‍⚖️ BONK COURT
👨‍⚖️──────────────🐶
         GUILTY
      `,
      `
😐👉🐶
🔨
go to horny jail
      `,
      `
(ノಥ,_｣ಥ)ノ︵ 🐶
BONK.
      `,
      // New memes from user
      `
(•_•)
<) )╯   BONK!
 / \\
      `,
      `
(ノಠ益ಠ)ノ彡┻━┻
       BONKED.
      `,
      `
( ͡° ͜ʖ ͡°)つ──☆*:・ﾟ
      BONK.
      `,
      `
   /\\_/\\  
  ( o.o ) 
   > ^ <   BONK RECEIVED
      `,
      `
(｡•́︿•̀｡)
 /︻╦̵̵̿╤── ───   BONK PROTOCOL
      `,
      `
 ________
|        |
| BONKED |
|________|
 (\\__/) ||
 (•ㅅ•) ||
 / 　 づ
      `,
      `
(╬ಠ益ಠ)
 ─▄▀▀▀▄──────
 ─█───█──────
 ─▀▄▀▄▀  BONK DROP
      `,
      `
  / \\__
 (    @\\___
 /         O
/   (_____/
/_____/   U   BONK DOG DEPLOYED
      `,
      `
You posted:
"Wen utility?"

System reply:
  BONK
   ||
  /__\\
      `,
      `
   __
  / /   ___   ____ ___
 / /   / _ \\ / __ \`__ \\
/ /___/  __// / / / / /
\\____/\\___/_/ /_/ /_/    BONKOS
      `,
      `
(ง •̀_•́)ง
   |||
   |||  BONK!
  / | \\
      `,
      `
(⌐■_■)
(╯︵╰,)   BONK BLAST INITIATED
      `,
      `
(╯°□°）╯︵ ┻━┻
        BONK!
You asked for it.
      `,
      `
 ________
/        \\\\
|  BONK!  |
\\________/
    ||
   /__\\
      `,
      `
(¬_¬)つ–{} 
        BONK GRENADE THROWN
      `,
      `
> Initializing BonkOS...
> trench_wallet.sh --deploy
> BONK SENT ✅
      `,
      `
( ಠ ͜ʖರೃ)
     ┌∩┐(◣_◢)┌∩┐
         DOUBLE BONK
      `,
      `
      __
     |==|
     |  |  BONK BLADE
     |  |
     |__|
    /____\\
      `,
      `
ERROR 404:
      BONK NOT FOUND
Installing BONK...
Success.
      `,
      `
 ________________
|  Welcome to     |
|     BONKOS      |
|_________________|
$ bonk.sh --rekt
      `
    ];
    
    const randomMeme = bonkMemes[Math.floor(Math.random() * bonkMemes.length)];
    return "\r\n" + colorText("🔨 BONK MEME ACTIVATED! 🔨", "yellow") + "\r\n" +
           colorText(randomMeme, "cyan") + "\r\n" +
           colorText("BONK ENERGY: MAXIMUM! 🚀", "green") + "\r\n";
  },

  "bonk-party": () => {
    return "\r\n" + colorText("🎉 BONK PARTY TIME! 🎉", "yellow") + "\r\n\r\n" +
           colorText("    🔨🔨🔨🔨🔨🔨🔨", "cyan") + "\r\n" +
           colorText("  🎊 EVERYONE GETS BONKED! 🎊", "green") + "\r\n" +
           colorText("    🔨🔨🔨🔨🔨🔨🔨", "cyan") + "\r\n\r\n" +
           colorText("♪┏(°.°)┛┗(°.°)┓┗(°.°)┛┏(°.°)┓ ♪", "magenta") + "\r\n" +
           colorText("         BONK DANCE!", "yellow") + "\r\n";
  },

  "bonk-wisdom": () => {
    const wisdom = [
      "The path to enlightenment is paved with BONKS",
      "One BONK can change the world",
      "To BONK or not to BONK - that is not a question",
      "BONK transcends all understanding",
      "In BONK we trust, all else we verify",
      "The greatest BONK comes from within",
      "BONK responsibly, BONK with purpose"
    ];
    
    const randomWisdom = wisdom[Math.floor(Math.random() * wisdom.length)];
    return "\r\n" + colorText("🧠 BONK WISDOM 🧠", "yellow") + "\r\n\r\n" +
           colorText(`"${randomWisdom}"`, "cyan") + "\r\n\r\n" +
           colorText("- Ancient BONK Teachings", "white") + "\r\n";
  },

  "bonk-energy": () => {
    return "\r\n" + colorText("⚡ BONK ENERGY CHARGING... ⚡", "yellow") + "\r\n\r\n" +
           colorText("████████████████████ 100%", "green") + "\r\n" +
           colorText("BONK POWER: OVER 9000!", "red") + "\r\n" +
           colorText("STATUS: MAXIMUM BONKAGE ACHIEVED", "cyan") + "\r\n\r\n" +
           colorText("🚀 READY TO BONK THE UNIVERSE! 🚀", "magenta") + "\r\n";
  },

  "agent": async (data: any, userMessage?: string) => {
    if (!userMessage) {
      return "\r\n" + colorText("🤖 BONKOS AI AGENT", "yellow") + "\r\n\r\n" +
             colorText("Usage: agent [your question]", "cyan") + "\r\n" +
             colorText("Example: agent how do I create a wallet?", "white") + "\r\n\r\n" +
             colorText("I'm BONKOS, your chaotic AI guide! Ask me anything about:", "green") + "\r\n" +
             colorText("• Terminal commands and features", "white") + "\r\n" +
             colorText("• Wallet creation and management", "white") + "\r\n" +
             colorText("• Solana CLI operations", "white") + "\r\n" +
             colorText("• BONK memes and easter eggs", "white") + "\r\n" +
             colorText("• Navigation and exploration", "white") + "\r\n";
    }

    try {
      const response = await fetch("/api/bonk-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Agent request failed");
      }

      const result = await response.json();
      return "\r\n" + colorText("🤖 BONKOS:", "yellow") + " " + colorText(result.response, "green") + "\r\n";
    } catch (error) {
      return "\r\n" + colorText("🤖 BONKOS:", "yellow") + " " + 
             colorText("BONK energy fluctuating! Try again or use 'help' for commands.", "red") + "\r\n";
    }
  },

  "ai": async (data: any) => {
    // Alias for agent command - handled in terminal processing
    return commands.agent(data);
  },

  "ask": async (data: any) => {
    // Another alias for agent command - handled in terminal processing  
    return commands.agent(data);
  }
};
