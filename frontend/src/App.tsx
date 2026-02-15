import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthPage } from './pages/AuthPage';

import { UsersPage } from './pages/UsersPage';

import { PlansPage } from './pages/PlansPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';

// Premium "Alive" Overview Component
const Overview = () => (
  <div className="relative p-6 lg:p-12 min-h-[600px] flex flex-col justify-center overflow-hidden page-transition">
    {/* Dynamic Background Auras */}
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] -z-10 float-slow"></div>
    <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-sky-100/20 rounded-full blur-[100px] -z-10 float-slow animation-delay-2000"></div>

    <div className="relative space-y-8 lg:space-y-10">
      <div className="space-y-4">
        <h2 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter animate-in zoom-in-95 slide-in-from-left-8 duration-1000">
          Welcome <span className="text-gradient">back!</span>
        </h2>
        <div className="flex items-center gap-4 animate-in slide-in-from-left-12 duration-1000 delay-200">
          <div className="h-1.5 w-32 bg-blue-600 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
          </div>
          <div className="w-3 h-3 rounded-full bg-emerald-500 alive-pulse shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-slate-400 font-black text-xs lg:text-sm uppercase tracking-[0.5em] animate-in fade-in duration-1000 delay-400 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-slate-200"></span>
          System Operational • Identity Secure
        </p>
        <p className="text-slate-500 font-bold text-xl lg:text-2xl leading-relaxed max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
          Your command center is synchronized. Orchestrate users, provision resources, and maintain global service architectures with SubFlow's <span className="text-slate-900 italic">live heartbeat</span>.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 pt-4 animate-in fade-in duration-1000 delay-800">
        <div className="glass-card px-8 py-5 rounded-3xl hover-alive cursor-default">
          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Active Nodes</p>
          <p className="text-2xl font-black text-slate-900 leading-none">1,284</p>
        </div>
        <div className="glass-card px-8 py-5 rounded-3xl hover-alive cursor-default bg-blue-600/5 border-blue-100">
          <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest mb-1">Global Health</p>
          <p className="text-2xl font-black text-blue-600 leading-none">99.9%</p>
        </div>
        <div className="glass-card px-8 py-5 rounded-3xl hover-alive cursor-default">
          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Uptime</p>
          <p className="text-2xl font-black text-slate-900 leading-none">32d 4h</p>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Overview />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
