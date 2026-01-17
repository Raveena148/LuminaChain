import { useMemo } from 'react';
import { useRealtimeBlocks } from '@/hooks/useRealtimeBlocks';

/**
 * Hook to manage node statistics
 */
export const useNodeStats = () => {
    const { ethBlocks, btcBlocks } = useRealtimeBlocks(5);

    const stats = useMemo(() => ({
        nodes: 240 + (ethBlocks.length + btcBlocks.length),
        links: 1200 + (ethBlocks.length + btcBlocks.length) * 4
    }), [ethBlocks, btcBlocks]);

    return stats;
};

/**
 * Generate dynamic nodes based on real-time block data
 */
export const useDynamicNodes = () => {
    const { ethBlocks, btcBlocks } = useRealtimeBlocks(5);

    const dynamicNodes = useMemo(() => {
        const baseNodes = [
            { lat: 40.7128, lng: -74.0060, name: 'NYC Cluster', color: '#3b82f6', type: 'Ethereum' },
            { lat: 51.5074, lng: -0.1278, name: 'London Relay', color: '#3b82f6', type: 'Ethereum' },
            { lat: 35.6762, lng: 139.6503, name: 'Tokyo Core', color: '#f59e0b', type: 'Bitcoin' },
            { lat: -33.8688, lng: 151.2093, name: 'Sydney Peak', color: '#3b82f6', type: 'Ethereum' },
            { lat: 1.3521, lng: 103.8198, name: 'Singapore Hub', color: '#f59e0b', type: 'Bitcoin' },
            { lat: -23.5505, lng: -46.6333, name: 'Sao Paulo Node', color: '#10b981', type: 'LuminaChain' },
            { lat: 21.0285, lng: 105.8542, name: 'Hanoi Unit', color: '#10b981', type: 'LuminaChain' },
            { lat: 48.8566, lng: 2.3522, name: 'Paris Validator', color: '#3b82f6', type: 'Ethereum' },
        ];

        const extraNodes = [];
        if (ethBlocks.length > 0) {
            extraNodes.push({
                lat: 34.0522 + (Math.random() * 5),
                lng: -118.2437 + (Math.random() * 5),
                name: `Realtime ETH #${ethBlocks[0].height || 'New'}`,
                color: '#3b82f6',
                type: 'Ethereum'
            });
        }
        if (btcBlocks.length > 0) {
            extraNodes.push({
                lat: 41.8781 + (Math.random() * 5),
                lng: -87.6298 + (Math.random() * 5),
                name: `Live BTC Node`,
                color: '#f59e0b',
                type: 'Bitcoin'
            });
        }

        return [...baseNodes, ...extraNodes];
    }, [ethBlocks, btcBlocks]);

    return dynamicNodes;
};

/**
 * Project lat/lng to percentage for responsive mapping
 */
export const projectNodePosition = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: `${x}%`, y: `${y}%` };
};
