import React, { useState, useEffect } from 'react';
import { Resolver, DEPARTMENTS_LIST } from '../types';
import { apiFetch } from '../lib/api';
import { Wrench, UserPlus, Phone, Building, ShieldCheck, Trash2, ArrowLeft, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface AdminResolversViewProps {
  onNavigate: (view: string) => void;
}

export function AdminResolversView({ onNavigate }: AdminResolversViewProps) {
  const [resolvers, setResolvers] = useState<Resolver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New resolver form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS_LIST[0]);
  const [status, setStatus] = useState<'Available' | 'On Task' | 'Off Duty'>('Available');
  const [submitting, setSubmitting] = useState(false);

  const fetchResolvers = async () => {
    try {
      const data = await apiFetch('/api/resolvers');
      if (Array.isArray(data)) setResolvers(data);
    } catch (err) {
      console.error('Error fetching resolvers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResolvers();
  }, []);

  const handleAddResolver = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch('/api/resolvers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'true'
        },
        body: JSON.stringify({
          name,
          role,
          phone,
          department,
          status,
          isAdmin: true
        })
      });

      setName('');
      setRole('');
      setPhone('');
      setShowAddModal(false);
      fetchResolvers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResolver = async (id: string) => {
    if (!confirm('Are you sure you want to remove this technician from the staff directory?')) return;
    try {
      await apiFetch(`/api/resolvers/${id}?isAdmin=true`, {
        method: 'DELETE',
        headers: {
          'x-admin-auth': 'true'
        }
      });
      fetchResolvers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" /> Campus Technicians & Problem Resolvers Staff
          </h1>
          <p className="text-xs text-slate-500">
            View specialized technicians, plumbers, electricians, carpenters, and IT experts assigned to resolve campus issues.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow transition"
          >
            <UserPlus className="w-4 h-4" /> Add New Technician
          </button>
          <span className="text-xs bg-blue-900 text-white font-semibold px-3 py-1.5 rounded-full">
            Total Staff: {resolvers.length}
          </span>
        </div>
      </div>

      {/* Resolvers Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-sm">Loading technicians directory...</div>
      ) : resolvers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 text-sm">No technicians registered yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resolvers.map(res => (
            <div key={res.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{res.name}</h3>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">{res.role}</p>
                </div>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  res.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                  res.status === 'On Task' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {res.status}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span><strong>Department:</strong> {res.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span><strong>Contact:</strong> {res.phone}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-400">ID: {res.id}</span>
                <button
                  onClick={() => handleDeleteResolver(res.id)}
                  className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                  title="Remove Technician"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Technician Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 flex justify-between items-center">
              <div>
                <span className="text-xs uppercase tracking-widest text-blue-400 font-bold">Staff Directory</span>
                <h3 className="text-xl font-extrabold mt-1">Add Problem Resolver / Technician</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddResolver} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Technician Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Specialized Role / Skill</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plumber & Pipe Specialist"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Assigned Department</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  {DEPARTMENTS_LIST.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Initial Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Available">Available</option>
                  <option value="On Task">On Task</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow transition"
                >
                  {submitting ? 'Adding...' : 'Add Technician'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
