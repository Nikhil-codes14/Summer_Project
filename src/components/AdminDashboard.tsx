import React from 'react';
import { Complaint } from '../types';
import { FileText, Clock, Activity, CheckCircle, AlertTriangle, XCircle, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminDashboardProps {
  complaints: Complaint[];
  onNavigate: (view: string) => void;
}

export function AdminDashboard({ complaints, onNavigate }: AdminDashboardProps) {
  const total = complaints.length;
  const newCount = complaints.filter(c => c.status === 'Submitted').length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const rejected = complaints.filter(c => c.status === 'Rejected').length;

  // Category breakdown for chart
  const categoryMap: { [key: string]: number } = {};
  complaints.forEach(c => {
    categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
  });
  const categoryData = Object.keys(categoryMap).map(cat => ({
    category: cat,
    count: categoryMap[cat]
  }));

  // Status breakdown for Pie chart
  const statusData = [
    { name: 'Submitted', value: newCount, color: '#3b82f6' },
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'In Progress', value: inProgress, color: '#6366f1' },
    { name: 'Resolved', value: resolved, color: '#10b981' },
    { name: 'Rejected', value: rejected, color: '#ef4444' }
  ].filter(item => item.value > 0);

  const highPriority = complaints.filter(c => c.priority === 'High' || c.priority === 'Emergency');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full font-semibold border border-blue-400/30">
            Administrator Portal • SAMS Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Admin Overview & Analytics</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Monitor, assign departments, update statuses, and review resolution feedback across campus.
          </p>
        </div>
        <div>
          <button
            onClick={() => onNavigate('admin-complaints')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition text-sm"
          >
            Manage All Complaints ({total})
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</span>
          <div className="text-2xl font-extrabold text-slate-900">{total}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">New</span>
          <div className="text-2xl font-extrabold text-slate-900">{newCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending</span>
          <div className="text-2xl font-extrabold text-slate-900">{pending}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">In Progress</span>
          <div className="text-2xl font-extrabold text-slate-900">{inProgress}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Resolved</span>
          <div className="text-2xl font-extrabold text-slate-900">{resolved}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Rejected</span>
          <div className="text-2xl font-extrabold text-slate-900">{rejected}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category breakdown bar chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Category-Wise Complaints</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="category" angle={-25} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status distribution */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-base">Complaint Status Distribution</h3>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs pt-2 border-t border-slate-100">
            {statusData.map((s, idx) => (
              <span key={idx} className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></span>
                {s.name} ({s.value})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* High Priority Complaints */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> High Priority & Emergency Complaints
          </h3>
          <button
            onClick={() => onNavigate('admin-complaints')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Manage All
          </button>
        </div>

        {highPriority.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No high priority or emergency complaints currently pending.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {highPriority.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{c.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{c.studentName} ({c.studentRoll})</td>
                    <td className="px-4 py-3 text-slate-700">{c.category}</td>
                    <td className="px-4 py-3 text-slate-600">{c.location} ({c.specificLocation})</td>
                    <td className="px-4 py-3">
                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-bold">{c.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-semibold">{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onNavigate('admin-complaints')}
                        className="text-xs font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
