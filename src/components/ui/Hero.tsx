"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Scene from "@/components/three/Scene";
import FloatingLogo from "@/components/three/FloatingLogo";

export default function Hero() {
    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-500">
            <Scene>
                <FloatingLogo />
            </Scene>

            <div className="relative z-10 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8"
                >
                    <span className="text-xs uppercase tracking-[0.5em] text-brand-gray-500 mb-4 block">
                        Interface de Services
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-gradient leading-tight">
                        DEMANDES<br />COMMUNICATION
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-brand-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12"
                >
                    Centralisez, suivez et optimisez vos besoins en communication
                    via notre plateforme immersive 3D.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center"
                >
                    <Link href="/request">
                        <button className="group relative px-8 py-4 bg-foreground text-background font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:pr-12">
                            <span className="relative z-10">Nouvelle Demande</span>
                            <div className="absolute top-0 right-0 h-full w-0 bg-brand-gray-500/20 transition-all duration-300 group-hover:w-full" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100">→</span>
                        </button>
                    </Link>

                    <Link href="/dashboard">
                        <button className="px-8 py-4 border border-foreground/20 text-foreground font-bold uppercase tracking-widest backdrop-blur-sm transition-all duration-300 hover:bg-foreground/10">
                            Tableau de Bord
                        </button>
                    </Link>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-brand-gray-600 text-[10px] tracking-[0.3em] uppercase"
            >
                Scrollez pour explorer
            </motion.div>
        </div>
    );
}
