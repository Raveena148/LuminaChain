import axios from 'axios';
import { API_CONFIG } from './constants';

const RAW_BASE_URL = API_CONFIG.BASE_URL;
const API_BASE_URL = RAW_BASE_URL.endsWith('/api') ? RAW_BASE_URL : `${RAW_BASE_URL}/api`;

console.log(`🔌 Initializing API Client at: ${API_BASE_URL}`);

// Create Axios Instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for global error handling (optional expansion)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.warn('API Call Failed:', error.message);
        return Promise.reject(error);
    }
);

export const api = {
    // Blockchain Data
    getBlocks: (network: string, limit = 10) => apiClient.get(`/blocks/${network}?limit=${limit}`),
    getAddressTransactions: (address: string) => apiClient.get(`/address/${address}/transactions`),
    getHistory: (network: string, page = 1) => apiClient.get(`/history/${network}?page=${page}`),
    getBlockDetails: (network: string, id: string) => apiClient.get(`/block/${network}/${id}`),
    getTransactionDetails: (network: string, hash: string) => apiClient.get(`/transaction/${network}/${hash}`),
    getAnalyticsStats: () => apiClient.get('/analytics/stats'),
    globalSearch: (query: string) => apiClient.get(`/search/${query}`),

    // Watchlist
    getWatchlist: () => apiClient.get('/watchlist'),
    addToWatchlist: (data: { address: string; tag: string; note: string }) => apiClient.post('/watchlist', data),
    removeFromWatchlist: (id: number) => apiClient.delete(`/watchlist/${id}`),
};
