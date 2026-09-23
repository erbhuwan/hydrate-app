import { useState, useEffect } from 'react';
import { 
  Users, 
  Sliders, 
  Globe, 
  LogOut, 
  Database, 
  Menu, 
  X,
  Droplet,
  ChevronRight
} from 'lucide-react';
import { adminAuthService, AdminUser } from '../../services/adminAuth';
import { getServiceAccount } from '../../firebase';

export type AdminTab = 'users' | 'user-detail' | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onNavigateHome: () => void;
  onLogout: () => void;
  children: React.ReactNode;
  userCount?: number;
}

export function AdminLayout({
  currentTab,
  onSelectTab,
  onNavigateHome,
  onLogout,
  children,
  userCount = 0,
}: AdminLayoutProps) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const creds = getServiceAccount();

  useEffect(() => {
    setAdminUser(adminAuthService.getCurrentAdmin());
  }, []);

  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'users':
        return 'Users Management';
      case 'user-detail':
        return 'User Analytics & Profile';
      case 'settings':
        return 'Global App Settings & Feature Toggles';
      default:
        return 'Overview';
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col md:flex-row selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Mobile top header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white">
            <Droplet className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">Hydrate Admin</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-950/90 border-r border-slate-800/80 p-5 flex flex-col justify-between z-40 transition-transform duration-200 backdrop-blur-xl shrink-0`}
      >
        <div className="flex flex-col gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                Hydrate <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold">Admin</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">Control Center</div>
            </div>
          </div>

          {/* Connected Firestore status */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">Database</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-400 font-medium">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-200 font-mono font-medium truncate">
              <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{creds?.project_id || 'hydrate-6c9b6'}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => {
                onSelectTab('users');
                setMobileNavOpen(false);
              }}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'users' || currentTab === 'user-detail'
                  ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Users</span>
              </div>
              {userCount > 0 && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-cyan-400 border border-slate-700">
                  {userCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                onSelectTab('settings');
                setMobileNavOpen(false);
              }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'settings'
                  ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Global Settings</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all cursor-pointer mt-2"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span>Landing Page</span>
            </button>
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-sky-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              {adminUser?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">
                {adminUser?.email || 'Administrator'}
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Super Admin</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="px-6 py-4 bg-slate-950/60 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-semibold">{getBreadcrumbTitle()}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Service Account Active</span>
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
