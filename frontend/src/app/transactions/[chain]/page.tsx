'use client';

import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import styles from '../../page.module.scss';
import { useParams } from 'next/navigation';
import { Loader, NoData } from '@/components/UI/Status/Status';

export default function TransactionsPage() {
    const { chain } = useParams();
    const [txs, setTxs] = useState([]);
    const [loading, setLoading] = useState(true);

    const network = typeof chain === 'string' ? chain.toUpperCase() : 'ETH';

    useEffect(() => {
        // Note: Backend endpoint for *recent* txs might not exist yet, defaulting to empty or simple fetch
        // If backend doesn't support generic /transactions/:network, we just show empty or mock
        setLoading(true);
        // Simulating delay
        setTimeout(() => {
            setTxs([]);
            setLoading(false);
        }, 1000);
    }, [network]);

    return (
        <div className={styles.container}>
            <header className={styles.hero}>
                <h1 className="gradient-text">{network} Transactions</h1>
                <p>Live Transaction Feed</p>
            </header>

            {loading ? <Loader /> : <NoData />}
        </div>
    );
}
