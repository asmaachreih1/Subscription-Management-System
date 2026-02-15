import React, { useState } from 'react';
import { Zap, DollarSign, Clock, Loader2, Layers } from 'lucide-react';

interface PlanFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    loading: boolean;
}

export const PlanForm = ({ initialData, onSubmit, loading }: PlanFormProps) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        price: initialData?.price || 0,
        duration: initialData?.duration || 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
            <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5">Tier Specification</label>
                <div className="relative group">
                    <Layers className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        type="text"
                        required
                        className="w-full bg-white/30 border border-white/20 text-slate-900 pl-16 pr-8 py-5 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white/50 focus:border-white/40 transition-all font-black text-sm tracking-tight placeholder:text-slate-300 shadow-inner"
                        placeholder="Service Tier Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5">Unit Price</label>
                    <div className="relative group">
                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <input
                            type="number"
                            required
                            min="0"
                            className="w-full bg-white/30 border border-white/20 text-slate-900 pl-14 pr-6 py-5 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white/50 focus:border-white/40 transition-all font-black text-sm shadow-inner"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5">Cycle (Mo)</label>
                    <div className="relative group">
                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="number"
                            required
                            min="1"
                            className="w-full bg-white/30 border border-white/20 text-slate-900 pl-14 pr-6 py-5 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white/50 focus:border-white/40 transition-all font-black text-sm shadow-inner"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-slate-800 text-white font-black py-5 rounded-[2rem] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:shadow-slate-200 active:scale-[0.97] disabled:opacity-50 group"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={22} />
                    ) : (
                        <Zap size={22} className="group-hover:rotate-12 transition-transform" />
                    )}
                    <span className="text-[10px] uppercase tracking-[0.2em]">{loading ? 'Architecting...' : initialData ? 'Optimize Tier' : 'Provision Service Tier'}</span>
                </button>
            </div>
        </form>
    );
};
