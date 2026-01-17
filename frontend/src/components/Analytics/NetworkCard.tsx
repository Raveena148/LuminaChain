'use client';

import React, { useMemo } from 'react';
import { Activity, Zap, Database, BarChart3 } from 'lucide-react';
import styles from './NetworkCard.module.scss';

interface NetworkCardProps {
    type: 'ETH' | 'BTC';
    stats: any;
}

const NetworkCard: React.FC<NetworkCardProps> = ({ type, stats }) => {
    const isEth = useMemo(() => type === 'ETH', [type]);

    return (
        <div className={`glass-card ${styles.networkCard}`}>
            <div className={styles.cardBgIcon}>
                {isEth ? <Zap size={150} /> : <Database size={150} />}
            </div>

            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                    <div className={`${styles.iconBox} ${isEth ? styles.ethTheme : styles.btcTheme}`}>
                        {isEth ? <Activity size={20} /> : <BarChart3 size={20} />}
                    </div>
                    {isEth ? 'Ethereum Network' : 'Bitcoin Network'}
                </h3>
                <span className={`${styles.statusBadge} ${isEth ? styles.live : styles.syncing}`}>
                    {isEth ? 'LIVE' : 'SYNCHING'}
                </span>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <p>Stored Transactions</p>
                    <h2>{stats?.totalTxs.toLocaleString()}</h2>
                </div>
                <div className={styles.statItem}>
                    <p>Avg Block Time</p>
                    <h2>{isEth ? `${stats?.avgBlockTime}s` : '10.0m'}</h2>
                </div>
                <div className={styles.statItem}>
                    <p>Total Volume</p>
                    <h2 className={isEth ? styles.ethVolume : styles.btcVolume}>
                        {isEth ? 'Ξ' : '₿'} {parseFloat(stats?.volume24h).toFixed(isEth ? 2 : 4)}
                    </h2>
                </div>
                <div className={styles.statItem}>
                    <p>Indexing Nodes</p>
                    <h2>{stats?.activeNodes}</h2>
                </div>
            </div>
        </div>
    );
};

export default NetworkCard;
