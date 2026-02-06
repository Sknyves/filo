"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import Scene from "@/components/three/Scene";

export default function ConfirmationPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden transition-colors duration-500">
            <Scene showParticles={true} />

            <div className="max-w-md w-full glass p-12 rounded-[32px] text-center relative z-10">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 bg-foreground rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
                >
                    <CheckCircle2 size={48} className="text-background" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-black text-foreground tracking-tighter mb-4"
                >
                    DEMANDE TRANSMISE
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-brand-gray-400 text-sm leading-relaxed mb-12"
                >
                    Votre demande est en cours de traitement par le service communication.
                    Vous recevrez un email de confirmation d&apos;ici quelques instants.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                >
                    <Link href="/dashboard" className="block w-full">
                        <button className="w-full bg-foreground text-background py-4 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-gray-500/20 transition-colors flex items-center justify-center gap-3">
                            Suivre ma demande <ArrowRight size={14} />
                        </button>
                    </Link>

                    <Link href="/" className="block w-full">
                        <button className="w-full border border-foreground/10 text-foreground py-4 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-foreground/5 transition-colors flex items-center justify-center gap-3">
                            <Home size={14} /> Retour à l&apos;accueil
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
