---
description: How to run the Blockchain Indexer system
---

## Prerequisites
- Node.js 18+ (use `npx -p node@18` for commands)
- Docker & Docker Compose
- Ethereum RPC URL (get free from Infura, Alchemy, or Ankr)

## Step 1: Start Database
// turbo
Run `docker compose up -d` in the root directory to start PostgreSQL.

## Step 2: Configure Backend
1. Go to `backend/` directory
2. Copy `.env.example` to `.env`: `cp .env.example .env`
3. Edit `.env` and add your Ethereum RPC URL:
   - Get free API key from https://infura.io or https://alchemy.com
   - Update `ETH_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID`

## Step 3: Build and Run Backend
// turbo
1. Install dependencies: `npm install` (in backend/)
2. Build TypeScript: `npx -p node@18 npm run build`
3. Start server: `npx -p node@18 node dist/index.js`

The backend will:
- Connect to PostgreSQL
- Sync database tables
- Start Ethereum indexer
- Listen on port 3001

## Step 4: Setup Frontend
1. Go to `frontend/` directory
2. Install dependencies: `npm install`
// turbo
3. Start dev server: `npm run dev`
4. Open http://localhost:3000 in your browser

## API Endpoints
The backend exposes these endpoints at http://localhost:3001/api:

- `GET /blocks/:network` - Recent blocks (ETH or BTC)
- `GET /address/:address/transactions` - Transactions for an address
- `GET /history/:network?page=1&limit=20` - Paginated transaction history
- `GET /block/:network/:id` - Block details by number or hash

## Troubleshooting

### RPC Errors
If you see "Cannot fulfill request" errors:
1. The free RPC endpoint is rate-limited
2. Get a dedicated API key from Infura or Alchemy
3. Update `ETH_RPC_URL` in backend/.env

### Node Version Issues
This project requires Node 18+. Always use:
```bash
npx -p node@18 npm run build
npx -p node@18 node dist/index.js
```

### Database Connection
Ensure PostgreSQL is running:
```bash
docker ps  # Should show blockchain_indexer_db
docker compose up -d  # Start if not running
```

## How It Works

1. **Indexer** polls Ethereum network every 12 seconds
2. **Fetches** new blocks with full transaction data
3. **Parses** transactions (from, to, value, gas fees)
4. **Stores** in PostgreSQL with atomic transactions
5. **API** serves data to frontend and external clients
6. **Frontend** displays real-time blockchain data

## Next Steps

- Customize the frontend dashboard
- Add more blockchain networks
- Implement WebSocket subscriptions
- Build analytics features
- Add transaction search and filtering
