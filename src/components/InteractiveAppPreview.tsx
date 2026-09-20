import { useState } from 'react';
import { 
  BarChart2, 
  Settings, 
  X, 
  Pause, 
  Play, 
  Bell, 
  RotateCcw,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InteractiveAppPreview() {
  const [glassesCount, setGlassesCount] = useState(1);
  const totalGlasses = 8;
  const glassVolume = 0.25; // 0.25 L = 250ml
  const [isPaused, setIsPaused] = useState(false);
  const [showLogPing, setShowLogPing] = useState(false);
  const [activeSnooze, setActiveSnooze] = useState<number | null>(null);

  const currentLiters = (glassesCount * glassVolume).toFixed(2);
  const percentage = Math.min(100, Math.round((glassesCount / totalGlasses) * 100));

  const handleDrinkWater = () => {
    setGlassesCount((prev) => (prev < totalGlasses ? prev + 1 : 1));
    setShowLogPing(true);
    setTimeout(() => setShowLogPing(false), 900);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGlassesCount(1);
  };

  const handleSnooze = (minutes: number) => {
    setActiveSnooze(minutes);
    setTimeout(() => setActiveSnooze(null), 2500);
  };

  // SVG circular ring calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none">
      {/* Background radial aura */}
      <div className="absolute -top-12 -left-12 w-72 h-72 bg-sky-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Real App Window Frame */}
      <div className="w-full bg-[#0d1424] rounded-3xl p-5 shadow-2xl border border-white/10 relative overflow-hidden backdrop-blur-xl">
        {/* Top Window Bar */}
        <div className="flex items-center justify-between pb-3">
          {/* Mac Traffic Lights */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#4a5568] inline-block shadow-sm" />
          </div>

          {/* Centered App Title with Droplet */}
          <div className="flex items-center gap-1.5 font-bold text-white text-base">
            <span className="text-sky-400 text-lg">💧</span>
            <span className="tracking-tight">Hydrate</span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1.5">
            {/* User Avatar with Green dot */}
            <div className="relative w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center overflow-hidden">
              <span className="text-xs">🧑‍💻</span>
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-slate-900" />
            </div>

            {/* Pause, Stats, Settings, Close */}
            <button 
              onClick={() => setIsPaused(!isPaused)} 
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                isPaused ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isPaused ? "Resume" : "Pause Tracking"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <button className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white">
              <BarChart2 className="w-3.5 h-3.5" />
            </button>

            <button className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white">
              <Settings className="w-3.5 h-3.5" />
            </button>

            <button className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-center text-xs text-slate-300/80 mb-4 font-normal">
          Stay refreshed and energized while you work
        </p>

        {/* Main Card: Glass & Circular Ring */}
        <div className="bg-[#121b2d] rounded-2xl p-5 border border-slate-800 shadow-inner mb-3 relative overflow-hidden">
          {/* Interactive Reset Icon */}
          <button 
            onClick={handleReset}
            title="Reset Simulation to 1/8"
            className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 p-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="grid grid-cols-12 gap-3 items-center">
            {/* Left Glass Visual */}
            <div className="col-span-6 flex flex-col items-center justify-center relative">
              <div className="relative w-28 h-40 flex flex-col justify-end items-center">
                {/* 3D Glass Silhouette Outline */}
                <div className="absolute inset-0 rounded-b-xl border-x-2 border-b-2 border-t border-slate-600/40 bg-gradient-to-b from-white/5 via-transparent to-white/5 pointer-events-none z-20 shadow-lg">
                  {/* Glass refraction reflection sheen */}
                  <div className="absolute top-2 left-2 w-1.5 h-32 bg-white/15 rounded-full blur-[0.5px]" />
                </div>

                {/* Floating Bubbles inside Glass */}
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-b-xl">
                  <div className="absolute bottom-8 left-6 w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                  <div className="absolute bottom-12 left-10 w-2 h-2 rounded-full bg-white/30 animate-ping" />
                  <div className="absolute bottom-4 right-8 w-1 h-1 rounded-full bg-white/50" />
                </div>

                {/* Liquid fill animated container */}
                <motion.div
                  className="w-full bg-gradient-to-t from-sky-600 via-sky-500 to-cyan-400 rounded-b-lg relative overflow-hidden"
                  initial={false}
                  animate={{ height: `${Math.max(12, percentage)}%` }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                >
                  {/* Liquid top surface curve */}
                  <div className="absolute top-0 left-0 right-0 h-3 bg-sky-200/50 rounded-full blur-[1px]" />
                </motion.div>

                {/* Glass Percentage text label */}
                <div className="absolute bottom-3 text-white font-bold text-xs tracking-wider drop-shadow z-20 font-sans">
                  {percentage}%
                </div>
              </div>
            </div>

            {/* Right Circular Progress Ring */}
            <div className="col-span-6 flex flex-col items-center justify-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                  {/* Background track circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    className="stroke-slate-800"
                    strokeWidth="9"
                    fill="transparent"
                  />
                  {/* Active blue progress arc */}
                  <motion.circle
                    cx="60"
                    cy="60"
                    r={radius}
                    className="stroke-[#0284c7]"
                    strokeWidth="9"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Center text stats */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-lg font-bold text-white leading-none">
                    {glassesCount}<span className="text-xs text-slate-400 font-normal">/{totalGlasses}</span>
                  </div>
                  <div className="text-xs font-semibold text-cyan-400 mt-0.5">
                    {currentLiters} L
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {percentage}%
                  </div>
                </div>
              </div>

              {/* Title & Goal */}
              <div className="mt-2 text-center">
                <div className="text-xs font-bold text-white">Daily Hydration</div>
                <div className="text-[11px] text-slate-400">Goal: 2 L / day</div>
              </div>
            </div>
          </div>
        </div>

        {/* Big Action Button: "💧 I drank water" */}
        <div className="relative mb-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleDrinkWater}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white font-bold text-base shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span className="text-lg">💧</span>
            <span>I drank water</span>
          </motion.button>

          {/* Quick Ping Animation Banner */}
          <AnimatePresence>
            {showLogPing && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: -28, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-xl shadow-emerald-500/30 flex items-center gap-1.5 z-30 pointer-events-none"
              >
                <Check className="w-3.5 h-3.5" />
                <span>+0.25 L Logged ({glassesCount}/{totalGlasses})</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Card: Reminder & Snooze */}
        <div className="bg-[#121b2d] rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0e2a4a] text-sky-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  NEXT REMINDER
                </div>
                <div className="text-sm font-bold text-white">
                  45m 08s <span className="text-xs font-normal text-slate-400">• 60m cycle</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          </div>

          {/* Snooze Pills Row */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[5, 10, 20].map((mins) => (
              <button
                key={mins}
                onClick={() => handleSnooze(mins)}
                className={`py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                  activeSnooze === mins
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className="text-[11px]">💤</span>
                <span>{mins}m</span>
              </button>
            ))}
          </div>

          {activeSnooze && (
            <div className="text-center text-[10px] text-sky-400 mt-2 font-mono">
              Timer snoozed for {activeSnooze} minutes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
