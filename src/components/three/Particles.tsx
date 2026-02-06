"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Particles({ count = 1000 }) {
    const points = useRef<THREE.Points>(null!);

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // eslint-disable-next-line react-hooks/purity
            positions[i * 3] = (Math.random() - 0.5) * 10;
            // eslint-disable-next-line react-hooks/purity
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            // eslint-disable-next-line react-hooks/purity
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return positions;
    }, [count]);

    useFrame((state) => {
        const { clock, mouse } = state;
        if (points.current) {
            points.current.rotation.y = clock.getElapsedTime() * 0.05;
            points.current.rotation.x = THREE.MathUtils.lerp(
                points.current.rotation.x,
                mouse.y * 0.1,
                0.05
            );
            points.current.rotation.z = THREE.MathUtils.lerp(
                points.current.rotation.z,
                mouse.x * 0.1,
                0.05
            );
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particlesPosition, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#666666"
                sizeAttenuation={true}
                transparent={true}
                opacity={0.4}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
