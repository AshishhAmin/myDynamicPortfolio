import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = () => {
    const count = 5000;

    // Generate star field positions
    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Distribute in a sphere
            const r = 10 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta); // x
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
            positions[i * 3 + 2] = r * Math.cos(phi); // z
        }
        return positions;
    }, [count]);

    const pointsRef = useRef();

    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        // Base rotation
        pointsRef.current.rotation.y -= delta * 0.05;
        pointsRef.current.rotation.x -= delta * 0.02;

        // Interaction rotation (Parallax effect based on pointer)
        const targetX = (state.pointer.x * Math.PI) / 8;
        const targetY = (state.pointer.y * Math.PI) / 8;

        pointsRef.current.rotation.y += 0.05 * (targetX - pointsRef.current.rotation.y);
        pointsRef.current.rotation.x += 0.05 * (targetY - pointsRef.current.rotation.x);
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={count}
                        array={positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    opacity={0.6}
                />
            </points>
        </group>
    );
};

export default function InteractiveHero3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                <ParticleField />
            </Canvas>
        </div>
    );
}
