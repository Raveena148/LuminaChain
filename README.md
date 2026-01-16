# Production-Ready Blockchain Indexer

A full-stack blockchain indexer for Bitcoin (BTC) and Ethereum (ETH) with real-time monitoring, PostgreSQL storage, and REST APIs.

## 🏗️ System Architecture

```
┌─────────────────┐
│   Frontend      │  Next.js 14 + SCSS
│   (Port 3000)   │  Dashboard & Explorer
└────────┬────────┘
         │
         │ REST API
         ▼
┌─────────────────┐
│   Backend       │  Node.js + Express
│   (Port 3001)   │  API Server
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│  ETH   │ │  BTC   │  Blockchain Indexers
│Indexer │ │Indexer │  (Web3.js / RPC)
└────────┘ └────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │  Database
│   (Port 5432)   │  Blocks & Transactions
└─────────────────┘
```

## ✨ Features

- ✅ **Real-time Blockchain Monitoring**: Polls ETH/BTC networks for new blocks
- ✅ **Transaction Parsing**: Extracts and normalizes transaction data
- ✅ **PostgreSQL Storage**: Indexed database with optimized queries
- ✅ **REST API**: Query blocks, transactions, and address history
- ✅ **Modern Frontend**: Next.js dashboard with glassmorphism design
- ✅ **Error Handling**: Comprehensive logging with Winston
- ✅ **Transaction Safety**: Database transactions prevent partial data

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (Required for modern dependencies)
- **Docker & Docker Compose** (For PostgreSQL)
- **Ethereum RPC URL** (Get free from [Infura](https://infura.io), [Alchemy](https://alchemy.com), or [Ankr](https://ankr.com))

### Installation

1. **Clone and setup database:**
```bash
cd /path/to/antigravityTask
docker compose up -d
```

2. **Configure Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env and add your ETH_RPC_URL
npm install
```

3. **Build and run backend (with Node 18):**
```bash
npx -p node@18 npm run build
npx -p node@18 node dist/index.js
```

4. **Setup Frontend:**
```bash
cd ../frontend
npm install
npm run dev
```

5. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## 🔧 Configuration

### Environment Variables (backend/.env)

```bash
# Database
DB_NAME=blockchain_indexer
DB_USER=user
DB_PASSWORD=password
DB_HOST=localhost
PORT=3001

# Ethereum Indexer
ENABLE_ETH_INDEXER=true
ETH_RPC_URL=https://eth.llamarpc.com  # Or your Infura/Alchemy URL

# Bitcoin Indexer (Optional)
ENABLE_BTC_INDEXER=false
BTC_RPC_URL=http://localhost:8332
```

### Getting a Free Ethereum RPC URL

**Option 1: Infura (Recommended)**
1. Sign up at https://infura.io
2. Create a new project
3. Copy the Ethereum Mainnet endpoint
4. Use: `https://mainnet.infura.io/v3/YOUR_PROJECT_ID`

**Option 2: Alchemy**
1. Sign up at https://alchemy.com
2. Create an app
3. Use: `https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY`

**Option 3: Ankr (Free Public)**
- Use: `https://rpc.ankr.com/eth`

## 📡 API Endpoints

### Get Recent Blocks
```bash
GET /api/blocks/:network
# Example: GET /api/blocks/ETH
```

### Get Address Transactions
```bash
GET /api/address/:address/transactions
# Example: GET /api/address/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb/transactions
```

### Get Transaction History (Paginated)
```bash
GET /api/history/:network?page=1&limit=20
# Example: GET /api/history/ETH?page=1&limit=20
```

### Get Block Details
```bash
GET /api/block/:network/:id
# Example: GET /api/block/ETH/18234567
```

## 🗄️ Database Schema

### Blocks Table
```sql
- id (PRIMARY KEY)
- network (ETH/BTC)
- blockNumber (BIGINT, INDEXED)
- blockHash (STRING, INDEXED)
- timestamp (DATE)
```

### Transactions Table
```sql
- id (PRIMARY KEY)
- network (ETH/BTC)
- txHash (STRING, UNIQUE, INDEXED)
- blockNumber (BIGINT, INDEXED)
- fromAddress (STRING, INDEXED)
- toAddress (STRING, INDEXED)
- value (DECIMAL 36,18)
- fee (DECIMAL 36,18)
- timestamp (DATE)
- rawMetadata (JSONB)
```

## 🛠️ Development

### Backend Development
```bash
cd backend

# Build TypeScript
npx -p node@18 npm run build

# Run with Node 18
npx -p node@18 node dist/index.js

# Watch mode (rebuild on changes)
npx -p node@18 npm run watch
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## 🐛 Troubleshooting

### Issue: "Cannot fulfill request" RPC Error
**Solution**: The free RPC endpoint is rate-limited. Get a dedicated API key from Infura or Alchemy.

### Issue: Node version errors
**Solution**: This project requires Node 18+. Use `npx -p node@18` to run commands with Node 18.

### Issue: Database connection failed
**Solution**: Ensure Docker is running and PostgreSQL container is up:
```bash
docker ps
docker compose up -d
```

### Issue: TypeScript compilation errors
**Solution**: Rebuild the project:
```bash
cd backend
rm -rf dist
npx -p node@18 npm run build
```

## 📊 How It Works

### Ethereum Indexer Flow
1. **Connect** to Ethereum RPC endpoint via Web3.js
2. **Poll** for latest block number every 12 seconds
3. **Compare** with last indexed block in database
4. **Fetch** missing blocks with full transaction data
5. **Parse** transactions (from, to, value, gas)
6. **Store** in PostgreSQL using atomic transactions
7. **Log** progress and errors to console and file

### Data Normalization
- **ETH**: Converts Wei to Ether for readability
- **BTC**: Aggregates UTXO outputs to single value
- **Fees**: Calculated from gas price × gas used (ETH)
- **Timestamps**: Unix timestamps converted to JavaScript Date

## 🎨 Frontend Features

- **Glassmorphism UI**: Modern dark theme with blur effects
- **Real-time Stats**: Network height, indexed transactions
- **Block Explorer**: View recent blocks and transactions
- **Responsive Design**: Works on desktop and mobile
- **SCSS Modules**: Component-scoped styling

## 📝 License

MIT License - Feel free to use for learning and production!

## 🤝 Contributing

This is a production-ready template. Customize for your needs:
- Add more blockchain networks (BSC, Polygon, etc.)
- Implement WebSocket subscriptions
- Add transaction filtering and search
- Build analytics dashboards
- Add user authentication

---

**Built with ❤️ using Node.js, TypeScript, PostgreSQL, and Next.js**
