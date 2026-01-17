'use client';

import { useState } from 'react';
import styles from './BlockList.module.scss';
import { Box } from 'lucide-react';
import { Loader, NoData } from '../UI/Status/Status';
import { BlockListItem, BlockCardItem } from './BlockListItems';
import { PAGINATION } from '@/utils/constants';
import { getNetworkSlug } from '@/utils/helpers';

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

const BlockList = ({ blocks, network, loading }: BlockListProps) => {
    const [page, setPage] = useState(1);

    if (loading) return <Loader />;
    if (!blocks || blocks.length === 0) return <NoData />;

    const totalPages = Math.ceil(blocks.length / PAGINATION.ITEMS_PER_PAGE);
    const paginatedBlocks = blocks.slice((page - 1) * PAGINATION.ITEMS_PER_PAGE, page * PAGINATION.ITEMS_PER_PAGE);


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
                            <BlockListItem
                                key={block.id}
                                block={block}
                                network={network}
                                getSlug={getNetworkSlug}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.mobileCards}>
                {paginatedBlocks.map((block) => (
                    <BlockCardItem
                        key={block.id}
                        block={block}
                        network={network}
                        getSlug={getNetworkSlug}
                    />
                ))}
            </div>
        </div>
    );
};

export default BlockList;
