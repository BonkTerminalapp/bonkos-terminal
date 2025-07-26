import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Initialize connection to Helius RPC endpoint
const getHeliusApiKey = async (): Promise<string | null> => {
  try {
    const response = await fetch('/api/helius-key');
    if (response.ok) {
      const data = await response.json();
      return data.apiKey;
    }
  } catch (error) {
    console.warn('Failed to fetch Helius API key');
  }
  return null;
};

const createConnection = async (): Promise<Connection> => {
  const heliusApiKey = await getHeliusApiKey();
  if (heliusApiKey) {
    return new Connection(`https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`, 'confirmed');
  }
  // Fallback to default mainnet if no Helius key
  return new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
};

let connection: Connection | null = null;

const getConnection = async (): Promise<Connection> => {
  if (!connection) {
    connection = await createConnection();
  }
  return connection;
};

// Use a real wallet address with SOL balance for demonstration
const DEFAULT_WALLET = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'; // A wallet with SOL balance

export async function getSolanaBalance(address?: string): Promise<string> {
  try {
    const conn = await getConnection();
    const publicKey = new PublicKey(address || DEFAULT_WALLET);
    const balance = await conn.getBalance(publicKey);
    const solBalance = balance / 1000000000; // Convert lamports to SOL
    return `${solBalance.toFixed(9)} SOL`;
  } catch (error) {
    return 'Error: Invalid address or network issue';
  }
}

export async function getSolanaAddress(): Promise<string> {
  return DEFAULT_WALLET;
}

export async function getSolanaConfig(): Promise<string> {
  try {
    const conn = await getConnection();
    const version = await conn.getVersion();
    return `Config File: ~/.config/solana/cli/config.yml
RPC URL: ${conn.rpcEndpoint}
WebSocket URL: ${conn.rpcEndpoint.replace('http', 'ws')}
Keypair Path: ~/.config/solana/id.json
Commitment: confirmed
Solana Version: ${version['solana-core']}`;
  } catch (error) {
    return 'Error: Unable to retrieve config';
  }
}

export async function getClusterVersion(): Promise<string> {
  try {
    const conn = await getConnection();
    const version = await conn.getVersion();
    return `Cluster Version: ${version['solana-core']}
Feature Set: ${version['feature-set']}`;
  } catch (error) {
    return 'Error: Unable to retrieve cluster version';
  }
}

export async function getEpochInfo(): Promise<string> {
  try {
    const conn = await getConnection();
    const epochInfo = await conn.getEpochInfo();
    const blockTime = await conn.getBlockTime(epochInfo.absoluteSlot);
    
    return `Epoch: ${epochInfo.epoch}
Slot: ${epochInfo.absoluteSlot}
Slots in Epoch: ${epochInfo.slotsInEpoch}
Slot Index: ${epochInfo.slotIndex}
Slots Remaining: ${epochInfo.slotsInEpoch - epochInfo.slotIndex}
Block Time: ${blockTime ? new Date(blockTime * 1000).toISOString() : 'Unknown'}
Progress: ${((epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100).toFixed(2)}%`;
  } catch (error) {
    return 'Error: Unable to retrieve epoch info';
  }
}

export async function getValidators(): Promise<string> {
  try {
    const conn = await getConnection();
    const voteAccounts = await conn.getVoteAccounts();
    const currentValidators = voteAccounts.current.slice(0, 10); // Show top 10
    
    let output = `Active Validators: ${voteAccounts.current.length}
Delinquent Validators: ${voteAccounts.delinquent.length}

Top 10 Active Validators:
`;
    
    currentValidators.forEach((validator, index) => {
      const stakeSOL = (validator.activatedStake / 1000000000).toFixed(0);
      output += `${(index + 1).toString().padStart(2)}. ${validator.nodePubkey.slice(0, 8)}... - ${stakeSOL} SOL staked\n`;
    });
    
    return output;
  } catch (error) {
    return 'Error: Unable to retrieve validator info';
  }
}

export async function getSolanaHelp(): Promise<string> {
  const clusterVersion = await getClusterVersion();
  return `Solana CLI ${clusterVersion}

USAGE:
    solana [OPTIONS] <SUBCOMMAND>

SUBCOMMANDS:
    address                   Display the pubkey for the selected address
    balance                   Get the balance of the configured account
    cluster-version           Get the cluster version
    config                    Solana command-line configuration
    epoch-info                Display information about the current epoch
    validators                Show summary information about validators

For more commands, visit: https://docs.solana.com/cli`;
}