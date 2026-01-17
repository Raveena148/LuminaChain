'use client';

import React from 'react';
import { Hash } from 'lucide-react';
import styles from './BlockDetail.module.scss';
import CopyToClipboard from '@/components/UI/CopyToClipboard/CopyToClipboard';

interface CryptographicDataProps {
    blockHash: string;
}

const CryptographicData: React.FC<CryptographicDataProps> = ({ blockHash }) => {
    return (
        <div className="glass-card">
            <h3 className={styles.cardTitle}>
                <Hash size={20} className={styles.successIcon} /> Cryptographic Data
            </h3>
            <div className={`${styles.detailRow} ${styles.vertical}`}>
                <span className={styles.label}>Block Hash</span>
                <div className={styles.valueWrapper}>
                    <span className={styles.hashValue}>
                        {blockHash}
                    </span>
                    <CopyToClipboard text={blockHash} />
                </div>
            </div>
        </div>
    );
};

export default CryptographicData;
