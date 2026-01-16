import sequelize from './config/database.js';
import Block from './models/Block.js';
import Transaction from './models/Transaction.js';
import AddressBalance from './models/AddressBalance.js';

const seedData = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced for seeding...');

        // Create ETH Blocks
        const ethBlocks = await Block.bulkCreate([
            { network: 'ETH', blockNumber: 18456001, blockHash: '0x123abc...eth1', timestamp: new Date() },
            { network: 'ETH', blockNumber: 18456002, blockHash: '0x123abc...eth2', timestamp: new Date(Date.now() - 12000) },
            { network: 'ETH', blockNumber: 18456003, blockHash: '0x123abc...eth3', timestamp: new Date(Date.now() - 24000) },
        ]);

        // Create BTC Blocks
        const btcBlocks = await Block.bulkCreate([
            { network: 'BTC', blockNumber: 825001, blockHash: '000000...btc1', timestamp: new Date() },
            { network: 'BTC', blockNumber: 825002, blockHash: '000000...btc2', timestamp: new Date(Date.now() - 600000) },
        ]);

        // Create Transactions
        await Transaction.bulkCreate([
            {
                network: 'ETH',
                txHash: '0xabc...tx1',
                blockNumber: 18456001,
                fromAddress: '0xUser1...ETH',
                toAddress: '0xUser2...ETH',
                value: '1.5',
                fee: '0.002',
                timestamp: new Date(),
                rawMetadata: { gas: 21000 }
            },
            {
                network: 'BTC',
                txHash: 'abc...btctx1',
                blockNumber: 825001,
                fromAddress: 'bc1...user1',
                toAddress: 'bc1...user2',
                value: '0.05',
                fee: '0.0001',
                timestamp: new Date(),
                rawMetadata: { inputs: [] }
            }
        ]);

        // Create Watchlist
        const Watchlist = (await import('./models/Watchlist.js')).default;
        await Watchlist.bulkCreate([
            { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', tag: 'Whale 1', note: 'Binance Hot Wallet' },
            { address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', tag: 'Savings', note: 'Cold Storage' }
        ]);

        console.log('✅ Seed data inserted successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
