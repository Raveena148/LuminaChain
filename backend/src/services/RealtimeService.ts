import { Server } from 'socket.io';
import WebSocket from 'ws';
import axios from 'axios';
import Block from '../models/Block.js';
import Transaction from '../models/Transaction.js';
import { NETWORKS, RPC_URLS, REFRESH_INTERVALS } from '../utils/constants.js';
import { hexToInt, formatBaseFee, weiToEth } from '../utils/helpers.js';

// Interfaces for normalized block data
interface BlockData {
    network: typeof NETWORKS.BTC | typeof NETWORKS.ETH;
    height: number;
    hash: string;
    timestamp: number;
    txCount: number;
    size: number; // bytes
    miner?: string;
    fees?: string; // string representation of fees
    difficulty?: number;
}

export class RealtimeService {
    private io: Server;
    private btcWs: WebSocket | null = null;
    private ethWs: WebSocket | null = null;

    constructor(io: Server) {
        this.io = io;
        this.init();
    }

    private async init() {
        // Let indexers handle history to ensure full transaction data is included
        // await this.fetchInitialBtcBlocks();
        // await this.fetchInitialEthBlocks();

        // Start live streams
        this.startBtcStream();
        this.startEthStream();
    }

    private async fetchInitialBtcBlocks() {
        try {
            console.log('🔄 Fetching initial BTC history...');
            const response = await axios.get(`${RPC_URLS.BTC_HTTP}/blocks`);
            const blocks = response.data.slice(0, 5);
            for (const b of blocks) {
                await Block.upsert({
                    network: NETWORKS.BTC,
                    blockNumber: b.height,
                    blockHash: b.id,
                    timestamp: new Date(b.timestamp * 1000),
                    txCount: b.tx_count || 0,
                    size: b.size || 0
                });
            }
            console.log('✅ BTC history initialized');
        } catch (error) {
            console.error('Failed to fetch initial BTC blocks:', error);
        }
    }

    private async fetchInitialEthBlocks() {
        try {
            console.log('🔄 Fetching initial ETH history...');
            // Get latest block number
            const bnRes = await axios.post(RPC_URLS.ETH_HTTP, {
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_blockNumber',
                params: []
            });
            const latestHex = bnRes.data.result;
            const latest = hexToInt(latestHex);

            // Fetch last 5
            for (let i = 0; i < 5; i++) {
                const hexNum = '0x' + (latest - i).toString(16);
                const bRes = await axios.post(RPC_URLS.ETH_HTTP, {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'eth_getBlockByNumber',
                    params: [hexNum, false]
                });
                const b = bRes.data.result;
                if (b) {
                    await Block.upsert({
                        network: NETWORKS.ETH,
                        blockNumber: hexToInt(b.number),
                        blockHash: b.hash,
                        timestamp: new Date(hexToInt(b.timestamp) * 1000),
                        txCount: b.transactions?.length || 0,
                        size: hexToInt(b.size || '0')
                    });
                }
            }
            console.log('✅ ETH history initialized');
        } catch (error) {
            console.error('Failed to fetch initial ETH blocks:', error);
        }
    }

    // --- Bitcoin Streaming (via Mempool.space WS) ---
    private startBtcStream() {
        try {
            this.btcWs = new WebSocket(RPC_URLS.BTC_WS);

            this.btcWs.on('open', () => {
                console.log('🔌 Connected to BTC WebSocket Feed (Mempool.space)');
                this.btcWs?.send(JSON.stringify({ action: 'want-blocks' }));
            });

            this.btcWs.on('message', (data: any) => {
                const msg = JSON.parse(data.toString());
                if (msg.block) {
                    this.processBtcBlock(msg.block);
                }
            });

            this.btcWs.on('error', (err) => console.error('BTC WS Error:', err));
            this.btcWs.on('close', () => {
                console.warn(`BTC WS Closed. Reconnecting in ${REFRESH_INTERVALS.RECONNECT_DELAY / 1000}s...`);
                setTimeout(() => this.startBtcStream(), REFRESH_INTERVALS.RECONNECT_DELAY);
            });
        } catch (e) {
            console.error('Failed to start BTC stream:', e);
        }
    }

