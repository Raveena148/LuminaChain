'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { Search, Loader2, Box, Hash, User, ExternalLink, AlertCircle } from 'lucide-react';
import { api } from '@/utils/api';
import styles from '../page.module.scss';

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('query');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (query) {
            handleSearch(query);
        }
    }, [query]);

    const handleSearch = async (q: string) => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await api.globalSearch(q);
            setResult(response.data);
        } catch (err: any) {
            console.error('Search error:', err);
            setError(err.response?.data?.error || 'No results found for this query.');
        } finally {
            setLoading(false);
        }
    };

    if (!query) {
        return (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
                <Search size={64} className="text-secondary" style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                <h2 style={{ marginBottom: '1rem' }}>Blockchain Search Engine</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto' }}>
                    Enter a block height, transaction hash, or wallet address to explore the decentralized web.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
                <Loader2 className="animate-spin" size={48} color="#3b82f6" style={{ marginBottom: '1.5rem', margin: '0 auto' }} />
                <h2>Analyzing Network Data...</h2>
                <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)' }}>Querying LuminaChain indexing nodes for {query}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1.5rem', margin: '0 auto' }} />
                <h2>Search Failed</h2>
                <p style={{ marginTop: '1rem', color: '#ef4444' }}>{error}</p>
                <button
                    onClick={() => window.location.href = '/explorer'}
                    style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px' }}
                >
                    Clear Search
                </button>
            </div>
        );
    }

    const getExternalLink = () => {
        if (!result) return '#';
        const type = result.type;
        const data = result.data;
        const network = data.network || (data.address?.startsWith('0x') ? 'ETH' : 'BTC');

        if (network === 'ETH') {
            if (type === 'block') return `https://etherscan.io/block/${data.blockNumber}`;
            if (type === 'transaction') return `https://etherscan.io/tx/${data.txHash}`;
            if (type === 'address') return `https://etherscan.io/address/${data.address}`;
        } else {
            // BTC
            if (type === 'block') return `https://mempool.space/block/${data.blockHash}`;
            if (type === 'transaction') return `https://mempool.space/tx/${data.txHash}`;
            if (type === 'address') return `https://mempool.space/address/${data.address}`;
        }
        return '#';
    };

    if (result) {
        return (
            <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                    {result.type === 'block' && <Box size={24} className="text-primary" />}
                    {result.type === 'transaction' && <Hash size={24} className="text-success" />}
                    {result.type === 'address' && <User size={24} className="text-warning" />}
                    <h2 style={{ textTransform: 'capitalize' }}>{result.type} Found</h2>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {result.type === 'block' && (
                        <>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Network</span>
                                <span className={styles.value} style={{ color: result.data.network === 'BTC' ? '#f7931a' : '#627eea' }}>{result.data.network}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Height</span>
                                <span className={styles.value}>#{result.data.blockNumber}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Hash</span>
                                <span className={styles.value} style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                    <Link href={`/block/${result.data.network.toLowerCase()}/${result.data.blockNumber}`}>
                                        {result.data.blockHash}
                                    </Link>
                                </span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Timestamp</span>
                                <span className={styles.value}>{new Date(result.data.timestamp).toLocaleString()}</span>
                            </div>
                        </>
                    )}

                    {result.type === 'transaction' && (
                        <>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Network</span>
                                <span className={styles.value}>{result.data.network}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Transaction Hash</span>
                                <span className={styles.value} style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                    <Link href={`/tx/${result.data.network.toLowerCase()}/${result.data.txHash}`}>
                                        {result.data.txHash}
                                    </Link>
                                </span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>From</span>
                                <span className={styles.value} style={{ fontFamily: 'monospace' }}>{result.data.fromAddress}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>To</span>
                                <span className={styles.value} style={{ fontFamily: 'monospace' }}>{result.data.toAddress}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Value</span>
                                <span className={styles.value} style={{ color: '#10b981', fontWeight: 'bold' }}>{result.data.value} {result.data.network}</span>
                            </div>
                        </>
                    )}

                    {result.type === 'address' && (
                        <>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Address</span>
                                <span className={styles.value} style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{result.data.address}</span>
                            </div>
                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                                This address has been identified on the {result.data.address.startsWith('0x') ? 'Ethereum' : 'Bitcoin'} network.
                            </div>
                        </>
                    )}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => window.location.href = '/explorer'}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        New Search
                    </button>
                    {result.type !== 'address' && (
                        <button
                            onClick={() => router.push(result.type === 'block' ? `/block/${result.data.network.toLowerCase()}/${result.data.blockNumber}` : `/tx/${result.data.network.toLowerCase()}/${result.data.txHash}`)}
                            style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Internal View
                        </button>
                    )}
                    <button
                        onClick={() => window.open(getExternalLink(), '_blank')}
                        style={{ flex: 1, background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    >
                        View on Mainnet <ExternalLink size={16} />
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

export default function Explorer() {
    return (
        <div className={styles.container}>
            <header className={styles.hero}>
                <h1 className="gradient-text">Network Explorer</h1>
                <p>Advanced Blockchain Query Engine</p>
            </header>

            <Suspense fallback={<div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={24} style={{ margin: '0 auto' }} /></div>}>
                <SearchContent />
            </Suspense>
        </div>
    );
}
