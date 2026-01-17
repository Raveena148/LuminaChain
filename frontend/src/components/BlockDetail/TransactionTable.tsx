'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Database } from 'lucide-react';
import styles from './BlockDetail.module.scss';

interface TransactionTableProps {
    transactions: any[];
    network: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, network }) => {
    // React 18: useMemo to memoize transaction list
    const transactionItems = useMemo(() => transactions.map((tx: any) => (
        <tr key={tx.id || tx.txHash}>
            <td className={styles.hash}>
                <Link href={`/tx/${network.toLowerCase()}/${tx.txHash}`}>
                    {tx.txHash.substring(0, 16)}...
                </Link>
            </td>
            <td className={styles.addressCell}>
                {tx.fromAddress ? (
                    <span title={tx.fromAddress}>{tx.fromAddress.substring(0, 15)}...</span>
                ) : 'N/A'}
            </td>
            <td className={styles.addressCell}>
                {tx.toAddress ? (
                    <span title={tx.toAddress}>{tx.toAddress.substring(0, 15)}...</span>
                ) : 'N/A'}
            </td>
            <td className={styles.value}>
                {tx.value} {network.toUpperCase()}
            </td>
        </tr>
    )), [transactions, network]);

    return (
        <div className={`glass-card ${styles.transactionCard}`}>
            <div className={styles.cardHeader}>
                <h3 className={styles.noMargin}>
                    <Database size={20} className={styles.warningIcon} /> Block Transactions
                </h3>
                <span className={styles.badge}>
                    Top {transactions.length} Persisted
                </span>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>TX Hash</th>
                            <th>From Address</th>
                            <th>To Address</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? transactionItems : (
                            <tr>
                                <td colSpan={4} className={styles.emptyCell}>
                                    No transactions indexed for this block yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTable;
