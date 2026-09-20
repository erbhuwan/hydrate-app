import { useState } from 'react';
import { 
  Download, 
  Check, 
  Copy, 
  FileCode
} from 'lucide-react';
import { AppleIcon, WindowsIcon } from './Icons';
import { useLatestRelease } from '../hooks/useLatestRelease';
import { useOS } from '../hooks/useOS';
import { triggerDownloadConfetti } from '../utils/confetti';

export function DownloadsMatrix() {
  const release = useLatestRelease();
  const osInfo = useOS();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopySha = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (url: string) => {
    triggerDownloadConfetti();
    window.location.href = url;
  };

  return (
    <section id="downloads" className="py-24 relative bg-[#070b13] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30">
            Native Installers
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-tight">
            Download Hydrate for your workstation.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4">
            100% free to use. Directly compiled for Apple Silicon (M1/M2/M3/M4), Intel Macs, and Windows.
          </p>
        </div>

        {/* Release Version Banner */}
        <div className="mb-8 p-4 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Latest Release: <span className="font-mono text-cyan-400">{release.tag}</span>
              </div>
              <div className="text-xs text-slate-400">
                Published on {release.publishedAt} • Free Desktop Utility
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            <span>✓ Verified Safe & Signed</span>
          </div>
        </div>

        {/* Cards Grid for All Downloads */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {release.downloads.map((item) => {
            const isRecommended = item.recommendedFor?.includes(osInfo.os);
            const shaSample = `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between p-6 rounded-2xl glass-panel border transition-all duration-200 ${
                  isRecommended
                    ? 'border-sky-500/50 bg-slate-900/90 shadow-xl shadow-sky-500/10 scale-[1.02]'
                    : 'border-white/5 hover:border-slate-700'
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-sky-500 text-white font-bold text-[10px] tracking-wider uppercase shadow-md">
                    Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400">
                      {item.platform === 'macOS' ? (
                        <AppleIcon className="w-5 h-5 fill-current" />
                      ) : (
                        <WindowsIcon className="w-5 h-5 fill-current" />
                      )}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.sizeText}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{item.platform}</h3>
                  <div className="text-xs font-mono text-cyan-400 font-medium mb-2">{item.arch}</div>
                  <div className="text-xs text-slate-400 mb-4">{item.type}</div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-6">
                    <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">Target File</div>
                    <div className="text-xs font-mono text-slate-300 truncate" title={item.filename}>
                      {item.filename}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleDownload(item.url)}
                    className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-xs shadow-lg transition-all cursor-pointer ${
                      isRecommended
                        ? 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white shadow-sky-500/25'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {item.filename.endsWith('.dmg') ? '.dmg' : '.exe'}</span>
                  </button>

                  <button
                    onClick={() => handleCopySha(item.id, shaSample)}
                    className="w-full py-1.5 text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Checksum Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy SHA-256 Checksum</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Homebrew & CLI banner */}
        <div className="mt-12 p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              <FileCode className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Prefer Terminal / Package Managers?</div>
              <div className="text-xs text-slate-400">
                Install directly via Homebrew Cask or Winget CLI
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <code className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-cyan-300 select-all">
              brew install --cask erbhuwan/tap/hydrate
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}
