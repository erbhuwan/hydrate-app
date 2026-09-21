import { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  ChevronDown, 
  Check
} from 'lucide-react';
import { AppleIcon, WindowsIcon } from './Icons';
import { useOS } from '../hooks/useOS';
import { useLatestRelease } from '../hooks/useLatestRelease';
import { triggerDownloadConfetti } from '../utils/confetti';
import { InteractiveAppPreview } from './InteractiveAppPreview';

export function Hero() {
  const osInfo = useOS();
  const release = useLatestRelease();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const recommendedDownload = release.downloads.find(
    (d) => d.recommendedFor?.includes(osInfo.os)
  ) || release.downloads[0];

  const handleDownload = (url: string) => {
    triggerDownloadConfetti();
    setDropdownOpen(false);
    window.location.href = url;
  };

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 radial-bg">
      {/* Background ambient lighting isolated with overflow-hidden */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-sky-600/15 to-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Version Release Announcement Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-6 shadow-sm">
              <span className="text-cyan-400 font-bold">●</span>
              <span>
                <strong>Hydrate {release.tag}</strong> is now available for macOS & Windows
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] sm:leading-[1.12] mb-6 font-sans">
              The smart menu bar{' '}
              <span className="text-gradient-cyan block sm:inline">hydration tracker</span> that works as hard as you do.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300/90 max-w-2xl mb-8 leading-relaxed font-normal">
              Discreetly tracks your desk hours, sends non-intrusive reminders only when you're active, and resets with your natural morning routine.
            </p>

            {/* CTA Download Button Group with Dropdown */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-30 mb-6">
              <div ref={dropdownRef} className="relative inline-flex rounded-2xl shadow-2xl shadow-sky-500/25 z-40 w-full sm:w-auto">
                {/* Main Action */}
                <button
                  onClick={() => handleDownload(recommendedDownload.url)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-3 px-5 sm:px-7 py-3.5 sm:py-4 rounded-l-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-600 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer active:scale-[0.98]"
                >
                  <div className="w-5 sm:w-6 h-5 sm:h-6 flex items-center justify-center shrink-0">
                    {osInfo.isMac ? (
                      <AppleIcon className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
                    ) : osInfo.isWindows ? (
                      <WindowsIcon className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-current" />
                    ) : (
                      <Download className="w-4 sm:w-5 h-4 sm:h-5" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="leading-tight text-sm sm:text-[15px]">
                      {osInfo.isMac
                        ? `Download for ${osInfo.isAppleSilicon ? 'Apple Silicon' : 'macOS'}`
                        : osInfo.isWindows
                        ? 'Download for Windows'
                        : 'Download Hydrate'}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-normal text-cyan-100 opacity-90">
                      {release.tag} • {recommendedDownload.sizeText} • 100% Free
                    </div>
                  </div>
                </button>

                {/* Dropdown Toggle */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-3.5 sm:px-4 py-3.5 sm:py-4 rounded-r-2xl bg-sky-700 hover:bg-sky-600 text-white border-l border-white/20 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                  aria-label="Choose platform installer"
                >
                  <ChevronDown className={`w-4 sm:w-5 h-4 sm:h-5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Binary Options */}
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2.5 w-[calc(100vw-2.5rem)] max-w-[480px] max-h-[440px] dropdown-scroll bg-[#0b1325]/98 backdrop-blur-2xl border border-slate-700/90 rounded-2xl shadow-2xl shadow-black/90 z-[100] p-2.5 sm:p-3 text-left animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 text-[10px] sm:text-[11px] font-semibold tracking-wider text-slate-400 uppercase border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0b1325] z-20 pb-2">
                      <span>Available Installers ({release.tag})</span>
                      <span className="text-[10px] text-sky-400 font-mono font-normal">All 64-bit</span>
                    </div>
                    <div className="flex flex-col gap-1.5 sm:gap-2 mt-2">
                      {release.downloads.map((item) => {
                        const isRecommended = item.recommendedFor?.includes(osInfo.os);
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleDownload(item.url)}
                            className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left transition-all cursor-pointer ${
                              isRecommended
                                ? 'bg-sky-950/70 border border-sky-500/50 text-white shadow-md shadow-sky-500/10'
                                : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 sm:w-9 h-8 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                isRecommended ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {item.platform === 'macOS' ? (
                                  <AppleIcon className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
                                ) : (
                                  <WindowsIcon className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-current" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap">
                                  <span>{item.platform} • {item.arch}</span>
                                  {isRecommended && (
                                    <span className="px-1.5 py-0.2 text-[9px] font-mono rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                                      Your OS
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate mt-0.5">
                                  {item.filename} ({item.sizeText})
                                </div>
                              </div>
                            </div>
                            <div className="shrink-0 ml-2 pl-1 flex items-center">
                              <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition-colors">
                                <Download className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* View Matrix Secondary Link */}
              <a
                href="#downloads"
                className="px-5 py-3.5 sm:py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 text-slate-200 text-xs sm:text-sm font-semibold text-center transition-all"
              >
                All Download Packages
              </a>
            </div>

            {/* Value Proposition Pills */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>100% Free to Use</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zero Dock Clutter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Privacy-First (Offline)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Apple Silicon & Windows 64-bit</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Floating App Window */}
          <div className="lg:col-span-5 flex justify-center">
            <InteractiveAppPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
