'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { api } from '@/utils/api';
import styles from '@/components/Analytics/Analytics.module.scss';
import { Activity } from 'lucide-react';
import AnalyticsNavbar from '@/components/Analytics/AnalyticsNavbar';

// Dynamic sub-components for optimized lazy loading
const NetworkCard = dynamic(() => import('@/components/Analytics/NetworkCard'), {
    loading: () => <div className={styles.skeletonBlock} />
});
const PropagationHealth = dynamic(() => import('@/components/Analytics/PropagationHealth'));

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await api.getAnalyticsStats();
                setStats(res.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // useMemo helps preventing unnecessary downstream renders if stats object reference changes but content is same
    const ethStats = useMemo(() => stats?.eth, [stats]);
    const btcStats = useMemo(() => stats?.btc, [stats]);

    if (loading) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.loaderContent}>
                    <Activity className={`${styles.spinner} animate-spin`} size={48} />
                    <p>Loading Intelligence Feed...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <header className={styles.hero}>
                <h1 className="gradient-text">Network Intelligence</h1>
                <p>Global blockchain acoustics and traffic distribution analytics.</p>
            </header>

            <AnalyticsNavbar />

            <section className={styles.networkGrid}>
                {ethStats && <NetworkCard type="ETH" stats={ethStats} />}
                {btcStats && <NetworkCard type="BTC" stats={btcStats} />}
            </section>

            <section className={styles.chartSection}>
                <PropagationHealth ethStats={ethStats} btcStats={btcStats} />
            </section>
        </div>
    );
}
