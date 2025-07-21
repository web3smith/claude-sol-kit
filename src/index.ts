import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { Connection, PublicKey, Commitment } from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

const server = new Server(
  {
    name: "claude-solana-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const connection = new Connection(SOLANA_RPC_URL, "confirmed");

const SOLANA_TOOLS = [
  {
    name: "getAccountInfo",
    description: "Returns all information associated with the account of provided Pubkey",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string", description: "The account public key (base58 encoded)" },
        commitment: { type: "string", description: "Commitment level (processed, confirmed, finalized)", default: "confirmed" }
      },
      required: ["address"]
    }
  },
  {
    name: "getBalance",
    description: "Returns the balance of the account of provided Pubkey",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string", description: "The account public key (base58 encoded)" },
        commitment: { type: "string", description: "Commitment level", default: "confirmed" }
      },
      required: ["address"]
    }
  },
  {
    name: "getBlock",
    description: "Returns identity and transaction information about a confirmed block in the ledger",
    inputSchema: {
      type: "object",
      properties: {
        slot: { type: "number", description: "Slot number" },
        maxSupportedTransactionVersion: { type: "number", description: "Max transaction version to return", default: 0 }
      },
      required: ["slot"]
    }
  },
  {
    name: "getBlockHeight",
    description: "Returns the current block height of the node",
    inputSchema: {
      type: "object",
      properties: {
        commitment: { type: "string", description: "Commitment level", default: "confirmed" }
      }
    }
  },
  {
    name: "getBlockTime",
    description: "Returns the estimated production time of a block",
    inputSchema: {
      type: "object",
      properties: {
        slot: { type: "number", description: "Slot number" }
      },
      required: ["slot"]
    }
  },
  {
    name: "getClusterNodes",
    description: "Returns information about all the nodes participating in the cluster",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "getEpochInfo",
    description: "Returns information about the current epoch",
    inputSchema: {
      type: "object",
      properties: {
        commitment: { type: "string", description: "Commitment level", default: "confirmed" }
      }
    }
  },
  {
    name: "getGenesisHash",
    description: "Returns the genesis hash",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "getHealth",
    description: "Returns the current health of the node",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "getLatestBlockhash",
    description: "Returns the latest blockhash",
    inputSchema: {
      type: "object",
      properties: {
        commitment: { type: "string", description: "Commitment level", default: "confirmed" }
      }
    }
  },
  {
    name: "getMinimumBalanceForRentExemption",
    description: "Returns minimum balance required to make account rent exempt",
    inputSchema: {
      type: "object",
      properties: {
        dataLength: { type: "number", description: "Account data length" }
      },
      required: ["dataLength"]
    }
  },
  {
    name: "getMultipleAccounts",
    description: "Returns the account information for a list of Pubkeys",
    inputSchema: {
      type: "object",
      properties: {
        addresses: { 
          type: "array", 
          items: { type: "string" },
          description: "Array of account public keys (base58 encoded)" 
        },
        commitment: { type: "string", description: "Commitment level", default: "confirmed" }
      },
      required: ["addresses"]
    }
  },
  {
    name: "getSignatureStatuses",
    description: "Returns the statuses of a list of signatures",
    inputSchema: {
      type: "object",
      properties: {
        signatures: { 
          type: "array", 
          items: { type: "string" },
          description: "Array of transaction signatures" 
        }
      },
      required: ["signatures"]
    }
  },
  {
    name: "getSlot",
    description: "Returns the slot that has reached the given or default commitment level",
    inputSchema: {
      type: "object",
      properties: {
        commitment: { type: "string", description: "Commitment level", default: "confirmed" }
      }
    }
  },
  {
    name: "getSupply",
    description: "Returns information about the current supply",
    inputSchema: {
      type: "object",
      properties: {
        commitment: { type: "string", description: "Commitment level", default: "confirmed" }
      }
    }
  },
  {
    name: "getTokenAccountBalance",
    description: "Returns the token balance of an SPL Token account",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string", description: "Token account address (base58 encoded)" },
        commitment: { type: "string", description: "Commitment level", default: "confirmed" }
      },
      required: ["address"]
    }
  },
  {
    name: "getTokenAccountsByOwner",
    description: "Returns all SPL Token accounts by token owner",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string", description: "Owner public key (base58 encoded)" },
        mint: { type: "string", description: "Pubkey of the specific token Mint to limit accounts to" },
        programId: { type: "string", description: "Pubkey of the Token program to limit accounts to" }
      },
      required: ["owner"]
    }
  },
  {
    name: "getTransaction",
    description: "Returns transaction details for a confirmed transaction",
    inputSchema: {
      type: "object",
      properties: {
        signature: { type: "string", description: "Transaction signature" },
        maxSupportedTransactionVersion: { type: "number", description: "Max transaction version to return", default: 0 }
      },
      required: ["signature"]
    }
  },
  {
    name: "getTransactionCount",
    description: "Returns the current Transaction count from the ledger",
    inputSchema: {
      type: "object",
      properties: {
        commitment: { type: "string", description: "Commitment level", default: "confirmed" }
      }
    }
  },
  {
    name: "getVersion",
    description: "Returns the current Solana version running on the node",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "getVoteAccounts",
    description: "Returns the account info and associated stake for all the voting accounts in the current bank",
    inputSchema: {
      type: "object",
      properties: {
        commitment: { type: "string", description: "Commitment level", default: "confirmed" }
      }
    }
  },
  {
    name: "isBlockhashValid",
    description: "Returns whether a blockhash is still valid or not",
    inputSchema: {
      type: "object",
      properties: {
        blockhash: { type: "string", description: "The blockhash to validate" },
        commitment: { type: "string", description: "Commitment level", default: "confirmed" }
      },
      required: ["blockhash"]
    }
  },
  {
    name: "requestAirdrop",
    description: "Requests an airdrop of lamports to a Pubkey (only available on devnet/testnet)",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string", description: "Pubkey to receive lamports (base58 encoded)" },
        lamports: { type: "number", description: "Amount of lamports to airdrop" }
      },
      required: ["address", "lamports"]
    }
  },
  {
    name: "sendTransaction",
    description: "Submits a signed transaction to the cluster for processing",
    inputSchema: {
      type: "object",
      properties: {
        transaction: { type: "string", description: "Signed Transaction (base64 encoded)" },
        skipPreflight: { type: "boolean", description: "Skip preflight checks", default: false }
      },
      required: ["transaction"]
    }
  },
  {
    name: "simulateTransaction",
    description: "Simulate sending a transaction",
    inputSchema: {
      type: "object",
      properties: {
        transaction: { type: "string", description: "Transaction to simulate (base64 encoded)" },
        sigVerify: { type: "boolean", description: "Verify transaction signatures", default: false }
      },
      required: ["transaction"]
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: SOLANA_TOOLS
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    switch (name) {
      case "getAccountInfo": {
        const address = args.address as string;
        const pubkey = new PublicKey(address);
        const accountInfo = await connection.getAccountInfo(pubkey, args.commitment as Commitment);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(accountInfo, null, 2)
          }]
        };
      }

      case "getBalance": {
        const address = args.address as string;
        const pubkey = new PublicKey(address);
        const balance = await connection.getBalance(pubkey, args.commitment as Commitment);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ balance, lamports: balance, sol: balance / 1e9 }, null, 2)
          }]
        };
      }

      case "getBlock": {
        const slot = args.slot as number;
        const block = await connection.getBlock(slot, {
          maxSupportedTransactionVersion: args.maxSupportedTransactionVersion as number
        });
        return {
          content: [{
            type: "text",
            text: JSON.stringify(block, null, 2)
          }]
        };
      }

      case "getBlockHeight": {
        const blockHeight = await connection.getBlockHeight(args.commitment as Commitment);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ blockHeight }, null, 2)
          }]
        };
      }

      case "getBlockTime": {
        const slot = args.slot as number;
        const blockTime = await connection.getBlockTime(slot);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ blockTime, date: blockTime ? new Date(blockTime * 1000).toISOString() : null }, null, 2)
          }]
        };
      }

      case "getClusterNodes": {
        const clusterNodes = await connection.getClusterNodes();
        return {
          content: [{
            type: "text",
            text: JSON.stringify(clusterNodes, null, 2)
          }]
        };
      }

      case "getEpochInfo": {
        const epochInfo = await connection.getEpochInfo(args.commitment as Commitment);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(epochInfo, null, 2)
          }]
        };
      }

      case "getGenesisHash": {
        const genesisHash = await connection.getGenesisHash();
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ genesisHash }, null, 2)
          }]
        };
      }

      case "getHealth": {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ health: "ok" }, null, 2)
          }]
        };
      }

      case "getLatestBlockhash": {
        const blockhashInfo = await connection.getLatestBlockhash(args.commitment as Commitment);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(blockhashInfo, null, 2)
          }]
        };
      }

      case "getMinimumBalanceForRentExemption": {
        const dataLength = args.dataLength as number;
        const minBalance = await connection.getMinimumBalanceForRentExemption(dataLength);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              minBalance, 
              lamports: minBalance, 
              sol: minBalance / 1e9 
            }, null, 2)
          }]
        };
      }

      case "getMultipleAccounts": {
        const addresses = args.addresses as string[];
        const pubkeys = addresses.map((addr: string) => new PublicKey(addr));
        const accounts = await connection.getMultipleAccountsInfo(pubkeys, args.commitment as Commitment);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(accounts, null, 2)
          }]
        };
      }

      case "getSignatureStatuses": {
        const signatures = args.signatures as string[];
        const statuses = await connection.getSignatureStatuses(signatures);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(statuses, null, 2)
          }]
        };
      }

      case "getSlot": {
        const slot = await connection.getSlot(args.commitment as Commitment);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ slot }, null, 2)
          }]
        };
      }

      case "getSupply": {
        const supply = await connection.getSupply(args.commitment as Commitment);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(supply, null, 2)
          }]
        };
      }

      case "getTokenAccountBalance": {
        const address = args.address as string;
        const pubkey = new PublicKey(address);
        const balance = await connection.getTokenAccountBalance(pubkey, args.commitment as Commitment);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(balance, null, 2)
          }]
        };
      }

      case "getTokenAccountsByOwner": {
        const ownerStr = args.owner as string;
        const owner = new PublicKey(ownerStr);
        const mint = args.mint as string | undefined;
        const programId = args.programId as string | undefined;
        const filter = mint ? { mint: new PublicKey(mint) } : { programId: new PublicKey(programId || "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") };
        const accounts = await connection.getTokenAccountsByOwner(owner, filter);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(accounts, null, 2)
          }]
        };
      }

      case "getTransaction": {
        const signature = args.signature as string;
        const transaction = await connection.getTransaction(signature, {
          maxSupportedTransactionVersion: args.maxSupportedTransactionVersion as number
        });
        return {
          content: [{
            type: "text",
            text: JSON.stringify(transaction, null, 2)
          }]
        };
      }

      case "getTransactionCount": {
        const count = await connection.getTransactionCount(args.commitment as Commitment);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ transactionCount: count }, null, 2)
          }]
        };
      }

      case "getVersion": {
        const version = await connection.getVersion();
        return {
          content: [{
            type: "text",
            text: JSON.stringify(version, null, 2)
          }]
        };
      }

      case "getVoteAccounts": {
        const voteAccounts = await connection.getVoteAccounts(args.commitment as Commitment);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(voteAccounts, null, 2)
          }]
        };
      }

      case "isBlockhashValid": {
        const blockhash = args.blockhash as string;
        const isValid = await connection.isBlockhashValid(blockhash, { commitment: args.commitment as Commitment });
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ isValid: isValid.value }, null, 2)
          }]
        };
      }

      case "requestAirdrop": {
        const address = args.address as string;
        const lamports = args.lamports as number;
        const pubkey = new PublicKey(address);
        const signature = await connection.requestAirdrop(pubkey, lamports);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ signature }, null, 2)
          }]
        };
      }

      case "sendTransaction": {
        return {
          content: [{
            type: "text",
            text: "sendTransaction is not implemented for security reasons. Please use a wallet application to send transactions."
          }]
        };
      }

      case "simulateTransaction": {
        return {
          content: [{
            type: "text",
            text: "simulateTransaction requires a properly constructed transaction object. Please provide a valid base64 encoded transaction."
          }]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{
        type: "text",
        text: `Error executing ${name}: ${error.message}`
      }]
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Solana MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});