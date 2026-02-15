import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
    CreditCard, LogIn, Mail, Lock, AlertCircle,
    Loader2, ArrowRight, Eye, EyeOff, User, UserPlus, Check, X
} from 'lucide-react';

const Requirement = ({ met, label }: { met: boolean; label: string }) => (
    <div className={`flex items-center gap-1.5 transition-all duration-300 ${met ? 'text-blue-600' : 'text-slate-400'}`}>
        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${met ? 'bg-blue-600/10' : 'bg-slate-100'}`}>
            {met ? <Check size={8} strokeWidth={4} /> : <X size={8} strokeWidth={4} className="text-slate-300" />}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-wider ${met ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
    </div>
);

export const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Determine initial mode from URL
    const isLoginPage = location.pathname === '/login';
    const [isLogin, setIsLogin] = useState(isLoginPage);

    useEffect(() => {
        setIsLogin(location.pathname === '/login');
        // Reset form state when switching between login and register
        setEmail('');
        setPassword('');
        setName('');
        setError('');
    }, [location.pathname]);

    // Common State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Register Specific State
    const [name, setName] = useState('');

    const toggleMode = () => {
        setError('');
        const newMode = !isLogin;
        navigate(newMode ? '/login' : '/register');
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.token, response.data.data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Strong password check
        const isStrong = password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*]/.test(password);

        if (!isStrong) {
            setError('Please use a stronger password (8+ chars, uppercase, lowercase, number, symbol)');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/register', { name, email, password, role: 'admin' });
            // After registration, smoothly switch to login
            setIsLogin(true);
            navigate('/login');
            // Show a success message if possible (omitted for brevity)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. This email may already be in use.');
        } finally {
            setLoading(false);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 500 : -500,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
            }
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 500 : -500,
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
            }
        })
    };

    const direction = isLogin ? -1 : 1;

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh p-4 sm:p-6 lg:p-8 overflow-hidden relative font-sans">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-blue-100/30 rounded-full blur-[80px] sm:blur-[120px] -z-10 -mr-48 sm:-mr-96 -mt-48 sm:-mt-96 animate-in fade-in duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-sky-100/20 rounded-full blur-[70px] sm:blur-[100px] -z-10 -ml-32 sm:-ml-64 -mb-32 sm:-mb-64 animate-in fade-in duration-1000 delay-300"></div>

            <div className="max-w-md w-full bg-white/40 backdrop-blur-[32px] border border-white/20 rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.06)] relative overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={isLogin ? 'login' : 'register'}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="p-8 sm:p-12"
                    >
                        {/* Brand Header */}
                        <div className="flex flex-col items-center mb-8 sm:mb-10 text-center">
                            <motion.div
                                whileHover={{ rotate: 6 }}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[1.8rem] bg-blue-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20"
                            >
                                <CreditCard size={32} className="text-white" />
                            </motion.div>
                            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter mb-2">SubFlow</h1>
                            <p className="text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em]">
                                {isLogin ? 'Log In to Your Account' : 'Create Your Administrator Account'}
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-rose-50 border border-rose-100 text-rose-500 p-4 sm:p-5 rounded-2xl mb-8 flex items-start gap-3"
                            >
                                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                                <span className="text-sm font-bold tracking-tight leading-snug">{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4 sm:space-y-5">
                            {!isLogin && (
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
                            )}

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

                            <div className="space-y-4">
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

                                {!isLogin && password.length > 0 && (
                                    <div className="px-5 space-y-2">
                                        <div className="flex gap-1 h-1.5">
                                            {[1, 2, 3, 4].map((step) => {
                                                const strength =
                                                    (password.length >= 8 ? 1 : 0) +
                                                    (/[A-Z]/.test(password) ? 1 : 0) +
                                                    (/[a-z]/.test(password) ? 1 : 0) +
                                                    (/[0-9!@#$%^&*]/.test(password) ? 1 : 0);

                                                return (
                                                    <div
                                                        key={step}
                                                        className={`h-full flex-1 rounded-full transition-all duration-500 ${step <= strength
                                                            ? (strength <= 2 ? 'bg-rose-400' : strength === 3 ? 'bg-amber-400' : 'bg-blue-600')
                                                            : 'bg-slate-100'
                                                            }`}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <div className="space-y-1.5 pt-1">
                                            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                                                <Requirement met={password.length >= 8} label="8+ Characters" />
                                                <Requirement met={/[A-Z]/.test(password)} label="Uppercase" />
                                                <Requirement met={/[a-z]/.test(password)} label="Lowercase" />
                                                <Requirement met={/[0-9]/.test(password)} label="Number" />
                                                <Requirement met={/[!@#$%^&*]/.test(password)} label="Special Char" />
                                            </div>
                                            {password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password) && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 mt-2"
                                                >
                                                    <CreditCard size={10} /> Perfect! Password is strong
                                                </motion.p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 sm:pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-800 hover:bg-blue-600 text-white font-black py-4.5 sm:py-5 rounded-[1.5rem] sm:rounded-[1.8rem] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl active:scale-[0.97] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin text-white" size={22} />
                                    ) : (
                                        isLogin ? <LogIn size={22} className="text-white" /> : <UserPlus size={22} className="text-white" />
                                    )}
                                    <span className="text-xs sm:text-sm uppercase tracking-[0.2em]">
                                        {loading ? (isLogin ? 'Logging In...' : 'Creating Account...') : (isLogin ? 'Log In' : 'Sign Up')}
                                    </span>
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 sm:mt-10 text-center border-t border-slate-100 pt-6 sm:pt-8">
                            <p className="text-slate-400 font-bold text-xs sm:text-sm">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button
                                    onClick={toggleMode}
                                    className="text-blue-600 hover:text-blue-700 transition-all decoration-blue-500/20 underline decoration-2 underline-offset-8 font-black group inline-flex items-center gap-1"
                                >
                                    {isLogin ? 'Sign Up' : 'Log In'}
                                    {isLogin && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
