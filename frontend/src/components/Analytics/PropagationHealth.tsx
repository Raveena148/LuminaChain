'use client';

import React, { useMemo } from 'react';
import styles from './Analytics.module.scss';

const PropagationHealth: React.FC = () => {
    // React 18: memoize the mock data to prevent re-renders
    const mockData = useMemo(() => [40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100], []);

    return (
        <div className={`glass-card ${styles.propagationCard}`}>
            <div className={styles.propHeader}>
                <h3>Network Propagation Health</h3>
                <div className={styles.legend}>
                    <div className={styles.legendItem}>
                        <div className={`${styles.dot} ${styles.ethDot}`}></div> Ethereum
                    </div>
                    <div className={styles.legendItem}>
                        <div className={`${styles.dot} ${styles.btcDot}`}></div> Bitcoin
                    </div>
                </div>
            </div>

            <div className={styles.graphContainer}>
                {mockData.map((h, i) => (
                    <div key={i} className={styles.barWrapper}>
                        <div className={styles.ethBar} style={{ height: `${h}%` }}></div>
                        <div className={styles.btcBar} style={{ height: `${h * 0.4}%` }}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PropagationHealth;
