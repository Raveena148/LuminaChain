import { NETWORK_SLUGS } from './constants';

/**
 * Truncates a blockchain hash or address for display.
 */
export const truncateHash = (hash: string, start = 6, end = 4): string => {
    if (!hash) return '';
    if (hash.length <= start + end) return hash;
    return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;
};

/**
 * Formats data size in bytes to a human-readable format (e.g., KB, MB).
 */
export const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Formats network difficulty to a compact string (e.g., T for trillions).
 */
export const formatDifficulty = (difficulty: number): string => {
    if (!difficulty) return '-';
    if (difficulty >= 1e12) return (difficulty / 1e12).toFixed(2) + 'T';
    if (difficulty >= 1e9) return (difficulty / 1e9).toFixed(2) + 'G';
    if (difficulty >= 1e6) return (difficulty / 1e6).toFixed(2) + 'M';
    return difficulty.toLocaleString();
};

/**
 * Formats a timestamp into a local date and time string.
 */
export const formatDateTime = (timestamp: string | number | Date): string => {
    return new Date(timestamp).toLocaleString();
};

/**
 * Formats a timestamp into a local time string.
 */
export const formatTime = (timestamp: string | number | Date): string => {
    return new Date(timestamp).toLocaleTimeString();
};

/**
 * Formats a number with local thousand separators.
 */
export const formatNumber = (num: number | string): string => {
    return Number(num).toLocaleString();
};

/**
 * Returns the network slug based on the network name.
 */
export const getNetworkSlug = (network: string): string => {
    const net = network.toLowerCase();
    if (net.includes('eth') || net.includes('ethereum')) return NETWORK_SLUGS.ETH;
    if (net.includes('btc') || net.includes('bitcoin')) return NETWORK_SLUGS.BTC;
    return net;
};

/**
 * Formats a base fee with Gwei unit.
 */
export const formatBaseFee = (fee: string | number | undefined): string => {
    if (fee === undefined || fee === null) return 'N/A';
    if (typeof fee === 'string' && fee.includes('Gwei')) return fee;
    return `${Number(fee).toFixed(2)} Gwei`;
};
