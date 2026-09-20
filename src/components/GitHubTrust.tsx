import { ShieldCheck, Heart, Zap, Download, MessageSquare, Check } from 'lucide-react';
import { AppleIcon, WindowsIcon } from './Icons';
import { useOS } from '../hooks/useOS';
import { useLatestRelease } from '../hooks/useLatestRelease';
import { triggerDownloadConfetti } from '../utils/confetti';

export function GitHubTrust() {
  const osInfo = useOS();
  const release = useLatestRelease();

  const recommendedDownload = release.downloads.find(
    (d) => d.recommendedFor?.includes(osInfo.os)
  ) || release.downloads[0];

  const handleDownload = () => {
    triggerDownloadConfetti();
    window.location.href = recommendedDownload.url;
  };

  return (
    <section className="py-20 relative bg-[#070b13] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-[#0d172e] to-slate-900 border border-sky-500/20 p-8 sm:p-12 overflow-hidden shadow-2xl">
          {/* Ambient background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-cyan-400 text-xs font-mono mb-4 border border-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Free Forever</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Stay hydrated, focused, and energized every single day.
              </h3>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">
                Hydrate is free for all professionals, programmers, designers, and students. Download directly for macOS or Windows and elevate your desk routine today.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Privacy First (Local Execution)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>No Ads or Subscriptions</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Regular Feature Updates</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-sm transition-all shadow-lg shadow-sky-500/25 cursor-pointer"
              >
                {osInfo.isMac ? (
                  <AppleIcon className="w-4 h-4 fill-current" />
                ) : osInfo.isWindows ? (
                  <WindowsIcon className="w-4 h-4 fill-current" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>
                  {osInfo.isMac ? 'Download for Mac' : osInfo.isWindows ? 'Download for Windows' : 'Download Free'}
                </span>
              </button>

              <a
                href="https://github.com/erbhuwan/hydrate-app/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium text-xs transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send Feedback / Request Feature</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
