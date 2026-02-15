import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { UserPlus, Mail, Lock, User, AlertCircle, Loader2, CreditCard, Eye, EyeOff } from 'lucide-react';

export const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/register', { name, email, password, role: 'admin' });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. This email may already be in use.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh p-4 sm:p-6 lg:p-8 overflow-hidden relative font-sans">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-blue-100/30 rounded-full blur-[80px] sm:blur-[100px] -z-10 -ml-32 sm:-ml-40 -mt-32 sm:-mt-40"></div>
            <div className="absolute bottom-0 right-0 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-slate-100/50 rounded-full blur-[90px] sm:blur-[120px] -z-10 -mr-48 sm:-mr-64 -mb-48 sm:-mb-64 animate-pulse"></div>

            <div className="max-w-md w-full bg-white/70 backdrop-blur-3xl border border-white rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden">
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-8 sm:mb-10 text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[1.8rem] bg-blue-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20 group hover:rotate-6 transition-transform duration-500">
                        <CreditCard size={28} className="text-white sm:hidden" />
                        <CreditCard size={32} className="text-white hidden sm:block" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter mb-2">SubFlow</h1>
                    <p className="text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em]">Create Your Administrator Account</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-500 p-4 sm:p-5 rounded-2xl mb-8 flex items-start gap-3 animate-in fade-in duration-300">
                        <AlertCircle size={20} className="shrink-0 mt-0.5 font-sans" />
                        <span className="text-sm font-bold tracking-tight leading-snug">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-5">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-all" size={20} />
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-50/50 border border-slate-100 text-slate-900 pl-16 pr-6 py-4 sm:py-4.5 rounded-[1.5rem] sm:rounded-[1.8rem] focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500/30 outline-none transition-all font-bold tracking-tight text-sm placeholder:text-slate-300 shadow-inner"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-5">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-all font-sans" size={20} />
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-50/50 border border-slate-100 text-slate-900 pl-16 pr-6 py-4 sm:py-4.5 rounded-[1.5rem] sm:rounded-[1.8rem] focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500/30 outline-none transition-all font-bold tracking-tight text-sm placeholder:text-slate-300 shadow-inner"
                                placeholder="name@subflow.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-5">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-all" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full bg-slate-50/50 border border-slate-100 text-slate-900 pl-16 pr-14 py-4 sm:py-4.5 rounded-[1.5rem] sm:rounded-[1.8rem] focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500/30 outline-none transition-all font-bold tracking-tight text-sm placeholder:text-slate-300 shadow-inner"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 sm:pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-slate-800 text-white font-black py-4.5 sm:py-5 rounded-[1.5rem] sm:rounded-[1.8rem] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-[0.97] disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin text-white" size={22} />
                            ) : (
                                <UserPlus size={22} className="text-white shrink-0" />
                            )}
                            <span className="text-xs sm:text-sm uppercase tracking-[0.2em]">{loading ? 'Creating Account...' : 'Sign Up'}</span>
                        </button>
                    </div>
                </form>

                <div className="mt-8 sm:mt-10 text-center border-t border-slate-50 pt-6 sm:pt-8">
                    <p className="text-slate-400 font-bold text-xs sm:text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 transition-all decoration-blue-500/20 underline decoration-2 underline-offset-8 font-black">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
