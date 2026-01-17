'use client';

import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import BlockList from '@/components/BlockList/BlockList';
import styles from '../../page.module.scss';
import { useParams } from 'next/navigation';

export default function BlocksPage() {
    const { chain } = useParams();
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);

    const network = typeof chain === 'string' ? chain.toUpperCase() : 'ETH';

    useEffect(() => {
        if (network) {
            setLoading(true);
            api.getBlocks(network)
                .then(res => setBlocks(res.data))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [network]);

    return (
        <div className={styles.container}>
            <header className={styles.hero}>
                <h1 className="gradient-text">{network} Blocks</h1>
                <p>Live Block Feed</p>
            </header>
            <BlockList blocks={blocks} network={network} loading={loading} />
        </div>
    );
}
