import React, { useState } from 'react';
import { User, COMPLAINT_CATEGORIES, CAMPUS_LOCATIONS } from '../types';
import { apiFetch } from '../lib/api';
import { Send, MapPin, AlertTriangle, Image as ImageIcon, CheckCircle2, ArrowLeft } from 'lucide-react';

interface SubmitComplaintFormProps {
  user: User;
  onComplaintSubmitted: () => void;
  onNavigate: (view: string) => void;
}

export function SubmitComplaintForm({ user, onComplaintSubmitted, onNavigate }: SubmitComplaintFormProps) {
  const [category, setCategory] = useState(COMPLAINT_CATEGORIES[0]);
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [specificLocation, setSpecificLocation] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Emergency'>('Medium');
  const [image, setImage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!description.trim() || !specificLocation.trim()) {
      setError('Please provide specific location and problem description.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiFetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          studentName: user.fullName || user.name,
          studentRoll: user.studentId || user.rollNumber || 'SAMS2026',
          category,
          title,
          location,
          specificLocation,
          description,
          priority,
          image
        })
      });

      setSuccessId(data.complaint.id);
      onComplaintSubmitted();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>
        <span className="text-xs bg-red-100 text-red-800 font-semibold px-3 py-1 rounded-full">
          SAMS Complaint Portal
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-900 to-slate-900 text-white p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold">Report Campus Problem</h1>
          <p className="text-xs text-slate-300 mt-1">
            Submit infrastructure, electrical, cleanliness, or Wi-Fi issues for immediate administrative tracking.
          </p>
        </div>

        {successId ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Complaint Submitted Successfully!</h2>
              <p className="text-sm text-slate-600">
                Your unique Complaint ID has been generated and assigned to the administration queue.
              </p>
              <div className="inline-block bg-red-50 border border-red-200 px-4 py-2 rounded-xl font-mono text-lg font-bold text-red-700">
                {successId}
              </div>
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('my-complaints')}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow"
              >
                View in My Complaints
              </button>
              <button
                onClick={() => { setSuccessId(''); setDescription(''); setSpecificLocation(''); setImage(''); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-2.5 rounded-xl text-sm transition"
              >
                Submit Another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Complaint Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  {COMPLAINT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Campus Location</label>
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  {CAMPUS_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Specific Location / Room No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Room 204, Lab 3, First Floor"
                  value={specificLocation}
                  onChange={e => setSpecificLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Priority Level</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Emergency">Emergency (Safety Hazard)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Complaint Title / Headline (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Water tap broken in washroom / Wi-Fi router not working"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Problem Description</label>
              <textarea
                required
                rows={4}
                placeholder="Describe the problem in detail (e.g. electricity wire is sparking or water pipe is leaking heavily)..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Optional Image URL (Proof)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... (optional)"
                value={image}
                onChange={e => setImage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
