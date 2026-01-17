'use client';
import { useState, useEffect } from 'react';
import { Search, Bell, User, LogOut, Settings as SettingsIcon, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRealtime } from '@/context/RealtimeContext';
import styles from './Header.module.scss';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const query = searchQuery.trim();
        if (!query) return;

        // Simple routing logic: 
        // If it's a number, treat as ETH block height by default
        if (/^\d+$/.test(query)) {
            router.push(`/ethereum?block=${query}`);
        } else if (query.startsWith('0x')) {
            // Treat as address/tx hash
            router.push(`/explorer?query=${query}`);
        } else {
            router.push(`/explorer?query=${query}`);
        }
        setSearchQuery('');
    };

    const { btcBlocks, ethBlocks } = useRealtime();

    // Get combined sorted live feed (latest first)
    const liveFeed = [...btcBlocks, ...ethBlocks]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);

    return (
        <header className={styles.header}>
            <form className={styles.searchWrapper} onSubmit={handleSearch}>
                <Search className={styles.icon} size={18} />
                <input
                    type="text"
                    placeholder="Search transactions, blocks, or addresses..."
                    className={styles.input}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className={styles.shortcut}>/</div>
            </form>

            <div className={styles.brandBadge}>
                <div className={styles.pulse} />
                <span>Real-Time Blockchain Intelligence</span>
            </div>

            <div className={styles.actions}>
                <div className={styles.actionItem}>
                    <button
                        className={`${styles.iconBtn} ${showNotifications ? styles.active : ''}`}
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowUserMenu(false);
                        }}
                    >
                        <Bell size={20} />
                        {liveFeed.length > 0 && <span className={styles.badge} />}
                    </button>

                    {showNotifications && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownHeader}>Live Feed</div>
                            <div className={styles.dropdownList}>
                                {liveFeed.length > 0 ? (
                                    liveFeed.map((block) => (
                                        <div key={`${block.network}-${block.hash}`} className={styles.notifItem}>
                                            <div className={`${styles.notifDot} ${block.network === 'ETH' ? styles.ethDot : styles.btcDot}`} />
                                            <div>
                                                <span className={styles.notifNetwork}>{block.network}</span> Block
                                                <span className={styles.notifHeight}> #{block.height}</span> mined
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noData}>No recent activity</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.actionItem}>
                    <button
                        className={styles.profileBtn}
                        onClick={() => {
                            setShowUserMenu(!showUserMenu);
                            setShowNotifications(false);
                        }}
                    >
                        <div className={styles.avatar}>
                            <User size={18} />
                        </div>
                        <div className={styles.userInfo}>
                            <div className={styles.nameRow}>
                                <span className={styles.name}>Demo User</span>
                                <span className={styles.proBadge}>PRO</span>
                            </div>
                            <span className={styles.role}>Viewer Mode</span>
                        </div>
                    </button>

                    {showUserMenu && (
                        <div className={styles.dropdown}>
                            <div className={styles.menuItem}>
                                <User size={16} />
                                <span>Public Profile</span>
                            </div>
                            <div className={styles.menuItem}>
                                <SettingsIcon size={16} />
                                <span>System Settings</span>
                            </div>
                            <div className={styles.menuItem}>
                                <Shield size={16} />
                                <span>Security Log</span>
                            </div>
                            <div className={styles.divider} />
                            <div className={`${styles.menuItem} ${styles.logout}`}>
                                <LogOut size={16} />
                                <span>Logout Session</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
