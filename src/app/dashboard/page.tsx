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
    Eye
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

    const handleLogout = () => {
        clearAuthSession();
        router.push("/login");
    };

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

    const updateRequestStatus = async (id: number, newStatus: string) => {
        const { error } = await supabase
            .from('requests')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error("Error updating status:", error);
            return;
        }

        // Update local state and stats
        setRequests(prev => {
            const updated = prev.map(r => r.id === id ? { ...r, status: newStatus } : r);
            setStats({
                total: updated.length,
                pending: updated.filter(r => r.status === 'A faire').length,
                progress: updated.filter(r => r.status === 'En cours').length,
                solved: updated.filter(r => r.status === 'Terminé').length,
            });
            return updated;
        });
    };

    const deleteRequest = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) return;

        setIsDeleting(id);
        const { error } = await supabase
            .from('requests')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting request:", error);
            setIsDeleting(null);
            return;
        }

        setRequests(prev => {
            const updated = prev.filter(r => r.id !== id);
            setStats({
                total: updated.length,
                pending: updated.filter(r => r.status === 'A faire').length,
                progress: updated.filter(r => r.status === 'En cours').length,
                solved: updated.filter(r => r.status === 'Terminé').length,
            });
            return updated;
        });
        setIsDeleting(null);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <Scene showParticles={false} />

            {/* Sidebar - Desktop */}
            <div className="fixed left-0 top-0 h-full w-20 glass hidden md:flex flex-col items-center py-8 gap-10 z-20">
                <div className="w-10 h-10 bg-foreground flex items-center justify-center font-black text-background">C</div>
                <div className="flex flex-col gap-8">
                    <LayoutDashboard className="text-brand-violet cursor-pointer" size={20} />
                    <Activity className="text-brand-gray-600 cursor-pointer hover:text-brand-violet transition-colors" size={20} />
                    <Send className="text-brand-gray-600 cursor-pointer hover:text-brand-violet transition-colors" size={20} />
                    <Clock className="text-brand-gray-600 cursor-pointer hover:text-brand-violet transition-colors" size={20} />
                </div>

                <div className="mt-auto mb-8">
                    <LogOut
                        className="text-red-500 cursor-pointer hover:text-red-400 transition-colors"
                        size={20}
                        onClick={handleLogout}
                    />
                </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between mb-8 relative z-20">
                <div className="w-10 h-10 bg-foreground flex items-center justify-center font-black text-background">C</div>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 glass rounded-lg"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="fixed inset-0 z-30 md:hidden glass p-8 flex flex-col gap-8"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <div className="w-10 h-10 bg-foreground flex items-center justify-center font-black text-background">C</div>
                            <button onClick={() => setIsMenuOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <nav className="flex flex-col gap-6 text-xl font-bold">
                            <div className="flex items-center gap-4 text-foreground"><LayoutDashboard size={24} /> DASHBOARD</div>
                            <div className="flex items-center gap-4 text-brand-gray-600"><Activity size={24} /> ACTIVITÉ</div>
                            <div className="flex items-center gap-4 text-brand-gray-600"><Send size={24} /> ENVOIS</div>
                            <div className="flex items-center gap-4 text-brand-gray-600"><Clock size={24} /> HISTORIQUE</div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-4 text-red-500 mt-10"
                            >
                                <LogOut size={24} /> DÉCONNEXION
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="md:ml-24 max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 italic">COMMAND CENTER</h1>
                        <p className="text-brand-gray-500 text-[10px] uppercase tracking-[0.3em]">Gestion des demandes de communication</p>
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
                        <button className="bg-brand-violet text-white px-6 py-3 font-black text-[10px] tracking-widest uppercase hover:bg-brand-violet-dark transition-colors">
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
                            <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity text-brand-violet">
                                <stat.icon size={120} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Requests Table/Grid */}
                <div className="space-y-4 overflow-x-auto">
                    <div className="flex items-center justify-between px-6 text-brand-gray-600 text-[10px] uppercase tracking-widest font-bold min-w-[600px] mb-4">
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
                                onClick={() => setSelectedRequest(req)}
                                className={`glass p-6 rounded-2xl flex items-center hover:bg-foreground/[0.05] transition-all group cursor-pointer min-w-[600px] border border-transparent hover:border-brand-violet/20 ${isDeleting === req.id ? 'opacity-50 grayscale' : ''}`}
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
                                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${req.status === 'Terminé' ? 'bg-green-500' : req.status === 'En cours' ? 'bg-amber-500' : 'bg-brand-gray-600'}`} />
                                    <select
                                        value={req.status}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            updateRequestStatus(req.id, e.target.value);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-[10px] font-bold uppercase tracking-widest bg-transparent outline-none cursor-pointer hover:text-brand-violet transition-colors"
                                    >
                                        <option value="A faire" className="bg-background">À faire</option>
                                        <option value="En cours" className="bg-background">En cours</option>
                                        <option value="Terminé" className="bg-background">Terminé</option>
                                    </select>
                                </div>
                                <div className="w-10 flex justify-end relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveDropdown(activeDropdown === req.id ? null : req.id);
                                        }}
                                        className="p-2 hover:bg-brand-violet/10 rounded-full transition-colors"
                                    >
                                        <MoreVertical size={16} className="text-brand-gray-600" />
                                    </button>

                                    <AnimatePresence>
                                        {activeDropdown === req.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-[25]"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveDropdown(null);
                                                    }}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                    className="absolute right-0 top-12 w-48 glass p-2 rounded-xl z-[30] shadow-2xl border border-brand-violet/20"
                                                >
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedRequest(req);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full text-left p-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-brand-violet text-white transition-colors rounded-lg"
                                                    >
                                                        <Eye size={14} /> Voir Détails
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteRequest(req.id);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="w-full text-left p-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-red-500 text-white transition-colors rounded-lg mt-1"
                                                    >
                                                        <Trash2 size={14} /> Supprimer
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Request Detail Modal */}
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
                            className="relative w-full max-w-2xl glass p-8 md:p-12 rounded-[40px] shadow-2xl border border-brand-violet/20 overflow-hidden"
                        >
                            <div className="absolute top-8 right-8">
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="p-3 glass rounded-full hover:bg-brand-violet transition-colors text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${selectedRequest.status === 'Terminé' ? 'bg-green-500/10 border-green-500 text-green-500' :
                                    selectedRequest.status === 'En cours' ? 'bg-amber-500/10 border-amber-500 text-amber-500' :
                                        'bg-brand-gray-600/10 border-brand-gray-600 text-brand-gray-400'
                                    }`}>
                                    {selectedRequest.status}
                                </span>
                                <span className="text-brand-gray-600 font-mono text-xs italic">
                                    {new Date(selectedRequest.created_at).toLocaleString('fr-FR')}
                                </span>
                            </div>

                            <header className="mb-10">
                                <h2 className="text-brand-gray-500 text-[10px] uppercase tracking-[0.4em] font-bold mb-3">Détails de la demande</h2>
                                <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-tight">
                                    {selectedRequest.type}: {selectedRequest.demandeur}
                                </h3>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] uppercase font-bold text-brand-gray-600 tracking-widest">Service émetteur</h4>
                                    <p className="text-lg font-bold uppercase tracking-tighter">{selectedRequest.service}</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[10px] uppercase font-bold text-brand-gray-600 tracking-widest">Contact Client</h4>
                                    <p className="text-lg font-bold tracking-tighter">{selectedRequest.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <h4 className="text-[10px] uppercase font-bold text-brand-gray-600 tracking-widest">Description du projet</h4>
                                <div className="p-6 bg-stat-card border border-brand-violet/10 rounded-2xl text-sm leading-relaxed text-brand-gray-300 italic">
                                    "{selectedRequest.description}"
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-8 border-t border-brand-violet/10">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            deleteRequest(selectedRequest.id);
                                            setSelectedRequest(null);
                                        }}
                                        className="px-6 py-4 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all rounded-xl"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="px-10 py-4 bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:bg-brand-violet hover:text-white transition-all rounded-xl shadow-lg shadow-brand-violet/20"
                                >
                                    Fermer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
