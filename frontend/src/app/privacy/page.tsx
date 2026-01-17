'use client';

import styles from '../page.module.scss';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            <header className={styles.hero}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Shield size={48} className="text-primary" />
                </div>
                <h1 className="gradient-text">Privacy Policy</h1>
                <p>How LuminaChain handles your data and privacy</p>
            </header>

            <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>1. Data Collection</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                        LuminaChain is a blockchain explorer. We do not collect personal identification information from our users.
                        Our platform indexed public blockchain data which is inherently transparent and accessible to everyone.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>2. Public Ledger Data</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Information displayed on LuminaChain (such as transaction hashes, wallet addresses, and block details) is
                        sourced directly from the decentralized public ledgers of Bitcoin and Ethereum. This data cannot be
                        altered or deleted by LuminaChain.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>3. Cookies & Analytics</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                        We use minimal local storage to remember your theme preferences and connected wallet state (if opted-in).
                        We do not sell user data to third parties.
                    </p>
                </section>

                <section>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>4. Contact</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                        If you have questions regarding our privacy practices, please contact us at privacy@luminachain.io.
                    </p>
                </section>
            </div>
        </div>
    );
}
