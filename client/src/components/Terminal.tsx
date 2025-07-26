import { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { commands } from "@/lib/terminal-commands";
import { getBootAsciiArt } from "@/lib/ascii-art";
import { useQuery } from "@tanstack/react-query";

// Import xterm CSS
import "xterm/css/xterm.css";

interface CryptoData {
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  change24h: number;
}

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [currentLine, setCurrentLine] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const currentLineRef = useRef("");

  // Fetch initial crypto data
  const { data: cryptoData, refetch, isLoading } = useQuery<CryptoData>({
    queryKey: ["/api/crypto"],
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });

  useEffect(() => {
    if (!terminalRef.current) return;
    
    console.log('Terminal component crypto data:', cryptoData);

    // Initialize terminal
    const term = new XTerm({
      theme: {
        background: "#1a0d1a",
        foreground: "#00ff00",
        cursor: "#39ff14",
        cursorAccent: "#1a0d1a",
        black: "#000000",
        red: "#ff6b6b",
        green: "#00ff00",
        yellow: "#ffeb3b",
        blue: "#4dabf7",
        magenta: "#ff88ff",
        cyan: "#39ff14",
        white: "#ffffff",
        brightBlack: "#666666",
        brightRed: "#ff6b6b",
        brightGreen: "#39ff14",
        brightYellow: "#ffeb3b",
        brightBlue: "#4dabf7",
        brightMagenta: "#ff88ff",
        brightCyan: "#39ff14",
        brightWhite: "#ffffff",
      },
      fontFamily: "'Courier New', Monaco, Menlo, monospace",
      fontSize: window.innerWidth < 480 ? 24 : window.innerWidth < 768 ? 20 : 14, // Massive font on mobile
      lineHeight: window.innerWidth < 768 ? 1.8 : 1.2, // Better line spacing on mobile
      cursorBlink: true,
      cursorStyle: "block",
      allowProposedApi: true,
      scrollback: 1000,
      convertEol: true,
      rightClickSelectsWord: true,
      macOptionIsMeta: true,
      disableStdin: false,
      cols: window.innerWidth < 480 ? Math.floor(window.innerWidth / 18) : window.innerWidth < 768 ? Math.floor(window.innerWidth / 15) : 80, // Optimize for mobile readability
      rows: window.innerWidth < 480 ? Math.floor(window.innerHeight / 40) : window.innerWidth < 768 ? Math.floor(window.innerHeight / 35) : 24, // Better mobile terminal size
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    
    // Enhanced mobile fitting
    const fitTerminal = () => {
      try {
        if (fitAddon && term) {
          fitAddon.fit();
          // Adjust font size dynamically for mobile
          if (window.innerWidth < 480) {
            // Extra large for very small screens
            term.options.fontSize = 24;
            term.options.lineHeight = 1.9;
          } else if (window.innerWidth < 768) {
            const newSize = Math.max(20, Math.min(24, window.innerWidth / 16));
            term.options.fontSize = newSize;
            // Also adjust line height for better readability
            term.options.lineHeight = 1.8;
          }
        }
      } catch (error) {
        console.warn('Terminal fit error:', error);
      }
    };
    
    fitTerminal();
    
    // Add resize listeners for responsive behavior
    const handleTerminalResize = () => setTimeout(fitTerminal, 100);
    window.addEventListener('resize', handleTerminalResize);
    window.addEventListener('orientationchange', handleTerminalResize);

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Make terminal focusable
    const terminalElement = terminalRef.current;
    terminalElement.setAttribute('tabindex', '0');
    
    // Ensure terminal gets focus for input
    const handleClick = () => {
      term.focus();
    };
    terminalElement.addEventListener('click', handleClick);

    // Initialize wallet manager
    (async () => {
      const { walletManager } = await import('../lib/wallet');
      walletManager.restoreSession();
    })();

    // Setup WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "crypto_update") {
        console.log('WebSocket crypto update received:', data.data);
        refetch();
      } else if (data.type === "chat_message") {
        // Handle chat messages if needed
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Handle keyboard input
    term.onKey(({ key, domEvent }) => {
      const code = domEvent.keyCode;
      const currentLineValue = currentLineRef.current;

      // Handle Ctrl+V (paste) 
      if (domEvent.ctrlKey && code === 86) {
        domEvent.preventDefault();
        
        if (navigator.clipboard && navigator.clipboard.readText) {
          navigator.clipboard.readText().then(text => {
            if (text) {
              const cleanText = text.replace(/[\r\n\t]/g, ' ').trim();
              const newLine = currentLineValue + cleanText;
              currentLineRef.current = newLine;
              setCurrentLine(newLine);
              term.write(cleanText);
            }
          }).catch(() => {
            console.log('Clipboard access failed');
          });
        }
        
        return;
      }

      // Handle Ctrl+Shift+V (alternative paste)
      if (domEvent.ctrlKey && domEvent.shiftKey && code === 86) {
        domEvent.preventDefault();
        
        if (navigator.clipboard && navigator.clipboard.readText) {
          navigator.clipboard.readText().then(text => {
            if (text) {
              const cleanText = text.replace(/[\r\n\t]/g, ' ').trim();
              const newLine = currentLineValue + cleanText;
              currentLineRef.current = newLine;
              setCurrentLine(newLine);
              term.write(cleanText);
            }
          }).catch(() => {
            console.log('Clipboard access denied');
          });
        }
        return;
      }

      // Handle Ctrl+C (copy) - let browser handle this naturally
      if (domEvent.ctrlKey && code === 67) {
        // Don't prevent default, let browser handle copy
        return;
      }

      if (code === 13) { // Enter
        term.write("\r\n");
        processCommand(currentLineValue.trim());
        currentLineRef.current = "";
        setCurrentLine("");
      } else if (code === 8 || code === 127) { // Backspace or Delete
        if (currentLineValue.length > 0) {
          const newLine = currentLineValue.slice(0, -1);
          currentLineRef.current = newLine;
          setCurrentLine(newLine);
          term.write("\b \b");
        }
      } else if (code === 38) { // Up arrow - command history
        if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          const command = commandHistory[commandHistory.length - 1 - newIndex];
          
          // Clear current line
          for (let i = 0; i < currentLineValue.length; i++) {
            term.write("\b \b");
          }
          currentLineRef.current = command;
          setCurrentLine(command);
          term.write(command);
        }
      } else if (code === 40) { // Down arrow
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          const command = commandHistory[commandHistory.length - 1 - newIndex];
          
          // Clear current line
          for (let i = 0; i < currentLineValue.length; i++) {
            term.write("\b \b");
          }
          currentLineRef.current = command;
          setCurrentLine(command);
          term.write(command);
        } else if (historyIndex === 0) {
          // Clear current line
          for (let i = 0; i < currentLineValue.length; i++) {
            term.write("\b \b");
          }
          currentLineRef.current = "";
          setCurrentLine("");
          setHistoryIndex(-1);
        }
      } else if (code === 9) { // Tab - command completion
        domEvent.preventDefault();
        const availableCommands = Object.keys(commands);
        const matches = availableCommands.filter(cmd => 
          cmd.startsWith(currentLineValue.toLowerCase())
        );
        
        if (matches.length === 1) {
          const completion = matches[0].slice(currentLineValue.length);
          const newLine = currentLineValue + completion;
          currentLineRef.current = newLine;
          setCurrentLine(newLine);
          term.write(completion);
        } else if (matches.length > 1) {
          term.write("\r\n" + matches.join("  ") + "\r\n");
          showPrompt();
          term.write(currentLineValue);
        }
      } else if (key.length === 1 && code >= 32 && code <= 126) {
        // Printable characters
        const newLine = currentLineValue + key;
        currentLineRef.current = newLine;
        setCurrentLine(newLine);
        term.write(key);
      }
    });

    // Window resize handler is already added above with enhanced mobile support

    // Boot sequence - skip entirely on mobile for immediate terminal access
    const bootDuration = window.innerWidth < 768 ? 0 : 3000; // Instant on mobile
    setTimeout(() => {
      setIsBooting(false);
      showWelcomeMessage();
    }, bootDuration);

    return () => {
      ws.close();
      window.removeEventListener("resize", handleTerminalResize);
      window.removeEventListener("orientationchange", handleTerminalResize);
      terminalElement.removeEventListener('click', handleClick);
      term.dispose();
    };
  }, []);

  const colorText = (text: string, color: string) => {
    const colors: Record<string, string> = {
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
      reset: "\x1b[0m",
    };
    return colors[color] + text + colors.reset;
  };

  const typeText = (text: string, callback?: () => void) => {
    if (!xtermRef.current) return;
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length && xtermRef.current) {
        xtermRef.current.write(text[i]);
        i++;
      } else {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 20);
  };

  const showPrompt = () => {
    if (!xtermRef.current) return;
    const prompt = colorText("[user@bonk ~]$", "green") + " ";
    xtermRef.current.write(prompt);
  };

  const showWelcomeMessage = () => {
    if (!xtermRef.current) return;
    
    // Generate current date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    const timeStr = now.toLocaleTimeString('en-US', { 
      hour12: false,
      timeZone: 'Asia/Tokyo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Generate realistic system stats
    const systemLoad = (Math.random() * 0.5 + 0.1).toFixed(2);
    const processes = Math.floor(Math.random() * 20 + 65);
    const diskUsage = (Math.random() * 3 + 1.5).toFixed(1);
    const memoryUsage = Math.floor(Math.random() * 5 + 2);
    const ipAddress = `172.28.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    const ubuntuWelcome = 
      colorText("Welcome to Ubuntu 24.04.1 LTS (GNU/Linux 5.15.167.4-microsoft-standard-WSL2 x86_64)", "white") + "\r\n\r\n" +
      colorText(" * Documentation:  https://help.ubuntu.com", "white") + "\r\n" +
      colorText(" * Management:     https://landscape.canonical.com", "white") + "\r\n" +
      colorText(" * Support:        https://ubuntu.com/pro", "white") + "\r\n\r\n" +
      colorText(` System information as of ${dateStr} ${timeStr} JST 2025`, "white") + "\r\n\r\n" +
      colorText(`  System load:  ${systemLoad}                Processes:             ${processes}`, "white") + "\r\n" +
      colorText(`  Usage of /:   ${diskUsage}% of 1006.85GB   Users logged in:       0`, "white") + "\r\n" +
      colorText(`  Memory usage: ${memoryUsage}%                  IPv4 address for eth0: ${ipAddress}`, "white") + "\r\n" +
      colorText("  Swap usage:   0%", "white") + "\r\n\r\n\r\n" +
      colorText("This message is shown once a day. To disable it please create the", "white") + "\r\n" +
      colorText("/home/bonk/.hushlogin file.", "white") + "\r\n\r\n";
    
    const bonkSplash = `
██████╗  ██████╗ ███╗   ██╗██╗  ██╗    ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
██╔══██╗██╔═══██╗████╗  ██║██║ ██╔╝    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
██████╔╝██║   ██║██╔██╗ ██║█████╔╝        ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
██╔══██╗██║   ██║██║╚██╗██║██╔═██╗        ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
██████╔╝╚██████╔╝██║ ╚████║██║  ██╗       ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
                                        POWERED BY $BONK
`;

    const bonkMessage = 
      colorText(bonkSplash, "yellow") + "\r\n" +
      colorText("═══════════════════════════════════════════", "cyan") + "\r\n" +
      colorText("Contract: Coming soon", "green") + "\r\n\r\n" +
      colorText("[ BONKOS ]", "yellow") + " " + colorText("BONK Terminal System Initialized", "white") + "\r\n" +
      colorText("[ BONKOS ]", "yellow") + " " + colorText("Welcome to the trenches, anon", "white") + "\r\n\r\n" +
      colorText("Create or import your Solana wallet with:", "white") + "\r\n" +
      colorText("• wallet create  • wallet import <seed-phrase>", "cyan") + "\r\n\r\n" +
      colorText("Type", "white") + " " + colorText("help", "cyan") + " " + colorText("to see all available commands", "white") + "\r\n" +
      colorText("Type", "white") + " " + colorText("agent <question>", "cyan") + " " + colorText("to ask BONKOS for help!", "white") + "\r\n" +
      colorText("Type", "white") + " " + colorText("meme", "cyan") + " " + colorText("for some bonk energy!", "white") + "\r\n\r\n";
    
    const fullWelcome = ubuntuWelcome + bonkMessage;
    
    typeText(fullWelcome, () => {
      showPrompt();
    });
  };

  const processCommand = async (command: string) => {
    if (!xtermRef.current) return;

    if (command === "") {
      showPrompt();
      return;
    }

    // Add to history
    if (commandHistory[commandHistory.length - 1] !== command) {
      setCommandHistory([...commandHistory, command]);
    }
    setHistoryIndex(-1);

    const cmd = command.toLowerCase();
    
    // Handle commands with parameters
    let cmdName = cmd;
    let cmdParams = "";
    
    // Handle wallet import with seed phrase
    if (cmd.startsWith('wallet import ')) {
      const seedPhrase = command.slice('wallet import '.length).trim();
      if (seedPhrase) {
        try {
          xtermRef.current.write(colorText("Importing wallet...", "yellow") + "\r\n");
          const { walletManager } = await import('../lib/wallet');
          const result = await walletManager.importWallet(seedPhrase);
          
          let output;
          if (result.success) {
            output = "\r\n" + colorText("🎉 WALLET IMPORTED SUCCESSFULLY!", "green") + "\r\n\r\n" +
                     colorText("Address: " + result.address, "cyan") + "\r\n\r\n" +
                     colorText("Your wallet is now connected and ready to use.", "green") + "\r\n" +
                     colorText("Use 'wallet balance' to check your balance.", "white") + "\r\n";
          } else {
            output = "\r\n" + colorText("❌ " + result.message, "red") + "\r\n";
          }
          
          typeText(output, showPrompt);
          return;
        } catch (error) {
          const errorMsg = colorText("Error: Failed to import wallet", "red") + "\r\n";
          typeText(errorMsg, showPrompt);
          return;
        }
      }
    }
    
    // Handle AI agent commands with parameters
    if (cmd.startsWith('agent ') || cmd.startsWith('ai ') || cmd.startsWith('ask ')) {
      const spaceIndex = cmd.indexOf(' ');
      if (spaceIndex > 0) {
        cmdName = cmd.substring(0, spaceIndex);
        cmdParams = command.slice(spaceIndex + 1).trim();
      }
    }
    
    if (commands[cmdName]) {
      try {
        // Show loading indicator for Solana commands
        if (cmdName.startsWith('solana')) {
          xtermRef.current.write(colorText("Connecting to Solana mainnet...", "yellow") + "\r\n");
        }
        
        // Show loading indicator for AI agent commands
        if (cmdName === 'agent' || cmdName === 'ai' || cmdName === 'ask') {
          if (cmdParams) {
            xtermRef.current.write(colorText("🤖 BONKOS is thinking...", "yellow") + "\r\n");
          }
        }
        
        // For status command, ensure we have fresh crypto data
        let dataToPass = cryptoData;
        if (cmdName === 'status') {
          if (!cryptoData || isLoading) {
            xtermRef.current.write(colorText("Loading BONK terminal...", "yellow") + "\r\n");
            const result = await refetch();
            dataToPass = result.data;
          } else {
            dataToPass = cryptoData;
          }
        }
        
        console.log('Crypto data being passed to command:', dataToPass);
        
        // Pass parameters to AI agent commands
        let output;
        if (cmdName === 'agent' || cmdName === 'ai' || cmdName === 'ask') {
          output = await commands[cmdName](dataToPass, cmdParams);
        } else {
          output = await commands[cmdName](dataToPass);
        }
        
        if (output) {
          typeText(output, () => {
            if (cmdName !== "clear") {
              showPrompt();
            }
          });
        } else {
          if (cmdName === "clear") {
            xtermRef.current?.clear();
            showPrompt();
          } else {
            showPrompt();
          }
        }
      } catch (error) {
        const errorMsg = colorText("Error: Failed to execute command", "red") + "\r\n";
        typeText(errorMsg, showPrompt);
      }
    } else {
      const errorMsg = 
        colorText("bash: " + cmdName + ": command not found", "red") + "\r\n" +
        colorText('Type "help" for available commands', "yellow") + "\r\n";
      typeText(errorMsg, showPrompt);
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="window-controls">
          <button className="control-btn close"></button>
          <button className="control-btn minimize"></button>
          <button className="control-btn maximize"></button>
        </div>
        <div className="terminal-title">user@bonk2025:~</div>
        <div style={{ width: "60px" }}></div>
      </div>
      <div className="terminal-wrapper">
        {isBooting && window.innerWidth >= 768 && (
          <div className="boot-screen">
            <div className="ascii-art">{getBootAsciiArt()}</div>
            <div className="boot-text">Running BONK Terminal -dev</div>
            <div className="boot-text">[INFO] BONK terminal initialized.</div>
            <div className="boot-text">[OK] Listening on port 69.</div>
            <div className="boot-text loading-dots">Starting Terminal of BONK</div>
          </div>
        )}
        
        <div ref={terminalRef} className="terminal-content" />

      </div>
    </div>
  );
}
