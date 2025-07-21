[![X (formerly Twitter)](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/ClaudeSolKit)
# Claude Solana MCP Server

<pre> 
  ░██████  ░██                              ░██                 ░██████              ░██    ░██     ░██ ░██   ░██    
 ░██   ░██ ░██                              ░██                ░██   ░██             ░██    ░██    ░██        ░██    
░██        ░██  ░██████   ░██    ░██  ░████████  ░███████     ░██          ░███████  ░██    ░██   ░██   ░██░████████ 
░██        ░██       ░██  ░██    ░██ ░██    ░██ ░██    ░██     ░████████  ░██    ░██ ░██    ░███████    ░██   ░██    
░██        ░██  ░███████  ░██    ░██ ░██    ░██ ░█████████            ░██ ░██    ░██ ░██    ░██   ░██   ░██   ░██    
 ░██   ░██ ░██ ░██   ░██  ░██   ░███ ░██   ░███ ░██            ░██   ░██  ░██    ░██ ░██    ░██    ░██  ░██   ░██    
  ░██████  ░██  ░█████░██  ░█████░██  ░█████░██  ░███████       ░██████    ░███████  ░██    ░██     ░██ ░██    ░████ 
                                                                                                                     
                                                                                                                     
                                                                                                                     
</pre>
An MCP (Model Context Protocol) server that provides Claude with access to Solana blockchain RPC methods. This allows Claude to query real-time blockchain data, check account balances, transaction statuses, and more.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Available Methods](#available-methods)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Features

This MCP server provides comprehensive access to Solana blockchain data through 25+ RPC methods:

- **Real-time blockchain data**: Query current blockchain state, blocks, and transactions
- **Account management**: Check balances, account info, and token holdings
- **Transaction analysis**: Get transaction details, simulate transactions, check statuses
- **Cluster information**: Monitor network health, epoch info, and validator nodes
- **Token operations**: Query SPL token balances and accounts
- **Developer friendly**: Full TypeScript support with type safety

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Claude Desktop** application
- **Git** (for cloning the repository)

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/web3smith/claude-sol-kit.git
cd claude-solana-mcp
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the Project

```bash
npm run build
```

This will compile the TypeScript code into JavaScript in the `dist` directory.

### Step 4: Set Up Environment Variables (Optional)

If you want to use a custom RPC endpoint:

```bash
cp .env.example .env
```

Then edit `.env` to set your preferred RPC endpoint:

```env
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Configuration

### Claude Desktop Configuration

The MCP server needs to be configured in Claude Desktop. The configuration file location varies by operating system:

#### macOS
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

#### Windows
```
%APPDATA%\Claude\claude_desktop_config.json
```

#### Linux
```
~/.config/Claude/claude_desktop_config.json
```

### Configuration File Setup

1. Open the configuration file in a text editor
2. Add the following configuration:

```json
{
  "mcpServers": {
    "solana": {
      "command": "node",
      "args": ["/absolute/path/to/claude-solana-mcp/dist/index.js"],
      "env": {
        "SOLANA_RPC_URL": "https://api.mainnet-beta.solana.com"
      }
    }
  }
}
```

**Important**: Replace `/absolute/path/to/claude-solana-mcp` with the actual path to your installation.

### Network Selection

You can configure different Solana networks by changing the `SOLANA_RPC_URL`:

- **Mainnet**: `https://api.mainnet-beta.solana.com` (default)
- **Devnet**: `https://api.devnet.solana.com`
- **Testnet**: `https://api.testnet.solana.com`
- **Localhost**: `http://localhost:8899`

### Applying Configuration

After updating the configuration:

1. Save the configuration file
2. Completely quit Claude Desktop (not just close the window)
3. Restart Claude Desktop
4. The Solana MCP server should now be available

## Usage

Once configured, you can interact with Solana blockchain data through natural language queries in Claude. Here are some examples:

### Basic Queries

```
"What's the SOL balance of address 11111111111111111111111111111111?"
"Get the current block height"
"Show me the latest blockhash"
"What's the current epoch information?"
```

### Account Information

```
"Get detailed account info for [address]"
"Show me all token accounts owned by [address]"
"What's the minimum balance for rent exemption for 200 bytes?"
```

### Transaction Queries

```
"Get transaction details for signature [txid]"
"Check the status of these transactions: [sig1, sig2, sig3]"
"What's the current transaction count?"
```

### Token Operations

```
"Get the token balance for token account [address]"
"Show all token accounts owned by [owner_address] for mint [mint_address]"
```

### Network Information

```
"List all cluster nodes"
"Get the genesis hash"
"Check if blockhash [hash] is still valid"
"Show me the current supply information"
```

## Available Methods

### Account Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `getAccountInfo` | Returns all information associated with an account | `address`, `commitment` |
| `getBalance` | Returns the balance in lamports | `address`, `commitment` |
| `getMultipleAccounts` | Returns information for multiple accounts | `addresses[]`, `commitment` |

### Block Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `getBlock` | Returns block information | `slot`, `maxSupportedTransactionVersion` |
| `getBlockHeight` | Returns current block height | `commitment` |
| `getBlockTime` | Returns estimated production time | `slot` |

### Cluster Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `getClusterNodes` | Returns info about cluster nodes | none |
| `getEpochInfo` | Returns current epoch information | `commitment` |
| `getGenesisHash` | Returns the genesis hash | none |
| `getHealth` | Returns node health status | none |

### Transaction Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `getLatestBlockhash` | Returns latest blockhash | `commitment` |
| `getSignatureStatuses` | Returns transaction statuses | `signatures[]` |
| `getTransaction` | Returns transaction details | `signature`, `maxSupportedTransactionVersion` |
| `getTransactionCount` | Returns total transaction count | `commitment` |
| `simulateTransaction` | Simulates a transaction | `transaction`, `sigVerify` |

### Token Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `getTokenAccountBalance` | Returns SPL token balance | `address`, `commitment` |
| `getTokenAccountsByOwner` | Returns token accounts by owner | `owner`, `mint`/`programId` |

### Utility Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `getMinimumBalanceForRentExemption` | Calculates rent-exempt balance | `dataLength` |
| `getSlot` | Returns current slot | `commitment` |
| `getSupply` | Returns supply information | `commitment` |
| `getVersion` | Returns Solana version | none |
| `getVoteAccounts` | Returns vote accounts | `commitment` |
| `isBlockhashValid` | Checks blockhash validity | `blockhash`, `commitment` |
| `requestAirdrop` | Request SOL airdrop (devnet/testnet) | `address`, `lamports` |

## Development

### Running in Development Mode

For development with hot reload:

```bash
npm run dev
```

### Project Structure

```
claude-solana-mcp/
├── src/
│   └── index.ts          # Main MCP server implementation
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .env.example          # Example environment variables
├── .gitignore           # Git ignore file
└── README.md            # This file
```

### Adding New RPC Methods

To add a new RPC method:

1. Add the method definition to the `SOLANA_TOOLS` array
2. Implement the handler in the switch statement
3. Rebuild the project

## Testing

### Using MCP Inspector

The MCP Inspector is a debugging tool for testing your server:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

This opens a web interface where you can:
- View available tools
- Test individual methods
- See request/response data

### Manual Testing

You can also test directly in Claude Desktop by asking questions like:
- "Test the getBalance method for address 11111111111111111111111111111111"
- "Show me the raw response from getEpochInfo"

## Troubleshooting

### Common Issues

#### Server not appearing in Claude

1. Check configuration file syntax (must be valid JSON)
2. Ensure absolute paths are used
3. Verify Node.js is in your system PATH
4. Check Claude Desktop logs for errors

#### Connection errors

1. Verify your RPC endpoint is accessible
2. Check internet connection
3. Try a different RPC endpoint
4. Ensure firewall isn't blocking connections

#### Build errors

1. Make sure you have Node.js v18+ installed
2. Delete `node_modules` and run `npm install` again
3. Check for TypeScript errors with `npx tsc --noEmit`

### Debug Mode

To see detailed logs, run the server manually:

```bash
node dist/index.js
```

Then check the error output for any issues.

## Security

### Important Security Considerations

- **Read-only access**: This server only provides read access to blockchain data
- **No private keys**: Never store or transmit private keys through this server
- **Transaction signing**: The `sendTransaction` method is intentionally disabled
- **RPC endpoint**: Use trusted RPC providers to avoid malicious data
- **Local execution**: The server runs locally on your machine

### Best Practices

1. Use environment variables for sensitive configuration
2. Regularly update dependencies for security patches
3. Monitor RPC usage to avoid rate limits
4. Use appropriate network (mainnet vs devnet) for your needs

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Ensure all RPC methods handle errors gracefully

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- Uses [Solana Web3.js](https://github.com/solana-labs/solana-web3.js)
- Inspired by the MCP community

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Join the MCP community discussions

---
