"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, ShieldCheck, AlertCircle } from "lucide-react";
import Scene from "@/components/three/Scene";
import { setAuthSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { data: admin, error: dbError } = await supabase
                .from('admin_settings')
                .select('*')
                .eq('email', identifier)
                .single();

            if (dbError || !admin) {
                setError("Utilisateur non autorisé.");
                setIsLoading(false);
                return;
            }

            if (admin.password_hash === password) {
                setAuthSession();
                if (!admin.has_changed_password) {
                    router.push("/change-password");
                } else {
                    router.push("/dashboard");
                }
            } else {
                setError("Mot de passe incorrect.");
                setIsLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError("Une erreur est survenue.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
            <Scene showParticles={true} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass p-12 rounded-[32px] shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                            <ShieldCheck size={32} className="text-background" />
                        </div>
                        <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Accès Restreint</h1>
                        <p className="text-brand-gray-500 text-[10px] uppercase tracking-[0.3em] mt-2">Authentification requise</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-500 ml-1">Identifiant</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-500" size={16} />
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="UTILISATEUR"
                                    className="w-full bg-stat-card border border-[var(--glass-border)] p-4 pl-12 text-foreground outline-none focus:border-foreground transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-500 ml-1">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-500" size={16} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-stat-card border border-[var(--glass-border)] p-4 pl-12 text-foreground outline-none focus:border-foreground transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-500/10 p-4 border border-red-500/20"
                            >
                                <AlertCircle size={14} />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-foreground text-background py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-gray-500/20 transition-all transform active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? "VÉRIFICATION..." : "SE CONNECTER"}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
