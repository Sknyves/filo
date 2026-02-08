"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Scene from "@/components/three/Scene";
import { SERVICES } from "@/lib/services";
import { ChevronRight, LayoutGrid, Home } from "lucide-react";

export default function ServicesHub() {
    return (
        <div className="min-h-screen w-full bg-background text-foreground p-8 relative overflow-hidden">
            <Scene showParticles={false} />

            <div className="max-w-5xl mx-auto relative z-10 pt-12 md:pt-20">
                <div className="flex justify-between items-center mb-16">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase mb-2">
                            ESPACES SERVICES
                        </h1>
                        <p className="text-brand-gray-500 text-[10px] uppercase tracking-[0.4em]">Sélectionnez votre unité départementale</p>
                    </div>
                    <Link href="/">
                        <button className="glass p-4 rounded-full hover:bg-brand-violet/20 transition-colors">
                            <Home size={20} />
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SERVICES.map((service, i) => (
                        <motion.div
                            key={service.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={`/service/${service.slug}`}>
                                <div className="glass p-8 rounded-3xl group hover:border-brand-violet/40 transition-all duration-500 hover:bg-foreground/[0.02]">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 bg-stat-card border border-[var(--glass-border)] flex items-center justify-center rounded-xl group-hover:bg-brand-violet group-hover:border-brand-violet transition-colors">
                                            <LayoutGrid size={20} className="text-brand-gray-500 group-hover:text-white" />
                                        </div>
                                        <ChevronRight size={20} className="text-brand-gray-600 group-hover:text-brand-violet group-hover:translate-x-2 transition-all" />
                                    </div>
                                    <h2 className="text-xl font-bold uppercase tracking-tight mb-2">{service.name}</h2>
                                    <p className="text-xs text-brand-gray-500 uppercase tracking-widest leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
