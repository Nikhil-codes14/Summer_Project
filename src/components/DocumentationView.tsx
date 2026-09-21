import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  ShieldAlert, 
  Building2, 
  Wrench, 
  Cpu, 
  Clock, 
  Users, 
  Layers, 
  FileCode2, 
  HelpCircle, 
  ChevronRight,
  Sparkles,
  Zap,
  Award
} from 'lucide-react';
import { COMPLAINT_CATEGORIES, CAMPUS_LOCATIONS } from '../types';

interface DocumentationViewProps {
  onNavigate: (view: string) => void;
  userRole?: 'STUDENT' | 'ADMIN' | null;
}

export function DocumentationView({ onNavigate, userRole }: DocumentationViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'workflow' | 'roles' | 'sla' | 'api' | 'faq'>('overview');

  const backDestination = userRole === 'ADMIN' ? 'admin-dashboard' : userRole === 'STUDENT' ? 'dashboard' : 'landing';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => onNavigate(backDestination)}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {userRole === 'ADMIN' ? 'Admin Portal' : userRole === 'STUDENT' ? 'Student Dashboard' : 'Home'}
        </button>
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs px-3.5 py-1 rounded-full font-bold">
          <BookOpen className="w-3.5 h-3.5" /> SAMS System Documentation v2.4
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="space-y-3 relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full font-semibold border border-blue-400/30">
            <Sparkles className="w-3 h-3 text-blue-400" /> Ambalika Institute of Management & Technology
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Smart Ambalika Management System
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
            Comprehensive system guide, operational workflows, institutional role hierarchy, SLAs, and technical specifications for campus grievance resolution.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none hidden lg:block">
          <ShieldAlert className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'overview', label: '1. System Overview', icon: Layers },
          { id: 'workflow', label: '2. Lifecycle & Workflow', icon: Clock },
          { id: 'roles', label: '3. Roles & Hierarchy', icon: Users },
          { id: 'sla', label: '4. Priority & SLA Matrix', icon: Zap },
          { id: 'api', label: '5. Architecture & API', icon: FileCode2 },
          { id: 'faq', label: '6. FAQs & Help', icon: HelpCircle },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Vision & Objective</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                The Smart Ambalika Management System (SAMS) replaces slow, manual paper complaints with an automated, transparent, and multi-tier campus issue resolution platform designed specifically for the Ambalika Institute of Management and Technology campus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Campus-Wide Coverage</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Covers all Academic Blocks (A, B, C), Computer Centers, Mechanical Workshops, Central Library, Boys & Girls Hostels, Canteen, and Sports Complex.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Instant Tracking & IDs</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every issue receives an immutable reference ID (e.g. <span className="font-mono font-semibold text-blue-700">SAMS-2026-1001</span>) allowing real-time progress verification without repeated follow-ups.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Accountability & Ratings</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Post-resolution rating system (1 to 5 stars) enables the College Dean and Additional Director to audit department turnaround times and student satisfaction.
                </p>
              </div>
            </div>

            <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-200 space-y-4">
              <h3 className="font-bold text-blue-950 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" /> Supported Facility Categories
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {COMPLAINT_CATEGORIES.map(cat => (
                  <div key={cat} className="bg-white px-3.5 py-2.5 rounded-xl border border-blue-200/80 text-xs font-semibold text-slate-800 shadow-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WORKFLOW */}
        {activeTab === 'workflow' && (
          <div className="space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Complaint Lifecycle & Resolution Stages</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Standard operating procedure from the moment a student observes an issue to complete physical maintenance and verification.
              </p>
            </div>

            <div className="relative border-l-2 border-blue-200 ml-4 pl-6 space-y-8">
              <div className="relative">
                <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-base">Stage 1: Submission & Automated Classification</h3>
                    <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">Status: Submitted</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Student logs in with roll number, selects category, campus zone (e.g. Block B, 2nd Floor Room 204), urgency level, description, and optionally uploads photo proof.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-base">Stage 2: Administrative Review & Dept Assignment</h3>
                    <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">Status: Pending</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Estate officer / HOD triages incoming tickets. The system routes the ticket to the respective department (e.g. Electrical Dept) and designates a technician (e.g. Plumber/Electrician).
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-base">Stage 3: Ground Execution & Resolver Dispatch</h3>
                    <span className="text-[10px] uppercase font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">Status: In Progress</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Technicians physically inspect the location, replace faulty parts or fix wiring/piping, and submit work completion notes to the supervisor.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-base">Stage 4: Resolution & Student Quality Feedback</h3>
                    <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">Status: Resolved</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Admin marks ticket as Resolved with resolution details. The student receives an automated notification and rates the resolution quality from 1 to 5 stars.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ROLES */}
        {activeTab === 'roles' && (
          <div className="space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Institutional Hierarchy & Access Matrix</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Role-based access control (RBAC) ensures transparency while maintaining administrative authority.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    🎓
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Student Portal</h3>
                    <span className="text-xs text-blue-600 font-semibold">Self-Service Access</span>
                  </div>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    Submit grievances with multimedia evidence & location tags.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    Track live status via unique Complaint ID.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    Submit 1-5 star ratings & post-resolution reviews.
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                    ⚙️
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Estate Admin & HODs</h3>
                    <span className="text-xs text-slate-500 font-semibold">Operational Oversight</span>
                  </div>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    Review, filter, and assign tickets across all departments.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    Assign technicians (plumbers, electricians, carpenters).
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    Update resolution progress and provide student feedback notes.
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold">
                    🏛️
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">College Dean & Additional Director</h3>
                    <span className="text-xs text-blue-700 font-semibold">Executive Level Authority</span>
                  </div>
                </div>
                <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-blue-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    Executive Acknowledgment & priority directives on severe tickets.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    Departmental performance analytics and SLA compliance audit.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    High-level emergency escalation control.
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    🔧
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Campus Resolvers & Technicians</h3>
                    <span className="text-xs text-amber-700 font-semibold">Field Maintenance Staff</span>
                  </div>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    Dedicated technicians for Electrical, IT, Plumbing, and Carpentry.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    Status tracking (Available / On Task / On Leave).
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    Contact directory available for rapid administrative dispatch.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SLA */}
        {activeTab === 'sla' && (
          <div className="space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Service Level Agreement (SLA) & Priority Matrix</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Turnaround expectations based on complaint severity and risk to campus safety or academic continuity.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="p-3.5 font-bold uppercase">Priority Level</th>
                    <th className="p-3.5 font-bold uppercase">Target Response</th>
                    <th className="p-3.5 font-bold uppercase">Resolution Window</th>
                    <th className="p-3.5 font-bold uppercase">Typical Examples</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-red-50/50">
                    <td className="p-3.5 font-bold text-red-600 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span> Emergency
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900">&lt; 30 Minutes</td>
                    <td className="p-3.5 font-bold text-red-700">Within 2 to 4 Hours</td>
                    <td className="p-3.5 text-slate-600">Short circuit, active fire hazard, major pipeline burst, hostel security issue</td>
                  </tr>
                  <tr className="hover:bg-amber-50/50">
                    <td className="p-3.5 font-bold text-amber-600">High Priority</td>
                    <td className="p-3.5 font-semibold text-slate-900">&lt; 2 Hours</td>
                    <td className="p-3.5 font-bold text-amber-700">Within 24 Hours</td>
                    <td className="p-3.5 text-slate-600">Lab projector malfunction before class, Wi-Fi outage across entire block, drinking water RO breakdown</td>
                  </tr>
                  <tr className="hover:bg-blue-50/50">
                    <td className="p-3.5 font-bold text-blue-600">Medium Priority</td>
                    <td className="p-3.5 font-semibold text-slate-900">&lt; 6 Hours</td>
                    <td className="p-3.5 font-bold text-blue-700">Within 48 Hours</td>
                    <td className="p-3.5 text-slate-600">Classroom fan noise, single washroom tap leakage, broken desk or chair in lecture hall</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-600">Low Priority</td>
                    <td className="p-3.5 font-semibold text-slate-900">&lt; 24 Hours</td>
                    <td className="p-3.5 font-bold text-slate-700">Within 72 Hours</td>
                    <td className="p-3.5 text-slate-600">Whiteboard re-coating, minor paint touchups, aesthetic signage adjustment</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: API */}
        {activeTab === 'api' && (
          <div className="space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Backend REST API Specifications</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Core API endpoints powering the SAMS web client and mobile interface.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
                <div className="text-blue-400 font-bold">// 1. Authentication Endpoints</div>
                <div><span className="text-emerald-400 font-bold">POST</span> /api/auth/register <span className="text-slate-400">- Register student with roll number, course, dept</span></div>
                <div><span className="text-emerald-400 font-bold">POST</span> /api/auth/login <span className="text-slate-400">- Authenticate student via roll & password</span></div>
                <div><span className="text-emerald-400 font-bold">POST</span> /api/auth/admin-login <span className="text-slate-400">- Authenticate Admin / Dean / Director</span></div>
              </div>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
                <div className="text-blue-400 font-bold">// 2. Complaints Management Endpoints</div>
                <div><span className="text-blue-400 font-bold">GET</span> /api/complaints <span className="text-slate-400">- Retrieve all complaints or filter by status/dept</span></div>
                <div><span className="text-emerald-400 font-bold">POST</span> /api/complaints <span className="text-slate-400">- Submit new complaint with auto-ID & priority</span></div>
                <div><span className="text-amber-400 font-bold">PUT</span> /api/complaints/:id <span className="text-slate-400">- Update status, assign resolver & admin response</span></div>
                <div><span className="text-amber-400 font-bold">POST</span> /api/complaints/:id/feedback <span className="text-slate-400">- Submit 1-5 star rating & feedback</span></div>
              </div>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
                <div className="text-blue-400 font-bold">// 3. Resolver & Staff Endpoints</div>
                <div><span className="text-blue-400 font-bold">GET</span> /api/resolvers <span className="text-slate-400">- Fetch technician directory & availability</span></div>
                <div><span className="text-emerald-400 font-bold">POST</span> /api/resolvers <span className="text-slate-400">- Register new campus technician</span></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Common queries regarding complaint submission, emergency protocols, and tracking.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  How do I track my complaint without logging in?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  You can click on <strong>Track Status</strong> from the top navigation bar and enter your Complaint ID (e.g. <span className="font-mono font-semibold text-blue-700">SAMS-2026-1001</span>) to view the live timeline and administrative remarks.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  What should I do in case of an immediate physical emergency?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  Select the <strong>Emergency</strong> priority option in the complaint form. This instantly flags the issue in red at the top of the Dean's and Estate Administrator's control center. For life-threatening emergencies, also notify the nearest Block Warden or Security Desk.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  Can multiple students report the same broken facility?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  Yes! The system automatically detects duplicate reports occurring at the same specific campus location within a 24-hour window, boosts the issue's report count counter (e.g. 🔥 3 Reports), and elevates its priority ranking in the admin queue.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
