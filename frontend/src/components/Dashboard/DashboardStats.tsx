'use client';

import React from 'react';
import { Zap, Activity, Shield, Globe } from 'lucide-react';
import styles from '@/app/page.module.scss';

interface DashboardStatsProps {
    ethHeight: number | string;
    btcHeight: number | string;
    indexedTxs: number;
    status: string;
    connected: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ ethHeight, btcHeight, indexedTxs, status, connected }) => {
    return (
        <section className={styles.stats}>
            <div className="glass-card">
                <div className={`${styles.statIcon} ${styles.eth}`}>
                    <Zap size={24} />
                </div>
                <div className={styles.statContent}>
                    <span className={styles.label}>ETH Height</span>
                    <span className={styles.value}>#{Number(ethHeight).toLocaleString()}</span>
                </div>
            </div>
            <div className="glass-card">
                <div className={`${styles.statIcon} ${styles.btc}`}>
                    <Activity size={24} />
                </div>
                <div className={styles.statContent}>
                    <span className={styles.label}>BTC Height</span>
                    <span className={styles.value}>#{Number(btcHeight).toLocaleString()}</span>
                </div>
            </div>
            <div className="glass-card">
                <div className={`${styles.statIcon} ${styles.feed}`}>
                    <Shield size={24} />
                </div>
                <div className={styles.statContent}>
                    <span className={styles.label}>Live Feed</span>
                    <span className={styles.value}>{indexedTxs > 0 ? 'Active' : 'Waiting...'}</span>
                </div>
            </div>
            <div className="glass-card">
                <div className={`${styles.statIcon} ${styles.system}`}>
                    <Globe size={24} />
                </div>
                <div className={styles.statContent}>
                    <span className={styles.label}>System Status</span>
                    <span className={`${styles.statusText} ${status === 'Online' ? styles.online : styles.reconnecting}`}>
                        {status}
                    </span>
                </div>
            </div>
        </section>
    );
};

export default DashboardStats;
