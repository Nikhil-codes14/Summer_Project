import React, { useState } from 'react';
import { Complaint } from '../types';
import { Search, ShieldAlert, CheckCircle2, Clock, Activity, AlertTriangle, ArrowLeft } from 'lucide-react';

interface TrackComplaintProps {
  complaints: Complaint[];
  onNavigate: (view: string) => void;
}

export function TrackComplaint({ complaints, onNavigate }: TrackComplaintProps) {
  const [searchId, setSearchId] = useState('');
  const [tracked, setTracked] = useState<Complaint | null>(null);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const found = complaints.find(c => c.id.toLowerCase() === searchId.trim().toLowerCase());
    if (!found) {
      setError('Complaint ID not found in system. Please verify your ID.');
      setTracked(null);
    } else {
      setTracked(found);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>
        <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full">
          SAMS Complaint Tracker
        </span>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Track Complaint Status</h1>
          <p className="text-xs text-slate-500 mt-1">Enter your unique Complaint ID (e.g. SAMS-COMP-1001) to check live status.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              placeholder="e.g. SAMS-COMP-1001"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow transition"
          >
            Track Status
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {tracked && (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-blue-600 font-bold">Complaint Record</span>
                <h3 className="text-xl font-bold font-mono text-slate-900">{tracked.id}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                tracked.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                tracked.status === 'In Progress' ? 'bg-indigo-100 text-indigo-800' :
                tracked.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                tracked.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                'bg-slate-200 text-slate-800'
              }`}>
                {tracked.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block uppercase font-bold">Category</span>
                <span className="font-semibold text-slate-800">{tracked.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold">Location</span>
                <span className="font-semibold text-slate-800">{tracked.location} ({tracked.specificLocation})</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold">Priority</span>
                <span className="font-semibold text-slate-800">{tracked.priority}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold">Assigned Department</span>
                <span className="font-semibold text-blue-700">{tracked.assignedDepartment}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold">Submission Date</span>
                <span className="font-semibold text-slate-800">{new Date(tracked.dateTime).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold">Last Updated</span>
                <span className="font-semibold text-slate-800">{new Date(tracked.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Problem Description</h4>
              <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                {tracked.description}
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Admin Response</h4>
              <p className="text-sm text-slate-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                {tracked.adminResponse || 'Pending administrative review.'}
              </p>
            </div>

            {/* Visual Timeline */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visual Progress Timeline</h4>
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 text-xs font-medium">
                <div className="flex flex-col items-center text-blue-600 font-bold">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1 text-[10px]">✓</div>
                  Submitted
                </div>
                <div className={`flex flex-col items-center ${['Pending', 'In Progress', 'Resolved'].includes(tracked.status) ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                  <div className={`w-6 h-6 rounded-full ${['Pending', 'In Progress', 'Resolved'].includes(tracked.status) ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'} flex items-center justify-center mb-1 text-[10px]`}>2</div>
                  Pending
                </div>
                <div className={`flex flex-col items-center ${['In Progress', 'Resolved'].includes(tracked.status) ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                  <div className={`w-6 h-6 rounded-full ${['In Progress', 'Resolved'].includes(tracked.status) ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'} flex items-center justify-center mb-1 text-[10px]`}>3</div>
                  In Progress
                </div>
                <div className={`flex flex-col items-center ${tracked.status === 'Resolved' ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                  <div className={`w-6 h-6 rounded-full ${tracked.status === 'Resolved' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'} flex items-center justify-center mb-1 text-[10px]`}>4</div>
                  Resolved
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
