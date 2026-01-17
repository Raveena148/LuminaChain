'use client';

import React, { useMemo, useState } from 'react';
import { useRealtimeBlocks } from '@/hooks/useRealtimeBlocks';
import styles from './PropagationHealth.module.scss';

type TimeRange = 'day' | 'month' | 'year' | 'all';
type NetworkType = 'both' | 'ETH' | 'BTC';

interface PropagationHealthProps {
    ethStats?: any;
    btcStats?: any;
}

const PropagationHealth: React.FC<PropagationHealthProps> = ({ ethStats, btcStats }) => {
    const [timeRange, setTimeRange] = useState<TimeRange>('day');
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('both');

    const { ethBlocks, btcBlocks } = useRealtimeBlocks(100);

    // Generate chart data with smart grouping
    const chartData = useMemo(() => {
        const configs = {
            day: { points: 24, label: 'h' },
            month: { points: 30, label: 'd' },
            year: { points: 12, label: 'm' },
            all: { points: 20, label: 'pt' }
        };

        const config = configs[timeRange];
        const blocksPerPoint = Math.max(1, Math.floor(ethBlocks.length / config.points));

        return Array.from({ length: config.points }, (_, i) => {
            const ethSlice = ethBlocks.slice(i * blocksPerPoint, (i + 1) * blocksPerPoint);
            const btcSlice = btcBlocks.slice(i * blocksPerPoint, (i + 1) * blocksPerPoint);

            const ethHealth = ethSlice.length > 0
                ? Math.min(100, 65 + (ethSlice.reduce((sum, b) => sum + (b.txCount || 0), 0) / ethSlice.length / 5))
                : 70 + Math.random() * 25;

            const btcHealth = btcSlice.length > 0
                ? Math.min(100, 55 + (btcSlice.reduce((sum, b) => sum + (b.txCount || 0), 0) / btcSlice.length / 8))
                : 60 + Math.random() * 25;

            return {
                eth: Number(ethHealth.toFixed(1)),
                btc: Number(btcHealth.toFixed(1)),
                index: i
            };
        });
    }, [timeRange, ethBlocks, btcBlocks]);

    const getXAxisLabels = useMemo(() => {
        const totalPoints = chartData.length;
        const maxLabels = 10;
        const step = Math.ceil(totalPoints / maxLabels);

        return chartData.map((_, i) => {
            if (i % step === 0 || i === totalPoints - 1) {
                if (timeRange === 'day') return `${i}h`;
                if (timeRange === 'month') return `${i + 1}`;
                if (timeRange === 'year') return ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i] || '';
                return `${i + 1}`;
            }
            return '';
        });
    }, [chartData, timeRange]);

    const handleNetworkClick = (network: 'ETH' | 'BTC') => {
        setSelectedNetwork(prev => prev === network ? 'both' : network);
    };

    const showEth = selectedNetwork === 'both' || selectedNetwork === 'ETH';
    const showBtc = selectedNetwork === 'both' || selectedNetwork === 'BTC';

    const avgEthHealth = useMemo(() => {
        const sum = chartData.reduce((acc, d) => acc + d.eth, 0);
        return (sum / chartData.length).toFixed(1);
    }, [chartData]);

    const avgBtcHealth = useMemo(() => {
        const sum = chartData.reduce((acc, d) => acc + d.btc, 0);
        return (sum / chartData.length).toFixed(1);
    }, [chartData]);

    const realtimeEthStats = useMemo(() => ({
        totalTxs: ethBlocks.reduce((sum, b) => sum + (b.txCount || 0), 0),
        activeNodes: ethStats?.activeNodes || ethBlocks.length * 10,
        avgBlockTime: ethStats?.avgBlockTime || '12',
        volume24h: ethStats?.volume24h || '1234.56'
    }), [ethBlocks, ethStats]);

    const realtimeBtcStats = useMemo(() => ({
        totalTxs: btcBlocks.reduce((sum, b) => sum + (b.txCount || 0), 0),
        activeNodes: btcStats?.activeNodes || btcBlocks.length * 15,
        volume24h: btcStats?.volume24h || '0.1234'
    }), [btcBlocks, btcStats]);

    return (
        <div className={`glass-card ${styles.propagationCard}`}>
            <div className={styles.propHeader}>
                <h3>Network Propagation Health</h3>
                <div className={styles.controls}>
                    <div className={styles.legend}>
                        <div
                            className={`${styles.legendItem} ${selectedNetwork === 'ETH' ? styles.active : ''}`}
                            onClick={() => handleNetworkClick('ETH')}
                        >
                            <div className={`${styles.dot} ${styles.ethDot}`}></div>
                            <span>Ethereum</span>
                            {selectedNetwork === 'ETH' && (
                                <span className={styles.avgValue}>{avgEthHealth}%</span>
                            )}
                        </div>
                        <div
                            className={`${styles.legendItem} ${selectedNetwork === 'BTC' ? styles.active : ''}`}
                            onClick={() => handleNetworkClick('BTC')}
                        >
                            <div className={`${styles.dot} ${styles.btcDot}`}></div>
                            <span>Bitcoin</span>
                            {selectedNetwork === 'BTC' && (
                                <span className={styles.avgValue}>{avgBtcHealth}%</span>
                            )}
                        </div>
                    </div>
                    <div className={styles.timeButtons}>
                        <button
                            className={timeRange === 'day' ? styles.active : ''}
                            onClick={() => setTimeRange('day')}
                        >
                            Day
                        </button>
                        <button
                            className={timeRange === 'month' ? styles.active : ''}
                            onClick={() => setTimeRange('month')}
                        >
                            Month
                        </button>
                        <button
                            className={timeRange === 'year' ? styles.active : ''}
                            onClick={() => setTimeRange('year')}
                        >
                            Year
                        </button>
                        <button
                            className={timeRange === 'all' ? styles.active : ''}
                            onClick={() => setTimeRange('all')}
                        >
                            All
                        </button>
                    </div>
                </div>
            </div>

            {selectedNetwork !== 'both' && (
                <div className={styles.networkDetail}>
                    <div className={styles.detailCard}>
                        <div className={styles.detailHeader}>
                            <h4>{selectedNetwork === 'ETH' ? 'Ethereum' : 'Bitcoin'} Network Health</h4>
                            <span className={styles.healthBadge}>
                                {selectedNetwork === 'ETH' ? avgEthHealth : avgBtcHealth}% Healthy
                            </span>
                        </div>
                        <div className={styles.detailStats}>
                            <div className={styles.detailStat}>
                                <span>Total Transactions</span>
                                <strong>
                                    {selectedNetwork === 'ETH'
                                        ? realtimeEthStats.totalTxs.toLocaleString()
                                        : realtimeBtcStats.totalTxs.toLocaleString()
                                    }
                                </strong>
                            </div>
                            <div className={styles.detailStat}>
                                <span>Avg Block Time</span>
                                <strong>
                                    {selectedNetwork === 'ETH' ? `${realtimeEthStats.avgBlockTime}s` : '10.0m'}
                                </strong>
                            </div>
                            <div className={styles.detailStat}>
                                <span>Active Nodes</span>
                                <strong>
                                    {selectedNetwork === 'ETH'
                                        ? realtimeEthStats.activeNodes.toLocaleString()
                                        : realtimeBtcStats.activeNodes.toLocaleString()
                                    }
                                </strong>
                            </div>
                            <div className={styles.detailStat}>
                                <span>24h Volume</span>
                                <strong>
                                    {selectedNetwork === 'ETH'
                                        ? `Ξ ${parseFloat(realtimeEthStats.volume24h).toFixed(2)}`
                                        : `₿ ${parseFloat(realtimeBtcStats.volume24h).toFixed(4)}`
                                    }
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.chartContainer}>
                <div className={styles.yAxisLabel}>Health Score (%)</div>

                <div className={styles.chartArea}>
                    <div className={styles.yAxis}>
                        <span>100</span>
                        <span>75</span>
                        <span>50</span>
                        <span>25</span>
                        <span>0</span>
                    </div>

                    <div className={styles.chartMain}>
                        <div className={styles.gridLines}>
                            {[100, 75, 50, 25, 0].map((val) => (
                                <div key={val} className={styles.gridLine}></div>
                            ))}
                        </div>

                        <div className={styles.barsContainer}>
                            {chartData.map((data, i) => (
                                <div key={i} className={styles.barGroup}>
                                    <div className={styles.bars}>
                                        {showEth && (
                                            <div
                                                className={`${styles.bar} ${styles.ethBar}`}
                                                style={{ height: `${data.eth}%` }}
                                                title={`ETH: ${data.eth}%`}
                                            >
                                                <span className={styles.barTooltip}>{data.eth}%</span>
                                            </div>
                                        )}
                                        {showBtc && (
                                            <div
                                                className={`${styles.bar} ${styles.btcBar}`}
                                                style={{ height: `${data.btc}%` }}
                                                title={`BTC: ${data.btc}%`}
                                            >
                                                <span className={styles.barTooltip}>{data.btc}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.xAxis}>
                            {getXAxisLabels.map((label, i) => (
                                <div key={i} className={styles.xAxisTick}>
                                    {label && (
                                        <>
                                            <div className={styles.tickMark}></div>
                                            <span className={styles.tickLabel}>{label}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.xAxisLabel}>
                    {timeRange === 'day' ? 'Time (Hours)' :
                        timeRange === 'month' ? 'Days of Month' :
                            timeRange === 'year' ? 'Months' : 'Data Points'}
                </div>
            </div>
        </div>
    );
};

export default PropagationHealth;
