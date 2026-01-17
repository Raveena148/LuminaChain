'use client';

import { useEffect, useState, useTransition, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { api } from '@/utils/api';
import { useRealtimeBlocks } from '@/hooks/useRealtimeBlocks';
import styles from './page.module.scss';

// Dynamic imports for better bundle splitting and performance
const SystemHealth = dynamic(() => import('@/components/Dashboard/SystemHealth'), { ssr: false });
const DashboardStats = dynamic(() => import('@/components/Dashboard/DashboardStats'), { ssr: false });
const Tabs = dynamic(() => import('@/components/Tabs/Tabs'), { ssr: false });
const BlockList = dynamic(() => import('@/components/BlockList/BlockList'), { ssr: false });
const WatchlistComponent = dynamic(() => import('@/components/Watchlist/Watchlist'), { ssr: false });

export default function Home() {
  const { btcBlocks, ethBlocks, connected } = useRealtimeBlocks();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPending, startTransition] = useTransition();

  // useMemo for derived state to avoid re-computations
  const stats = useMemo(() => ({
    ethHeight: ethBlocks[0]?.height || 0,
    btcHeight: btcBlocks[0]?.height || 0,
    indexedTxs: ethBlocks.length + btcBlocks.length,
    status: connected ? 'Online' : 'Reconnecting...'
  }), [ethBlocks, btcBlocks, connected]);

  const fetchWatchlist = async () => {
    try {
      const res = await api.getWatchlist();
      setWatchlist(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabChange = (newTab: string) => {
    // React 18: useTransition for non-urgent UI updates
    startTransition(() => {
      setActiveTab(newTab);
    });
  };

  const handleAddToWatchlist = async () => {
    await api.addToWatchlist({
      address: `0x${Math.random().toString(16).slice(2)}`,
      tag: 'New Wallet',
      note: 'Added via UI'
    });
    fetchWatchlist();
  };

  const handleDeleteWatchlist = async (id: number) => {
    await api.removeFromWatchlist(id);
    fetchWatchlist();
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const mapToProp = useMemo(() => (blocks: any[]) => blocks.map((b) => ({
    id: b.hash,
    blockNumber: b.height,
    blockHash: b.hash,
    timestamp: new Date(b.timestamp).toISOString(),
    txCount: b.txCount,
    size: b.size,
    miner: b.miner,
    fees: b.fees,
    difficulty: b.difficulty
  })), []);

  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.hero}>
          <h1 className="gradient-text">LuminaChain Analytics</h1>
          <p>Real-Time Blockchain Intelligence</p>
        </header>

        <SystemHealth status={stats.status} connected={connected} />

        <DashboardStats
          ethHeight={stats.ethHeight}
          btcHeight={stats.btcHeight}
          indexedTxs={stats.indexedTxs}
          status={stats.status}
          connected={connected}
        />

        <Tabs activeTab={activeTab} onTabChange={handleTabChange} />

        <section className={`${styles.content} ${isPending ? styles.pending : ''}`}>
          <div className={styles.mainCol}>
            {activeTab === 'dashboard' ? (
              <div className={styles.dashboardTab}>
                <div className={styles.listWrapper}>
                  <BlockList blocks={mapToProp(ethBlocks).slice(0, 5)} network="Ethereum" />
                </div>
                <div className={styles.listWrapper}>
                  <BlockList blocks={mapToProp(btcBlocks).slice(0, 5)} network="Bitcoin" />
                </div>
              </div>
            ) : (
              <div className={styles.watchlistTab}>
                <div className={styles.actionHeader}>
                  <button className="btn-primary" onClick={handleAddToWatchlist}>
                    + Add Random Wallet
                  </button>
                </div>
                <WatchlistComponent items={watchlist} onDelete={handleDeleteWatchlist} />
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
