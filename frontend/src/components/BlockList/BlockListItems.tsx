'use client';

import React from 'react';
import Link from 'next/link';
import styles from './BlockList.module.scss';
import Tooltip from '../UI/Tooltip/Tooltip';
import CopyToClipboard from '../UI/CopyToClipboard/CopyToClipboard';

interface Block {
    id: number | string;
    blockNumber: number | string;
    blockHash: string;
    timestamp: string;
    txCount?: number;
    size?: number;
    miner?: string;
    fees?: string;
    difficulty?: number;
}

interface BlockListItemProps {
    block: Block;
    network: string;
    getSlug: (net: string) => string;
}

export const BlockListItem: React.FC<BlockListItemProps> = ({ block, network, getSlug }) => {
    return (
        <tr>
            <td className={styles.height}>
                <Link href={`/block/${getSlug(network)}/${block.blockNumber}`}>
                    #{Number(block.blockNumber).toLocaleString()}
                </Link>
            </td>
            <td>
                <div className={styles.hashWrapper}>
                    <Tooltip content={`Full Hash: ${block.blockHash}`}>
                        <Link href={`/block/${getSlug(network)}/${block.blockNumber}`} className={styles.hash}>
                            {block.blockHash.substring(0, 12)}...
                        </Link>
                    </Tooltip>
                    <CopyToClipboard text={block.blockHash} />
                </div>
            </td>
            <td>{block.txCount ?? '-'}</td>
            <td>{block.size ? (block.size / 1024).toFixed(2) + ' KB' : '-'}</td>
            {network === 'Ethereum' ? (
                <td>
                    <div className={styles.minerInfo}>
                        <span className={styles.miner}>{block.miner ? block.miner.substring(0, 10) + '...' : '-'}</span>
                        <span className={styles.fees}>{block.fees ?? ''}</span>
                    </div>
                </td>
            ) : (
                <td>{block.difficulty ? (block.difficulty / 1e12).toFixed(2) + 'T' : '-'}</td>
            )}
            <td className={styles.time}>
                {new Date(block.timestamp).toLocaleTimeString()}
            </td>
        </tr>
    );
};

export const BlockCardItem: React.FC<BlockListItemProps> = ({ block, network, getSlug }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <Link href={`/block/${getSlug(network)}/${block.blockNumber}`} className={styles.height}>
                    #{Number(block.blockNumber).toLocaleString()}
                </Link>
                <span className={styles.time}>{new Date(block.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className={styles.cardRow}>
                <span className={styles.label}>Hash</span>
                <div className={styles.hashWrapper}>
                    <span className={styles.hash}>{block.blockHash.substring(0, 12)}...</span>
                    <CopyToClipboard text={block.blockHash} />
                </div>
            </div>
        </div>
    );
}
