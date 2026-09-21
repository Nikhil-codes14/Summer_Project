import React, { useState } from 'react';
import { ShieldAlert, Lock, Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface AdminLoginModalProps {
  onLoginSuccess: (user: any, role: 'ADMIN') => void;
  onBackToLanding: () => void;
  onSwitchToStudent: () => void;
}

export function AdminLoginModal({ onLoginSuccess, onBackToLanding, onSwitchToStudent }: AdminLoginModalProps) {
  const [adminEmail, setAdminEmail] = useState('dean@ambalika.ac.in');
  const [adminPassword, setAdminPassword] = useState('dean123');
  const [selectedRole, setSelectedRole] = useState<'dean' | 'director' | 'admin'>('dean');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectRole = (roleType: 'dean' | 'director' | 'admin') => {
    setSelectedRole(roleType);
    if (roleType === 'dean') {
      setAdminEmail('dean@ambalika.ac.in');
      setAdminPassword('dean123');
    } else if (roleType === 'director') {
      setAdminEmail('director@ambalika.ac.in');
      setAdminPassword('director123');
    } else {
      setAdminEmail('admin@ambalika.ac.in');
      setAdminPassword('admin123');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });
      onLoginSuccess(data.user, 'ADMIN');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 text-white p-3.5 rounded-2xl shadow-xl border border-blue-500/30">
            <KeyRound className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight">
          {selectedRole === 'dean' ? '🏛️ College Dean Login' : selectedRole === 'director' ? '👔 Additional Director Login' : '⚙️ Estate HOD / Admin Login'}
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400 uppercase tracking-widest font-semibold">
          {selectedRole === 'dean' ? 'Academic & Executive Council Portal' : selectedRole === 'director' ? 'Directorate General Executive Portal' : 'Estate & Maintenance Management Portal'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900 py-8 px-6 shadow-2xl sm:rounded-2xl border border-slate-800 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <button
              onClick={onBackToLanding}
              className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </button>
            <button
              onClick={onSwitchToStudent}
              className="text-xs text-blue-400 hover:underline font-medium"
            >
              Go to Student Portal →
            </button>
          </div>

          {error && (
            <div className="bg-red-950/80 border border-red-800 text-red-300 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Select Executive / Admin Role</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectRole('dean')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border ${
                  selectedRole === 'dean' ? 'bg-blue-600 text-white border-blue-500 shadow-md' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>🏛️ Dean</span>
                <span className="text-[10px] opacity-80 font-normal">Academic</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole('director')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border ${
                  selectedRole === 'director' ? 'bg-blue-600 text-white border-blue-500 shadow-md' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>👔 Director</span>
                <span className="text-[10px] opacity-80 font-normal">Executive</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole('admin')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border ${
                  selectedRole === 'admin' ? 'bg-blue-600 text-white border-blue-500 shadow-md' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>⚙️ HOD / Admin</span>
                <span className="text-[10px] opacity-80 font-normal">Estate</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="admin@ambalika.ac.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Admin Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <p className="font-semibold text-blue-400">Authorized Executive Accounts:</p>
              <div className="space-y-1 text-slate-300">
                <p>🏛️ <strong>Dean:</strong> <code className="bg-slate-900 px-1 py-0.5 rounded font-mono text-blue-300">dean@ambalika.ac.in</code> / <code className="bg-slate-900 px-1 py-0.5 rounded font-mono">dean123</code></p>
                <p>👔 <strong>Director:</strong> <code className="bg-slate-900 px-1 py-0.5 rounded font-mono text-blue-300">director@ambalika.ac.in</code> / <code className="bg-slate-900 px-1 py-0.5 rounded font-mono">director123</code></p>
                <p>⚙️ <strong>Admin/HOD:</strong> <code className="bg-slate-900 px-1 py-0.5 rounded font-mono text-blue-300">admin@ambalika.ac.in</code> / <code className="bg-slate-900 px-1 py-0.5 rounded font-mono">admin123</code></p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg transition text-sm flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" /> {loading ? 'Authenticating...' : selectedRole === 'dean' ? '🏛️ Login as College Dean' : selectedRole === 'director' ? '👔 Login as Additional Director' : '⚙️ Login as Estate HOD / Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
