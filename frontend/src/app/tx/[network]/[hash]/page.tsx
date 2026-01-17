'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Hash, Clock, Database, Activity, ExternalLink, Loader2, User, Send, CheckCircle2 } from 'lucide-react';
import { api } from '@/utils/api';
import styles from '@/app/page.module.scss';
import CopyToClipboard from '@/components/UI/CopyToClipboard/CopyToClipboard';

export default function TransactionDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const network = params.network as string;
    const hash = params.hash as string;

    const [loading, setLoading] = useState(true);
    const [tx, setTx] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await api.getTransactionDetails(network.toUpperCase(), hash);
                setTx(res.data);
            } catch (err: any) {
                console.error('Failed to fetch transaction details:', err);
                setError(err.response?.data?.error || 'Failed to retrieve transaction information.');
            } finally {
                setLoading(false);
            }
        };

        if (network && hash) {
            fetchDetails();
        }
    }, [network, hash]);

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 className="animate-spin" size={48} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
                    <h2 className="gradient-text">Analyzing Transaction</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Fetching data for {network.toUpperCase()} transaction...</p>
                </div>
            </div>
        );
    }

    if (error || !tx) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ color: '#ef4444', marginBottom: '1.5rem', fontSize: '3rem' }}>!</div>
                    <h2 style={{ marginBottom: '1rem' }}>Transaction Not Found</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>{error || 'This transaction hash does not exist in our records.'}</p>
                    <button className="btn-primary" onClick={() => router.back()}>Go Back</button>
                </div>
            </div>
        );
    }

    const getExplorerUrl = () => {
        if (network.toLowerCase() === 'eth') {
            return `https://etherscan.io/tx/${tx.txHash}`;
        }
        return `https://mempool.space/tx/${tx.txHash}`;
    };

    return (
        <div className="container">
            <button
                onClick={() => router.back()}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
                <ArrowLeft size={18} /> Back
            </button>

            <header className={styles.hero} style={{ textAlign: 'left', padding: '0 0 3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <Hash className="text-success" size={32} />
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0 }}>Transaction Details</h1>
                </div>
                <p style={{ marginLeft: '3rem', fontFamily: 'monospace', opacity: 0.6 }}>{tx.txHash}</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {/* Status & Value */}
                    <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                                <CheckCircle2 size={24} />
                                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Confirmed</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Value Transferred</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{tx.value} {network.toUpperCase()}</div>
                            </div>
                        </div>

                        <div className={styles.detailRow}>
                            <span className={styles.label}>Network</span>
                            <span className={styles.value} style={{ color: network.toUpperCase() === 'BTC' ? '#f7931a' : '#627eea' }}>{network.toUpperCase()} Mainnet</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Timestamp</span>
                            <span className={styles.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={16} /> {new Date(tx.timestamp).toLocaleString()}
                            </span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Block Height</span>
                            <span className={styles.value} style={{ color: '#3b82f6', cursor: 'pointer' }} onClick={() => router.push(`/block/${network}/${tx.blockNumber}`)}>
                                #{tx.blockNumber}
                            </span>
                        </div>
                    </div>

                    {/* From/To Addresses */}
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Send size={20} className="text-primary" /> Routing
                        </h3>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                                    <User size={14} /> FROM (SENDER)
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                                    <span style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all' }}>{tx.fromAddress || 'Coinbase (New Coins)'}</span>
                                    {tx.fromAddress && <CopyToClipboard text={tx.fromAddress} />}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    ↓
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                                    <User size={14} /> TO (RECIPIENT)
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                                    <span style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all' }}>{tx.toAddress || 'Multiple Outputs'}</span>
                                    {tx.toAddress && <CopyToClipboard text={tx.toAddress} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ textAlign: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <ExternalLink size={24} className="text-success" />
                        </div>
                        <h4>Verify Transaction</h4>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: '1rem 0' }}>
                            Check the full execution details on the {network.toUpperCase()} mainnet explorer.
                        </p>
                        <button
                            className="btn-primary"
                            style={{ width: '100%', fontSize: '0.8rem', background: '#10b981' }}
                            onClick={() => window.open(getExplorerUrl(), '_blank')}
                        >
                            Open External Explorer
                        </button>
                    </div>

                    <div className="glass-card">
                        <h4 style={{ marginBottom: '1rem' }}>Execution Metadata</h4>
                        <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Gas Used</span>
                                <span>{tx.gasUsed || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Fee Paid</span>
                                <span>{tx.fees || '0.0001'} {network.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
