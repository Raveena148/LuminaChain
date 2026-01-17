'use client';

import Link from 'next/link';
import GlobeVisualizer from '@/components/Visualizer/GlobeVisualizer';
import { ArrowLeft } from 'lucide-react';
import styles from '../page.module.scss';

export default function Visualizer() {
    return (
        <div className="container">
            <Link
                href="/"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', textDecoration: 'none' }}
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <header className={styles.hero} style={{ textAlign: 'left', padding: '0 0 2rem' }}>
                <h1 className="gradient-text">Global Node Visualizer</h1>
                <p>Tracking P2P propagation and network health across the decentralized web.</p>
            </header>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', height: '600px', position: 'relative' }}>
                <GlobeVisualizer />
            </div>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-card">
                    <h4 style={{ marginBottom: '1rem' }}>Propagation Monitoring</h4>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                        Visualizing how blocks traverse the global cluster. Each node represents an active LuminaChain indexing point communicating via the gossip protocol.
                    </p>
                </div>
                <div className="glass-card">
                    <h4 style={{ marginBottom: '1rem' }}>Network Heatmap</h4>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                        Currently monitoring 240+ primary nodes. High-density areas indicate major mining clusters and high-traffic routing hubs.
                    </p>
                </div>
            </div>
        </div>
    );
}
