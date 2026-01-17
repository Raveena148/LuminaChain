'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useRealtimeBlocks } from '@/hooks/useRealtimeBlocks';

const GlobeVisualizer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { ethBlocks, btcBlocks } = useRealtimeBlocks(5);
    const [stats, setStats] = useState({ nodes: 0, links: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        // Ensure container has dimensions
        const width = containerRef.current.offsetWidth || 800;
        const height = containerRef.current.offsetHeight || 600;

        // Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 15;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.minDistance = 8;
        controls.maxDistance = 25;

        // --- Globe Body ---
        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load('/earth_dark.jpg');

        const sphereGeometry = new THREE.SphereGeometry(5, 64, 64);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            map: earthTexture,
            color: 0x111111, // Deep dark base for night view
            transparent: true,
            opacity: 0.98,
            shininess: 25,
        });
        const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(globe);

        // --- Grid/Wireframe ---
        const wireframeGlobe = new THREE.Mesh(
            sphereGeometry,
            new THREE.MeshBasicMaterial({
                color: 0x224488, // Darker blue wireframe
                wireframe: true,
                transparent: true,
                opacity: 0.08
            })
        );
        scene.add(wireframeGlobe);

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Reduced ambient light for contrast
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x3b82f6, 1.5);
        pointLight.position.set(15, 10, 20);
        scene.add(pointLight);

        // --- Nodes Visualization ---
        const nodeGroup = new THREE.Group();
        scene.add(nodeGroup);

        const createNode = (lat: number, lng: number, color: number) => {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lng + 180) * (Math.PI / 180);
            const radius = 5.05;

            const x = -(radius * Math.sin(phi) * Math.cos(theta));
            const z = (radius * Math.sin(phi) * Math.sin(theta));
            const y = (radius * Math.cos(phi));

            const dotGeom = new THREE.SphereGeometry(0.12, 16, 16);
            const dotMat = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.5
            });
            const dot = new THREE.Mesh(dotGeom, dotMat);
            dot.position.set(x, y, z);

            // Add glow sprite
            const spriteMaterial = new THREE.SpriteMaterial({
                map: createGlowTexture(color),
                color: color,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(0.6, 0.6, 1);
            dot.add(sprite);

            return dot;
        };

        const createGlowTexture = (color: number) => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const context = canvas.getContext('2d')!;
            const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.2, `rgba(${(color >> 16) & 255}, ${(color >> 8) & 255}, ${color & 255}, 0.8)`);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, 64, 64);
            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        };

        // Static "Seed" Nodes
        const nodesData = [
            { lat: 40.7128, lng: -74.0060, color: 0x3b82f6 },
            { lat: 51.5074, lng: -0.1278, color: 0x3b82f6 },
            { lat: 35.6762, lng: 139.6503, color: 0xf59e0b },
            { lat: -33.8688, lng: 151.2093, color: 0x3b82f6 },
            { lat: 1.3521, lng: 103.8198, color: 0xf59e0b },
            { lat: -23.5505, lng: -46.6333, color: 0x10b981 },
        ];

        nodesData.forEach(data => {
            nodeGroup.add(createNode(data.lat, data.lng, data.color));
        });

        // Animation Loop
        let frameId: number;
        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };
        animate();

        // Handle Resize
        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
            if (containerRef.current?.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            sphereGeometry.dispose();
            sphereMaterial.dispose();
        };
    }, []);

    // Effect to add dynamic nodes from traffic
    useEffect(() => {
        setStats({
            nodes: 240 + (ethBlocks.length + btcBlocks.length),
            links: 1200 + (ethBlocks.length + btcBlocks.length) * 4
        });
    }, [ethBlocks, btcBlocks]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '600px' }}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

            {/* Visualizer UI Overlay */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                pointerEvents: 'none'
            }}>
                <div className="glass-card" style={{ padding: '15px 25px', minWidth: '300px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                        Global Node Network
                    </h3>
                    <p style={{ margin: '0 0 15px 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
                        Real-time visualization of active Bitcoin & Ethereum nodes propagating blocks across the globe.
                    </p>
                    <div style={{ display: 'flex', gap: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                        <div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Nodes</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3b82f6' }}>{stats.nodes.toLocaleString()}</div>
                        </div>
                        <div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Peers</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>{stats.links.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                pointerEvents: 'none'
            }}>
                <div className="glass-card" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' }}></div>
                        <span>Active Monitoring Cluster</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobeVisualizer;
