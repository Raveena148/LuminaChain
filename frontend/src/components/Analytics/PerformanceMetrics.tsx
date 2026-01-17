'use client';

import React, { useMemo } from 'react';
import { Cpu, Globe, Database } from 'lucide-react';
import styles from './PerformanceMetrics.module.scss';

const PerformanceMetrics: React.FC = () => {
    // React 18: useMemo for static data
    const metrics = useMemo(() => [
        {
            label: 'CPU Load',
            value: '24%',
            theme: styles.cpuTheme,
            icon: <Cpu size={20} />
        },
        {
            label: 'Node Latency',
            value: '18ms',
            theme: styles.latencyTheme,
            icon: <Globe size={20} />,
            barValue: '15%'
        },
        {
            label: 'Storage Used',
            value: '82%',
            theme: styles.storageTheme,
            icon: <Database size={20} />
        },
    ], []);

    return (
        <div className={`glass-card ${styles.performanceCard}`}>
            <h3>System Performance</h3>
            <div className={styles.perfList}>
                {metrics.map((m, i) => (
                    <div key={i} className={styles.perfItem}>
                        <div className={`${styles.perfIcon} ${m.theme}`}>
                            {m.icon}
                        </div>
                        <div className={styles.perfContent}>
                            <div className={styles.perfLabel}>
                                <span>{m.label}</span>
                                <span>{m.value}</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div
                                    className={`${styles.fill} ${m.theme}`}
                                    style={{ width: m.barValue || m.value }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PerformanceMetrics;
