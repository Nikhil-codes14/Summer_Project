import React from 'react';
import { ShieldAlert, CheckCircle2, ArrowRight, UserCheck, Lock, Building, Wrench, Zap, Wifi, Sparkles, FileText, HelpCircle } from 'lucide-react';
import { COMPLAINT_CATEGORIES, CAMPUS_LOCATIONS } from '../types';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Ambalika Institute of Management and Technology
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              SMART AMBALIKA <br />
              <span className="text-blue-400">MANAGEMENT SYSTEM</span> <span className="text-2xl sm:text-3xl font-bold text-slate-300">(SAMS)</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-light">
              Smart Campus. Faster Complaints. Better Management. A fully transparent, trackable, and efficient digital complaint resolution system designed for students across all courses and departments.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => onNavigate('login')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg transition flex items-center gap-2 shadow-blue-600/30"
              >
                Student Portal <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition"
              >
                Student Registration
              </button>
              <button
                onClick={() => onNavigate('admin-login')}
                className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold px-6 py-3.5 rounded-xl transition flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-blue-400" /> Admin Login
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs uppercase tracking-widest text-blue-300 font-bold">System Overview</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-medium">Live & Secure</span>
              </div>
              <div className="space-y-4 text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Instant Complaint ID</strong>
                    Auto-generated tracking numbers for every reported issue.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Departmental Routing</strong>
                    Direct assignment to Electrical, IT, Cleaning, & Maintenance teams.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Transparent Timeline</strong>
                    Submitted → Pending → In Progress → Resolved status tracking.
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
                <span>BCA 2nd Year Project</span>
                <button onClick={() => onNavigate('documentation')} className="text-blue-300 hover:underline flex items-center gap-1 font-medium">
                  <FileText className="w-3.5 h-3.5" /> Read Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the System */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">About SAMS</h2>
          <p className="text-slate-600 text-lg">
            Developed as a real college management project for Ambalika Institute of Management and Technology. SAMS streamlines how campus maintenance issues are reported, assigned, and resolved.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900">Report Effortlessly</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Students can report electricity issues, broken furniture, water leakage, or Wi-Fi problems in seconds with specific campus locations and priority ratings.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900">Admin Management</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Administrators review incoming complaints, assign them to responsible departments (Electrical, IT, Cleaning), update statuses, and add resolution notes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900">Feedback & Ratings</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Once complaints are marked resolved, students provide ratings (1 to 5) and feedback to ensure high service standards across campus.
            </p>
          </div>
        </div>
      </section>

      {/* Complaint Categories & Locations */}
      <section className="bg-slate-100 py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-slate-900">Supported Categories & Locations</h2>
            <p className="text-slate-600">Comprehensive campus coverage across all institute blocks and facilities.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {COMPLAINT_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 text-center font-medium text-slate-800 text-sm flex flex-col items-center gap-2 hover:border-blue-500 transition">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                {cat}
              </div>
            ))}
          </div>

          <div className="pt-6">
            <h4 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Campus Locations Covered</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {CAMPUS_LOCATIONS.map((loc, idx) => (
                <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Flowchart Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold text-slate-900">System Workflow</h2>
          <p className="text-slate-600">Step-by-step journey from problem identification to final feedback.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3 text-center">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto">1</div>
            <h4 className="font-bold text-slate-900">Student Register & Login</h4>
            <p className="text-xs text-slate-500">Secure authentication with student roll number and course details.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3 text-center">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto">2</div>
            <h4 className="font-bold text-slate-900">Submit Complaint</h4>
            <p className="text-xs text-slate-500">Auto-generates unique Complaint ID with category & location.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3 text-center">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto">3</div>
            <h4 className="font-bold text-slate-900">Admin Review & Assign</h4>
            <p className="text-xs text-slate-500">Admin assigns responsible department and updates status.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3 text-center">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mx-auto">4</div>
            <h4 className="font-bold text-slate-900">Resolved & Feedback</h4>
            <p className="text-xs text-slate-500">Student reviews resolution and submits rating from 1 to 5.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wide">Smart Ambalika Management System (SAMS)</div>
              <div className="text-xs text-slate-500">Ambalika Institute of Management and Technology</div>
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            <button onClick={() => onNavigate('login')} className="hover:text-white transition">Student Login</button>
            <button onClick={() => onNavigate('admin-login')} className="hover:text-white transition">Admin Portal</button>
            <button onClick={() => onNavigate('documentation')} className="hover:text-white transition">Documentation</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
