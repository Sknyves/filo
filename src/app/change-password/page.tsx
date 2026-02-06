"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";
import Scene from "@/components/three/Scene";
import { supabase } from "@/lib/supabase";

export default function ChangePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const { error: dbError } = await supabase
                .from('admin_settings')
                .update({
                    password_hash: password,
                    has_changed_password: true
                })
                .eq('id', 1);

            if (dbError) throw dbError;

            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la mise à jour.");
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
                        <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-12">
                            <Lock size={32} className="text-background" />
                        </div>
                        <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Sécurité</h1>
                        <p className="text-brand-gray-500 text-[10px] uppercase tracking-[0.3em] mt-2">Définir votre mot de passe définitif</p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-500 ml-1">Nouveau mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-500" size={16} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-stat-card border border-[var(--glass-border)] p-4 pl-12 text-foreground outline-none focus:border-foreground transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-500 ml-1">Confirmer</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-500" size={16} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-stat-card border border-[var(--glass-border)] p-4 pl-12 text-foreground outline-none focus:border-foreground transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-500/10 p-4 border border-red-500/20">
                                    <AlertCircle size={14} />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-foreground text-background py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-gray-500/20 transition-all transform active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading ? "MISE À JOUR..." : "CONFIRMER"}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-10 space-y-6">
                            <CheckCircle size={64} className="mx-auto text-green-500" />
                            <div className="font-bold text-lg uppercase tracking-widest">Mot de passe mis à jour !</div>
                            <p className="text-brand-gray-500 text-xs">Redirection vers le tableau de bord...</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
