import React, { useState } from 'react';
import { User, Mail, Shield, Lock, Save, Loader2 } from 'lucide-react';

interface UserFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    loading: boolean;
}

export const UserForm = ({ initialData, onSubmit, loading }: UserFormProps) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        role: initialData?.role || 'user',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: any = { ...formData };
        if (!data.password) delete data.password;
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
            <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Node Identity</label>
                <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        required
                        className="w-full bg-white/30 border border-white/20 text-slate-900 pl-14 pr-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white/50 focus:border-white/40 transition-all font-bold tracking-tight text-sm placeholder:text-slate-300"
                        placeholder="System Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Interface Email</label>
                <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="email"
                        required
                        className="w-full bg-white/30 border border-white/20 text-slate-900 pl-14 pr-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white/50 focus:border-white/40 transition-all font-bold tracking-tight text-sm placeholder:text-slate-300"
                        placeholder="name@nexus.io"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Access Protocol</label>
                <div className="relative group">
                    <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <select
                        className="w-full bg-white/30 border border-white/20 text-slate-900 pl-14 pr-10 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white/50 focus:border-white/40 transition-all font-black appearance-none cursor-pointer text-sm"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    >
                        <option value="user">Standard Agent</option>
                        <option value="admin">System Architect</option>
                    </select>
                </div>
            </div>

            {!initialData && (
                <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Credential Key</label>
                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="password"
                            required={!initialData}
                            className="w-full bg-white/30 border border-white/20 text-slate-900 pl-14 pr-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white/50 focus:border-white/40 transition-all font-bold tracking-tight text-sm placeholder:text-slate-300"
                            placeholder="••••••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>
            )}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-800 hover:bg-blue-500 text-white font-black py-5 rounded-[1.8rem] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-slate-200 active:scale-[0.97] disabled:opacity-50 group"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <Save size={20} className="group-hover:scale-110 transition-transform" />
                    )}
                    <span className="text-xs uppercase tracking-widest">{loading ? 'Synchronizing...' : initialData ? 'Update Identity' : 'Provision Node'}</span>
                </button>
            </div>
        </form>
    );
};
