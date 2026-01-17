'use client';

import { useEffect, useState } from 'react';
import BlockList from '@/components/BlockList/BlockList';
import { Activity, Zap, Shield, Globe } from 'lucide-react';
import styles from './page.module.scss';

// Note: In real app, fetch this from the backend
import { api } from '@/utils/api';

import Tabs from '@/components/Tabs/Tabs';
import WatchlistComponent from '@/components/Watchlist/Watchlist';
import { useRealtimeBlocks } from '@/hooks/useRealtimeBlocks';

export default function Home() {
  const { btcBlocks, ethBlocks, connected } = useRealtimeBlocks();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = {
    ethHeight: ethBlocks[0]?.height || 0,
    btcHeight: btcBlocks[0]?.height || 0,
    indexedTxs: ethBlocks.length + btcBlocks.length,
    status: connected ? 'Online' : 'Reconnecting...'
  };

  const fetchWatchlist = async () => {
    try {
      const res = await api.getWatchlist();
      setWatchlist(res.data);
    } catch (err) {
      console.error(err);
    }
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
    <main>
      <div className="container">
        <header className={styles.hero}>
          <h1 className="gradient-text">LuminaChain Analytics</h1>
          <p>Real-Time Blockchain Intelligence</p>
        </header>

        <section className={`${styles.healthHeader} glass-card`}>
          <h4>System Health Status</h4>
          <div className={styles.healthItems}>
            <div className={styles.healthItem}>
              <span>PostgreSQL</span>
              <span className={styles.dot}></span>
            </div>
            <div className={styles.healthItem}>
              <span>ChainVault API</span>
              <span className={styles.dot} style={{ background: stats.status === 'Online' ? '#10b981' : '#ef4444', boxShadow: `0 0 8px ${stats.status === 'Online' ? '#10b981' : '#ef4444'}` }}></span>
            </div>
            <div className={styles.healthItem}>
              <span>Mempool Stream</span>
              <span className={styles.dot} style={{ background: connected ? '#10b981' : '#f59e0b', boxShadow: `0 0 8px ${connected ? '#10b981' : '#f59e0b'}` }}></span>
            </div>
          </div>
        </section>

        <section className={styles.stats}>
          <div className="glass-card">
            <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
              <Zap color="#3b82f6" size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.label}>ETH Height</span>
              <span className={styles.value}>#{Number(stats.ethHeight).toLocaleString()}</span>
            </div>
          </div>
          <div className="glass-card">
            <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
              <Activity color="#f59e0b" size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.label}>BTC Height</span>
              <span className={styles.value}>#{Number(stats.btcHeight).toLocaleString()}</span>
            </div>
          </div>
          <div className="glass-card">
            <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
              <Shield color="#10b981" size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.label}>Live Feed</span>
              <span className={styles.value}>{stats.indexedTxs > 0 ? 'Active' : 'Waiting...'}</span>
            </div>
          </div>
          <div className="glass-card">
            <div className={styles.statIcon} style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
              <Globe color="#8b5cf6" size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.label}>System Status</span>
              <span style={{ color: connected ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                {stats.status}
              </span>
            </div>
          </div>
        </section>

        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        <section className={styles.content}>
          <div className={styles.mainCol}>
            {activeTab === 'dashboard' ? (
              <>
                <div style={{ marginBottom: '2rem' }}>
                  <BlockList blocks={mapToProp(ethBlocks).slice(0, 5)} network="Ethereum" />
                </div>
                <BlockList blocks={mapToProp(btcBlocks).slice(0, 5)} network="Bitcoin" />
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                  <button className="btn-primary" onClick={handleAddToWatchlist}>
                    + Add Random Wallet
                  </button>
                </div>
                <WatchlistComponent items={watchlist} onDelete={handleDeleteWatchlist} />
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
