#!/bin/bash

echo "🚀 Starting Blockchain Indexer Backend..."
echo ""

# Check if Node 18 is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Installing Node 18..."
    npx -p node@18 node --version
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your ETH_RPC_URL"
    echo ""
fi

# Build TypeScript
echo "📦 Building TypeScript..."
npx -p node@18 npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors above."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo "🌐 Starting server on port 3001..."
echo "📊 Indexer will begin syncing blockchain data..."
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Run the server
npx -p node@18 node dist/index.js
