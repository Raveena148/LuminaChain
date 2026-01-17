'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import styles from './BlockDetail.module.scss';

interface ExternalVerificationProps {
    network: string;
    blockNumber: string | number;
    blockHash: string;
}

const ExternalVerification: React.FC<ExternalVerificationProps> = ({ network, blockNumber, blockHash }) => {
    const getExternalUrl = () => {
        return network.toLowerCase() === 'eth'
            ? `https://etherscan.io/block/${blockNumber}`
            : `https://mempool.space/block/${blockHash}`;
    };

    return (
        <aside className={styles.aside}>
            <div className={`glass-card ${styles.externalCard}`}>
                <div className={styles.iconWrapper}>
                    <ExternalLink size={24} className="text-primary" />
                </div>
                <h4>External Verification</h4>
                <p>
                    Verify this block data directly on the {network.toUpperCase()} mainnet via official explorers.
                </p>
                <button
                    className="btn-primary"
                    onClick={() => window.open(getExternalUrl(), '_blank')}
                >
                    Open External Info
                </button>
            </div>

            <div className="glass-card">
                <h4 style={{ marginBottom: '1rem' }}>Network Summary</h4>
                <div className={styles.summaryList}>
                    <div className={styles.summaryRow}>
                        <span className={styles.label}>Protocol</span>
                        <span>{network.toUpperCase()} Mainnet</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.label}>Consensus</span>
                        <span>{network.toUpperCase() === 'ETH' ? 'Proof of Stake' : 'Proof of Work'}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ExternalVerification;
