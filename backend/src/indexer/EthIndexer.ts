import { Web3 } from 'web3';
import Block from '../models/Block.js';
import Transaction from '../models/Transaction.js';
import sequelize from '../config/database.js';
import winston from 'winston';
import { Server } from 'socket.io';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'eth-indexer.log' }),
    ],
});

export class EthIndexer {
    private web3: Web3;
    private isSyncing: boolean = false;
    private io: Server;

    constructor(rpcUrl: string, io: Server) {
        this.web3 = new Web3(rpcUrl);
        this.io = io;
    }

    public async start() {
        logger.info('Starting Ethereum Indexer...');

        // Initial sync
        await this.sync();

        // Listen for new blocks
        // Note: web3@4.x has different subscription syntax, using polling for reliability
        setInterval(async () => {
            if (!this.isSyncing) {
                await this.sync();
            }
        }, 12000); // ETH block time is ~12s
    }

    private async sync() {
        this.isSyncing = true;
        try {
            const latestBlockOnChain = Number(await this.web3.eth.getBlockNumber());
            const lastIndexedBlock = await Block.findOne({
                where: { network: 'ETH' },
                order: [['blockNumber', 'DESC']],
            });

            let currentBlock = lastIndexedBlock ? Number(lastIndexedBlock.blockNumber) + 1 : latestBlockOnChain - 10;

            while (currentBlock <= latestBlockOnChain) {
                logger.info(`Syncing ETH block ${currentBlock}`);
                await this.indexBlock(currentBlock);
                currentBlock++;
            }
        } catch (error) {
            logger.error('Error syncing Ethereum:', error);
        } finally {
            this.isSyncing = false;
        }
    }

    private async indexBlock(blockNumber: number) {
        const block = await this.web3.eth.getBlock(blockNumber, true);
        if (!block) return;

        // Idempotency check
        const exists = await Block.findOne({ where: { network: 'ETH', blockNumber } });
        if (exists) {
            // logger.info(`Block ${blockNumber} already indexed.`);
            return;
        }

        const t = await sequelize.transaction();
        try {
            await Block.create({
                network: 'ETH',
                blockNumber: Number(block.number),
                blockHash: block.hash,
                timestamp: new Date(Number(block.timestamp) * 1000),
            }, { transaction: t });

            if (block.transactions) {
                for (const tx of block.transactions) {
                    if (typeof tx === 'string') continue;

                    await Transaction.create({
                        network: 'ETH',
                        txHash: tx.hash,
                        blockNumber: Number(block.number),
                        fromAddress: tx.from,
                        toAddress: tx.to || '0x0000000000000000000000000000000000000000',
                        value: this.web3.utils.fromWei((tx.value || 0).toString(), 'ether'),
                        fee: this.web3.utils.fromWei((BigInt(tx.gasPrice || 0) * BigInt(tx.gas || 0)).toString(), 'ether'),
                        timestamp: new Date(Number(block.timestamp) * 1000),
                    }, { transaction: t });
                }
            }

            await t.commit();
            logger.info(`Indexed ETH block ${blockNumber} with ${block.transactions?.length} txs`);

            // Emit Realtime Event
            this.io.emit('new-block', {
                network: 'ETH',
                height: Number(block.number),
                hash: block.hash,
                timestamp: Number(block.timestamp) * 1000,
                txCount: block.transactions?.length || 0,
                size: Number(block.size)
            });

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}
