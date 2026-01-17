'use client';

import React from 'react';
import Link from 'next/link';
import styles from './TransactionList.module.scss';
import { truncateHash, formatTime, getNetworkSlug } from '@/utils/helpers';

interface Transaction {
    id: number;
    txHash: string;
    blockNumber: number;
    fromAddress: string;
    toAddress: string;
    value: string;
    timestamp: string;
}

interface TransactionItemProps {
    tx: Transaction;
    network: string;
}

export const TransactionListItem: React.FC<TransactionItemProps> = ({ tx, network }) => {
    const networkSlug = getNetworkSlug(network);
    return (
        <tr key={tx.id || tx.txHash}>
            <td>
                <Link href={`/tx/${networkSlug}/${tx.txHash}`} className={styles.hash}>
                    {truncateHash(tx.txHash, 14, 0)}
                </Link>
            </td>
            <td>
                <span className={styles.address} title={tx.fromAddress}>
                    {tx.fromAddress ? truncateHash(tx.fromAddress, 8, 0) : 'N/A'}
                </span>
            </td>
            <td>
                <span className={styles.address} title={tx.toAddress}>
                    {tx.toAddress ? truncateHash(tx.toAddress, 8, 0) : 'N/A'}
                </span>
            </td>
            <td className={styles.value}>
                {parseFloat(tx.value).toFixed(6)} {network.toUpperCase().includes('ETH') ? 'ETH' : 'BTC'}
            </td>
            <td className={styles.time}>
                {formatTime(tx.timestamp)}
            </td>
        </tr>
    );
};

export const TransactionCardItem: React.FC<TransactionItemProps> = ({ tx, network }) => {
    const networkSlug = getNetworkSlug(network);
    return (
        <div key={tx.id || tx.txHash} className={styles.card}>
            <div className={styles.cardHeader}>
                <Link href={`/tx/${networkSlug}/${tx.txHash}`} className={styles.hash}>
                    {truncateHash(tx.txHash, 14, 0)}
                </Link>
                <span className={styles.time}>{formatTime(tx.timestamp)}</span>
            </div>
            <div className={styles.cardRow}>
                <span className={styles.label}>From</span>
                <span className={styles.address}>{tx.fromAddress ? truncateHash(tx.fromAddress, 8, 0) : 'N/A'}</span>
            </div>
            <div className={styles.cardRow}>
                <span className={styles.label}>To</span>
                <span className={styles.address}>{tx.toAddress ? truncateHash(tx.toAddress, 8, 0) : 'N/A'}</span>
            </div>
            <div className={styles.cardRow}>
                <span className={styles.label}>Value</span>
                <span className={styles.value}>{parseFloat(tx.value).toFixed(6)}</span>
            </div>
        </div>
    );
};
