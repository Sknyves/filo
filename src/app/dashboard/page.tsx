"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Send,
    Clock,
    CheckCircle,
    AlertCircle,
    Search,
    MoreVertical,
    Activity,
    LogOut
} from "lucide-react";
import Scene from "@/components/three/Scene";
import { useRouter } from "next/navigation";
import { clearAuthSession, isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const router = useRouter();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, progress: 0, solved: 0 });

    const handleLogout = () => {
        clearAuthSession();
        router.push("/login");
    };

    useEffect(() => {
        const checkAuth = () => {
            if (!isAuthenticated()) {
                router.push("/login");
                return false;
            }
            return true;
        };

        const fetchRequests = async () => {
            if (!checkAuth()) return;

            const { data, error } = await supabase
                .from('requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching requests:", error);
            } else {
                setRequests(data || []);
                setStats({
                    total: data?.length || 0,
                    pending: data?.filter(r => r.status === 'A faire').length || 0,
                    progress: data?.filter(r => r.status === 'En cours').length || 0,
                    solved: data?.filter(r => r.status === 'Terminé').length || 0,
                });
            }
            setLoading(false);
        };

        fetchRequests();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <Scene showParticles={false} />

            {/* Sidebar - Command Center Style */}
            <div className="fixed left-0 top-0 h-full w-20 glass flex flex-col items-center py-8 gap-10 z-20">
                <div className="w-10 h-10 bg-foreground flex items-center justify-center font-black text-background">C</div>
                <div className="flex flex-col gap-8">
                    <LayoutDashboard className="text-foreground cursor-pointer" size={20} />
                    <Activity className="text-brand-gray-600 cursor-pointer hover:text-white transition-colors" size={20} />
                    <Send className="text-brand-gray-600 cursor-pointer hover:text-white transition-colors" size={20} />
                    <Clock className="text-brand-gray-600 cursor-pointer hover:text-white transition-colors" size={20} />
                </div>

                <div className="mt-auto mb-8">
                    <LogOut
                        className="text-red-500 cursor-pointer hover:text-red-400 transition-colors"
                        size={20}
                        onClick={handleLogout}
                    />
                </div>
            </div>

            <div className="ml-24 max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-end mb-16">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter mb-2 italic">COMMAND CENTER</h1>
                        <p className="text-brand-gray-500 text-xs uppercase tracking-[0.3em]">Gestion des demandes de communication</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-600 group-focus-within:text-foreground transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="RECHERCHER..."
                                className="bg-stat-card border border-[var(--glass-border)] pl-12 pr-6 py-3 text-[10px] tracking-widest uppercase outline-none focus:border-foreground transition-all w-64"
                            />
                        </div>
                        <button className="bg-foreground text-background px-6 py-3 font-black text-[10px] tracking-widest uppercase hover:bg-brand-gray-500/20 transition-colors">
                            Filtres
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Total", value: stats.total.toString(), icon: Activity },
                        { label: "En attente", value: stats.pending.toString(), icon: Clock },
                        { label: "En cours", value: stats.progress.toString(), icon: AlertCircle },
                        { label: "Finalisés", value: stats.solved.toString(), icon: CheckCircle },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-6 rounded-2xl relative overflow-hidden group"
                        >
                            <div className="relative z-10">
                                <stat.icon className="text-brand-gray-500 mb-4" size={20} />
                                <div className="text-brand-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.label}</div>
                                <div className="text-3xl font-black">{stat.value}</div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                <stat.icon size={120} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Requests Table/Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-6 text-brand-gray-600 text-[10px] uppercase tracking-widest font-bold">
                        <div className="w-1/3">Détails de la demande</div>
                        <div className="w-1/6">Service</div>
                        <div className="w-1/6">Date</div>
                        <div className="w-1/6">Statut</div>
                        <div className="w-10"></div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-brand-gray-500 uppercase tracking-[0.5em] text-xs">Chargement des données...</div>
                    ) : (
                        requests.map((req, i) => (
                            <motion.div
                                key={req.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="glass p-6 rounded-2xl flex items-center hover:bg-foreground/[0.03] transition-colors group cursor-pointer"
                            >
                                <div className="w-1/3">
                                    <div className="font-bold text-sm uppercase tracking-tighter group-hover:text-brand-gray-300 transition-colors">
                                        {req.type}: {req.demandeur}
                                    </div>
                                    <div className="text-[10px] text-brand-gray-600 uppercase mt-1">ID: #RE-{req.id.toString().padStart(4, '0')}</div>
                                </div>
                                <div className="w-1/6">
                                    <span className="text-[10px] px-3 py-1 bg-stat-card rounded-full font-bold uppercase tracking-widest">{req.service}</span>
                                </div>
                                <div className="w-1/6 text-xs text-brand-gray-400 font-mono italic">
                                    {new Date(req.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                                <div className="w-1/6 flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${req.status === 'Terminé' ? 'bg-green-500' : req.status === 'En cours' ? 'bg-amber-500' : 'bg-brand-gray-600'}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{req.status}</span>
                                </div>
                                <div className="w-10 flex justify-end">
                                    <MoreVertical size={16} className="text-brand-gray-600" />
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
