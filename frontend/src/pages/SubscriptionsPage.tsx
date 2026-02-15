import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Calendar,
    Users as UsersIcon,
    Activity,
    Layers
} from 'lucide-react';
import api from '../services/api';
import { Modal } from '../components/Modal';
import { SubscriptionForm } from '../components/SubscriptionForm';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const SubscriptionsPage = () => {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            const params: any = { page, limit, sort: sortField, order: sortOrder };
            if (statusFilter) params.status = statusFilter;
            if (search) params.search = search;
            const response = await api.get('/subscriptions', { params });
            setSubscriptions(response.data.data);
            setTotal(response.data.total);
            setError('');
        } catch (err: any) {
            setError('Failed to fetch subscriptions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchSubscriptions();
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchSubscriptions();
    }, [page, statusFilter, sortField, sortOrder]);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const handleOpenCreate = () => {
        setSelectedSubscription(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (sub: any) => {
        setSelectedSubscription(sub);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: any) => {
        setFormLoading(true);
        try {
            if (selectedSubscription) {
                await api.patch(`/subscriptions/${selectedSubscription._id}`, data);
            } else {
                await api.post('/subscriptions', data);
            }
            setIsModalOpen(false);
            fetchSubscriptions();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Action failed');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this subscription?')) return;
        try {
            await api.delete(`/subscriptions/${id}`);
            fetchSubscriptions();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-200/20';
            case 'expired': return 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-200/20';
            case 'cancelled': return 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-200/20';
            default: return 'bg-slate-50 text-slate-400 border-slate-100';
        }
    };

    return (
        <div className="space-y-6 lg:space-y-10 page-transition">
            {/* Control Panel */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-6 lg:gap-8 glass-card p-6 lg:p-8 rounded-[3rem]">
                <div className="flex flex-wrap gap-2 p-1.5 lg:p-2 bg-white/20 backdrop-blur-md rounded-[2rem] border border-white/20 w-full xl:w-auto shadow-inner">
                    {['', 'active', 'cancelled', 'expired'].map((status) => (
                        <button
                            key={status}
                            onClick={() => {
                                setStatusFilter(status);
                                setPage(1);
                            }}
                            className={cn(
                                "px-6 lg:px-8 py-3 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap",
                                statusFilter === status
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-900 mx-1'
                            )}
                        >
                            {status || 'All Allocations'}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="flex bg-white/20 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 shadow-inner">
                        <button
                            onClick={() => handleSort('createdAt')}
                            className={cn(
                                "px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                sortField === 'createdAt' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Recent {sortField === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                    </div>

                    <div className="relative flex-1 md:w-64 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search distribution..."
                            className="w-full bg-white/30 border border-white/20 text-slate-900 pl-16 pr-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white/50 focus:border-white/40 transition-all font-bold placeholder:text-slate-300 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-black text-xs lg:text-sm shadow-xl shadow-slate-200 hover:shadow-blue-500/10 active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={20} />
                        Allocate
                    </button>
                </div>
            </div>

            {/* Subscriptions Table */}
            <div className="glass-card rounded-[3rem] overflow-hidden border border-white/20 relative">
                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="p-32 text-center">
                            <div className="w-12 h-12 border-[3px] border-slate-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                            <p className="text-slate-400 font-black tracking-widest uppercase text-[10px] alive-pulse">Syncing Registry...</p>
                        </div>
                    ) : error ? (
                        <div className="p-32 text-center text-rose-500 font-black uppercase tracking-widest text-sm page-transition">{error}</div>
                    ) : (
                        <table className="w-full text-left min-w-[900px]">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/10">
                                    <th className="px-10 py-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">End User Node</th>
                                    <th className="px-10 py-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Resource Tier</th>
                                    <th className="px-10 py-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Lifecycle Status</th>
                                    <th className="px-10 py-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Expiration</th>
                                    <th className="px-10 py-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {subscriptions.map((sub, index) => (
                                    <tr
                                        key={sub._id}
                                        className="hover:bg-white/30 transition-all duration-300 group animate-in fade-in slide-in-from-right-4"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-5">
                                                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100/50 group-hover:bg-slate-800 group-hover:rotate-12 transition-all duration-500">
                                                    <UsersIcon size={20} className="text-slate-400 group-hover:text-white" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-slate-900 text-base tracking-tight leading-none mb-1 group-hover:text-blue-500 transition-colors uppercase italic truncate">{sub.user?.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase group-hover:translate-x-1 transition-transform">{sub.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-3 group-hover:scale-105 transition-transform origin-left">
                                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                    <Layers size={14} />
                                                </div>
                                                <span className="text-slate-800 font-black tracking-tighter uppercase text-xs">{sub.plan?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <span className={cn(
                                                "inline-flex items-center gap-3 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-110 shadow-sm border",
                                                getStatusStyles(sub.status)
                                            )}>
                                                <Activity size={12} className="alive-pulse" />
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-3 text-slate-500 font-bold text-xs uppercase tracking-wider group-hover:text-slate-900 transition-colors">
                                                <Calendar size={14} className="text-slate-300" />
                                                {new Date(sub.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7 text-right">
                                            <div className="flex items-center justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-all transform lg:translate-x-4 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => handleOpenEdit(sub)}
                                                    className="p-3 bg-white text-slate-400 hover:text-blue-600 hover:scale-110 active:scale-95 shadow-sm border border-slate-100 rounded-xl transition-all"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sub._id)}
                                                    className="p-3 bg-white text-slate-400 hover:text-rose-600 hover:scale-110 active:scale-95 shadow-sm border border-slate-100 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        Local Node Pulse • Active Sync
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-6 py-3.5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 hover:bg-blue-600 hover:text-white disabled:opacity-20 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-90"
                        >
                            Prev
                        </button>
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 text-sm animate-in zoom-in duration-500">
                            {page}
                        </div>
                        <button
                            disabled={page * limit >= total}
                            onClick={() => setPage(p => p + 1)}
                            className="px-6 py-3.5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 hover:bg-blue-600 hover:text-white disabled:opacity-20 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-90"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedSubscription ? 'Modify Resource Node' : 'Initialize User Allocation'}
            >
                <div className="p-2 page-transition">
                    <SubscriptionForm
                        initialData={selectedSubscription}
                        onSubmit={handleSubmit}
                        loading={formLoading}
                    />
                </div>
            </Modal>
        </div>
    );
};
