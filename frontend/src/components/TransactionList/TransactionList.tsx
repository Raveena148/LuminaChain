'use client';

import React, { useEffect, useState } from 'react';
import styles from './TransactionList.module.scss';
import { ArrowRightLeft } from 'lucide-react';
import { api } from '@/utils/api';
import { Loader } from '../UI/Status/Status';
import { TransactionListItem, TransactionCardItem } from './TransactionItems';

interface Transaction {
    id: number;
    txHash: string;
    blockNumber: number;
    fromAddress: string;
    toAddress: string;
    value: string;
    timestamp: string;
}

interface TransactionListProps {
    network: string;
}

import { PAGINATION, NETWORKS } from '@/utils/constants';

const TransactionList: React.FC<TransactionListProps> = ({ network }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const res = await api.getHistory(network, 1);
                const data = Array.isArray(res.data) ? res.data : (res.data.rows || []);
                setTransactions(data.slice(0, PAGINATION.ITEMS_PER_PAGE));
            } catch (error) {
                console.error('Failed to fetch transactions', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [network]);

    if (loading) return <Loader />;
    if (!transactions.length) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <ArrowRightLeft className={styles.icon} size={20} />
                    <h3>Recent {network.toUpperCase().includes('ETH') ? NETWORKS.ETH : NETWORKS.BTC} Transactions</h3>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tx Hash</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Value</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(tx => (
                            <TransactionListItem key={tx.id || tx.txHash} tx={tx} network={network} />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.mobileCards}>
                {transactions.map(tx => (
                    <TransactionCardItem key={tx.id || tx.txHash} tx={tx} network={network} />
                ))}
            </div>
        </div>
    );
};

export default TransactionList;
