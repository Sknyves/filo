"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function FloatingLogo() {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(time / 2) / 4;
            meshRef.current.rotation.y = time / 4;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={hovered ? 1.2 : 1}
            >
                <icosahedronGeometry args={[1, 15]} />
                <MeshDistortMaterial
                    color={"#808080"}
                    speed={2}
                    distort={0.4}
                    radius={1}
                />
                <Text
                    position={[0, 0, 1.2]}
                    fontSize={0.25}
                    color={document.documentElement.classList.contains("dark") ? "white" : "black"}
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor={document.documentElement.classList.contains("dark") ? "black" : "white"}
                >
                    REQUEST
                </Text>
            </mesh>
        </Float>
    );
}
