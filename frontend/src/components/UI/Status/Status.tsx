'use client';
import styles from './Loader.module.scss';

export const Loader = () => (
    <div className={styles.loaderContainer}>
        <div className={styles.spinner} />
        <p>Loading Blockchain Data...</p>
    </div>
);

export const NoData = () => (
    <div className={styles.noData}>
        <p>No Records Found</p>
    </div>
);
