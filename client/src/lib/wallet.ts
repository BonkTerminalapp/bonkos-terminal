import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Buffer } from 'buffer';
import bs58 from 'bs58';

// Polyfill Buffer for browser environment
if (typeof window !== 'undefined') {
  window.global = window;
  window.Buffer = Buffer;
}

interface WalletState {
  keypair: Keypair | null;
  address: string | null;
  isConnected: boolean;
}

class WalletManager {
  private wallet: WalletState = {
    keypair: null,
    address: null,
    isConnected: false
  };

  private connection: Connection | null = null;

  async getConnection(): Promise<Connection> {
    if (!this.connection) {
      try {
        const response = await fetch('/api/helius-key');
        if (response.ok) {
          const data = await response.json();
          this.connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=${data.apiKey}`, 'confirmed');
        } else {
          this.connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
        }
      } catch (error) {
        this.connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
      }
    }
    return this.connection;
  }

  async importWallet(seedPhrase: string): Promise<{ success: boolean; message: string; address?: string }> {
    try {
      console.log('Validating seed phrase...');
      
      // Validate seed phrase
      if (!bip39.validateMnemonic(seedPhrase.trim())) {
        console.log('Invalid mnemonic');
        return { success: false, message: 'Invalid seed phrase. Please check your mnemonic words.' };
      }

      console.log('Generating seed from mnemonic...');
      // Generate seed from mnemonic
      const seed = bip39.mnemonicToSeedSync(seedPhrase.trim());
      console.log('Seed generated, length:', seed.length);
      
      console.log('Deriving keypair...');
      // Derive Solana keypair using standard derivation path
      const derivationPath = "m/44'/501'/0'/0'";
      const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;
      console.log('Derived seed length:', derivedSeed.length);
      
      // Create keypair from derived seed
      const keypair = Keypair.fromSeed(derivedSeed);
      console.log('Keypair created, address:', keypair.publicKey.toString());
      
      // Store wallet state
      this.wallet = {
        keypair,
        address: keypair.publicKey.toString(),
        isConnected: true
      };

      // Store encrypted in session storage (temporary)
      sessionStorage.setItem('wallet_connected', 'true');
      sessionStorage.setItem('wallet_address', keypair.publicKey.toString());

      console.log('Wallet imported successfully');
      return {
        success: true,
        message: 'Wallet imported successfully!',
        address: keypair.publicKey.toString()
      };
    } catch (error) {
      console.error('Wallet import error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', errorMessage);
      return { success: false, message: `Failed to import wallet: ${errorMessage}` };
    }
  }

  async createWallet(): Promise<{ success: boolean; message: string; seedPhrase?: string; address?: string }> {
    try {
      console.log('Starting BONK wallet creation...');
      
      // Try to generate a BONK-themed wallet using keygen grind
      try {
        const response = await fetch('/api/grind-bonk-wallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success && result.address && result.privateKey) {
            // Decode the private key from Base58
            const secretKey = bs58.decode(result.privateKey);
            const keypair = Keypair.fromSecretKey(secretKey);
            
            // Store wallet state
            this.wallet = {
              keypair,
              address: result.address,
              isConnected: true
            };

            // Store in session storage
            sessionStorage.setItem('wallet_connected', 'true');
            sessionStorage.setItem('wallet_address', result.address);
            
            const bonkMessage = result.address.toLowerCase().startsWith('bonk') 
              ? "🔨 BONK-themed wallet generated! 🔨"
              : "Wallet generated (BONK pattern not found)";
            
            return {
              success: true,
              message: bonkMessage,
              seedPhrase: `Private Key (Base58): ${result.privateKey}`,
              address: result.address
            };
          }
        }
        
        console.log('BONK grind failed, falling back to regular generation...');
      } catch (grindError) {
        console.log('BONK grind error, falling back to regular generation:', grindError);
      }
      
      // Fallback to regular generation
      try {
        const keypair = Keypair.generate();
        console.log('Direct keypair created:', keypair.publicKey.toString());
        
        // Store wallet state
        this.wallet = {
          keypair,
          address: keypair.publicKey.toString(),
          isConnected: true
        };

        // Store in session storage
        sessionStorage.setItem('wallet_connected', 'true');
        sessionStorage.setItem('wallet_address', keypair.publicKey.toString());

        // Encode private key as Base58
        const privateKeyBase58 = bs58.encode(keypair.secretKey);
        
        // Save wallet to backend
        await this.saveWalletToFile(keypair.publicKey.toString(), privateKeyBase58, null, "direct");
        
        return {
          success: true,
          message: 'New wallet created successfully!',
          seedPhrase: `Private Key (Base58): ${privateKeyBase58}`,
          address: keypair.publicKey.toString()
        };
      } catch (directError) {
        console.log('Direct keypair failed, trying mnemonic approach...');
        
        // Final fallback to mnemonic approach
        const mnemonic = bip39.generateMnemonic(128); // 12 words
        console.log('Mnemonic generated:', mnemonic);
        
        // Import the generated wallet
        const result = await this.importWallet(mnemonic);
        console.log('Import result:', result);
        
        if (result.success) {
          // Get the private key in Base58 format
          const privateKeyBase58 = this.wallet.keypair ? bs58.encode(this.wallet.keypair.secretKey) : 'N/A';
          
          // Save wallet to backend
          if (this.wallet.keypair) {
            await this.saveWalletToFile(result.address!, privateKeyBase58, mnemonic, "mnemonic");
          }
          
          return {
            success: true,
            message: 'New wallet created successfully!',
            seedPhrase: `Seed Phrase: ${mnemonic}\nPrivate Key (Base58): ${privateKeyBase58}`,
            address: result.address
          };
        } else {
          return { success: false, message: 'Failed to create wallet with all methods.' };
        }
      }
    } catch (error) {
      console.error('Wallet creation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: `Failed to create wallet: ${errorMessage}` };
    }
  }

  async getBalance(): Promise<{ success: boolean; balance?: number; message: string }> {
    try {
      if (!this.wallet.isConnected || !this.wallet.keypair) {
        return { success: false, message: 'No wallet connected. Use "wallet import" or "wallet create".' };
      }

      const connection = await this.getConnection();
      const balance = await connection.getBalance(this.wallet.keypair.publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;

      return {
        success: true,
        balance: solBalance,
        message: `Balance: ${solBalance.toFixed(9)} SOL`
      };
    } catch (error) {
      return { success: false, message: 'Failed to fetch balance. Check your connection.' };
    }
  }

  getAddress(): { success: boolean; address?: string; message: string } {
    if (!this.wallet.isConnected || !this.wallet.address) {
      return { success: false, message: 'No wallet connected. Use "wallet import" or "wallet create".' };
    }

    return {
      success: true,
      address: this.wallet.address,
      message: `Address: ${this.wallet.address}`
    };
  }

  disconnect(): { success: boolean; message: string } {
    this.wallet = {
      keypair: null,
      address: null,
      isConnected: false
    };

    sessionStorage.removeItem('wallet_connected');
    sessionStorage.removeItem('wallet_address');

    return { success: true, message: 'Wallet disconnected successfully.' };
  }

  isConnected(): boolean {
    return this.wallet.isConnected;
  }

  getKeypair(): Keypair | null {
    return this.wallet.keypair;
  }

  // Save wallet to file system via backend API
  async saveWalletToFile(address: string, privateKey: string, seedPhrase: string | null, type: string): Promise<void> {
    try {
      const response = await fetch('/api/save-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          privateKey,
          seedPhrase,
          type
        })
      });

      if (!response.ok) {
        console.error('Failed to save wallet to file');
      } else {
        console.log('Wallet saved to file system successfully');
      }
    } catch (error) {
      console.error('Error saving wallet:', error);
    }
  }

  // Check session storage on page load
  restoreSession(): boolean {
    const connected = sessionStorage.getItem('wallet_connected');
    const address = sessionStorage.getItem('wallet_address');
    
    if (connected === 'true' && address) {
      // Note: We can't restore the keypair from session storage for security
      // User will need to re-import if they want to make transactions
      this.wallet.address = address;
      this.wallet.isConnected = false; // Set to false since we don't have keypair
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const walletManager = new WalletManager();