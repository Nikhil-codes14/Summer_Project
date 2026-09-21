import React, { useState } from 'react';
import { User } from '../types';
import { apiFetch } from '../lib/api';
import { User as UserIcon, Mail, BookOpen, Building, Hash, Calendar, CheckCircle2, ArrowLeft } from 'lucide-react';

interface StudentProfileProps {
  user: User;
  onUpdateUser: (updated: User) => void;
  onNavigate: (view: string) => void;
}

export function StudentProfile({ user, onUpdateUser, onNavigate }: StudentProfileProps) {
  const [fullName, setFullName] = useState(user.fullName || user.name || '');
  const [course, setCourse] = useState(user.course || 'BCA');
  const [department, setDepartment] = useState(user.department || 'Computer Applications');
  const [year, setYear] = useState(user.year || '2nd Year');
  const [semester, setSemester] = useState(user.semester || '4th Semester');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const data = await apiFetch(`/api/students/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, course, department, year, semester })
      });
      onUpdateUser(data.user);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>
        <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full">
          Student Profile Management
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 sm:p-8 flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow">
            {(fullName || 'S')[0]}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">{fullName}</h1>
            <p className="text-xs text-slate-300 font-mono">Roll No: {user.studentId || user.rollNumber || 'SAMS2026'}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Profile updated successfully!
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Student ID / Roll Number</label>
              <input
                type="text"
                disabled
                value={user.studentId || user.rollNumber || ''}
                className="w-full bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-500 font-mono cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Course</label>
              <input
                type="text"
                required
                value={course}
                onChange={e => setCourse(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Department</label>
              <input
                type="text"
                required
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Year</label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Semester</label>
              <select
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option>1st Semester</option>
                <option>2nd Semester</option>
                <option>3rd Semester</option>
                <option>4th Semester</option>
                <option>5th Semester</option>
                <option>6th Semester</option>
                <option>7th Semester</option>
                <option>8th Semester</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2.5 rounded-xl text-sm shadow transition"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
