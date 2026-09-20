import { useState, useMemo } from 'react';
import { 
  Droplet, 
  Scale, 
  Clock, 
  Activity, 
  Info,
  Bell
} from 'lucide-react';

export function HydrationCalculator() {
  const [weight, setWeight] = useState<number>(75);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [deskHours, setDeskHours] = useState<number>(8);
  const [activity, setActivity] = useState<'sedentary' | 'moderate' | 'intense'>('moderate');

  // Calculation logic
  const results = useMemo(() => {
    // Standard baseline: ~35ml per kg of body weight
    const weightInKg = unit === 'kg' ? weight : weight * 0.453592;
    
    let baseTarget = weightInKg * 35;
    
    // Activity modifier
    if (activity === 'moderate') baseTarget += 350;
    if (activity === 'intense') baseTarget += 700;

    // Air-conditioned / heated work environment factor
    const deskAddition = deskHours * 35;
    const finalDailyMl = Math.round(baseTarget + deskAddition);
    const finalDailyLiters = (finalDailyMl / 1000).toFixed(1);
    const finalDailyOz = Math.round(finalDailyMl * 0.033814);

    // Standard 250ml (0.25L) glasses count
    const glasses = Math.round(finalDailyMl / 250);

    // Suggested reminder chime interval (mins)
    const workInterval = Math.max(30, Math.min(75, Math.round((deskHours * 60) / Math.max(1, glasses))));

    return {
      dailyTargetMl: finalDailyMl,
      dailyTargetLiters: finalDailyLiters,
      dailyTargetOz: finalDailyOz,
      glassesCount: glasses,
      intervalMinutes: workInterval,
    };
  }, [weight, unit, deskHours, activity]);

  return (
    <section id="calculator" className="py-24 relative overflow-hidden bg-[#0a0f1d]">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30">
            Intake Calculator
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-tight">
            Calculate your ideal daily hydration goal.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4">
            Input your weight and average workday hours to estimate your target daily water volume and chime frequency.
          </p>
        </div>

        {/* Interactive Calculator Container */}
        <div className="max-w-4xl mx-auto rounded-3xl glass-panel border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Inputs Controls */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* Weight input with Unit switcher */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-cyan-400" />
                    Body Weight
                  </label>
                  <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                    <button
                      onClick={() => {
                        if (unit !== 'kg') {
                          setWeight(Math.round(weight * 0.453592));
                          setUnit('kg');
                        }
                      }}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        unit === 'kg' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      kg
                    </button>
                    <button
                      onClick={() => {
                        if (unit !== 'lbs') {
                          setWeight(Math.round(weight * 2.20462));
                          setUnit('lbs');
                        }
                      }}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        unit === 'lbs' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      lbs
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={unit === 'kg' ? 40 : 90}
                    max={unit === 'kg' ? 140 : 310}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="flex-1 accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="w-20 px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl font-mono text-center font-bold text-white text-sm">
                    {weight} {unit}
                  </div>
                </div>
              </div>

              {/* Desk Hours Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    Average Desk Hours
                  </label>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">{deskHours} hours/day</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={14}
                  value={deskHours}
                  onChange={(e) => setDeskHours(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>2h (Light)</span>
                  <span>8h (Standard Workday)</span>
                  <span>14h (Hardcore)</span>
                </div>
              </div>

              {/* Activity Level Selector */}
              <div>
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-2.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Physical Activity Intensity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'sedentary', label: 'Light', sub: 'Desk work only' },
                      { id: 'moderate', label: 'Moderate', sub: 'Walks & gym' },
                      { id: 'intense', label: 'High', sub: 'Athletic cardio' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActivity(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        activity === item.id
                          ? 'bg-sky-950/80 border-sky-500 text-white shadow-lg shadow-sky-500/20'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Output Recommendations Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-[#0d1629] to-[#07111e] p-6 sm:p-7 rounded-2xl border border-sky-500/30 shadow-xl relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-mono uppercase text-sky-400 font-semibold tracking-wider flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 fill-current" />
                    Recommended Daily Target
                  </span>
                  <span className="text-[11px] text-slate-400">Daily Formula</span>
                </div>

                {/* Big Target Output */}
                <div className="my-6 text-center">
                  <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight text-gradient-cyan">
                    {results.dailyTargetLiters} L <span className="text-2xl text-slate-400 font-normal">/ day</span>
                  </div>
                  <div className="text-sm text-slate-400 mt-1 font-mono">
                    {results.dailyTargetMl.toLocaleString()} ml • {results.glassesCount} glasses (0.25 L each)
                  </div>
                </div>

                {/* Key Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-left">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <Bell className="w-3.5 h-3.5 text-sky-400" />
                      Suggested Reminder
                    </div>
                    <div className="text-base font-bold text-white font-mono">
                      Every {results.intervalMinutes} mins
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">While typing/active</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-left">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <Droplet className="w-3.5 h-3.5 text-emerald-400" />
                      Glass Target
                    </div>
                    <div className="text-base font-bold text-white font-mono">
                      {results.glassesCount} Glasses
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">0.25 L per log</div>
                  </div>
                </div>
              </div>

              {/* Insight */}
              <div className="mt-2 p-3 rounded-xl bg-sky-950/40 border border-sky-500/20 text-xs text-cyan-200/90 flex items-start gap-2">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  Configure these custom goals in Hydrate's settings to track your personalized daily target.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
