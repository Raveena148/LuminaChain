import axios from 'axios';
import Block from '../models/Block.js';
import Transaction from '../models/Transaction.js';
import sequelize from '../config/database.js';
import winston from 'winston';
import axiosRetry from 'axios-retry';
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'btc-indexer.log' }),
    ],
});
// @ts-ignore
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
export class BtcIndexer {
    rpcUrl;
    isSyncing = false;
    constructor(rpcUrl) {
        this.rpcUrl = rpcUrl;
    }
    async start() {
        logger.info('Starting Bitcoin Indexer...');
        // Initial sync
        await this.sync();
        // Listen for new blocks
        setInterval(async () => {
            if (!this.isSyncing) {
                await this.sync();
            }
        }, 600000); // BTC block time is ~10min
    }
    async rpcCall(method, params = []) {
        // For production, use actual Bitcoin Core RPC
        // For this example, we mock or use a service that mimics it
        try {
            const response = await axios.post(this.rpcUrl, {
                jsonrpc: '1.0',
                id: 'btc-indexer',
                method,
                params,
            });
            return response.data.result;
        }
        catch (error) {
            // In a real scenario, handle connection errors
            throw error;
        }
    }
    async sync() {
        this.isSyncing = true;
        try {
            // Mocking block count if rpc fails or providing public API fallback logic
            const latestBlockOnChain = await this.rpcCall('getblockcount');
            const lastIndexedBlock = await Block.findOne({
                where: { network: 'BTC' },
                order: [['blockNumber', 'DESC']],
            });
            let currentBlockNum = lastIndexedBlock ? Number(lastIndexedBlock.blockNumber) + 1 : latestBlockOnChain - 5;
            while (currentBlockNum <= latestBlockOnChain) {
                const blockHash = await this.rpcCall('getblockhash', [currentBlockNum]);
                const block = await this.rpcCall('getblock', [blockHash, 2]); // 2 for detailed transactions
                await this.indexBlock(block);
                currentBlockNum++;
            }
        }
        catch (error) {
            logger.error('Error syncing Bitcoin:', error);
        }
        finally {
            this.isSyncing = false;
        }
    }
    async indexBlock(block) {
        const t = await sequelize.transaction();
        try {
            await Block.create({
                network: 'BTC',
                blockNumber: block.height,
                blockHash: block.hash,
                timestamp: new Date(block.time * 1000),
            }, { transaction: t });
            for (const tx of block.tx) {
                // BTC UTXO simplification: 
                // toAddress = first vout address
                // fromAddress = hard to determine without tracing vin, usually left empty or indexed separately
                const toAddr = tx.vout[0]?.scriptPubKey?.address || tx.vout[0]?.scriptPubKey?.addresses?.[0] || 'unknown';
                const totalValue = tx.vout.reduce((sum, v) => sum + (v.value || 0), 0);
                await Transaction.create({
                    network: 'BTC',
                    txHash: tx.txid,
                    blockNumber: block.height,
                    fromAddress: 'multiple-inputs', // Normalized for BTC
                    toAddress: toAddr,
                    value: totalValue.toString(),
                    fee: '0', // Calculation requires vin lookup
                    timestamp: new Date(block.time * 1000),
                    rawMetadata: tx,
                }, { transaction: t });
            }
            await t.commit();
            logger.info(`Indexed BTC block ${block.height}`);
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
}
