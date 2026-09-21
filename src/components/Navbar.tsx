import React, { useState } from 'react';
import { User, NotificationItem } from '../types';
import { ShieldAlert, Bell, LogOut, User as UserIcon, Menu, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  role: 'STUDENT' | 'ADMIN' | null;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export function Navbar({
  user,
  role,
  notifications,
  onMarkNotificationRead,
  onLogout,
  onNavigate,
  currentView
}: NavbarProps) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate(role ? 'dashboard' : 'landing')}>
            <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-xl flex items-center justify-center shadow">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-wide flex items-center gap-2">
                <span>SAMS</span>
                <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30 font-normal">Ambalika Institute</span>
              </div>
              <div className="text-xs text-slate-400 hidden sm:block">Smart Ambalika Management System</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {role === 'STUDENT' && (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`text-sm font-medium transition hover:text-blue-400 ${currentView === 'dashboard' ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-slate-300'}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onNavigate('submit')}
                  className={`text-sm font-medium transition hover:text-blue-400 ${currentView === 'submit' ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-slate-300'}`}
                >
                  Submit Complaint
                </button>
                <button
                  onClick={() => onNavigate('my-complaints')}
                  className={`text-sm font-medium transition hover:text-blue-400 ${currentView === 'my-complaints' ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-slate-300'}`}
                >
                  My Complaints
                </button>
                <button
                  onClick={() => onNavigate('track')}
                  className={`text-sm font-medium transition hover:text-blue-400 ${currentView === 'track' ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-slate-300'}`}
                >
                  Track Status
                </button>
                <button
                  onClick={() => onNavigate('profile')}
                  className={`text-sm font-medium transition hover:text-blue-400 ${currentView === 'profile' ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-slate-300'}`}
                >
                  Profile
                </button>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className={`text-sm font-medium transition hover:text-blue-400 ${currentView === 'admin-dashboard' ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-slate-300'}`}
                >
                  Admin Dashboard
                </button>
                <button
                  onClick={() => onNavigate('admin-complaints')}
                  className={`text-sm font-medium transition hover:text-blue-400 ${currentView === 'admin-complaints' ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-slate-300'}`}
                >
                  Manage Complaints
                </button>
                <button
                  onClick={() => onNavigate('admin-resolvers')}
                  className={`text-sm font-medium transition hover:text-blue-400 ${currentView === 'admin-resolvers' ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-slate-300'}`}
                >
                  Technicians Staff
                </button>
              </>
            )}

            <button
              onClick={() => onNavigate('documentation')}
              className={`text-sm font-medium transition hover:text-blue-400 ${currentView === 'documentation' ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-slate-300'}`}
            >
              Documentation
            </button>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center space-x-4">
            {role && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="p-2 text-slate-300 hover:text-white relative transition rounded-full hover:bg-slate-800"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-semibold text-sm text-slate-900">Notifications</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full">
                        {unreadCount} unread
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-slate-500 text-sm">No notifications yet</div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => onMarkNotificationRead(n.id)}
                            className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition ${!n.read ? 'bg-blue-50/60 font-medium' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-slate-900">{n.title}</span>
                              <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-slate-600">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="hidden sm:flex items-center space-x-3 border-l border-slate-700 pl-4">
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{user.fullName || user.name}</div>
                  <div className="text-xs text-blue-400 uppercase tracking-wider font-semibold">{role}</div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-blue-400 transition rounded-lg hover:bg-slate-800"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow"
                >
                  Student Portal
                </button>
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  Admin Login
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 pt-2 pb-4 space-y-2">
          {role === 'STUDENT' && (
            <>
              <button onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded hover:bg-slate-700 text-sm">Dashboard</button>
              <button onClick={() => { onNavigate('submit'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded hover:bg-slate-700 text-sm">Submit Complaint</button>
              <button onClick={() => { onNavigate('my-complaints'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded hover:bg-slate-700 text-sm">My Complaints</button>
              <button onClick={() => { onNavigate('track'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded hover:bg-slate-700 text-sm">Track Status</button>
              <button onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded hover:bg-slate-700 text-sm">Profile</button>
            </>
          )}
          {role === 'ADMIN' && (
            <>
              <button onClick={() => { onNavigate('admin-dashboard'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded hover:bg-slate-700 text-sm">Admin Dashboard</button>
              <button onClick={() => { onNavigate('admin-complaints'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded hover:bg-slate-700 text-sm">Manage Complaints</button>
              <button onClick={() => { onNavigate('admin-resolvers'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded hover:bg-slate-700 text-sm">Technicians Staff</button>
            </>
          )}

          <button onClick={() => { onNavigate('documentation'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded hover:bg-slate-700 text-sm">Documentation</button>

          {user && (
            <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded hover:bg-red-900/30 text-red-400 text-sm font-semibold">Logout ({user.fullName || user.name})</button>
          )}
        </div>
      )}
    </header>
  );
}
