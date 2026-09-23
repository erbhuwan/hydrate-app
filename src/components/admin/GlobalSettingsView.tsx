import { 
  Sliders, 
  Save, 
  Check, 
  ShieldAlert, 
  Cloud, 
  Zap, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useGlobalSettings } from '../../hooks/useGlobalSettings';

export function GlobalSettingsView() {
  const {
    config,
    isLoading,
    isSaving,
    error,
    saveSuccess,
    toggleFeature,
    updateDefaults,
    save,
    resetToFactoryDefaults,
    refetch,
  } = useGlobalSettings();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-slate-400 animate-in fade-in">
        <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-4" />
        <span className="font-mono text-xs">Querying Firestore collection `config/global_settings`...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Global App Settings</span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-500/30 font-semibold">
              Live Firestore Config
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Control feature toggles, cloud sync defaults, and desktop client flags
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refetch}
            disabled={isLoading || isSaving}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 text-xs font-mono transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={resetToFactoryDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-mono transition-colors cursor-pointer"
          >
            Reset Defaults
          </button>

          <button
            onClick={save}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saveSuccess ? 'Changes Published!' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-3 animate-in fade-in">
          <Check className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>Configuration saved successfully and synced live to Firestore document `config/global_settings`.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Feature Toggles Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">App Features & Remote Toggles</h2>
              <p className="text-xs text-slate-400 font-mono">Real-time feature gating across all connected workstations</p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-500/30">
            {(config.features.enableCloudSync ? 1 : 0) + (config.features.maintenanceMode ? 1 : 0)} Active Flags
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cloud Sync */}
          <div
            onClick={() => toggleFeature('enableCloudSync')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
              config.features.enableCloudSync
                ? 'bg-slate-900/90 border-cyan-500/40 shadow-sm'
                : 'bg-slate-950/60 border-slate-800/80 opacity-75'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 mt-0.5">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>Realtime Cloud Sync</span>
                  {config.features.enableCloudSync && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-semibold">
                      ON
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Enables instant background hydration log synchronization between macOS, Windows, and Web devices.
                </p>
              </div>
            </div>

            <div className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ${config.features.enableCloudSync ? 'bg-cyan-500' : 'bg-slate-800'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${config.features.enableCloudSync ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Maintenance Mode */}
          <div
            onClick={() => toggleFeature('maintenanceMode')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
              config.features.maintenanceMode
                ? 'bg-rose-950/40 border-rose-500/40 shadow-sm'
                : 'bg-slate-950/60 border-slate-800/80 opacity-75'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>System Maintenance Mode</span>
                  {config.features.maintenanceMode && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/40 font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Temporarily displays maintenance downtime notices across all client applications.
                </p>
              </div>
            </div>

            <div className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ${config.features.maintenanceMode ? 'bg-rose-500' : 'bg-slate-800'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${config.features.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Global Defaults Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Default Workstation Parameters</h2>
            <p className="text-xs text-slate-400 font-mono">Syncs to Firestore for initial client onboarding</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="block text-slate-400 mb-1">Default Daily Goal</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={config.defaults.dailyGoalGlasses}
                onChange={(e) =>
                  updateDefaults({ dailyGoalGlasses: parseInt(e.target.value, 10) || 8 })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-400">glasses</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="block text-slate-400 mb-1">Standard Glass Size</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={config.defaults.glassSizeMl}
                onChange={(e) =>
                  updateDefaults({ glassSizeMl: parseInt(e.target.value, 10) || 250 })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-400">ml</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="block text-slate-400 mb-1">Reminder Interval</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={config.defaults.reminderInterval}
                onChange={(e) =>
                  updateDefaults({ reminderInterval: parseInt(e.target.value, 10) || 30 })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-400">mins</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="block text-slate-400 mb-1">Day Reset Rollover</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={config.defaults.dayResetHour}
                onChange={(e) =>
                  updateDefaults({ dayResetHour: parseInt(e.target.value, 10) || 6 })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-400">:00 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
