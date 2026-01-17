'use client';
import { useRealtimeBlocks } from '@/hooks/useRealtimeBlocks';
import BlockList from '@/components/BlockList/BlockList';
import styles from '../page.module.scss';

export default function BitcoinPage() {
    const { btcBlocks, loading } = useRealtimeBlocks(100); // Fetch more for pagination

    const mapToProp = (blocks: any[]) => blocks.map((b) => ({
        id: b.hash,
        blockNumber: b.height,
        blockHash: b.hash,
        timestamp: new Date(b.timestamp).toISOString(),
        txCount: b.txCount,
        size: b.size,
        miner: b.miner,
        fees: b.fees,
        difficulty: b.difficulty
    }));

    return (
        <div className={styles.container}>
            <header className={styles.hero}>
                <h1 className="gradient-text">Bitcoin Mainnet</h1>
                <p>Live blocks from the Bitcoin blockchain</p>
            </header>
            <BlockList blocks={mapToProp(btcBlocks)} network="Bitcoin" loading={loading} />
        </div>
    );
}
