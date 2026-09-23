import { useState } from 'react';
import { 
  Users, 
  Search, 
  Crown, 
  RefreshCw, 
  ExternalLink, 
  Activity,
  Check,
  Copy,
  AlertCircle,
  Globe
} from 'lucide-react';
import { AppleIcon, WindowsIcon } from '../Icons';
import { UserDocument } from '../../types/admin';
import { isUserPro } from '../../firebase';

interface UsersListProps {
  users: UserDocument[];
  filteredUsers: UserDocument[];
  stats: {
    total: number;
    proCount: number;
    macCount: number;
    winCount: number;
    webCount: number;
    activeToday: number;
    conversionRate: number;
  };
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  platformFilter: 'all' | 'macos' | 'windows' | 'web' | 'linux';
  setPlatformFilter: (platform: 'all' | 'macos' | 'windows' | 'web' | 'linux') => void;
  proFilter: 'all' | 'pro' | 'free';
  setProFilter: (pro: 'all' | 'pro' | 'free') => void;
  onSelectUser: (userId: string) => void;
  onRefresh: () => void;
}

export function UsersList({
  filteredUsers,
  stats,
  isLoading,
  error,
  searchTerm,
  setSearchTerm,
  platformFilter,
  setPlatformFilter,
  proFilter,
  setProFilter,
  onSelectUser,
  onRefresh,
}: UsersListProps) {
  const [copiedUid, setCopiedUid] = useState<string | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const handleCopyUid = (uid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  const getRelativeTime = (timestampMs?: number) => {
    if (!timestampMs) return 'Never';
    const now = Date.now();
    const diffSec = Math.floor((now - timestampMs) / 1000);
    if (diffSec < 0 || diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDays = Math.floor(diffHour / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Sync */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Users Directory</span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 font-semibold">
              {stats.total} Live in Firestore
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Realtime user profiles, subscriptions, and active workstations
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/90 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Querying Firestore...' : 'Sync Firestore'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Database Error:</span> {error}
          </div>
          <button
            onClick={onRefresh}
            className="text-xs font-semibold text-rose-300 underline hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Registered</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {stats.total}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">✓ Realtime Firestore</span>
          </div>
        </div>

        {/* Pro Subscribers */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-amber-950/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Pro Subscribers</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {stats.proCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-mono">
            {stats.conversionRate}% Conversion Rate
          </div>
        </div>

        {/* Active Today */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Active Today</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {stats.activeToday}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Online in past 24h
          </div>
        </div>

        {/* Platforms Distribution */}
        <div className="glass-panel p-5 rounded-2xl border border-sky-500/20 bg-sky-950/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Platforms</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <AppleIcon className="w-3.5 h-3.5 fill-current" />
              <span>/</span>
              <WindowsIcon className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
          <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-mono">
            <span className="text-sky-300">{stats.macCount} Mac</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-300">{stats.winCount} Win</span>
            {stats.webCount > 0 && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">{stats.webCount} Web</span>
              </>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Client app distribution
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or UID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Platform filter */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                platformFilter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setPlatformFilter('macos')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                platformFilter === 'macos' ? 'bg-slate-800 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <AppleIcon className="w-3 h-3 fill-current" />
              <span>macOS</span>
            </button>
            <button
              onClick={() => setPlatformFilter('windows')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                platformFilter === 'windows' ? 'bg-slate-800 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <WindowsIcon className="w-3 h-3 fill-current" />
              <span>Windows</span>
            </button>
            <button
              onClick={() => setPlatformFilter('web')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                platformFilter === 'web' ? 'bg-slate-800 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Web</span>
            </button>
          </div>

          {/* Pro tier filter */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setProFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                proFilter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Tiers
            </button>
            <button
              onClick={() => setProFilter('pro')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                proFilter === 'pro' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Pro Only</span>
            </button>
            <button
              onClick={() => setProFilter('free')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                proFilter === 'free' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Free Tier
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4">User</th>
                <th scope="col" className="px-6 py-4">Platform</th>
                <th scope="col" className="px-6 py-4">Subscription</th>
                <th scope="col" className="px-6 py-4">Last Heartbeat</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-mono">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                      <span>Reading live Firestore collection `users`...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500 font-mono">
                    {searchTerm || platformFilter !== 'all' || proFilter !== 'all'
                      ? 'No users matching your active filters.'
                      : 'No users found in Firestore `users` collection.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const userIsProMember = isUserPro(user);
                  const isOnline = Date.now() - (user.lastActiveAt || 0) < 15 * 60000;
                  const hasImage = user.photoURL && !imageErrorMap[user.uid];

                  return (
                    <tr
                      key={user.uid}
                      onClick={() => onSelectUser(user.uid)}
                      className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                    >
                      {/* User Info with Real Photo */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative shrink-0">
                            {hasImage ? (
                              <img
                                src={user.photoURL!}
                                alt={user.displayName || 'User Avatar'}
                                referrerPolicy="no-referrer"
                                crossOrigin="anonymous"
                                onError={() =>
                                  setImageErrorMap((prev) => ({ ...prev, [user.uid]: true }))
                                }
                                className="w-10 h-10 rounded-full object-cover border border-cyan-500/30 shadow-sm"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm shadow-sm">
                                {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                              </div>
                            )}
                            {isOnline && (
                              <span
                                title="Active Heartbeat"
                                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse"
                              />
                            )}
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                              {user.displayName || 'Unnamed Hydrate User'}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono truncate">
                              {user.email || 'No email registered'}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-mono text-slate-500 truncate max-w-[140px]">
                                {user.uid}
                              </span>
                              <button
                                onClick={(e) => handleCopyUid(user.uid, e)}
                                title="Copy UID"
                                className="text-slate-500 hover:text-cyan-400 transition-colors p-0.5"
                              >
                                {copiedUid === user.uid ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Platform */}
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                          {user.primaryPlatform === 'macos' ? (
                            <>
                              <AppleIcon className="w-3.5 h-3.5 fill-current text-sky-400" />
                              <span>macOS</span>
                            </>
                          ) : user.primaryPlatform === 'windows' ? (
                            <>
                              <WindowsIcon className="w-3.5 h-3.5 fill-current text-cyan-400" />
                              <span>Windows</span>
                            </>
                          ) : (
                            <>
                              <Globe className="w-3.5 h-3.5 text-slate-400" />
                              <span className="capitalize">{user.primaryPlatform || 'Web'}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Subscription */}
                      <td className="px-6 py-4">
                        {userIsProMember ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/30 text-amber-300 font-medium">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            <span className="uppercase text-[10px] font-mono tracking-wider font-bold">
                              PRO • {user.subscription?.plan || 'Active'}
                            </span>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono uppercase">
                            Free Tier
                          </span>
                        )}
                      </td>

                      {/* Last Heartbeat */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col font-mono text-xs">
                          <span className="text-slate-200">
                            {getRelativeTime(user.lastActiveAt)}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {user.lastActiveAt
                              ? new Date(user.lastActiveAt).toLocaleString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectUser(user.uid);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/30 text-xs font-medium transition-all cursor-pointer shadow-sm"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
