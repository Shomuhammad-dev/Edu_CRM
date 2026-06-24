import { useState, useMemo } from 'react';
import TopNav from './components/TopNav';
import SecondaryNav from './components/SecondaryNav';
import StatsGrid from './components/StatsGrid';
import Timetable from './components/Timetable';
import LeadsPage from './pages/LeadsPage';
import MentorsPage from './pages/MentorsPage';
import GroupsPage from './pages/GroupsPage';
import StudentsPage from './pages/StudentsPage';
import TeacherDashboard from './pages/TeacherDashboard';
import SmsSettingsPage from './pages/settings/SmsSettingsPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const isSettingsRestricted = useMemo(() => {
    return user?.role === 'teacher' && (activeTab.startsWith('settings') || activeTab === 'students');
  }, [user, activeTab]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // If a teacher tries to access a restricted tab, reset to dashboard
  if (isSettingsRestricted) {
    setTimeout(() => setActiveTab('dashboard'), 0);
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <TopNav isMobileMenuOpen={isMobileMenuOpen} onMobileMenuToggle={setIsMobileMenuOpen} />
      <SecondaryNav activeTab={activeTab} onTabChange={setActiveTab} isMobileMenuOpen={isMobileMenuOpen} onMobileMenuToggle={setIsMobileMenuOpen} />
      
      <main className="flex-1 flex flex-col overflow-y-auto px-2 sm:px-4 lg:px-6 py-4">
        {activeTab === 'dashboard' ? (
          user?.role === 'teacher' ? (
            <TeacherDashboard />
          ) : (
            <div className="flex flex-col gap-4 sm:gap-6">
              <StatsGrid />
              <div className="flex-1 relative overflow-hidden hidden sm:block">
                <Timetable />
              </div>
              <div className="sm:hidden p-4 bg-white rounded-xl border border-slate-200 text-center">
                <p className="text-slate-600">Jadval mobil qurilmalarda mavjud emas. Katta ekran ishlatishni tavsiya qilamiz.</p>
              </div>
            </div>
          )
        ) : activeTab === 'leads' ? (
          <LeadsPage />
        ) : activeTab === 'teachers' ? (
          <MentorsPage />
        ) : activeTab === 'groups' ? (
          <GroupsPage />
        ) : activeTab === 'students' ? (
          <StudentsPage />
        ) : activeTab === 'settings-sms' ? (
          <SmsSettingsPage />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} sahifasi hali tayyor emas.
          </div>
        )}
      </main>

      <footer className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[10px] font-medium border-t border-slate-200 bg-white shrink-0 gap-3">
        <div>© 2024 Alouddin CRM. Barcha huquqlar himoyalangan.</div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hover:text-indigo-500 underline decoration-slate-200 underline-offset-4 font-bold uppercase tracking-widest text-[9px]">Maxfiylik siyosati</button>
          <button className="hover:text-indigo-500 underline decoration-slate-200 underline-offset-4 font-bold uppercase tracking-widest text-[9px]">Yordam markazi</button>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

