'use client';

import styles from '../BlockList/BlockList.module.scss'; // Reuse table styles
import { Star, Trash2 } from 'lucide-react';

interface WatchItem {
    id: number;
    address: string;
    tag: string;
    note: string;
}

interface WatchlistProps {
    items: WatchItem[];
    onDelete: (id: number) => void;
}

const WatchlistComponent = ({ items, onDelete }: WatchlistProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Star size={20} color="#fbbf24" fill="#fbbf24" />
                <h3>Saved Addresses</h3>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tag</th>
                            <th>Address</th>
                            <th>Note</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td style={{ fontWeight: 600, color: '#f8fafc' }}>{item.tag}</td>
                                <td className={styles.hash}>{item.address}</td>
                                <td className={styles.time}>{item.note}</td>
                                <td>
                                    <button onClick={() => onDelete(item.id)} style={{ color: '#ef4444' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WatchlistComponent;
