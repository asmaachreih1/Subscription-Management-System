import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Layout, Activity, Save, Loader2, ChevronDown } from 'lucide-react';

interface SubscriptionFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    loading: boolean;
}

export const SubscriptionForm = ({ initialData, onSubmit, loading }: SubscriptionFormProps) => {
    const [formData, setFormData] = useState({
        user: initialData?.user?._id || '',
        plan: initialData?.plan?._id || '',
        status: initialData?.status || 'active',
    });

    const [users, setUsers] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [uRes, pRes] = await Promise.all([
                    api.get('/users?limit=100'),
                    api.get('/plans?limit=100')
                ]);
                setUsers(uRes.data.data);
                setPlans(pRes.data.data);
            } finally {
                setDataLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (dataLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 gap-4">
                <Loader2 className="text-blue-600 animate-spin" size={32} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 alive-pulse">Mapping Registry...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 page-transition">
            <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Target Node (User)</label>
                <div className="relative group">
                    <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <select
                        required
                        className="w-full bg-white/30 border border-white/20 text-slate-900 pl-16 pr-10 py-5 rounded-[1.8rem] outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white/50 focus:border-white/40 transition-all font-bold appearance-none cursor-pointer text-sm shadow-inner disabled:opacity-50"
                        value={formData.user}
                        onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                        disabled={!!initialData}
                    >
                        <option value="">Select Identity</option>
                        {users.map(u => <option key={u._id} value={u._id}>{u.name} (ID: {u._id.slice(-4)})</option>)}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Service Tier (Plan)</label>
                <div className="relative group">
                    <Layout className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <select
                        required
                        className="w-full bg-white/30 border border-white/20 text-slate-900 pl-16 pr-10 py-5 rounded-[1.8rem] outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white/50 focus:border-white/40 transition-all font-bold appearance-none cursor-pointer text-sm shadow-inner"
                        value={formData.plan}
                        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    >
                        <option value="">Select Protocol</option>
                        {plans.map(p => <option key={p._id} value={p._id}>{p.name} — ${p.price}</option>)}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
            </div>

            {initialData && (
                <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Current Status</label>
                    <div className="relative group">
                        <Activity className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <select
                            className="w-full bg-white/30 border border-white/20 text-slate-900 pl-16 pr-10 py-5 rounded-[1.8rem] outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white/50 focus:border-white/40 transition-all font-bold appearance-none cursor-pointer text-sm shadow-inner"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="active">Operational (Active)</option>
                            <option value="cancelled">Terminated (Cancelled)</option>
                            <option value="expired">Void (Expired)</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                    </div>
                </div>
            )}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-800 hover:bg-blue-500 text-white font-black py-5 rounded-[2rem] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-slate-200 active:scale-[0.97] disabled:opacity-50 group"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <Save size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                    )}
                    <span className="text-xs uppercase tracking-widest">{loading ? 'Committing...' : initialData ? 'Sync Subscription' : 'Finalize Allocation'}</span>
                </button>
            </div>
        </form>
    );
};
