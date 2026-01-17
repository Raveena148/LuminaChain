'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const WavyBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 6;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // --- Waves Geometry ---
        const geometry = new THREE.PlaneGeometry(25, 12, 60, 60);
        const material = new THREE.MeshPhongMaterial({
            color: 0x3b82f6,
            wireframe: true,
            transparent: true,
            opacity: 0.08, // Darker waves
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2.5;
        scene.add(mesh);

        // --- Data Blocks (Intelligence) ---
        const blocksCount = 15;
        const dataBlocks: THREE.Mesh[] = [];
        const blockGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);

        for (let i = 0; i < blocksCount; i++) {
            const blockMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0x1d4ed8 : 0x059669, // Darker tones
                transparent: true,
                opacity: 0.15 // Subtler blocks
            });
            const block = new THREE.Mesh(blockGeometry, blockMaterial);

            // Random positions
            block.position.x = (Math.random() - 0.5) * 15;
            block.position.y = (Math.random() - 0.5) * 5;
            block.position.z = (Math.random() - 0.5) * 5;

            // Random speed data
            (block as any).userData = {
                speed: 0.01 + Math.random() * 0.02,
                rotSpeed: Math.random() * 0.02
            };

            scene.add(block);
            dataBlocks.push(block);
        }

        // --- Lights ---
        const light = new THREE.DirectionalLight(0xffffff, 0.6); // Reduced intensity
        light.position.set(0, 5, 5);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Reduced intensity
        scene.add(ambientLight);

        // Animation attributes
        const count = geometry.attributes.position.count;
        const initialPositions = new Float32Array(geometry.attributes.position.array);

        // Resize handler
        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);

        // Animation loop
        let frameId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            const time = clock.getElapsedTime();

            // Animate Waves
            const positions = geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < count; i++) {
                const ix = i * 3;
                const iy = i * 3 + 1;
                const iz = i * 3 + 2;

                const x = initialPositions[ix];
                const y = initialPositions[iy];

                positions[iz] = Math.sin(x * 0.4 + time * 0.5) * 0.6 + Math.cos(y * 0.4 + time * 0.5) * 0.6;
            }
            geometry.attributes.position.needsUpdate = true;

            // Animate Data Blocks
            dataBlocks.forEach((block) => {
                block.position.x += block.userData.speed;
                block.rotation.x += block.userData.rotSpeed;
                block.rotation.y += block.userData.rotSpeed;

                // Reset if out of view
                if (block.position.x > 8) {
                    block.position.x = -8;
                    block.position.y = (Math.random() - 0.5) * 5;
                }
            });

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
            renderer.dispose();
            geometry.dispose();
            blockGeometry.dispose();
            material.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
                opacity: 0.35 // Darker overall container
            }}
        />
    );
};

export default WavyBackground;
