import { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Settings, 
  X, 
  Pause, 
  Play, 
  Bell, 
  Armchair, 
  ChevronRight, 
  Check, 
  User, 
  Droplet,
  Droplets,
  Moon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InteractiveAppPreview() {
  const [glassesCount, setGlassesCount] = useState(5);
  const totalGlasses = 8;
  const glassVolume = 0.25; // 0.25 L = 250ml
  const [isPaused, setIsPaused] = useState(false);
  const [showLogPing, setShowLogPing] = useState(false);
  const [activeSnooze, setActiveSnooze] = useState<number | null>(null);

  // Timer countdown simulation
  const [secondsRemaining, setSecondsRemaining] = useState(2738); // 45m 38s

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const currentLiters = (glassesCount * glassVolume).toFixed(2);
  const percentage = Math.min(100, Math.round((glassesCount / totalGlasses) * 100));
  const glassesRemaining = Math.max(0, totalGlasses - glassesCount);

  const handleDrinkWater = () => {
    setGlassesCount((prev) => (prev < totalGlasses ? prev + 1 : 1));
    setShowLogPing(true);
    setTimeout(() => setShowLogPing(false), 1200);
  };

  const handleSnooze = (minutes: number) => {
    setActiveSnooze(minutes);
    setTimeout(() => setActiveSnooze(null), 2500);
  };

  // SVG circular progress calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[440px] mx-auto select-none font-sans">
      {/* Background ambient lighting aura */}
      <div className="absolute -top-8 -left-8 w-60 sm:w-72 h-60 sm:h-72 bg-sky-500/20 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-60 sm:w-72 h-60 sm:h-72 bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Main App Window Frame (macOS Dark Aesthetic) */}
      <div className="w-full bg-[#0b1322]/95 rounded-2xl sm:rounded-[28px] p-4 sm:p-5 shadow-2xl border border-white/10 relative overflow-hidden backdrop-blur-2xl text-slate-100">
        
        {/* Top Window Bar */}
        <div className="flex items-center justify-between pb-3">
          {/* Mac Traffic Lights */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#2a384e] inline-block shadow-sm" />
          </div>

          {/* Centered App Brand with Droplet Icon */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-white text-sm sm:text-base">
            <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-lg bg-gradient-to-b from-sky-400 to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/30 text-white">
              <Droplet className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current text-white" />
            </div>
            <span className="tracking-tight">Hydrate</span>
          </div>

          {/* Right Header Controls (macOS Styled Controls) */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* User Profile Avatar with Online Status */}
            <div className="relative w-6 sm:w-7 h-6 sm:h-7 rounded-lg bg-[#142236] border border-[#233550] flex items-center justify-center overflow-hidden">
              <User className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-300" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-[#0b1322]" />
            </div>

            {/* Pause Control */}
            <button 
              onClick={() => setIsPaused(!isPaused)} 
              className={`w-6 sm:w-7 h-6 sm:h-7 rounded-lg border flex items-center justify-center transition-all ${
                isPaused 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                  : 'bg-[#142236] border-[#233550] text-slate-300 hover:text-white hover:border-slate-600'
              }`}
              title={isPaused ? "Resume Hydration Cycle" : "Pause Tracking"}
            >
              {isPaused ? <Play className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current" /> : <Pause className="w-3 sm:w-3.5 h-3 sm:h-3.5" />}
            </button>

            {/* Stats / Bar Chart Icon */}
            <div 
              className="w-6 sm:w-7 h-6 sm:h-7 rounded-lg bg-[#142236] border border-[#233550] flex items-center justify-center text-slate-300"
              title="Activity & Water Statistics"
            >
              <BarChart2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            </div>

            {/* Settings Cog Icon */}
            <div 
              className="w-6 sm:w-7 h-6 sm:h-7 rounded-lg bg-[#142236] border border-[#233550] flex items-center justify-center text-slate-300"
              title="Reminder Styles & Sound Settings"
            >
              <Settings className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            </div>

            {/* Close Button */}
            <div 
              className="w-6 sm:w-7 h-6 sm:h-7 rounded-lg bg-[#142236] border border-[#233550] flex items-center justify-center text-slate-400"
              title="Menu Bar Tracker"
            >
              <X className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            </div>
          </div>
        </div>

        {/* Personalized Greeting Header */}
        <div className="text-center text-[11px] sm:text-xs text-slate-300 mb-3 sm:mb-3.5 font-medium flex items-center justify-center gap-1">
          <span>
            Hey <strong className="text-white font-semibold">Bhuwan</strong>, keep going, {glassesRemaining} glasses left to hit your goal!
          </span>
          <Droplets className="w-3.5 h-3.5 text-sky-400 shrink-0 inline" />
        </div>

        {/* Single Unified Dashboard View */}
        <div>
          {/* Main Card: Glass Reservoir & Circular Hydration Gauge */}
          <div className="bg-[#0e1728] rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[#1c2c47] shadow-inner mb-3 relative overflow-hidden">
            <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
              
              {/* Left Column: 3D Water Glass Visual */}
              <div className="col-span-6 flex flex-col items-center justify-center relative">
                <div className="relative w-24 sm:w-28 h-36 sm:h-44 flex flex-col justify-end items-center">
                  
                  {/* Glass Body with Tapered Shape & Reflections */}
                  <div className="absolute inset-0 rounded-b-xl sm:rounded-b-2xl border-x-2 border-b-2 border-t border-slate-400/30 bg-gradient-to-b from-white/10 via-transparent to-white/5 pointer-events-none z-20 shadow-xl overflow-hidden">
                    {/* Glass edge vertical glare shine */}
                    <div className="absolute top-2 left-2 w-1 sm:w-1.5 h-32 sm:h-36 bg-gradient-to-b from-white/30 via-white/10 to-transparent rounded-full blur-[0.4px]" />
                    <div className="absolute top-2 right-2 w-0.5 sm:w-1 h-32 sm:h-36 bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-full blur-[0.4px]" />
                  </div>

                  {/* Floating Bubbles */}
                  <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-b-xl sm:rounded-b-2xl">
                    <div className="absolute bottom-8 left-4 w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
                    <div className="absolute bottom-14 left-7 w-2 h-2 rounded-full bg-white/40 animate-bounce" />
                    <div className="absolute bottom-5 right-6 w-1 h-1 rounded-full bg-white/60" />
                    <div className="absolute bottom-18 right-4 w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
                  </div>

                  {/* Animated Water Reservoir */}
                  <motion.div
                    className="w-full bg-gradient-to-t from-[#0284c7] via-[#0ea5e9] to-[#38bdf8] rounded-b-xl sm:rounded-b-2xl relative overflow-hidden flex items-end justify-center pb-2.5 sm:pb-3"
                    initial={false}
                    animate={{ height: `${Math.max(16, percentage)}%` }}
                    transition={{ type: 'spring', damping: 18, stiffness: 90 }}
                  >
                    {/* Top Water Surface Meniscus */}
                    <div className="absolute top-0 left-0 right-0 h-2.5 sm:h-3 bg-cyan-100/60 rounded-full blur-[1px]" />

                    {/* Percentage Label inside Water */}
                    <span className="text-white font-bold text-[11px] sm:text-xs tracking-wider drop-shadow-md z-20 font-sans">
                      {percentage}%
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Right Column: Circular Hydration Progress Ring */}
              <div className="col-span-6 flex flex-col items-center justify-center">
                <div className="relative w-28 sm:w-32 h-28 sm:h-32 flex items-center justify-center">
                  <svg className="w-28 sm:w-32 h-28 sm:h-32 -rotate-90" viewBox="0 0 130 130">
                    {/* Background track circle */}
                    <circle
                      cx="65"
                      cy="65"
                      r={radius}
                      className="stroke-[#18263c]"
                      strokeWidth="11"
                      fill="transparent"
                    />
                    {/* Progress indicator arc */}
                    <motion.circle
                      cx="65"
                      cy="65"
                      r={radius}
                      className="stroke-[#00a8ff]"
                      strokeWidth="11"
                      strokeDasharray={circumference}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>

                  {/* Center Gauge Statistics */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="text-xl sm:text-2xl font-black text-white leading-none tracking-tight">
                      {glassesCount}<span className="text-xs sm:text-sm text-slate-400 font-normal">/{totalGlasses}</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-[#38bdf8] mt-1">
                      {currentLiters} L
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                      {percentage}%
                    </div>
                  </div>
                </div>

                {/* Gauge Caption */}
                <div className="mt-1.5 sm:mt-2 text-center">
                  <div className="text-xs sm:text-sm font-bold text-white">Daily Hydration</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Goal: 2 L / day</div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Card: Desk & Sitting Tracking */}
          <div className="bg-[#0e1728] rounded-2xl p-3 sm:p-3.5 border border-[#1c2c47] mb-3 flex items-center justify-between">
            {/* Left section: Armchair icon & Desk status */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-[#142640] border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <Armchair className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-white tracking-tight">Desk & Sitting</span>
                  <span className="px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full bg-sky-950 border border-sky-400/40 text-[#38bdf8] text-[9px] sm:text-[10px] font-semibold flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
                    Active Now
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5">
                  5h 53m away on breaks today
                </div>
              </div>
            </div>

            {/* Right section: Sitting metrics & Chevron */}
            <div className="flex items-center gap-1.5 sm:gap-2 pl-2 shrink-0">
              <div className="text-right">
                <div className="text-sm sm:text-base font-bold text-white leading-tight">6h 11m</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400">Today's Sitting</div>
              </div>
              <ChevronRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Primary Action Button: "💧 I drank water" */}
        <div className="relative mb-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleDrinkWater}
            className="w-full py-3 sm:py-3.5 px-5 sm:px-6 rounded-2xl bg-[#0099ff] hover:bg-[#008ae6] active:bg-[#007acc] text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer tracking-tight"
          >
            <Droplet className="w-4 h-4 fill-current text-white" />
            <span>I drank water</span>
          </motion.button>

          {/* Quick Confirmation Toast */}
          <AnimatePresence>
            {showLogPing && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: -26, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 px-3 sm:px-3.5 py-1.5 bg-emerald-500 text-white rounded-full text-[11px] sm:text-xs font-bold shadow-xl shadow-emerald-500/40 flex items-center gap-1.5 z-30 pointer-events-none whitespace-nowrap"
              >
                <Check className="w-3.5 h-3.5" />
                <span>+0.25 L Logged ({glassesCount}/{totalGlasses})</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Card: Next Reminder & Quick Snooze */}
        <div className="bg-[#0e1728] rounded-2xl p-3 sm:p-3.5 border border-[#1c2c47]">
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-[#142640] border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <Bell className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  NEXT REMINDER
                </div>
                <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{formatTimer(secondsRemaining)}</span>
                  <span className="text-[11px] sm:text-xs font-normal text-slate-400">• 60m cycle</span>
                </div>
              </div>
            </div>

            {/* Pause / Resume Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-[#142236] hover:bg-[#1a2f4c] border border-[#233550] text-[11px] sm:text-xs font-medium text-slate-200 flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400" /> : <Pause className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-300" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          </div>

          {/* Quick Snooze Pills Row */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
            {[5, 10, 20].map((mins) => (
              <button
                key={mins}
                onClick={() => handleSnooze(mins)}
                className={`py-1.5 sm:py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 sm:gap-1.5 border transition-all cursor-pointer ${
                  activeSnooze === mins
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                    : 'bg-[#132034] border-[#1e304b] text-slate-300 hover:border-slate-600 hover:text-white'
                }`}
              >
                <Moon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-400" />
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
