import express from 'express';
import Transaction from '../models/Transaction.js';
import Block from '../models/Block.js';
import Watchlist from '../models/Watchlist.js';
import { Op } from 'sequelize';

const router = express.Router();

// --- Watchlist Routes (Database Storage & Updating) ---

// Get all watched addresses
router.get('/watchlist', async (req, res) => {
    try {
        const list = await Watchlist.findAll({ order: [['createdAt', 'DESC']] });
        res.json(list);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Add new address to watchlist
router.post('/watchlist', async (req, res) => {
    try {
        const { address, tag, note } = req.body;
        const item = await Watchlist.create({ address, tag, note });
        res.json(item);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Delete address from watchlist
router.delete('/watchlist/:id', async (req, res) => {
    try {
        await Watchlist.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// --- Blockchain Routes ---

// Get recent blocks
router.get('/blocks/:network', async (req, res) => {
    try {
        const { network } = req.params;
        const limit = Math.min(Number(req.query.limit) || 10, 100);
        const blocks = await Block.findAll({
            where: { network: network.toUpperCase() },
            order: [['blockNumber', 'DESC']],
            limit,
        });
        res.json(blocks);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get transactions by address
router.get('/address/:address/transactions', async (req, res) => {
    try {
        const { address } = req.params;
        const txs = await Transaction.findAll({
            where: {
                [Op.or]: [
                    { fromAddress: address },
                    { toAddress: address },
                ],
            },
            order: [['timestamp', 'DESC']],
            limit: 50,
        });
        res.json(txs);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get transaction history (paginated)
router.get('/history/:network', async (req, res) => {
    try {
        const { network } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const txs = await Transaction.findAndCountAll({
            where: { network: network.toUpperCase() },
            order: [['timestamp', 'DESC']],
            limit: Number(limit),
            offset: offset,
        });
        res.json(txs);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get block details
router.get('/block/:network/:id', async (req, res) => {
    try {
        const { network, id } = req.params;
        const block = await Block.findOne({
            where: {
                network: network.toUpperCase(),
                [Op.or]: [
                    { blockNumber: id },
                    { blockHash: id },
                ],
            },
        });
        if (!block) return res.status(404).json({ error: 'Block not found' });

        const transactions = await Transaction.findAll({
            where: { network: network.toUpperCase(), blockNumber: block.blockNumber },
        });

        res.json({ block, transactions });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get transaction details
router.get('/transaction/:network/:hash', async (req, res) => {
    try {
        const { network, hash } = req.params;
        const transaction = await Transaction.findOne({
            where: {
                network: network.toUpperCase(),
                txHash: hash
            }
        });

        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

        res.json(transaction);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get analytics stats
router.get('/analytics/stats', async (req, res) => {
    try {
        const totalEthTxs = await Transaction.count({ where: { network: 'ETH' } });
        const totalBtcTxs = await Transaction.count({ where: { network: 'BTC' } });

        const latestEthBlock = await Block.findOne({ where: { network: 'ETH' }, order: [['blockNumber', 'DESC']] });
        const firstEthBlock = await Block.findOne({ where: { network: 'ETH' }, order: [['blockNumber', 'ASC']] });

        let avgBlockTime = 12; // fallback
        if (latestEthBlock && firstEthBlock && latestEthBlock.blockNumber !== firstEthBlock.blockNumber) {
            const timeDiff = latestEthBlock.timestamp.getTime() - firstEthBlock.timestamp.getTime();
            const blockDiff = Number(latestEthBlock.blockNumber) - Number(firstEthBlock.blockNumber);
            avgBlockTime = (timeDiff / blockDiff) / 1000;
        }

        // Calculate 24h volume (simulated as sum of stored tx values)
        const ethVolume = await Transaction.sum('value', { where: { network: 'ETH' } }) || 0;
        const btcVolume = await Transaction.sum('value', { where: { network: 'BTC' } }) || 0;

        res.json({
            eth: {
                totalTxs: totalEthTxs,
                avgBlockTime: avgBlockTime.toFixed(2),
                volume24h: ethVolume,
                activeNodes: 1420 // Mock
            },
            btc: {
                totalTxs: totalBtcTxs,
                avgBlockTime: '600', // Hardcoded 10m for BTC
                volume24h: btcVolume,
                activeNodes: 850 // Mock
            },
            global: {
                totalTxs: totalEthTxs + totalBtcTxs,
                marketCap: '$3.2T', // Mocked
                dominance: 'BTC 52%' // Mocked
            }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Global Search
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;

        // 1. Search for Block by Hash or Number
        const block = await Block.findOne({
            where: {
                [Op.or]: [
                    { blockHash: query },
                    { blockNumber: isNaN(Number(query)) ? -1 : Number(query) }
                ]
            }
        });

        if (block) {
            return res.json({ type: 'block', data: block });
        }

        // 2. Search for Transaction by Hash
        const tx = await Transaction.findOne({
            where: { txHash: query }
        });

        if (tx) {
            return res.json({ type: 'transaction', data: tx });
        }

        // 3. Search for Address (check if it appears in from/to fields)
        const addressTx = await Transaction.findOne({
            where: {
                [Op.or]: [
                    { fromAddress: query },
                    { toAddress: query }
                ]
            }
        });

        if (addressTx) {
            // If we found transactions for this query, it's likely an address
            return res.json({ type: 'address', data: { address: query } });
        }

        res.status(404).json({ error: 'No results found' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
