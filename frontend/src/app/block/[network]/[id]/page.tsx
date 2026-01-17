'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, Box, Loader2 } from 'lucide-react';
import { api } from '@/utils/api';
import styles from '@/components/BlockDetail/BlockDetail.module.scss';

// Dynamic imports for sub-components
const BlockOverview = dynamic(() => import('@/components/BlockDetail/BlockOverview'), {
    loading: () => <div className={styles.skeletonCard} />
});
const CryptographicData = dynamic(() => import('@/components/BlockDetail/CryptographicData'));
const TransactionTable = dynamic(() => import('@/components/BlockDetail/TransactionTable'));
const ExternalVerification = dynamic(() => import('@/components/BlockDetail/ExternalVerification'));

export default function BlockDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const network = (params.network as string) || '';
    const id = (params.id as string) || '';

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!network || !id) return;
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

        fetchDetails();
    }, [network, id]);

    // useMemo for structured data
    const block = useMemo(() => data?.block || null, [data]);
    const transactions = useMemo(() => data?.transactions || [], [data]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loaderWrapper}>
                    <Loader2 className={`${styles.loader} animate-spin`} size={48} />
                    <h2 className="gradient-text">Fetching Block Data</h2>
                    <p>Connecting to {network.toUpperCase()} cluster...</p>
                </div>
            </div>
        );
    }

    if (error || !block) {
        return (
            <div className={styles.errorContainer}>
                <div className={`glass-card ${styles.errorCard}`}>
                    <div className={styles.errorIcon}>!</div>
                    <h2>Data Unavailable</h2>
                    <p>{error || 'Block not found in our index.'}</p>
                    <button className="btn-primary" onClick={() => router.back()}>Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <button onClick={() => router.back()} className={styles.backButton}>
                <ArrowLeft size={18} /> Back to Network
            </button>

            <header className={styles.hero}>
                <div className={styles.titleWrapper}>
                    <Box className={styles.primaryIcon} size={32} />
                    <h1 className="gradient-text">Block #{block.blockNumber}</h1>
                </div>
                <p className={styles.subtitle}>Comprehensive breakdown of data persisted in the {network.toUpperCase()} blockchain.</p>
            </header>

            <div className={styles.mainGrid}>
                <div className={styles.leftCol}>
                    <BlockOverview block={block} transactionsCount={transactions.length} />
                    <CryptographicData blockHash={block.blockHash} />
                </div>
                <ExternalVerification
                    network={network}
                    blockNumber={block.blockNumber}
                    blockHash={block.blockHash}
                />
            </div>

            <TransactionTable transactions={transactions} network={network} />
        </div>
    );
}
