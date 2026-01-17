export const NETWORKS = {
    ETH: 'Ethereum',
    BTC: 'Bitcoin',
} as const;

export const NETWORK_SLUGS = {
    ETH: 'eth',
    BTC: 'btc',
} as const;

export const PAGINATION = {
    DEFAULT_LIMIT: 10,
    ITEMS_PER_PAGE: 10,
};

export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    TIMEOUT: 10000,
};

export const REFRESH_INTERVALS = {
    ANALYTICS: 30000,
    BLOCKS: 10000,
};
