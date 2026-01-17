'use client';

import Link from 'next/link';
import styles from './Footer.module.scss';
import { Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.brandCol}>
                        <div className={styles.logo}>
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <span>LuminaChain</span>
                        </div>
                        <p>Real-Time Blockchain Intelligence</p>
                    </div>

                    <div className={styles.linksGrid}>
                        <div className={styles.col}>
                            <h4>Explore</h4>
                            <Link href="/">Dashboard</Link>
                            <Link href="/ethereum">Ethereum</Link>
                            <Link href="/bitcoin">Bitcoin</Link>
                        </div>
                        <div className={styles.col}>
                            <h4>Services</h4>
                            <Link href="/explorer">Explorer</Link>
                            <Link href="/visualizer">Visualizer</Link>
                            <Link href="/analytics">Analytics</Link>
                        </div>
                        <div className={styles.col}>
                            <h4>Legal</h4>
                            <Link href="/privacy">Privacy</Link>
                            <Link href="/terms">Terms</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <span className={styles.copyright}>© 2026 LuminaChain Inc. All rights reserved.</span>
                    <div className={styles.social}>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub">
                            <Github size={16} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
                            <Twitter size={16} />
                        </a>
                        <a href="mailto:support@luminachain.io" title="Email">
                            <Mail size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
