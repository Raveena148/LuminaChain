'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import styles from './CopyToClipboard.module.scss';
import Tooltip from '../Tooltip/Tooltip';

export default function CopyToClipboard({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'}>
            <button className={`${styles.btn} ${copied ? styles.copied : ''}`} onClick={handleCopy}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
        </Tooltip>
    );
}
