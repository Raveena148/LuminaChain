'use client';

import React from 'react';
import { Activity, Clock } from 'lucide-react';
import styles from './BlockDetail.module.scss';

interface BlockOverviewProps {
    block: any;
    transactionsCount: number;
}

const BlockOverview: React.FC<BlockOverviewProps> = ({ block, transactionsCount }) => {
    return (
        <div className="glass-card">
            <h3 className={styles.cardTitle}>
                <Activity size={20} className={styles.secondaryIcon} /> Overview
            </h3>
            <div className={styles.detailRow}>
                <span className={styles.label}>Block Height</span>
                <span className={styles.valueHighlight}>
                    {Number(block.blockNumber).toLocaleString()}
                </span>
            </div>
            <div className={styles.detailRow}>
                <span className={styles.label}>Timestamp</span>
                <span className={styles.value}>
                    <Clock size={16} /> {new Date(block.timestamp).toLocaleString()}
                </span>
            </div>
            <div className={styles.detailRow}>
                <span className={styles.label}>Transaction Count</span>
                <span className={styles.value}>{block.txCount || transactionsCount} Transactions</span>
            </div>
            <div className={styles.detailRow}>
                <span className={styles.label}>Block Size</span>
                <span className={styles.value}>{(block.size / 1024).toFixed(2)} KB</span>
            </div>
        </div>
    );
};

export default BlockOverview;
