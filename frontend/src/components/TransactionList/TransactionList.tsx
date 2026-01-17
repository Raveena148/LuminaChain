'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './TransactionList.module.scss';
import { ArrowRightLeft } from 'lucide-react';
import { api } from '@/utils/api';
import { Loader, NoData } from '../UI/Status/Status';

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

const TransactionList: React.FC<TransactionListProps> = ({ network }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const res = await api.getHistory(network, 1);
                // Handle both array or { rows: ... } response from findAndCountAll
                const data = Array.isArray(res.data) ? res.data : (res.data.rows || []);
                setTransactions(data.slice(0, 10));
            } catch (error) {
                console.error('Failed to fetch transactions', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [network]);

    if (loading) return <Loader />;
    if (!transactions.length) return null; // Don't show empty table if no data

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <ArrowRightLeft className={styles.icon} size={20} />
                    <h3>Recent {network === 'ETH' ? 'Ethereum' : 'Bitcoin'} Transactions</h3>
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
                            <tr key={tx.id || tx.txHash}>
                                <td>
                                    <Link href={`/tx/${network.toLowerCase()}/${tx.txHash}`} className={styles.hash}>
                                        {tx.txHash.substring(0, 14)}...
                                    </Link>
                                </td>
                                <td>
                                    <span className={styles.address} title={tx.fromAddress}>
                                        {tx.fromAddress ? `${tx.fromAddress.substring(0, 8)}...` : 'N/A'}
                                    </span>
                                </td>
                                <td>
                                    <span className={styles.address} title={tx.toAddress}>
                                        {tx.toAddress ? `${tx.toAddress.substring(0, 8)}...` : 'N/A'}
                                    </span>
                                </td>
                                <td className={styles.value}>
                                    {parseFloat(tx.value).toFixed(6)} {network === 'ETH' ? 'ETH' : 'BTC'}
                                </td>
                                <td className={styles.time}>
                                    {new Date(tx.timestamp).toLocaleTimeString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className={styles.mobileCards}>
                {transactions.map(tx => (
                    <div key={tx.id || tx.txHash} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <Link href={`/tx/${network.toLowerCase()}/${tx.txHash}`} className={styles.hash}>
                                {tx.txHash.substring(0, 14)}...
                            </Link>
                            <span className={styles.time}>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className={styles.cardRow}>
                            <span className={styles.label}>From</span>
                            <span className={styles.address}>{tx.fromAddress ? `${tx.fromAddress.substring(0, 8)}...` : 'N/A'}</span>
                        </div>
                        <div className={styles.cardRow}>
                            <span className={styles.label}>To</span>
                            <span className={styles.address}>{tx.toAddress ? `${tx.toAddress.substring(0, 8)}...` : 'N/A'}</span>
                        </div>
                        <div className={styles.cardRow}>
                            <span className={styles.label}>Value</span>
                            <span className={styles.value}>{parseFloat(tx.value).toFixed(6)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionList;
