"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import Particles from "./Particles";

interface SceneProps {
    children?: React.ReactNode;
    showParticles?: boolean;
}

function MouseLight() {
    const lightRef = useRef<THREE.SpotLight>(null!);
    useFrame((state) => {
        if (lightRef.current) {
            const { mouse, viewport } = state;
            const x = (mouse.x * viewport.width) / 2;
            const y = (mouse.y * viewport.height) / 2;
            lightRef.current.position.set(x, y, 2);
        }
    });
    return <spotLight ref={lightRef} intensity={2} angle={0.3} penumbra={1} castShadow color="#ffffff" />;
}

export default function Scene({ children, showParticles = true }: SceneProps) {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none">
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.2} />
                <MouseLight />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Suspense fallback={null}>
                    {showParticles && <Particles count={1500} />}
                    {children}
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
}
