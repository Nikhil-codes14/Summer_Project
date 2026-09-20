import React from 'react';
import { User, Complaint } from '../types';
import { FileText, Clock, AlertCircle, CheckCircle, PlusCircle, ArrowRight, Activity, MapPin } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  complaints: Complaint[];
  onNavigate: (view: string) => void;
}

export function StudentDashboard({ user, complaints, onNavigate }: StudentDashboardProps) {
  const studentComplaints = complaints.filter(c => c.studentId === user.id);

  const total = studentComplaints.length;
  const pending = studentComplaints.filter(c => c.status === 'Submitted' || c.status === 'Pending').length;
  const inProgress = studentComplaints.filter(c => c.status === 'In Progress').length;
  const resolved = studentComplaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-red-500/30 text-red-300 text-xs px-3 py-1 rounded-full font-semibold">
            Student Dashboard • {user.course || 'BCA'} ({user.year || '2nd Year'})
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user.fullName || user.name}!</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Roll Number: <span className="font-mono text-white">{user.studentId || 'SAMS2026'}</span> | Department: {user.department || 'Computer Applications'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('submit')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-xl shadow transition flex items-center gap-2 text-sm"
          >
            <PlusCircle className="w-4 h-4" /> Submit New Complaint
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Complaints</span>
            <div className="text-3xl font-bold text-slate-900">{total}</div>
          </div>
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending / Submitted</span>
            <div className="text-3xl font-bold text-slate-900">{pending}</div>
          </div>
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">In Progress</span>
            <div className="text-3xl font-bold text-slate-900">{inProgress}</div>
          </div>
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Resolved</span>
            <div className="text-3xl font-bold text-slate-900">{resolved}</div>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Complaints Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Recent Complaints</h2>
            <p className="text-xs text-slate-500">Track status and review admin response</p>
          </div>
          <button
            onClick={() => onNavigate('my-complaints')}
            className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1"
          >
            View All ({total}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {studentComplaints.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <p className="text-sm">You haven't submitted any complaints yet.</p>
            <button
              onClick={() => onNavigate('submit')}
              className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Submit First Complaint
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-4 py-3">Complaint ID</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {studentComplaints.slice(0, 5).map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-red-600">{c.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{c.category}</td>
                    <td className="px-4 py-3 text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.location} ({c.specificLocation})
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        c.priority === 'Emergency' ? 'bg-red-100 text-red-800' :
                        c.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                        c.priority === 'Medium' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'In Progress' ? 'bg-indigo-100 text-indigo-800' :
                        c.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        c.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onNavigate('my-complaints')}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        View Details
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
