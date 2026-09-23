import { useState } from 'react';
import { 
  ArrowLeft, 
  Crown, 
  Monitor, 
  Sliders, 
  Droplets, 
  AlertTriangle, 
  Clock, 
  Check, 
  Copy, 
  Save, 
  ShieldCheck, 
  Calendar, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  Globe
} from 'lucide-react';
import { AppleIcon, WindowsIcon } from '../Icons';
import { useUserDetails } from '../../hooks/useUserDetails';
import { 
  isUserPro, 
  calculateSedentaryRisk, 
  calculateWaterPerSittingHour, 
  extractDaySittingMinutes,
  getTodayKey 
} from '../../firebase';

interface UserDetailViewProps {
  userId: string;
  onBack: () => void;
}

export function UserDetailView({ userId, onBack }: UserDetailViewProps) {
  const {
    user,
    settings,
    devices,
    days,
    isLoading,
    error,
    isMutating,
    refetch,
    saveSettings,
    removeDevice,
  } = useUserDetails(userId);

  const [copiedUid, setCopiedUid] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  // Form states for settings
  const [goalGlasses, setGoalGlasses] = useState(8);
  const [glassSize, setGlassSize] = useState(250);
  const [resetHour, setResetHour] = useState(6);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Sync settings when loaded
  if (settings && !settingsLoaded) {
    setGoalGlasses(settings.dailyGoalGlasses || 8);
    setGlassSize(settings.glassSizeMl || 250);
    setResetHour(settings.dayResetHour || 6);
    setSettingsLoaded(true);
  }

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleCopyUid = () => {
    navigator.clipboard.writeText(userId);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const onSavePreferencesClick = async () => {
    const res = await saveSettings({
      dailyGoalGlasses: goalGlasses,
      glassSizeMl: glassSize,
      dayResetHour: resetHour,
    });
    if (res.success) {
      showToast('Hydration targets updated & saved to Firestore!');
    } else {
      showToast(res.error || 'Failed to save targets', 'error');
    }
  };

  const onRemoveDeviceClick = async (deviceId: string, deviceName: string) => {
    if (confirm(`Remove registered device "${deviceName}"?`)) {
      const res = await removeDevice(deviceId);
      if (res.success) {
        showToast(`Device "${deviceName}" removed.`);
      } else {
        showToast(res.error || 'Failed to remove device', 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-slate-400 animate-in fade-in">
        <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-4" />
        <span className="font-mono text-xs">Fetching live user profile, subscription & devices...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-20 glass-panel rounded-3xl border border-slate-800 p-8">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-white mb-2">User Not Found</h2>
        <p className="text-slate-400 text-xs font-mono max-w-md mx-auto mb-6">{error || 'No Firestore document found for this user.'}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={refetch}
            className="px-4 py-2 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-mono"
          >
            Retry Query
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-900 text-slate-300 rounded-xl text-xs font-mono"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const activeResetHour = settings?.dayResetHour ?? resetHour ?? 6;
  const todayKey = getTodayKey(new Date(), activeResetHour);
  const todayRecord = days.find((d) => d.date === todayKey) || days[0];
  const userIsProMember = isUserPro(user);
  const sub = user.subscription;

  // Ergonomics & calculations from real records with full fallback hierarchy
  const totalGlassesToday = todayRecord?.glasses || 0;
  const totalMlToday = todayRecord?.milliliters || (totalGlassesToday * (settings?.glassSizeMl || 250));
  const { sittingMinutes: sittingMinsToday, idleMinutes: idleMinsToday } = extractDaySittingMinutes(todayRecord, devices);
  const lastDrinkTime = todayRecord?.timestamps?.length ? todayRecord.timestamps[todayRecord.timestamps.length - 1] : undefined;

  const sedentaryInfo = calculateSedentaryRisk(sittingMinsToday, lastDrinkTime);
  const waterPerHour = calculateWaterPerSittingHour(totalMlToday, sittingMinsToday);
  const goalPercentage = Math.min(200, Math.round((totalGlassesToday / (goalGlasses || 8)) * 100));

  const hasPhoto = user.photoURL && !imageFailed;

  const formatTimestamp = (ts?: number | null) => {
    if (!ts) return 'N/A';
    return new Date(ts).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (timestampMs?: number | null) => {
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
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Back Button & Feedback Toast */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users Directory</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={refetch}
            disabled={isLoading || isMutating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 text-xs font-mono transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Live</span>
          </button>

          {feedbackMsg && (
            <div
              className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 border animate-in fade-in ${
                feedbackMsg.type === 'error'
                  ? 'bg-rose-950/90 border-rose-500/40 text-rose-300'
                  : 'bg-cyan-950/90 border-cyan-500/40 text-cyan-300'
              }`}
            >
              {feedbackMsg.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              ) : (
                <Check className="w-4 h-4 text-cyan-400" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* User Header Profile Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Avatar & Identifiers with Real Photo */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              {hasPhoto ? (
                <img
                  src={user.photoURL!}
                  alt={user.displayName || 'User Profile'}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={() => setImageFailed(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/10"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center font-extrabold text-white text-2xl shadow-xl shadow-cyan-500/10">
                  {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                </div>
              )}
              {userIsProMember && (
                <div
                  title="Active Pro Subscriber"
                  className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-md"
                >
                  <Crown className="w-4 h-4" />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {user.displayName || 'Unnamed User'}
                </h1>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
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

                {userIsProMember ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>PRO • {sub?.plan || 'Active'}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono uppercase">
                    Free Tier
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 font-mono mt-1">
                {user.email || 'No email registered'}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <code className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                  {user.uid}
                </code>
                <button
                  onClick={handleCopyUid}
                  className="text-slate-500 hover:text-cyan-400 transition-colors p-1 cursor-pointer"
                  title="Copy UID"
                >
                  {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Realtime Metadata Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-500">Last Synced / Heartbeat</span>
              <span className="text-slate-200 font-bold mt-0.5">
                {getRelativeTime(user.lastActiveAt || user.lastSyncedAt)}
              </span>
              <span className="text-[10px] text-slate-500">
                {formatTimestamp(user.lastActiveAt || user.lastSyncedAt)}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-500">Attached Devices</span>
              <span className="text-cyan-300 font-bold mt-0.5">
                {devices.length} {devices.length === 1 ? 'Client' : 'Clients'}
              </span>
              <span className="text-[10px] text-slate-500">
                {devices.filter(d => Date.now() - (d.lastActiveAt || 0) < 15 * 60000).length} Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns (Hydration Targets / Read-Only Subscription Viewer) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Settings & Hydration Goals */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Hydration Preferences</h3>
              </div>
              <span className="text-[10px] font-mono uppercase text-slate-500">
                settings/preferences
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">
                  Daily Goal: <span className="text-cyan-300 font-bold">{goalGlasses} Glasses</span> ({goalGlasses * glassSize} ml)
                </label>
                <input
                  type="range"
                  min="4"
                  max="16"
                  value={goalGlasses}
                  onChange={(e) => setGoalGlasses(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Glass Size (ml)</label>
                  <input
                    type="number"
                    value={glassSize}
                    onChange={(e) => setGlassSize(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Day Reset Rollover</label>
                  <select
                    value={resetHour}
                    onChange={(e) => setResetHour(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value={4}>4:00 AM Reset</option>
                    <option value={5}>5:00 AM Reset</option>
                    <option value={6}>6:00 AM Reset (Standard)</option>
                    <option value={7}>7:00 AM Reset</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Onboarding: <span className="text-emerald-400">{settings?.hasCompletedOnboarding ? 'Completed' : 'Pending'}</span>
            </span>

            <button
              onClick={onSavePreferencesClick}
              disabled={isMutating}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isMutating ? 'Saving...' : 'Save Targets'}</span>
            </button>
          </div>
        </div>

        {/* Read-Only Subscription Viewer (Exact Schema) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Subscription & Licensing</h3>
                  <span className="text-[10px] font-mono text-slate-500">Live Customer Record (Read-Only)</span>
                </div>
              </div>

              {userIsProMember ? (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                  PRO Active
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono uppercase">
                  Free
                </span>
              )}
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Plan:</span>
                <span className="text-cyan-300 font-bold uppercase">
                  {sub?.plan || (userIsProMember ? 'PRO' : 'None')}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={`font-bold uppercase ${userIsProMember ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {sub?.status || (userIsProMember ? 'active' : 'inactive')}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Stripe Customer ID:</span>
                <span className="text-slate-300 font-mono truncate max-w-[180px]">
                  {sub?.stripeCustomerId || '—'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Current Period End / Renewal:</span>
                <span className="text-slate-300 font-mono">
                  {sub?.currentPeriodEnd ? formatTimestamp(sub.currentPeriodEnd) : (userIsProMember ? 'Lifetime / Bypass' : '—')}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Unlocked At:</span>
                <span className="text-slate-300 font-mono">
                  {sub?.unlockedAt ? formatTimestamp(sub.unlockedAt) : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Schema: v{user.schemaVersion || 2}</span>
            <span className="text-cyan-400">✓ Verified Direct Firestore</span>
          </div>
        </div>
      </div>

      {/* Connected Workstation Devices */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Registered Workstation Devices</h3>
              <p className="text-xs text-slate-400 font-mono">Live registered client devices from Firestore subcollection</p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-500/30">
            {devices.length} {devices.length === 1 ? 'Device' : 'Devices'}
          </span>
        </div>

        {devices.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono bg-slate-950/40 rounded-2xl border border-slate-800">
            No registered workstation clients detected for this account.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map((device) => {
              const isOnline = Date.now() - (device.lastActiveAt || 0) < 15 * 60000;
              const devActivity = todayRecord?.deviceActivity?.[device.deviceId];
              const devSitting = Math.round(devActivity?.sittingMinutes ?? device.sittingMinutes ?? 0);
              const devIdle = Math.round(devActivity?.idleMinutes ?? device.idleMinutes ?? 0);

              return (
                <div
                  key={device.deviceId}
                  className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800/80 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                          {device.platform === 'macos' ? (
                            <AppleIcon className="w-4 h-4 fill-current text-sky-400" />
                          ) : device.platform === 'windows' ? (
                            <WindowsIcon className="w-4 h-4 fill-current text-cyan-400" />
                          ) : (
                            <Globe className="w-4 h-4 text-purple-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">{device.deviceName || device.deviceId}</div>
                          <div className="text-[10px] font-mono text-slate-500 truncate max-w-[180px]">{device.deviceId}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                          <span className={`text-[10px] font-mono ${isOnline ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                            {isOnline ? 'Online' : getRelativeTime(device.lastActiveAt)}
                          </span>
                        </div>

                        <button
                          onClick={() => onRemoveDeviceClick(device.deviceId, device.deviceName || device.deviceId)}
                          title="Remove Device from Firestore"
                          className="p-1 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/60 p-3 rounded-xl mb-3">
                      <div>OS: <span className="text-slate-200">{device.osVersion || (device.platform === 'macos' ? 'macOS' : 'Windows')}</span></div>
                      <div>App: <span className="text-cyan-300">{device.appVersion ? `v${device.appVersion}` : 'Desktop Client'}</span></div>
                      <div>Alert Style: <span className="text-slate-200 capitalize">{device.deviceSettings?.alertStyle || 'Island'}</span></div>
                      <div>Interval: <span className="text-slate-200">{device.deviceSettings?.reminderInterval || 30}m</span></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/60">
                    <span>Sitting: <span className="text-sky-300 font-bold">{devSitting}m</span></span>
                    <span>Idle: <span className="text-purple-300 font-bold">{devIdle}m</span></span>
                    <span>WorkMode: <span className="text-slate-300">{device.deviceSettings?.workMode ? 'Enabled' : 'Disabled'}</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Daily Hydration Records & Sitting Posture */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Daily Hydration & Ergonomics Records</h3>
              <p className="text-xs text-slate-400 font-mono">Firestore Subcollection: users/{user.uid}/days</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">Active Date: {todayRecord?.date || todayKey}</span>
        </div>

        {/* Sedentary Warning Banner */}
        {sedentaryInfo.isSedentaryWarning && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-start gap-3 text-amber-200 text-xs font-mono animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-300 uppercase tracking-wider">Sedentary Risk Alert</div>
              <p className="text-amber-200/90 mt-0.5">{sedentaryInfo.message}</p>
            </div>
          </div>
        )}

        {/* Today's Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-500">Consumed Today</span>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">
              {totalGlassesToday} / {goalGlasses} <span className="text-xs text-cyan-400 font-normal">glasses</span>
            </div>
            <div className="text-[11px] text-cyan-400 font-mono mt-1">
              {totalMlToday} ml ({goalPercentage}% goal)
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-500">Sitting Duration</span>
            <div className="text-xl sm:text-2xl font-extrabold text-sky-400 font-mono mt-1">
              {Math.floor(sittingMinsToday / 60)}h {sittingMinsToday % 60}m
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Desk activity logged
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-500">Water / Sitting Hour</span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              {waterPerHour} <span className="text-xs text-slate-400 font-normal">ml/hr</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">
              Target: ~250-300 ml/hr
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-500">Idle / Away Duration</span>
            <div className="text-xl sm:text-2xl font-extrabold text-purple-400 font-mono mt-1">
              {idleMinsToday} <span className="text-xs text-slate-400 font-normal">mins</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Computer away time
            </div>
          </div>
        </div>

        {/* 14-Day History Visual Trend */}
        <div className="mb-8">
          <h4 className="text-xs font-mono uppercase text-slate-400 mb-3 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hydration History Trend ({days.length} Recorded Sessions)</span>
          </h4>

          {days.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs font-mono bg-slate-950/40 rounded-2xl border border-slate-800">
              No daily activity records logged in `days` subcollection yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {days.slice(0, 14).map((day) => {
                const dayPct = Math.min(100, Math.round((day.glasses / (goalGlasses || 8)) * 100));
                const isToday = day.date === todayKey;

                return (
                  <div
                    key={day.date}
                    className={`p-3 rounded-xl border flex flex-col justify-between text-xs font-mono ${
                      isToday
                        ? 'bg-cyan-950/40 border-cyan-500/40 shadow-sm'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                      <span>{day.date.slice(5)}</span>
                      {isToday && <span className="text-cyan-400 font-bold">Today</span>}
                    </div>

                    <div className="my-1.5">
                      <div className="text-sm font-bold text-white">{day.glasses} glasses</div>
                      <div className="text-[10px] text-slate-500">{day.milliliters || day.glasses * glassSize} ml</div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${dayPct >= 100 ? 'bg-emerald-400' : 'bg-cyan-400'}`}
                        style={{ width: `${dayPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Granular Drink Logs (Snapshots) */}
        {todayRecord?.drinks && todayRecord.drinks.length > 0 && (
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Granular Drink Logs Today</span>
            </h4>

            <div className="space-y-2">
              {todayRecord.drinks.map((drink) => (
                <div
                  key={drink.id}
                  className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                      💧
                    </div>
                    <div>
                      <span className="font-bold text-white">+{drink.amountMl} ml</span>
                      <span className="text-slate-500 ml-2">({drink.deviceName || 'Workstation'})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    {drink.state && (
                      <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {drink.state.percentCompleted}% target • {Math.round(drink.state.sittingMinutes)}m sitting
                      </span>
                    )}
                    <span className="text-cyan-300">
                      {new Date(drink.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
