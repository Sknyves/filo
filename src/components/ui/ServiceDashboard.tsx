"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Send,
    Clock,
    CheckCircle,
    AlertCircle,
    Search,
    MoreVertical,
    Activity,
    LogOut,
    Menu,
    X,
    Trash2,
    Eye,
    ChevronLeft
} from "lucide-react";
import Scene from "@/components/three/Scene";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface ServiceDashboardProps {
    serviceName: string;
}

export default function ServiceDashboard({ serviceName }: ServiceDashboardProps) {
    const router = useRouter();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, progress: 0, solved: 0 });
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

    const fetchRequests = async () => {
        const { data, error } = await supabase
            .from('requests')
            .select('*')
            .eq('service', serviceName)
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

    useEffect(() => {
        fetchRequests();
    }, [serviceName]);

    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <Scene showParticles={false} />

            <div className="max-w-7xl mx-auto">
                {/* Navigation & Header */}
                <header className="mb-16">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-brand-gray-500 hover:text-foreground transition-colors mb-8 glass px-4 py-2 rounded-full"
                    >
                        <ChevronLeft size={14} /> Retour aux services
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2 italic uppercase">
                                ESPACE {serviceName}
                            </h1>
                            <p className="text-brand-gray-500 text-[10px] uppercase tracking-[0.3em]">Suivi des demandes de votre service</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <div className="relative group w-full md:w-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-600 group-focus-within:text-foreground transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="RECHERCHER..."
                                    className="bg-stat-card border border-[var(--glass-border)] pl-12 pr-6 py-3 text-[10px] tracking-widest uppercase outline-none focus:border-brand-violet transition-all w-full md:w-64"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
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
                        </motion.div>
                    ))}
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-6 text-brand-gray-600 text-[10px] uppercase tracking-widest font-bold min-w-[600px] mb-4">
                        <div className="w-1/2">Détails de la demande</div>
                        <div className="w-1/4">Date</div>
                        <div className="w-1/4">Statut</div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-brand-gray-500 uppercase tracking-[0.5em] text-xs">Chargement...</div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-20 bg-stat-card/30 rounded-3xl border border-dashed border-[var(--glass-border)]">
                            <p className="text-brand-gray-500 uppercase tracking-widest text-xs font-bold">Aucune demande trouvée pour ce service</p>
                        </div>
                    ) : (
                        requests.map((req, i) => (
                            <motion.div
                                key={req.id}
                                onClick={() => setSelectedRequest(req)}
                                className="glass p-6 rounded-2xl flex items-center hover:bg-foreground/[0.05] transition-all group cursor-pointer"
                            >
                                <div className="w-1/2">
                                    <div className="font-bold text-sm uppercase tracking-tighter">
                                        {req.type}: {req.demandeur}
                                    </div>
                                    <div className="text-[10px] text-brand-gray-600 uppercase mt-1">ID: #RE-{req.id.toString().padStart(4, '0')}</div>
                                </div>
                                <div className="w-1/4 text-xs text-brand-gray-400 font-mono italic">
                                    {new Date(req.created_at).toLocaleDateString('fr-FR')}
                                </div>
                                <div className="w-1/4 flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${req.status === 'Terminé' ? 'bg-green-500' : req.status === 'En cours' ? 'bg-amber-500' : 'bg-brand-gray-600'}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{req.status}</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Detail */}
            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRequest(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl glass p-8 md:p-12 rounded-[40px] shadow-2xl border border-brand-violet/20"
                        >
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="absolute top-8 right-8 p-3 glass rounded-full hover:bg-brand-violet transition-colors text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-8 flex gap-4">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${selectedRequest.status === 'Terminé' ? 'bg-green-500/10 border-green-500 text-green-500' :
                                        selectedRequest.status === 'En cours' ? 'bg-amber-500/10 border-amber-500 text-amber-500' :
                                            'bg-brand-gray-600/10 border-brand-gray-600 text-brand-gray-400'
                                    }`}>
                                    {selectedRequest.status}
                                </span>
                            </div>

                            <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
                                {selectedRequest.type}: {selectedRequest.demandeur}
                            </h3>
                            <p className="text-brand-gray-500 text-sm mb-10">{selectedRequest.email}</p>

                            <div className="space-y-4 mb-10">
                                <h4 className="text-[10px] uppercase font-bold text-brand-gray-600 tracking-widest">Description</h4>
                                <div className="p-6 bg-stat-card border border-brand-violet/10 rounded-2xl text-sm leading-relaxed text-brand-gray-300 italic">
                                    "{selectedRequest.description}"
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="w-full py-4 bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:bg-brand-violet hover:text-white transition-all rounded-xl"
                            >
                                Fermer
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