    private async processBtcBlock(rawBlock: any) {
        console.log(`✅ Received BTC Block: #${rawBlock.height}`);
        const block: BlockData = {
            network: NETWORKS.BTC,
            height: rawBlock.height,
            hash: rawBlock.id,
            timestamp: rawBlock.timestamp * 1000,
            txCount: rawBlock.tx_count || 0,
            size: rawBlock.size || 0,
            difficulty: rawBlock.difficulty,
        };

        // Persist to DB
        try {
            await Block.upsert({
                network: NETWORKS.BTC,
                blockNumber: block.height,
                blockHash: block.hash,
                timestamp: new Date(block.timestamp),
                txCount: block.txCount,
                size: block.size
            });
        } catch (error) {
            console.error('Error persisting BTC block:', error);
        }

        this.io.emit('new-block', block);
    }

    // --- Ethereum Streaming (via Public RPC WS) ---
    private startEthStream() {
        try {
            this.ethWs = new WebSocket(RPC_URLS.ETH_WS);

            this.ethWs.on('open', () => {
                console.log('🔌 Connected to ETH WebSocket Feed');
                const subRequest = {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'eth_subscribe',
                    params: ['newHeads'],
                };
                this.ethWs?.send(JSON.stringify(subRequest));
            });

            this.ethWs.on('message', async (data: any) => {
                const msg = JSON.parse(data.toString());
                if (msg.method === 'eth_subscription' && msg.params?.result) {
                    await this.processEthHeader(msg.params.result);
                }
            });

            this.ethWs.on('error', (err) => console.error('ETH WS Error:', err));
            this.ethWs.on('close', () => {
                console.warn(`ETH WS Closed. Reconnecting in ${REFRESH_INTERVALS.RECONNECT_DELAY / 1000}s...`);
                setTimeout(() => this.startEthStream(), REFRESH_INTERVALS.RECONNECT_DELAY);
            });
        } catch (e) {
            console.error('Failed to start ETH stream:', e);
        }
    }

    private async processEthHeader(header: any) {
        const blockNumber = hexToInt(header.number);
        console.log(`✅ Received ETH Header: #${blockNumber}`);

        try {
            // To get txCount and size, we need to fetch the full block
            const response = await axios.post(RPC_URLS.ETH_HTTP, {
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_getBlockByNumber',
                params: [header.number, true], // true to get full transactions
            });

            const fullBlock = response.data.result;

            const block: BlockData = {
                network: NETWORKS.ETH,
                height: blockNumber,
                hash: header.hash,
                timestamp: hexToInt(header.timestamp) * 1000,
                txCount: fullBlock?.transactions?.length || 0,
                size: hexToInt(fullBlock?.size || '0'),
                miner: header.miner,
                fees: formatBaseFee(header.baseFeePerGas),
            };

            // Persist Block to DB
            await Block.upsert({
                network: NETWORKS.ETH,
                blockNumber: block.height,
                blockHash: block.hash,
                timestamp: new Date(block.timestamp),
                txCount: block.txCount,
                size: block.size
            });

            // Index at least some transactions for search testing
            if (fullBlock?.transactions) {
                const txsToSave = fullBlock.transactions.slice(0, 10); // Limit to 10 for performance
                for (const tx of txsToSave) {
                    await Transaction.upsert({
                        network: NETWORKS.ETH,
                        txHash: tx.hash,
                        blockNumber: block.height,
                        fromAddress: tx.from,
                        toAddress: tx.to,
                        value: weiToEth(tx.value),
                        timestamp: new Date(block.timestamp)
                    });
                }
            }

            this.io.emit('new-block', block);
        } catch (error) {
            console.error('Error fetching/persisting ETH block:', error);
            const fallbackBlock: BlockData = {
                network: NETWORKS.ETH,
                height: blockNumber,
                hash: header.hash,
                timestamp: hexToInt(header.timestamp) * 1000,
                txCount: 0,
                size: 0,
                miner: header.miner,
                fees: formatBaseFee(header.baseFeePerGas),
            };
            this.io.emit('new-block', fallbackBlock);
        }
    }
}
