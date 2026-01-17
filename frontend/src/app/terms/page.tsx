'use client';

import styles from '../page.module.scss';
import { FileText } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className={styles.container}>
            <header className={styles.hero}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <FileText size={48} className="text-primary" />
                </div>
                <h1 className="gradient-text">Terms of Service</h1>
                <p>Rules and guidelines for using the LuminaChain platform</p>
            </header>

            <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>1. Acceptance of Terms</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                        By accessing LuminaChain, you agree to be bound by these Terms of Service. If you do not agree,
                        please do not use the service.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>2. Service Availability</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                        LuminaChain provides real-time indexing of blockchain data. While we strive for 100% accuracy and uptime,
                        we do not guarantee the completeness or availability of the information provided at all times.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>3. Prohibited Use</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Users are prohibited from attempting to disrupt the service, scrape data at excessive rates,
                        or use the platform for any illegal activities.
                    </p>
                </section>

                <section>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>4. Limitation of Liability</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                        LuminaChain is not responsible for any financial decisions made based on the data displayed on this platform.
                        Always verify transaction status directly on the network if performing sensitive operations.
                    </p>
                </section>
            </div>
        </div>
    );
}
