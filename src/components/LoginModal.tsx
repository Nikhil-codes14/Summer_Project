import React, { useState } from 'react';
import { ShieldAlert, User, Lock, Mail, BookOpen, Building, Hash, Calendar, ArrowLeft } from 'lucide-react';

interface LoginModalProps {
  initialTab?: 'student-login' | 'student-register';
  onLoginSuccess: (user: any, role: 'STUDENT') => void;
  onBackToLanding: () => void;
  onSwitchToAdmin: () => void;
}

export function LoginModal({ initialTab = 'student-login', onLoginSuccess, onBackToLanding, onSwitchToAdmin }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'student-login' | 'student-register'>(initialTab);

  // Student Login State
  const [loginEmail, setLoginEmail] = useState('rahul.sharma@ambalika.ac.in');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Student Registration State
  const [regFullName, setRegFullName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCourse, setRegCourse] = useState('BCA');
  const [regDepartment, setRegDepartment] = useState('Computer Applications');
  const [regYear, setRegYear] = useState('2nd Year');
  const [regSemester, setRegSemester] = useState('4th Semester');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      onLoginSuccess(data.user, 'STUDENT');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName,
          studentId: regStudentId,
          email: regEmail,
          password: regPassword,
          course: regCourse,
          department: regDepartment,
          year: regYear,
          semester: regSemester
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      onLoginSuccess(data.user, 'STUDENT');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-red-600 text-white p-3 rounded-2xl shadow-md">
            <ShieldAlert className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-slate-900">
          Smart Ambalika Management System
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Student Portal • Ambalika Institute
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200">
          <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
            <button
              onClick={onBackToLanding}
              className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </button>
            <div className="flex items-center gap-3">
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => { setActiveTab('student-login'); setError(''); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'student-login' ? 'bg-red-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Student Login
                </button>
                <button
                  onClick={() => { setActiveTab('student-register'); setError(''); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'student-register' ? 'bg-red-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Register
                </button>
              </div>
              <button
                onClick={onSwitchToAdmin}
                className="text-xs text-slate-500 hover:text-slate-900 font-semibold underline"
              >
                Admin Portal →
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Student Login Form */}
          {activeTab === 'student-login' && (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="rahul.sharma@ambalika.ac.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-800 space-y-1">
                <p className="font-semibold">Demo Student Credentials:</p>
                <p>Email: <code className="bg-white px-1.5 py-0.5 rounded font-mono">rahul.sharma@ambalika.ac.in</code></p>
                <p>Password: <code className="bg-white px-1.5 py-0.5 rounded font-mono">password123</code></p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow transition text-sm"
              >
                {loading ? 'Logging in...' : 'Student Login'}
              </button>
            </form>
          )}

          {/* Student Registration Form */}
          {activeTab === 'student-register' && (
            <form onSubmit={handleStudentRegister} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={e => setRegFullName(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="Aman Singh"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Student ID / Roll No.</label>
                  <input
                    type="text"
                    required
                    value={regStudentId}
                    onChange={e => setRegStudentId(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="SAMS2026005"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="student@ambalika.ac.in"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Course</label>
                  <input
                    type="text"
                    required
                    value={regCourse}
                    onChange={e => setRegCourse(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={regDepartment}
                    onChange={e => setRegDepartment(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Year</label>
                  <select
                    value={regYear}
                    onChange={e => setRegYear(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Semester</label>
                  <select
                    value={regSemester}
                    onChange={e => setRegSemester(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow transition text-sm"
              >
                {loading ? 'Registering...' : 'Register Student Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
