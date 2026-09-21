import { MousePointerClick, Sun, Clock } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Sits Quietly in Your Menu Bar',
    subtitle: 'Zero configuration needed to get going',
    description:
      'Launches on startup and embeds directly into your macOS top menu bar or Windows taskbar tray. Glance at your current water progress anytime with a single click.',
    icon: Clock,
    metric: 'Instant Launch',
  },
  {
    step: '02',
    title: 'Work Mode Tracks Real Activity',
    subtitle: 'No annoying chimes when you step away',
    description:
      'Native low-level OS listeners observe active keyboard strokes and mouse movements. If you leave for lunch or a meeting, timers freeze until you return.',
    icon: MousePointerClick,
    metric: 'Privacy Preserved (Local Only)',
  },
  {
    step: '03',
    title: 'Resets with Your Custom Routine',
    subtitle: 'Personalized day start cycle',
    description:
      'Never lose streak points because you drank water past midnight while working late. Customize your rollover time (e.g. 6:00 AM) to match your real waking morning.',
    icon: Sun,
    metric: 'Customizable Cycle',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative bg-[#090d16] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30">
            Frictionless Daily Routine
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-tight">
            How Hydrate seamlessly integrates into your workday.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4">
            No endless push notifications, no mobile app required while working on your computer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col p-8 rounded-2xl glass-panel border border-slate-800/80 hover:border-cyan-500/30 transition-all group"
              >
                {/* Step Index Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-extrabold font-mono text-cyan-400/30 group-hover:text-cyan-400 transition-colors">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1.5">{item.title}</h3>
                <h4 className="text-xs text-cyan-400 font-medium mb-3">{item.subtitle}</h4>
                <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                  {item.description}
                </p>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span className="text-slate-500">Feature</span>
                  <span className="text-emerald-400 font-medium">{item.metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
