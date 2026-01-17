'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import styles from '../page.module.scss';
import AnalyticsNavbar from '@/components/Analytics/AnalyticsNavbar';
import {
    BarChart3,
    PieChart,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Database,
    Globe,
    Zap,
    Cpu
} from 'lucide-react';

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
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

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <Activity className="animate-spin" size={48} color="#3b82f6" />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.hero} style={{ textAlign: 'center', padding: '0 0 2rem' }}>
                <h1 className="gradient-text">Network Intelligence</h1>
                <p>Global blockchain acoustics and traffic distribution analytics.</p>
            </header>

            <AnalyticsNavbar />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                {/* Ethereum Deep Dive */}
                <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05 }}>
                        <Zap size={150} color="#627eea" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ padding: '8px', background: 'rgba(98, 126, 234, 0.1)', borderRadius: '8px' }}>
                                <Activity size={20} color="#627eea" />
                            </div>
                            Ethereum Network
                        </h3>
                        <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>LIVE</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Stored Transactions</p>
                            <h2 style={{ margin: 0 }}>{stats?.eth.totalTxs.toLocaleString()}</h2>
                        </div>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Avg Block Time</p>
                            <h2 style={{ margin: 0 }}>{stats?.eth.avgBlockTime}s</h2>
                        </div>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Total Volume</p>
                            <h2 style={{ margin: 0, color: '#10b981' }}>Ξ {parseFloat(stats?.eth.volume24h).toFixed(2)}</h2>
                        </div>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Indexing Nodes</p>
                            <h2 style={{ margin: 0 }}>{stats?.eth.activeNodes}</h2>
                        </div>
                    </div>
                </div>

                {/* Bitcoin Deep Dive */}
                <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05 }}>
                        <Database size={150} color="#f7931a" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ padding: '8px', background: 'rgba(247, 147, 26, 0.1)', borderRadius: '8px' }}>
                                <BarChart3 size={20} color="#f7931a" />
                            </div>
                            Bitcoin Network
                        </h3>
                        <span style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>SYNCHING</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Stored Transactions</p>
                            <h2 style={{ margin: 0 }}>{stats?.btc.totalTxs.toLocaleString()}</h2>
                        </div>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Avg Block Time</p>
                            <h2 style={{ margin: 0 }}>10.0m</h2>
                        </div>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Total Volume</p>
                            <h2 style={{ margin: 0, color: '#f59e0b' }}>₿ {parseFloat(stats?.btc.volume24h).toFixed(4)}</h2>
                        </div>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Indexing Nodes</p>
                            <h2 style={{ margin: 0 }}>{stats?.btc.activeNodes}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Analytics */}
            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3>Network Propagation Health</h3>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '2px' }}></div> Ethereum
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '2px' }}></div> Bitcoin
                            </span>
                        </div>
                    </div>

                    <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '10px', paddingBottom: '20px' }}>
                        {/* Mock Graph Bars */}
                        {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
                            <div key={i} style={{ flex: 1, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '4px', position: 'relative', height: '100%' }}>
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    width: '100%',
                                    height: `${h}%`,
                                    background: 'linear-gradient(to top, #3b82f6, #60a5fa)',
                                    borderRadius: '4px',
                                    opacity: 0.8
                                }}></div>
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    width: '100%',
                                    height: `${h * 0.4}%`,
                                    background: '#f59e0b',
                                    borderRadius: '4px',
                                    opacity: 0.8,
                                    left: '20%'
                                }}></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>System Performance</h3>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '10px' }}>
                                <Cpu size={20} color="#8b5cf6" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                                    <span>CPU Load</span>
                                    <span>24%</span>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                                    <div style={{ width: '24%', height: '100%', background: '#8b5cf6', borderRadius: '2px' }}></div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px' }}>
                                <Globe size={20} color="#10b981" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                                    <span>Node Latency</span>
                                    <span>18ms</span>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                                    <div style={{ width: '15%', height: '100%', background: '#10b981', borderRadius: '2px' }}></div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '10px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '10px' }}>
                                <Database size={20} color="#f43f5e" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                                    <span>Storage Used</span>
                                    <span>82%</span>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                                    <div style={{ width: '82%', height: '100%', background: '#f43f5e', borderRadius: '2px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
