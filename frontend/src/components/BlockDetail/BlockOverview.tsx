'use client';

import React from 'react';
import { Activity, Clock } from 'lucide-react';
import styles from './BlockDetail.module.scss';

interface BlockOverviewProps {
    block: any;
    transactionsCount: number;
}

import { formatNumber, formatDateTime, formatSize } from '@/utils/helpers';

const BlockOverview: React.FC<BlockOverviewProps> = ({ block, transactionsCount }) => {
    return (
        <div className="glass-card">
            <h3 className={styles.cardTitle}>
                <Activity size={20} className={styles.secondaryIcon} /> Overview
            </h3>
            <div className={styles.detailRow}>
                <span className={styles.label}>Block Height</span>
                <span className={styles.valueHighlight}>
                    {formatNumber(block.blockNumber)}
                </span>
            </div>
            <div className={styles.detailRow}>
                <span className={styles.label}>Timestamp</span>
                <span className={styles.value}>
                    <Clock size={16} /> {formatDateTime(block.timestamp)}
                </span>
            </div>
            <div className={styles.detailRow}>
                <span className={styles.label}>Transaction Count</span>
                <span className={styles.value}>{block.txCount || transactionsCount} Transactions</span>
            </div>
            <div className={styles.detailRow}>
                <span className={styles.label}>Block Size</span>
                <span className={styles.value}>{formatSize(block.size)}</span>
            </div>
        </div>
    );
};

export default BlockOverview;
