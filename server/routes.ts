import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { generateBonkosAsciiMeme } from "./lib/openai-memes";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current crypto data - Coming Soon mode
  app.get("/api/crypto", async (req, res) => {
    try {
      // Return "Coming Soon" data instead of live token data
      const cryptoData = {
        id: 1,
        symbol: "BONK",
        status: "coming_soon",
        message: "Terminal of BONK - Coming Soon! 🚀",
        price: 0,
        marketCap: 0, 
        volume24h: 0,
        holders: 0,
        change24h: 0,
        lastUpdated: new Date()
      };
      
      res.json(cryptoData);
    } catch (error) {
      console.error("Error fetching crypto data from Helius:", error);
      
      // Try fallback to stored data
      try {
        const fallbackData = await storage.getCryptoData();
        if (fallbackData && fallbackData.price > 0) {
          res.json(fallbackData);
        } else {
          throw new Error("No valid fallback data");
        }
      } catch (fallbackError) {
        res.status(500).json({ error: "Failed to fetch crypto data" });
      }
    }
  });

  // Generate BONKOS ASCII meme
  app.get("/api/generate-meme", async (req, res) => {
    try {
      const meme = await generateBonkosAsciiMeme();
      res.json({ meme });
    } catch (error) {
      console.error("Error generating meme:", error);
      res.status(500).json({ error: "Failed to generate meme" });
    }
  });

  // BONK AI Agent
  app.post("/api/bonk-agent", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const { generateBonkAgentResponse } = await import("./lib/bonk-agent.js");
      const response = await generateBonkAgentResponse(message);
      res.json({ response });
    } catch (error) {
      console.error("Error with BONK agent:", error);
      res.status(500).json({ error: "BONK agent is temporarily offline" });
    }
  });

  // Get Helius API key for frontend
  app.get("/api/helius-key", async (req, res) => {
    try {
      const apiKey = process.env.HELIUS_API_KEY;
      if (!apiKey) {
        return res.status(404).json({ error: "Helius API key not configured" });
      }
      res.json({ apiKey });
    } catch (error) {
      res.status(500).json({ error: "Failed to get API key" });
    }
  });

  // Generate regular Solana wallet 
  app.post("/api/create-wallet", async (req, res) => {
    try {
      const { Keypair } = await import('@solana/web3.js');
      const bs58 = await import('bs58');
      
      console.log("Generating new Solana wallet...");
      
      // Generate a new random keypair
      const keypair = Keypair.generate();
      const publicKey = keypair.publicKey.toString();
      const privateKeyBase58 = bs58.default.encode(keypair.secretKey);
      
      // Save to wallet directory
      const timestamp = new Date().toISOString();
      const walletFilename = `wallet_${publicKey.slice(0, 8)}_${Date.now()}.json`;
      const walletPath = path.join(process.cwd(), "wallets", walletFilename);
      
      const walletData = {
        timestamp,
        address: publicKey,
        privateKey: privateKeyBase58,
        type: "regular",
        created: timestamp
      };
      
      // Ensure wallets directory exists
      const walletsDir = path.join(process.cwd(), "wallets");
      if (!fs.existsSync(walletsDir)) {
        fs.mkdirSync(walletsDir, { recursive: true });
      }
      
      fs.writeFileSync(walletPath, JSON.stringify(walletData, null, 2));
      
      console.log(`Wallet generated: ${publicKey}`);
      
      res.json({
        success: true,
        address: publicKey,
        privateKey: privateKeyBase58,
        message: `Wallet created successfully! Address: ${publicKey}`,
        filename: walletFilename
      });
    } catch (error) {
      console.error("Error creating wallet:", error);
      res.status(500).json({ error: "Failed to create wallet" });
    }
  });

  // Save wallet to file system
  app.post("/api/save-wallet", async (req, res) => {
    try {
      const { address, privateKey, seedPhrase, type } = req.body;
      
      if (!address || !privateKey) {
        return res.status(400).json({ error: "Address and private key are required" });
      }
      
      const timestamp = new Date().toISOString();
      const walletFilename = `saved_wallet_${address.slice(0, 8)}_${Date.now()}.json`;
      const walletPath = path.join(process.cwd(), "wallets", walletFilename);
      
      const walletData = {
        timestamp,
        address,
        privateKey,
        seedPhrase: seedPhrase || null,
        type: type || "imported",
        created: timestamp
      };
      
      // Ensure wallets directory exists
      const walletsDir = path.join(process.cwd(), "wallets");
      if (!fs.existsSync(walletsDir)) {
        fs.mkdirSync(walletsDir, { recursive: true });
      }
      
      fs.writeFileSync(walletPath, JSON.stringify(walletData, null, 2));
      
      res.json({
        success: true,
        message: "Wallet saved successfully",
        filename: walletFilename
      });
    } catch (error) {
      console.error("Error saving wallet:", error);
      res.status(500).json({ error: "Failed to save wallet" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup for real-time data updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Periodic crypto data fetching (disabled for "Coming Soon" mode)
  const fetchRealCryptoData = async () => {
    try {
      // For "Coming Soon" mode, send placeholder data
      const placeholderData = {
        price: Math.random() * 0.00001 + 0.000008,
        marketCap: Math.random() * 1000 + 8000,
        volume24h: Math.random() * 100 + 150,
        holders: 0,
        change24h: Math.random() * 4 - 2,
        lastUpdated: new Date(),
        id: 1,
        symbol: "BONK"
      };

      // Broadcast update to WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'crypto_update',
            data: placeholderData
          }));
        }
      });
    } catch (error) {
      console.error('Failed to fetch real crypto data:', error);
    }
  };

  // Update crypto data every 60 seconds
  setInterval(fetchRealCryptoData, 60000);

  return httpServer;
}