'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './BlockList.module.scss';
import { Box } from 'lucide-react';
import CopyToClipboard from '../UI/CopyToClipboard/CopyToClipboard';
import Tooltip from '../UI/Tooltip/Tooltip';
import { Loader, NoData } from '../UI/Status/Status';

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

interface BlockListProps {
    blocks: Block[];
    network: string;
    loading?: boolean;
}

const ITEMS_PER_PAGE = 10;

const BlockList = ({ blocks, network, loading }: BlockListProps) => {
    const [page, setPage] = useState(1);

    if (loading) return <Loader />;
    if (!blocks || blocks.length === 0) return <NoData />;

    const totalPages = Math.ceil(blocks.length / ITEMS_PER_PAGE);
    const paginatedBlocks = blocks.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const getSlug = (net: string) => net.toLowerCase().includes('eth') ? 'eth' : 'btc';

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <Box className={styles.icon} size={20} />
                    <h3>{network} Blocks</h3>
                </div>

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className={styles.pageBtn}
                        >
                            &lt;
                        </button>
                        <span className={styles.pageInfo}>{page} / {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className={styles.pageBtn}
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Block Height</th>
                            <th>Hash</th>
                            <th>TXs</th>
                            <th>Size</th>
                            {network === 'Ethereum' ? <th>Miner / Fees</th> : <th>Difficulty</th>}
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedBlocks.map((block) => (
                            <tr key={block.id}>
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
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className={styles.mobileCards}>
                {paginatedBlocks.map((block) => (
                    <div key={block.id} className={styles.card}>
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
                ))}
            </div>
        </div>
    );
};

export default BlockList;
