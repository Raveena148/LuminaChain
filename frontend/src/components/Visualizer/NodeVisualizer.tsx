'use client';

import React, { useMemo } from 'react';
import { useNodeStats, useDynamicNodes, projectNodePosition } from './useNodeVisualizer';
import styles from './NodeVisualizer.module.scss';

/**
 * Node Marker Component - Displays individual node with tooltip
 */
const NodeMarker: React.FC<{ node: any }> = ({ node }) => {
    const position = useMemo(() => projectNodePosition(node.lat, node.lng), [node.lat, node.lng]);

    return (
        <div
            className={styles.node}
            style={{
                left: position.x,
                top: position.y,
                backgroundColor: node.color,
                boxShadow: `0 0 10px ${node.color}`
            }}
        >
            <div className={styles.tooltip}>
                <div className={styles.tooltipHeader}>
                    <div className={styles.colorDot} style={{ background: node.color }}></div>
                    <strong>{node.name}</strong>
                </div>
                <div className={styles.tooltipContent}>
                    <div>Network: <span style={{ color: node.color }}>{node.type}</span></div>
                    <div>Health: {(95 + Math.random() * 4).toFixed(1)}% Up</div>
                    <div>Latency: {Math.floor(Math.random() * 100) + 20}ms</div>
                </div>
            </div>
        </div>
    );
};

/**
 * Main NodeVisualizer Component
 */
const NodeVisualizer: React.FC = () => {
    const stats = useNodeStats();
    const dynamicNodes = useDynamicNodes();

    return (
        <div className={styles.container}>
            <div className={styles.mapWrapper}>
                <img
                    src="/world-map.png"
                    alt="Global Node Map"
                    className={styles.mapImage}
                />

                {dynamicNodes.map((node, index) => (
                    <NodeMarker key={`${node.name}-${index}`} node={node} />
                ))}
            </div>

            {/* Statistics HUD */}
            <div className={styles.overlay}>
                <div className="glass-card">
                    <h3 className={styles.hudTitle}>
                        <div className={styles.statusDot}></div>
                        Network Intelligence HUD
                    </h3>
                    <p className={styles.hudDescription}>
                        Real-time synchronization with Bitcoin and Ethereum mainnet.
                    </p>
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <div>Global Nodes</div>
                            <div className={styles.statValue}>{stats.nodes.toLocaleString()}</div>
                        </div>
                        <div className={styles.statItem}>
                            <div>Active Peers</div>
                            <div className={styles.statValueGreen}>{stats.links.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className={styles.legend}>
                <div className="glass-card">
                    <h4 className={styles.legendTitle}>Legend</h4>
                    <div className={styles.legendItems}>
                        <div className={styles.legendItem}>
                            <div className={styles.legendDot} style={{ background: '#f59e0b' }}></div>
                            <span>BTC Nodes</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={styles.legendDot} style={{ background: '#3b82f6' }}></div>
                            <span>ETH Nodes</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={styles.legendDot} style={{ background: '#10b981' }}></div>
                            <span>Lumina Peers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Status Indicator */}
            <div className={styles.bottomInfo}>
                <div className="glass-card">
                    <div className={styles.liveStatus}>
                        <div className={styles.livePulse}></div>
                        <span>Real-time Syncing</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NodeVisualizer;
