
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Activity,
    Layers,
    Box,
    BarChart2,
    Wallet,
    Settings,
    Search,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const connectWallet = async () => {
        if (typeof window === 'undefined') return;

        // @ts-ignore
        if (!window.ethereum) {
            alert('Please install MetaMask to connect your wallet!');
            window.open('https://metamask.io/download/', '_blank');
            return;
        }

        try {
            setIsConnecting(true);
            // @ts-ignore
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts && accounts.length > 0) {
                setWalletAddress(accounts[0]);
            }
        } catch (error) {
            console.error('Wallet connection failed:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setWalletAddress(null);
    };

    const formatAddress = (addr: string) => {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    const navItems = [
        { label: 'Home', href: '/', icon: Home },
        { label: 'Ethereum', href: '/ethereum', icon: Layers },
        { label: 'Bitcoin', href: '/bitcoin', icon: Box },
        { label: 'Explorer', href: '/explorer', icon: Search },
        { label: 'Analytics', href: '/analytics', icon: BarChart2 },
        { label: 'Node Visualizer', href: '/visualizer', icon: Activity },
    ];

    return (
        <>
            <button
                className={styles.mobileToggle}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X /> : <Menu />}
            </button>

            <aside className={`${styles.sidebar} ${isMobileOpen ? styles.open : ''}`}>
                <div className={styles.logoArea}>
                    <div className={styles.logoMark}>
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className={styles.logoText}>LuminaChain</span>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                                onClick={() => setIsMobileOpen(false)}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                                {isActive && <div className={styles.activeIndicator} />}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.footer}>
                    {walletAddress ? (
                        <button className={styles.walletBtn} onClick={disconnectWallet} title="Disconnect">
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                            <span>{formatAddress(walletAddress)}</span>
                        </button>
                    ) : (
                        <button className={styles.walletBtn} onClick={connectWallet} disabled={isConnecting}>
                            <Wallet size={18} />
                            <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                        </button>
                    )}

                    <div className={styles.versionInfo}>
                        <span>Version 1.0.0</span>
                    </div>
                </div>
            </aside>

            {isMobileOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
