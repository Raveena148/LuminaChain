'use client';
import { ReactNode } from 'react';
import styles from './Tooltip.module.scss';

interface TooltipProps {
    content: string;
    children: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
    return (
        <div className={styles.wrapper}>
            {children}
            <div className={styles.tooltip}>{content}</div>
        </div>
    );
}
