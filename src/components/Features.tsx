import { 
  Activity, 
  SunMedium, 
  Droplets, 
  Cloud, 
  Zap, 
  Bell
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Work Mode (Activity Detection)',
    badge: 'Hardware Aware',
    description:
      'Monitors keyboard and mouse activity locally. Reminders chime only when you are actively working at your desk, auto-pausing when you step away for lunch or meetings.',
    color: 'from-cyan-500/20 to-sky-500/10',
    borderColor: 'group-hover:border-cyan-500/40',
    iconColor: 'text-cyan-400',
  },
  {
    icon: SunMedium,
    title: 'Natural 6:00 AM Hydration Day',
    badge: 'Circadian Aligned',
    description:
      'Your body’s day starts when you wake up, not at 12:00 AM midnight. Late-night focus sessions count towards your actual waking day without premature streak resets.',
    color: 'from-amber-500/20 to-orange-500/10',
    borderColor: 'group-hover:border-amber-500/40',
    iconColor: 'text-amber-400',
  },
  {
    icon: Droplets,
    title: 'Visual Glass & Daily Targets',
    badge: 'Real-Time Progress',
    description:
      'Watch your 3D glass reservoir fill up glass-by-glass as you log drinks. Track daily targets (e.g. 2.0L) with clean percentage progress rings.',
    color: 'from-sky-500/20 to-blue-500/10',
    borderColor: 'group-hover:border-sky-500/40',
    iconColor: 'text-sky-400',
  },
  {
    icon: Bell,
    title: 'Smart Reminders & Quick Snooze',
    badge: 'Non-Intrusive',
    description:
      'Configurable reminder cycles with convenient 5m, 10m, and 20m snooze presets. Chimes gently and respects your focus state and presentations.',
    color: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'group-hover:border-emerald-500/40',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Cloud,
    title: 'Optional Cloud Backup & Sync',
    badge: 'Multi-Device',
    description:
      'Seamless optional Google Sign-in backed by Firebase. Sync your streaks, daily logs, and customized goals across your macOS work machine and Windows desktop.',
    color: 'from-indigo-500/20 to-purple-500/10',
    borderColor: 'group-hover:border-indigo-500/40',
    iconColor: 'text-indigo-400',
  },
  {
    icon: Zap,
    title: 'Zero Distraction Footprint',
    badge: '< 45MB RAM',
    description:
      'Lives exclusively in your macOS menu bar or Windows system tray. Zero dock clutter, ultra-low CPU footprint, and instant launch on system boot.',
    color: 'from-violet-500/20 to-pink-500/10',
    borderColor: 'group-hover:border-violet-500/40',
    iconColor: 'text-violet-400',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#070b13]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30">
            Engineered for Deep Work
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-tight">
            Built for developers, designers, and desk professionals.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4 leading-relaxed">
            Most hydration trackers rely on generic timers that ring while you’re away. 
            Hydrate stays connected to your real computer activity.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`group relative p-7 rounded-2xl glass-panel border border-white/5 ${feature.borderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden`}
              >
                {/* Subtle top gradient glow on hover */}
                <div
                  className={`absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br ${feature.color} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 opacity-60`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center shadow-inner ${feature.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
