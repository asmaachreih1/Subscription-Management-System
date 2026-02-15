import { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Users,
    CreditCard,
    LogOut,
    LayoutDashboard,
    CalendarDays,
    Menu,
    X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: <LayoutDashboard size={18} />, label: 'Overview', path: '/' },
        { icon: <Users size={18} />, label: 'Users', path: '/users' },
        { icon: <CalendarDays size={18} />, label: 'Plans', path: '/plans' },
        { icon: <CreditCard size={18} />, label: 'Subscriptions', path: '/subscriptions' },
    ];

    return (
        <div className="flex h-screen bg-mesh text-slate-900 overflow-hidden font-sans">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/10 backdrop-blur-md z-30 lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 w-72 glass-sidebar flex flex-col z-40 transform transition-transform duration-500 lg:relative lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500">
                            <CreditCard size={22} className="text-white" />
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-slate-900">
                            SubFlow
                        </h1>
                    </div>
                    <button
                        className="lg:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group relative ml-2 mr-2 hover-alive",
                                    isActive
                                        ? "bg-blue-500/10 text-blue-600 shadow-sm border border-white/40"
                                        : "text-slate-500 hover:bg-white/40 hover:text-slate-900"
                                )}
                            >
                                <span className={cn(
                                    "transition-transform duration-500 shrink-0",
                                    isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-blue-500"
                                )}>
                                    {item.icon}
                                </span>
                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                {isActive && (
                                    <div className="absolute right-4 w-1.5 h-1.5 bg-blue-500/40 rounded-full alive-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto border-t border-white/20">
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/20 hover-alive cursor-default group shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-white shadow-md group-hover:rotate-6 transition-transform">
                                {user?.name?.[0].toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-black text-sm truncate text-slate-900 leading-tight">{user?.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full alive-pulse"></div>
                                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{user?.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-4 py-3.5 w-full rounded-2xl bg-rose-50/30 backdrop-blur-md border border-rose-100/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 font-black text-sm group active:scale-95"
                    >
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform opacity-70 group-hover:opacity-100" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                {/* Header */}
                <header className="h-20 shrink-0 glass-header flex items-center justify-between px-6 lg:px-10 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis animate-in slide-in-from-left-4 duration-500">
                            {menuItems.find(m => m.path === location.pathname)?.label || 'Command Center'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-6">
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-12 relative bg-transparent">
                    <div className="w-full max-w-[1920px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
