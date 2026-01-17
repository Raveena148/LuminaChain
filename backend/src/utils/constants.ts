export const NETWORKS = {
    ETH: 'ETH',
    BTC: 'BTC',
} as const;

export const RPC_URLS = {
    ETH_HTTP: 'https://ethereum-rpc.publicnode.com',
    ETH_WS: 'wss://ethereum-rpc.publicnode.com',
    BTC_HTTP: 'https://mempool.space/api',
    BTC_WS: 'wss://mempool.space/api/v1/ws',
};

export const REFRESH_INTERVALS = {
    RECONNECT_DELAY: 5000,
};
