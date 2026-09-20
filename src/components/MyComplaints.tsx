import React, { useState } from 'react';
import { User, Complaint } from '../types';
import { Search, Filter, MapPin, Calendar, CheckCircle2, Clock, Activity, AlertTriangle, Star, MessageSquare, X, ArrowLeft } from 'lucide-react';

interface MyComplaintsProps {
  user: User;
  complaints: Complaint[];
  onRefresh: () => void;
  onNavigate: (view: string) => void;
}

export function MyComplaints({ user, complaints, onRefresh, onNavigate }: MyComplaintsProps) {
  const studentComplaints = complaints.filter(c => c.studentId === user.id);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Feedback State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  const filtered = studentComplaints.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(search.toLowerCase()) ||
                          c.category.toLowerCase().includes(search.toLowerCase()) ||
                          c.location.toLowerCase().includes(search.toLowerCase()) ||
                          c.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleFeedbackSubmit = async (e: React.FormEvent, complaintId: string) => {
    e.preventDefault();
    setFeedbackError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaintId,
          studentId: user.id,
          studentName: user.fullName || user.name,
          rating,
          comment
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit feedback');
      setFeedbackSubmitted(true);
      onRefresh();
    } catch (err: any) {
      setFeedbackError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900">My Complaints</h1>
          <p className="text-xs text-slate-500">View status history, admin responses, and give feedback on resolved issues.</p>
        </div>
        <button
          onClick={() => onNavigate('submit')}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition"
        >
          + Submit New Complaint
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by ID, category, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Furniture">Furniture</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Internet/Wi-Fi">Internet/Wi-Fi</option>
            <option value="Classroom">Classroom</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Washroom">Washroom</option>
            <option value="Security">Security</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <p className="text-sm">No complaints found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Complaint ID</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-red-600">{c.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{c.category}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {c.location} ({c.specificLocation})
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        c.priority === 'Emergency' ? 'bg-red-100 text-red-800' :
                        c.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                        c.priority === 'Medium' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(c.dateTime).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedComplaint(c)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                      >
                        Open Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complaint Details & Timeline Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden my-8">
            <div className="bg-gradient-to-r from-red-900 to-slate-900 text-white p-6 flex justify-between items-center">
              <div>
                <span className="text-xs uppercase tracking-widest bg-red-500/30 px-2.5 py-0.5 rounded text-red-300 font-bold">
                  Complaint Details
                </span>
                <h3 className="text-xl font-extrabold mt-1">{selectedComplaint.id}</h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-300 hover:text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Grid Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block uppercase font-bold">Category</span>
                  <span className="font-semibold text-slate-800">{selectedComplaint.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold">Location</span>
                  <span className="font-semibold text-slate-800">{selectedComplaint.location} ({selectedComplaint.specificLocation})</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold">Priority</span>
                  <span className="font-semibold text-slate-800">{selectedComplaint.priority}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold">Assigned Dept</span>
                  <span className="font-semibold text-red-700">{selectedComplaint.assignedDepartment}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold">Current Status</span>
                  <span className="font-semibold text-emerald-700">{selectedComplaint.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold">Submitted Date</span>
                  <span className="font-semibold text-slate-800">{new Date(selectedComplaint.dateTime).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Problem Description</h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Admin Response */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Admin Response</h4>
                <p className="text-sm text-slate-700 bg-red-50/50 p-4 rounded-xl border border-red-200">
                  {selectedComplaint.adminResponse || 'No response added yet by administrator.'}
                </p>
              </div>

              {/* Image Proof if any */}
              {selectedComplaint.image && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attached Image Proof</h4>
                  <img src={selectedComplaint.image} alt="Complaint proof" className="rounded-xl max-h-48 object-cover border border-slate-200" />
                </div>
              )}

              {/* Visual Timeline */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visual Progress Timeline</h4>
                <div className="flex items-center justify-between relative bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-medium">
                  <div className={`flex flex-col items-center ${['Submitted', 'Pending', 'In Progress', 'Resolved'].includes(selectedComplaint.status) ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center mb-1 text-[10px]">1</div>
                    Submitted
                  </div>
                  <div className={`flex flex-col items-center ${['Pending', 'In Progress', 'Resolved'].includes(selectedComplaint.status) ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center mb-1 text-[10px]">2</div>
                    Pending
                  </div>
                  <div className={`flex flex-col items-center ${['In Progress', 'Resolved'].includes(selectedComplaint.status) ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center mb-1 text-[10px]">3</div>
                    In Progress
                  </div>
                  <div className={`flex flex-col items-center ${selectedComplaint.status === 'Resolved' ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1 text-[10px]">4</div>
                    Resolved
                  </div>
                </div>
              </div>

              {/* Feedback Section for Resolved Complaints */}
              {selectedComplaint.status === 'Resolved' && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                    <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" /> Provide Resolution Feedback
                  </h4>
                  {feedbackSubmitted ? (
                    <p className="text-xs text-emerald-700 font-semibold">Thank you! Your feedback has been recorded successfully.</p>
                  ) : (
                    <form onSubmit={e => handleFeedbackSubmit(e, selectedComplaint.id)} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-emerald-800 mb-1">Rating (1 to 5 Stars)</label>
                        <select
                          value={rating}
                          onChange={e => setRating(Number(e.target.value))}
                          className="bg-white border border-emerald-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                          <option value="4">⭐⭐⭐⭐ (4 - Good)</option>
                          <option value="3">⭐⭐⭐ (3 - Average)</option>
                          <option value="2">⭐⭐ (2 - Below Average)</option>
                          <option value="1">⭐ (1 - Poor)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-emerald-800 mb-1">Feedback Comment</label>
                        <textarea
                          rows={2}
                          required
                          placeholder="How satisfied are you with the resolution?"
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                          className="w-full bg-white border border-emerald-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition"
                      >
                        Submit Feedback
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-5 py-2 rounded-xl text-sm transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
