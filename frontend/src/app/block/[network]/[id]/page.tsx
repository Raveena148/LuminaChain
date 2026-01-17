'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Box, Hash, Clock, Database, Activity, ExternalLink, Loader2 } from 'lucide-react';
import { api } from '@/utils/api';
import styles from '@/app/page.module.scss';
import CopyToClipboard from '@/components/UI/CopyToClipboard/CopyToClipboard';

export default function BlockDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const network = params.network as string;
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await api.getBlockDetails(network.toUpperCase(), id);
                setData(res.data);
            } catch (err: any) {
                console.error('Failed to fetch block details:', err);
                setError(err.response?.data?.error || 'Failed to retrieve block information.');
            } finally {
                setLoading(false);
            }
        };

        if (network && id) {
            fetchDetails();
        }
    }, [network, id]);

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 className="animate-spin" size={48} color="#3b82f6" style={{ margin: '0 auto 1.5rem' }} />
                    <h2 className="gradient-text">Fetching Block Data</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Connecting to {network.toUpperCase()} cluster...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ color: '#ef4444', marginBottom: '1.5rem', fontSize: '3rem' }}>!</div>
                    <h2 style={{ marginBottom: '1rem' }}>Data Unavailable</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>{error || 'Block not found in our index.'}</p>
                    <button className="btn-primary" onClick={() => router.back()}>Go Back</button>
                </div>
            </div>
        );
    }

    const { block, transactions } = data;

    return (
        <div className="container">
            <button
                onClick={() => router.back()}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
                <ArrowLeft size={18} /> Back to Network
            </button>

            <header className={styles.hero} style={{ textAlign: 'left', padding: '0 0 3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <Box className="text-primary" size={32} />
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0 }}>Block #{block.blockNumber}</h1>
                </div>
                <p style={{ marginLeft: '3rem' }}>Comprehensive breakdown of data persisted in the {network.toUpperCase()} blockchain.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {/* Basic Info */}
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Activity size={20} className="text-secondary" /> Overview
                        </h3>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Block Height</span>
                            <span className={styles.value} style={{ fontSize: '1.1rem', color: '#3b82f6' }}>{Number(block.blockNumber).toLocaleString()}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Timestamp</span>
                            <span className={styles.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={16} /> {new Date(block.timestamp).toLocaleString()}
                            </span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Transaction Count</span>
                            <span className={styles.value}>{block.txCount || transactions.length} Transactions</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Block Size</span>
                            <span className={styles.value}>{(block.size / 1024).toFixed(2)} KB</span>
                        </div>
                    </div>

                    {/* Hashes */}
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Hash size={20} className="text-success" /> Cryptographic Data
                        </h3>
                        <div className={styles.detailRow} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span className={styles.label} style={{ marginBottom: '0.5rem' }}>Block Hash</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                                <span className={styles.value} style={{ fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'left', flex: 1, color: 'rgba(255,255,255,0.8)' }}>
                                    {block.blockHash}
                                </span>
                                <CopyToClipboard text={block.blockHash} />
                            </div>
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Database size={20} className="text-warning" /> Block Transactions
                            </h3>
                            <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                                Top {transactions.length} Persisted
                            </span>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                                        <th style={{ padding: '1rem' }}>TX Hash</th>
                                        <th style={{ padding: '1rem' }}>Value</th>
                                        <th style={{ padding: '1rem' }}>From/To</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length > 0 ? transactions.map((tx: any) => (
                                        <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#3b82f6' }}>
                                                <Link href={`/tx/${network.toLowerCase()}/${tx.txHash}`}>
                                                    {tx.txHash.substring(0, 16)}...
                                                </Link>
                                            </td>
                                            <td style={{ padding: '1rem', color: '#10b981', fontWeight: 600 }}>
                                                {tx.value} {network.toUpperCase()}
                                            </td>
                                            <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                                                <div>F: {tx.fromAddress ? tx.fromAddress.substring(0, 10) + '...' : 'N/A'}</div>
                                                <div>T: {tx.toAddress ? tx.toAddress.substring(0, 10) + '...' : 'N/A'}</div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                                                No transactions indexed for this block yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <aside style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ textAlign: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <ExternalLink size={24} className="text-primary" />
                        </div>
                        <h4>External Verification</h4>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: '1rem 0' }}>
                            Verify this block data directly on the {network.toUpperCase()} mainnet via official explorers.
                        </p>
                        <button
                            className="btn-primary"
                            style={{ width: '100%', fontSize: '0.8rem' }}
                            onClick={() => window.open(network.toLowerCase() === 'eth' ? `https://etherscan.io/block/${block.blockNumber}` : `https://mempool.space/block/${block.blockHash}`, '_blank')}
                        >
                            Open External Info
                        </button>
                    </div>

                    <div className="glass-card">
                        <h4 style={{ marginBottom: '1rem' }}>Network Summary</h4>
                        <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Protocol</span>
                                <span>{network.toUpperCase()} Mainnet</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Consensus</span>
                                <span>{network.toUpperCase() === 'ETH' ? 'Proof of Stake' : 'Proof of Work'}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
