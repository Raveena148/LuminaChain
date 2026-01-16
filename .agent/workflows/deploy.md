---
description: Full-Fledged Deployment of LuminaChain Analytics
---

# Deployment Workflow

This workflow describes how to deploy the full LuminaChain stack (Frontend, Backend, Database) using Docker.

## Prerequisites
- Docker and Docker Compose installed
- Stable internet connection for RPC syncing

## Steps

### 1. Build and Start Services
Run the following command in the root directory:
```bash
docker-compose up --build -d
```
This will:
- Spin up a PostgreSQL 15 database
- Build the Node.js backend and start syncing Ethereum and Bitcoin data
- Build the Next.js frontend and serve it on port 3000

### 2. Verify Database Connectivity
You can check the database logs to ensure the backend has connected:
```bash
docker logs blockchain_indexer_backend
```

### 3. Access the Application
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001/api](http://localhost:3001/api)

### 4. Stopping the Services
To stop all services and keep the data:
```bash
docker-compose down
```
To wipe the database and start fresh:
```bash
docker-compose down -v
```

## Troubleshooting
- **Build Errors**: Ensure you have at least 4GB of RAM assigned to Docker for the Next.js build.
- **RPC Syncing**: If blocks aren't appearing, verify your `ETH_RPC_URL` in `docker-compose.yml`.
