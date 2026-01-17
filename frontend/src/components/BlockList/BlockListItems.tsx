'use client';

import React from 'react';
import Link from 'next/link';
import styles from './BlockList.module.scss';
import Tooltip from '../UI/Tooltip/Tooltip';
import CopyToClipboard from '../UI/CopyToClipboard/CopyToClipboard';
import { truncateHash, formatSize, formatDifficulty, formatTime, formatNumber } from '@/utils/helpers';

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
                    #{formatNumber(block.blockNumber)}
                </Link>
            </td>
            <td>
                <div className={styles.hashWrapper}>
                    <Tooltip content={`Full Hash: ${block.blockHash}`}>
                        <Link href={`/block/${getSlug(network)}/${block.blockNumber}`} className={styles.hash}>
                            {truncateHash(block.blockHash, 12, 0)}
                        </Link>
                    </Tooltip>
                    <CopyToClipboard text={block.blockHash} />
                </div>
            </td>
            <td>{block.txCount ?? '-'}</td>
            <td>{block.size ? formatSize(block.size) : '-'}</td>
            {network === 'Ethereum' ? (
                <td>
                    <div className={styles.minerInfo}>
                        <span className={styles.miner}>{block.miner ? truncateHash(block.miner, 10, 0) : '-'}</span>
                        <span className={styles.fees}>{block.fees ?? ''}</span>
                    </div>
                </td>
            ) : (
                <td>{block.difficulty ? formatDifficulty(block.difficulty) : '-'}</td>
            )}
            <td className={styles.time}>
                {formatTime(block.timestamp)}
            </td>
        </tr>
    );
};

export const BlockCardItem: React.FC<BlockListItemProps> = ({ block, network, getSlug }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <Link href={`/block/${getSlug(network)}/${block.blockNumber}`} className={styles.height}>
                    #{formatNumber(block.blockNumber)}
                </Link>
                <span className={styles.time}>{formatTime(block.timestamp)}</span>
            </div>
            <div className={styles.cardRow}>
                <span className={styles.label}>Hash</span>
                <div className={styles.hashWrapper}>
                    <span className={styles.hash}>{truncateHash(block.blockHash, 12, 0)}</span>
                    <CopyToClipboard text={block.blockHash} />
                </div>
            </div>
        </div>
    );
}
