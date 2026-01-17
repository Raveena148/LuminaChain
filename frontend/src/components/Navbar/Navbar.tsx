import Link from 'next/link';
import styles from './Navbar.module.scss';
import { Database, Search, Activity } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.content}`}>
                <Link href="/" className={styles.logo}>
                    <Database size={24} color="#0070f3" />
                    <span>ChainIndex</span>
                </Link>
                <div className={styles.links}>
                    <Link href="/eth">Ethereum</Link>
                    <Link href="/btc">Bitcoin</Link>
                    <Link href="/explorer">Explorer</Link>
                </div>
                <div className={styles.search}>
                    <Search size={18} className={styles.searchIcon} />
                    <input type="text" placeholder="Search address, hash, block..." />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
