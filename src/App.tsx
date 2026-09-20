import React, { useState, useEffect } from 'react';
import { User, Complaint, NotificationItem } from './types';
import { apiFetch } from './lib/api';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { StudentDashboard } from './components/StudentDashboard';
import { SubmitComplaintForm } from './components/SubmitComplaintForm';
import { MyComplaints } from './components/MyComplaints';
import { TrackComplaint } from './components/TrackComplaint';
import { StudentProfile } from './components/StudentProfile';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminComplaintsTable } from './components/AdminComplaintsTable';
import { AdminResolversView } from './components/AdminResolversView';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'STUDENT' | 'ADMIN' | null>(null);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch complaints & notifications
  const fetchData = async () => {
    try {
      const compData = await apiFetch('/api/complaints');
      if (Array.isArray(compData)) setComplaints(compData);

      if (user) {
        const notifData = await apiFetch(`/api/notifications?userId=${user.id}`);
        if (Array.isArray(notifData)) setNotifications(notifData);
      }
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleLoginSuccess = (loggedInUser: User, userRole: 'STUDENT' | 'ADMIN') => {
    setUser(loggedInUser);
    setRole(userRole);
    setCurrentView(userRole === 'ADMIN' ? 'admin-dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setRole(null);
    setCurrentView('landing');
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Error marking notification read', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        user={user}
        role={role}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onLogout={handleLogout}
        onNavigate={view => setCurrentView(view)}
        currentView={currentView}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage onNavigate={view => setCurrentView(view)} />
        )}

        {(currentView === 'login' || currentView === 'register') && (
          <LoginModal
            initialTab={currentView === 'register' ? 'student-register' : 'student-login'}
            onLoginSuccess={(u) => handleLoginSuccess(u, 'STUDENT')}
            onBackToLanding={() => setCurrentView('landing')}
            onSwitchToAdmin={() => setCurrentView('admin-login')}
          />
        )}

        {currentView === 'admin-login' && (
          <AdminLoginModal
            onLoginSuccess={(u) => handleLoginSuccess(u, 'ADMIN')}
            onBackToLanding={() => setCurrentView('landing')}
            onSwitchToStudent={() => setCurrentView('login')}
          />
        )}

        {role === 'STUDENT' && user && (
          <>
            {currentView === 'dashboard' && (
              <StudentDashboard user={user} complaints={complaints} onNavigate={view => setCurrentView(view)} />
            )}
            {currentView === 'submit' && (
              <SubmitComplaintForm user={user} onComplaintSubmitted={fetchData} onNavigate={view => setCurrentView(view)} />
            )}
            {currentView === 'my-complaints' && (
              <MyComplaints user={user} complaints={complaints} onRefresh={fetchData} onNavigate={view => setCurrentView(view)} />
            )}
            {currentView === 'track' && (
              <TrackComplaint complaints={complaints} onNavigate={view => setCurrentView(view)} />
            )}
            {currentView === 'profile' && (
              <StudentProfile user={user} onUpdateUser={updated => setUser(updated)} onNavigate={view => setCurrentView(view)} />
            )}
          </>
        )}

        {role === 'ADMIN' && user && (
          <>
            {currentView === 'admin-dashboard' && (
              <AdminDashboard complaints={complaints} onNavigate={view => setCurrentView(view)} />
            )}
            {currentView === 'admin-complaints' && (
              <AdminComplaintsTable complaints={complaints} onRefresh={fetchData} onNavigate={view => setCurrentView(view)} />
            )}
            {currentView === 'admin-resolvers' && (
              <AdminResolversView onNavigate={view => setCurrentView(view)} />
            )}
          </>
        )}


      </main>
    </div>
  );
}
