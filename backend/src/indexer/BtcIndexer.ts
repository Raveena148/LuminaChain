import axios from 'axios';
import Block from '../models/Block.js';
import Transaction from '../models/Transaction.js';
import sequelize from '../config/database.js';
import winston from 'winston';
import { Server } from 'socket.io'; // Import Server

import axiosRetry from 'axios-retry';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'btc-indexer.log' }),
    ],
});

// @ts-ignore
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export class BtcIndexer {
    private rpcUrl: string;
    private isSyncing: boolean = false;
    private io: Server;

    constructor(rpcUrl: string, io: Server) {
        this.rpcUrl = rpcUrl;
        this.io = io;
    }

    public async start() {
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

    private async rpcCall(method: string, params: any[] = []) {
        try {
            const response = await axios.post(this.rpcUrl, {
                jsonrpc: '1.0',
                id: 'btc-indexer',
                method,
                params,
            });
            return response.data.result;
        } catch (error) {
            throw error;
        }
    }

    private async sync() {
        this.isSyncing = true;
        logger.info('BTC Sync triggered');
        try {
            const latestBlockOnChain = await this.rpcCall('getblockcount');
            logger.info(`BTC Chain Height: ${latestBlockOnChain}`);

            const lastIndexedBlock = await Block.findOne({
                where: { network: 'BTC' },
                order: [['blockNumber', 'DESC']],
            });

            // If we have blocks but no transactions, we might need to re-index. 
            // For simplicity, we start from lastIndexed + 1.
            let currentBlockNum = lastIndexedBlock ? Number(lastIndexedBlock.blockNumber) + 1 : latestBlockOnChain - 5;

            while (currentBlockNum <= latestBlockOnChain) {
                logger.info(`Syncing BTC block ${currentBlockNum}...`);
                const blockHash = await this.rpcCall('getblockhash', [currentBlockNum]);
                const block = await this.rpcCall('getblock', [blockHash, 2]);

                if (!block) {
                    logger.warn(`Could not get block ${currentBlockNum}, skipping.`);
                    currentBlockNum++;
                    continue;
                }

                await this.indexBlock(block);
                currentBlockNum++;
            }
        } catch (error) {
            logger.error('Error syncing Bitcoin:', error);
        } finally {
            this.isSyncing = false;
        }
    }

    private async indexBlock(block: any) {
        // Only skip if block exists AND has transactions
        const existingBlock = await Block.findOne({ where: { network: 'BTC', blockNumber: block.height } });
        if (existingBlock) {
            const txCount = await Transaction.count({ where: { network: 'BTC', blockNumber: block.height } });
            if (txCount > 0) return;
        }

        let txs = block.tx;
        let useBlockchainInfo = false;

        // Try to get enriched block data from Blockchain.info
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const res = await axios.get(`https://blockchain.info/rawblock/${block.hash}?format=json`, { timeout: 15000 });
                if (res.data?.tx) {
                    txs = res.data.tx;
                    useBlockchainInfo = true;
                    break;
                }
            } catch (err) {
                if (attempt === 3) logger.warn(`Sync Fallback for BTC block ${block.height}`);
                else await new Promise(r => setTimeout(r, 2000));
            }
        }

        const t = await sequelize.transaction();
        try {
            const txRecords: any[] = [];
            for (let txData of (txs || [])) {
                try {
                    let tx = txData;
                    if (typeof tx === 'string') {
                        try {
                            tx = await this.rpcCall('getrawtransaction', [tx, 1]);
                        } catch (e) {
                            try {
                                const res = await axios.get(`https://blockchain.info/rawtx/${tx}?format=json`);
                                tx = res.data;
                            } catch (err) { continue; }
                        }
                    }

                    if (!tx) continue;

                    let fromAddr = 'Loading...';
                    const vins = tx.vin || tx.inputs || [];
                    const vouts = tx.vout || tx.out || [];

                    if (vins.length > 0) {
                        const firstVin = vins[0];
                        if (firstVin.coinbase || (firstVin.prev_out && firstVin.prev_out.value === 0)) {
                            fromAddr = 'Coinbase (New BTC)';
                        } else {
                            fromAddr = firstVin.prevout?.scriptPubKey?.address || firstVin.prev_out?.addr || firstVin.prevout?.addr || 'Multiple Inputs';
                        }
                    }

                    const toAddr = vouts[0]?.scriptPubKey?.address || vouts[0]?.addr || 'unknown';
                    const val = (vouts || []).reduce((s: number, v: any) => s + (Number(v.value) || 0), 0);
                    const totalValue = useBlockchainInfo ? val / 100000000 : val;

                    txRecords.push({
                        network: 'BTC',
                        txHash: tx.hash || tx.txid || (typeof txData === 'string' ? txData : ''),
                        blockNumber: block.height,
                        fromAddress: fromAddr,
                        toAddress: toAddr,
                        value: totalValue.toString(),
                        fee: '0',
                        timestamp: new Date(block.time * 1000),
                        rawMetadata: tx,
                    });
                } catch (e) { }
            }

            if (txRecords.length > 0) {
                await Transaction.bulkCreate(txRecords, { transaction: t, ignoreDuplicates: true });
            }

            if (existingBlock) {
                await existingBlock.update({
                    txCount: txRecords.length,
                    size: block.size || 0,
                    blockHash: block.hash,
                    timestamp: new Date(block.time * 1000)
                }, { transaction: t });
            } else {
                await Block.create({
                    network: 'BTC',
                    blockNumber: block.height,
                    blockHash: block.hash,
                    timestamp: new Date(block.time * 1000),
                    txCount: txRecords.length,
                    size: block.size || 0
                }, { transaction: t });
            }

            await t.commit();
            logger.info(`Indexed BTC block ${block.height} with ${txRecords.length} transactions`);

            this.io.emit('new-block', {
                network: 'BTC',
                height: block.height,
                hash: block.hash,
                timestamp: block.time * 1000,
                txCount: txRecords.length,
                size: block.size
            });

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}
