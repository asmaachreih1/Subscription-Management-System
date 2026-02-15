import { useState, useEffect } from 'react';
import {
    Users as UsersIcon,
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    UserPlus,
    Pencil,
    Trash2,
    Mail
} from 'lucide-react';
import api from '../services/api';
import { Modal } from '../components/Modal';
import { UserForm } from '../components/UserForm';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const UsersPage = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [roleFilter, setRoleFilter] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params: any = { page, limit, sort: sortField, order: sortOrder };
            if (search) params.search = search;
            if (roleFilter) params.role = roleFilter;
            const response = await api.get('/users', { params });
            setUsers(response.data.data);
            setTotal(response.data.total);
            setError('');
        } catch (err: any) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchUsers();
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchUsers();
    }, [page, sortField, sortOrder, roleFilter]);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const handleOpenCreate = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: any) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: any) => {
        setFormLoading(true);
        try {
            if (selectedUser) {
                await api.patch(`/users/${selectedUser._id}`, data);
            } else {
                await api.post('/users', data);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Action failed');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <div className="space-y-6 lg:space-y-10 page-transition">
            {/* Action Bar */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 glass-card p-6 lg:p-8 rounded-[2.5rem]">
                <div className="flex-1 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Find directory identity..."
                            className="w-full bg-white/30 border border-white/20 text-slate-900 pl-14 pr-6 py-3.5 lg:py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:bg-white/50 focus:border-white/40 outline-none transition-all font-bold tracking-tight text-sm lg:text-base placeholder:text-slate-300"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="relative group">
                        <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={18} />
                        <select
                            className="w-full md:w-56 bg-white/30 border border-white/20 text-slate-700 pl-14 pr-10 py-3.5 lg:py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:bg-white/50 focus:border-white/40 outline-none transition-all appearance-none cursor-pointer font-bold text-sm"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">Full Permissions</option>
                            <option value="admin">Admin Access</option>
                            <option value="user">Standard User</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-500 hover:bg-slate-800 text-white px-8 py-3.5 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-300 font-black text-xs lg:text-sm shadow-lg shadow-blue-500/10 active:scale-95 whitespace-nowrap"
                >
                    <UserPlus size={18} />
                    Create New Node
                </button>
            </div>

            {/* Table Container */}
            <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/20 relative">
                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 lg:p-32 gap-6">
                            <div className="w-12 h-12 border-[3px] border-slate-50 border-t-blue-500 rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-black tracking-widest uppercase text-[10px] alive-pulse">Updating Ledger...</p>
                        </div>
                    ) : error ? (
                        <div className="p-20 lg:p-32 text-center page-transition">
                            <p className="text-rose-500 font-black text-lg mb-2 capitalize">Sync Aborted</p>
                            <p className="text-slate-400 font-medium">{error}</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-20 lg:p-32 text-center page-transition">
                            <UsersIcon size={48} className="mx-auto text-slate-200 mb-6 float-slow" />
                            <p className="text-slate-400 font-bold text-lg">Empty directory state</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/10">
                                    <th className="px-6 lg:px-10 py-5 lg:py-6 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">Identity</th>
                                    <th className="px-6 lg:px-10 py-5 lg:py-6 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">Electronic Mail</th>
                                    <th className="px-6 lg:px-10 py-5 lg:py-6 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">Access Level</th>
                                    <th className="px-6 lg:px-10 py-5 lg:py-6 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort('createdAt')}>
                                        Provisioned {sortField === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-6 lg:px-10 py-5 lg:py-6 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-sans">
                                {users.map((user, index) => (
                                    <tr
                                        key={user._id}
                                        className="hover:bg-white/30 transition-all duration-300 group animate-in fade-in slide-in-from-left-4"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-6 lg:px-10 py-6 lg:py-7">
                                            <div className="flex items-center gap-4 lg:gap-5">
                                                <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-lg lg:rounded-xl bg-slate-50 flex items-center justify-center font-black text-blue-500 lg:text-lg shadow-inner border border-slate-100/50 group-hover:scale-105 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                                                    {user.name[0].toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="block font-black text-slate-900 text-sm lg:text-base tracking-tight truncate group-hover:text-blue-600 transition-colors">{user.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block transform group-hover:translate-x-1 transition-transform">ID: {user._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-10 py-6 lg:py-7">
                                            <div className="flex items-center gap-3 text-slate-600 group-hover:text-slate-900 transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                                    <Mail size={16} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                                                </div>
                                                <span className="text-sm font-bold tracking-tight">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-10 py-6 lg:py-7">
                                            <span className={cn(
                                                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 group-hover:scale-105",
                                                user.role === 'admin'
                                                    ? 'bg-purple-50 text-purple-600 border border-purple-100 shadow-sm shadow-purple-200/20'
                                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm shadow-emerald-200/20'
                                            )}>
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full alive-pulse",
                                                    user.role === 'admin' ? 'bg-purple-400' : 'bg-emerald-400'
                                                )} />
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 lg:px-10 py-6 lg:py-7">
                                            <div className="flex items-center gap-2 text-slate-500 text-[10px] lg:text-xs font-black uppercase tracking-wider">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-20"></div>
                                                {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-10 py-6 lg:py-7 text-right">
                                            <div className="flex items-center justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-all transform lg:translate-x-4 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => handleOpenEdit(user)}
                                                    className="p-3 bg-white text-slate-400 hover:text-blue-500 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md border border-slate-100/50 rounded-xl transition-all"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-3 bg-white text-slate-400 hover:text-rose-600 hover:scale-110 active:scale-95 shadow-sm hover:shadow-md border border-slate-100 rounded-xl transition-all"
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

                {/* Pagination */}
                <div className="p-6 lg:p-10 bg-white/10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Node Distribution • <span className="text-slate-900">{(page - 1) * limit + 1} - {Math.min(page * limit, total)}</span> of {total} entries
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 shadow-sm hover:bg-blue-600 hover:text-white transition-all disabled:opacity-20 active:scale-90"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="bg-blue-600 text-white w-12 h-12 flex items-center justify-center rounded-2xl text-sm font-black shadow-xl shadow-blue-500/20 transition-transform hover:scale-110">
                            {page}
                        </div>
                        <button
                            disabled={page * limit >= total}
                            onClick={() => setPage(p => p + 1)}
                            className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 shadow-sm hover:bg-blue-600 hover:text-white transition-all disabled:opacity-20 active:scale-90"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedUser ? 'Reconfigure Identity' : 'Provision User Node'}
            >
                <div className="p-2 page-transition">
                    <UserForm
                        initialData={selectedUser}
                        onSubmit={handleSubmit}
                        loading={formLoading}
                    />
                </div>
            </Modal>
        </div>
    );
};
