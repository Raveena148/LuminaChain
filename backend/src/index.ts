import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import sequelize from './config/database.js';
import apiRoutes from './routes/api.js';
import { EthIndexer } from './indexer/EthIndexer.js';
import { BtcIndexer } from './indexer/BtcIndexer.js';
import { RealtimeService } from './services/RealtimeService.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

// Helper to keep socket alive or debugging
io.on('connection', (socket) => {
    console.log('Client connected to WebSocket:', socket.id);
    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

const startServer = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced');

        // Start Realtime Service
        new RealtimeService(io);

        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Start Legacy Indexers (Background)
        // Start Legacy Indexers (Background)
        if (process.env.ENABLE_ETH_INDEXER === 'true') {
            const ethIndexer = new EthIndexer(process.env.ETH_RPC_URL || 'https://mainnet.infura.io/v3/your-project-id', io);
            ethIndexer.start();
        }

        if (process.env.ENABLE_BTC_INDEXER === 'true') {
            const btcIndexer = new BtcIndexer(process.env.BTC_RPC_URL || 'http://user:pass@localhost:8332', io);
            btcIndexer.start();
        }

    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();
