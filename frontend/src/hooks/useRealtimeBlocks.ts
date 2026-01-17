import { useMemo } from 'react';
import { useRealtime } from '@/context/RealtimeContext';
import { PAGINATION } from '@/utils/constants';

/**
 * useRealtimeBlocks hook
 * Now serves as a consumer for the global RealtimeContext.
 * Ensures data is preserved across page navigations.
 */
export const useRealtimeBlocks = (_limit = PAGINATION.DEFAULT_LIMIT) => {
    const { btcBlocks: btc, ethBlocks: eth, connected, loading } = useRealtime();

    const btcBlocks = useMemo(() => btc.slice(0, _limit), [btc, _limit]);
    const ethBlocks = useMemo(() => eth.slice(0, _limit), [eth, _limit]);

    return {
        btcBlocks,
        ethBlocks,
        connected,
        loading
    };
};
