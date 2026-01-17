'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import styles from './AnalyticsNavbar.module.scss';
import { Activity, Globe, Zap, Database, TrendingUp } from 'lucide-react';

import { REFRESH_INTERVALS } from '@/utils/constants';
import { formatNumber } from '@/utils/helpers';

const AnalyticsNavbar: React.FC = () => {
    const [stats, setStats] = useState<any>(null);

    const fetchStats = async () => {
        try {
            const res = await api.getAnalyticsStats();
            setStats(res.data);
        } catch (error) {
            console.error('Failed to fetch analytics stats:', error);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, REFRESH_INTERVALS.ANALYTICS); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    if (!stats) return null;

    return (
        <div className={styles.navbar}>
            <div className={styles.inner}>
                <div className={`${styles.statItem} glass-card`}>
                    <Globe size={14} className="text-primary" />
                    <span className={styles.label}>Market Cap</span>
                    <span className={styles.value}>{stats.global.marketCap}</span>
                </div>

                <div className={`${styles.statItem} glass-card`}>
                    <TrendingUp size={14} className="text-secondary" />
                    <span className={styles.label}>ETH Volume</span>
                    <span className={styles.value}>{formatNumber(stats.eth.volume24h)} ETH</span>
                </div>

                <div className={`${styles.statItem} glass-card`}>
                    <Activity size={14} className="text-success" />
                    <span className={styles.label}>ETH Block Time</span>
                    <span className={styles.value}>{stats.eth.avgBlockTime}s</span>
                </div>

                <div className={`${styles.statItem} glass-card`}>
                    <Zap size={14} className="text-warning" />
                    <span className={styles.label}>Global TXs</span>
                    <span className={styles.value}>{formatNumber(stats.global.totalTxs)}</span>
                </div>

                <div className={`${styles.statItem} glass-card`}>
                    <Database size={14} style={{ color: '#8b5cf6' }} />
                    <span className={styles.label}>Active Nodes</span>
                    <span className={styles.value}>{stats.eth.activeNodes + stats.btc.activeNodes}</span>
                </div>

                <div className={`${styles.statItem} glass-card`}>
                    <div className={`${styles.dot} ${styles.live}`}></div>
                    <span className={styles.label}>Network</span>
                    <span className={`${styles.value} ${styles.trendUp}`}>OPERATIONAL</span>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsNavbar;
