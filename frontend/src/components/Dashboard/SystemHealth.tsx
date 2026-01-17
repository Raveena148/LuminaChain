'use client';

import React from 'react';
import styles from '@/app/page.module.scss';

interface SystemHealthProps {
    status: string;
    connected: boolean;
}

const SystemHealth: React.FC<SystemHealthProps> = ({ status, connected }) => {
    return (
        <section className={`${styles.healthHeader} glass-card`}>
            <h4>System Health Status</h4>
            <div className={styles.healthItems}>
                <div className={styles.healthItem}>
                    <span>PostgreSQL</span>
                    <span className={`${styles.dot} ${styles.online}`}></span>
                </div>
                <div className={styles.healthItem}>
                    <span>ChainVault API</span>
                    <span className={`${styles.dot} ${status === 'Online' ? styles.online : styles.offline}`}></span>
                </div>
                <div className={styles.healthItem}>
                    <span>Mempool Stream</span>
                    <span className={`${styles.dot} ${connected ? styles.online : styles.reconnecting}`}></span>
                </div>
            </div>
        </section>
    );
};

export default SystemHealth;
