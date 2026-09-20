import React, { useState } from 'react';
import { Complaint, DEPARTMENTS_LIST, COMPLAINT_CATEGORIES } from '../types';
import { apiFetch } from '../lib/api';
import { Search, Filter, MapPin, CheckCircle2, XCircle, Clock, Activity, MessageSquare, Building, X, ArrowLeft } from 'lucide-react';

interface AdminComplaintsTableProps {
  complaints: Complaint[];
  onRefresh: () => void;
  onNavigate: (view: string) => void;
}

export function AdminComplaintsTable({ complaints, onRefresh, onNavigate }: AdminComplaintsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [resolvers, setResolvers] = useState<any[]>([]);

  // Edit State in Modal
  const [newStatus, setNewStatus] = useState<any>('In Progress');
  const [newDept, setNewDept] = useState('');
  const [assignedResolver, setAssignedResolver] = useState('');
  const [adminResponse, setAdminResponse] = useState('');
  const [executiveNote, setExecutiveNote] = useState('');
  const [updating, setUpdating] = useState(false);

  React.useEffect(() => {
    apiFetch('/api/resolvers')
      .then(data => {
        if (Array.isArray(data)) setResolvers(data);
      })
      .catch(() => {});
  }, []);

  const filtered = complaints.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(search.toLowerCase()) ||
                          c.studentName.toLowerCase().includes(search.toLowerCase()) ||
                          c.studentRoll.toLowerCase().includes(search.toLowerCase()) ||
                          c.category.toLowerCase().includes(search.toLowerCase()) ||
                          c.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
    const matchesDept = deptFilter === 'ALL' || c.assignedDepartment === deptFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesDept;
  }).sort((a, b) => {
    const pWeight = (p: string) => p === 'Emergency' ? 4 : p === 'High' ? 3 : p === 'Medium' ? 2 : 1;
    const scoreA = pWeight(a.priority) + (a.reportCount ? a.reportCount * 3 : 0);
    const scoreB = pWeight(b.priority) + (b.reportCount ? b.reportCount * 3 : 0);
    return scoreB - scoreA;
  });

  const handleOpenModal = (c: Complaint) => {
    setActiveComplaint(c);
    setNewStatus(c.status);
    setNewDept(c.assignedDepartment || DEPARTMENTS_LIST[0]);
    setAssignedResolver(c.assignedResolver || '');
    setAdminResponse(c.adminResponse || '');
    setExecutiveNote(c.executiveNote || '');
  };

  const handleUpdateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;
    setUpdating(true);

    try {
      await apiFetch(`/api/complaints/${activeComplaint.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-auth': 'true'
        },
        body: JSON.stringify({
          status: newStatus,
          assignedDepartment: newDept,
          assignedResolver,
          adminResponse,
          executiveNote,
          executiveSignoff: "College Dean / Additional Director Executive Office",
          isAdmin: true
        })
      });

      setActiveComplaint(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900">Manage Campus Complaints</h1>
          <p className="text-xs text-slate-500">Assign responsible departments, update statuses, and add administrative responses.</p>
        </div>
        <span className="text-xs bg-slate-900 text-white font-semibold px-3 py-1 rounded-full">
          Total Records: {filtered.length}
        </span>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search student, ID, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
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
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {COMPLAINT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>

        <div>
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS_LIST.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <p className="text-sm">No complaints match the filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Assigned Dept</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-red-600">{c.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{c.studentName}</div>
                      <div className="text-xs text-slate-400 font-mono">{c.studentRoll}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5 flex-wrap">
                        {c.category}
                        {c.reportCount && c.reportCount > 1 && (
                          <span className="inline-flex items-center gap-0.5 bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded text-[10px]" title={`${c.reportCount} students reported this issue`}>
                            🔥 {c.reportCount} Reports
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {c.location} ({c.specificLocation})
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                        c.priority === 'Emergency' ? 'bg-red-100 text-red-800' :
                        c.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                        c.priority === 'Medium' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700 font-medium">
                      {c.assignedDepartment}
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
                        onClick={() => handleOpenModal(c)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Management Modal */}
      {activeComplaint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden my-8">
            <div className="bg-gradient-to-r from-slate-900 to-red-950 text-white p-6 flex justify-between items-center">
              <div>
                <span className="text-xs uppercase tracking-widest text-red-400 font-bold">Admin Panel</span>
                <h3 className="text-xl font-extrabold font-mono mt-1">Manage: {activeComplaint.id}</h3>
              </div>
              <button onClick={() => setActiveComplaint(null)} className="text-slate-300 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateComplaint} className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div><strong>Student:</strong> {activeComplaint.studentName} ({activeComplaint.studentRoll})</div>
                <div><strong>Category & Location:</strong> {activeComplaint.category} at {activeComplaint.location} ({activeComplaint.specificLocation})</div>
                <div><strong>Description:</strong> {activeComplaint.description}</div>
                <div><strong>Priority:</strong> <span className="font-bold text-red-600">{activeComplaint.priority}</span></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Assign Responsible Department</label>
                <select
                  value={newDept}
                  onChange={e => setNewDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {DEPARTMENTS_LIST.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Assign Problem Resolver / Technician</label>
                <select
                  value={assignedResolver}
                  onChange={e => setAssignedResolver(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="">-- Select Resolver / Technician (Plumber, Electrician, Carpenter, IT) --</option>
                  {resolvers.map(r => (
                    <option key={r.id} value={`${r.name} (${r.role})`}>
                      {r.name} — {r.role} ({r.department}) [{r.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  🏛️ College Dean / Additional Director Executive Acknowledgment
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter executive acknowledgment or priority directive..."
                  value={executiveNote}
                  onChange={e => setExecutiveNote(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                ></textarea>
                <p className="text-[10px] text-amber-700">Official remarks from the Dean or Additional Director office will be highlighted on the complaint.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Admin Response / Resolution Note</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter notes for student (e.g. Electrician team scheduled for 3 PM)..."
                  value={adminResponse}
                  onChange={e => setAdminResponse(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                ></textarea>
              </div>

              {activeComplaint.image && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Attached Proof</span>
                  <img src={activeComplaint.image} alt="Proof" className="rounded-xl h-32 object-cover border" />
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveComplaint(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow transition"
                >
                  {updating ? 'Updating...' : 'Save & Notify Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
