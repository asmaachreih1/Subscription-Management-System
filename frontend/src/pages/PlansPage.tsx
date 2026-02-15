import { useState, useEffect } from 'react';
import {
    Plus,
    Check,
    Pencil,
    Trash2,
    Clock,
    Shield,
    Zap,
    TrendingUp,
    ArrowRight,
    Search,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import api from '../services/api';
import { Modal } from '../components/Modal';
import { PlanForm } from '../components/PlanForm';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const PlansPage = () => {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Pagination & Sorting State
    const [page, setPage] = useState(1);
    const [limit] = useState(8);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('price');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const params: any = { page, limit, sort: sortField, order: sortOrder };
            if (search) params.search = search;
            const response = await api.get('/plans', { params });
            setPlans(response.data.data);
            setTotal(response.data.total || response.data.data.length); // Fallback for total
            setError('');
        } catch (err: any) {
            setError('Failed to fetch plans');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchPlans();
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchPlans();
    }, [page, sortField, sortOrder]);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const handleOpenCreate = () => {
        setSelectedPlan(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (plan: any) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: any) => {
        setFormLoading(true);
        try {
            if (selectedPlan) {
                await api.patch(`/plans/${selectedPlan._id}`, data);
            } else {
                await api.post('/plans', data);
            }
            setIsModalOpen(false);
            fetchPlans();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Action failed');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this plan?')) return;
        try {
            await api.delete(`/plans/${id}`);
            fetchPlans();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <div className="space-y-8 lg:space-y-12 page-transition">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 glass-card p-8 lg:p-10 rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000"></div>

                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 active:rotate-12 transition-transform">
                        <Zap size={28} className="animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-1 uppercase italic">Service Architect</h1>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 alive-pulse"></div>
                            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">Engine Tier Infrastructure</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 max-w-sm w-full relative group mx-4">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search architect tiers..."
                        className="w-full bg-white/30 border border-white/20 text-slate-900 pl-16 pr-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white/50 focus:border-white/40 transition-all font-bold placeholder:text-slate-300 text-sm shadow-inner"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white/20 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 shadow-inner">
                        <button
                            onClick={() => handleSort('price')}
                            className={cn(
                                "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                sortField === 'price' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Cost {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                    </div>

                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-blue-500 text-white px-8 py-4.5 rounded-2xl transition-all duration-300 font-black text-xs active:scale-95 shadow-xl shadow-slate-200 hover:shadow-blue-500/10 group/btn"
                    >
                        <Plus size={20} className="group-hover/btn:rotate-90 transition-transform" />
                        Provision Tier
                    </button>
                </div>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-[3rem] p-10 h-[450px] animate-pulse border border-slate-50 shadow-sm" />
                    ))
                ) : error ? (
                    <div className="col-span-full p-24 text-center glass-card rounded-[3rem] page-transition">
                        <p className="text-rose-500 font-black text-lg">{error}</p>
                    </div>
                ) : (
                    plans.map((plan, index) => (
                        <div
                            key={plan._id}
                            className="bg-white/40 backdrop-blur-md rounded-[3rem] p-10 flex flex-col group relative border border-slate-100/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-400/30 hover:-translate-y-2 transition-all duration-500 animate-in fade-in zoom-in-95"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-indigo-500 flex items-center justify-center border border-slate-100/50 group-hover:bg-indigo-500 group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-inner">
                                    <Shield size={26} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenEdit(plan)}
                                        className="p-3 bg-white text-slate-400 hover:text-blue-600 hover:scale-110 shadow-sm border border-slate-100 rounded-xl transition-all active:scale-90"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plan._id)}
                                        className="p-3 bg-white text-slate-400 hover:text-rose-600 hover:scale-110 shadow-sm border border-slate-100 rounded-xl transition-all active:scale-90"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight tracking-tighter uppercase italic group-hover:text-blue-600 transition-colors">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1 animate-in slide-in-from-left-4 duration-500">
                                    <span className="text-blue-500 font-black text-lg leading-none transform group-hover:scale-110 transition-transform inline-block">$</span>
                                    <span className="text-5xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                                    <span className="text-slate-400 font-bold text-xs uppercase ml-1 tracking-widest">/ Node</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 flex-1 border-t border-slate-100 pt-8 mt-2 scroll-reveal">
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-600 group-hover:translate-x-1 transition-transform">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                    <span>Cloud Distributed</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-600 group-hover:translate-x-2 transition-transform">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                        <TrendingUp size={12} strokeWidth={4} />
                                    </div>
                                    <span>Auto-Scaling Enabled</span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10 mt-6 alive-pulse">
                                    <Clock size={16} className="text-blue-500 shrink-0" />
                                    <span className="uppercase tracking-[0.2em]">{plan.duration} Month Runtime Cycle</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleOpenEdit(plan)}
                                className="w-full py-5 rounded-2xl bg-slate-800 text-white hover:bg-blue-500 transition-all duration-300 text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center gap-2 group/btn"
                            >
                                Re-Architect Tier
                                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Tier Registry Pulse • {total} Configured Nodes
                </p>
                <div className="flex items-center gap-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 hover:bg-blue-600 hover:text-white disabled:opacity-20 transition-all shadow-sm active:scale-90"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 text-sm">
                        {page}
                    </div>
                    <button
                        disabled={page * limit >= total}
                        onClick={() => setPage(p => p + 1)}
                        className="p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 hover:bg-blue-600 hover:text-white disabled:opacity-20 transition-all shadow-sm active:scale-90"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedPlan ? 'Optimize Economic Node' : 'Initialize Service Tier'}
            >
                <div className="p-2 page-transition">
                    <PlanForm
                        initialData={selectedPlan}
                        onSubmit={handleSubmit}
                        loading={formLoading}
                    />
                </div>
            </Modal>
        </div>
    );
};
