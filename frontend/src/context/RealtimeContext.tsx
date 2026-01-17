'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io } from 'socket.io-client';
import { api } from '@/utils/api';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface RealtimeBlock {
    network: 'BTC' | 'ETH';
    height: number;
    hash: string;
    timestamp: number;
    txCount: number;
    size: number;
    miner?: string;
    fees?: string;
    difficulty?: number;
}

interface RealtimeContextType {
    btcBlocks: RealtimeBlock[];
    ethBlocks: RealtimeBlock[];
    connected: boolean;
    loading: boolean;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider = ({ children }: { children: ReactNode }) => {
    const [btcBlocks, setBtcBlocks] = useState<RealtimeBlock[]>([]);
    const [ethBlocks, setEthBlocks] = useState<RealtimeBlock[]>([]);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [ethRes, btcRes] = await Promise.all([
                api.getBlocks('ETH', 100), // Fetch 100 for full sub-page coverage
                api.getBlocks('BTC', 100)
            ]);

            const mapApiBlock = (b: any, network: 'BTC' | 'ETH'): RealtimeBlock => ({
                network,
                height: b.blockNumber,
                hash: b.blockHash,
                timestamp: new Date(b.timestamp).getTime(),
                txCount: b.txCount || 0,
                size: b.size || 0,
            });

            setEthBlocks(ethRes.data.map((b: any) => mapApiBlock(b, 'ETH')));
            setBtcBlocks(btcRes.data.map((b: any) => mapApiBlock(b, 'BTC')));
        } catch (error) {
            console.error('Failed to fetch initial blocks globally:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();

        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
        });

        socket.on('connect', () => {
            console.log('Realtime System Online');
            setConnected(true);
        });

        socket.on('disconnect', () => {
            setConnected(false);
        });

        socket.on('new-block', (block: RealtimeBlock) => {
            if (block.network === 'BTC') {
                setBtcBlocks(prev => {
                    if (prev.some(b => b.hash === block.hash)) return prev;
                    return [block, ...prev].slice(0, 100);
                });
            } else if (block.network === 'ETH') {
                setEthBlocks(prev => {
                    if (prev.some(b => b.hash === block.hash)) return prev;
                    return [block, ...prev].slice(0, 100);
                });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <RealtimeContext.Provider value={{ btcBlocks, ethBlocks, connected, loading }}>
            {children}
        </RealtimeContext.Provider>
    );
};

export const useRealtime = () => {
    const context = useContext(RealtimeContext);
    if (context === undefined) {
        throw new Error('useRealtime must be used within a RealtimeProvider');
    }
    return context;
};
