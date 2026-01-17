'use client';
import styles from './Tabs.module.scss';

interface TabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
    return (
        <div className={styles.tabs}>
            <button
                className={activeTab === 'dashboard' ? styles.active : ''}
                onClick={() => onTabChange('dashboard')}
            >
                Dashboard
            </button>
            <button
                className={activeTab === 'watchlist' ? styles.active : ''}
                onClick={() => onTabChange('watchlist')}
            >
                Watchlist
            </button>
        </div>
    );
};

export default Tabs;
