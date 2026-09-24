import { useState, useEffect } from 'react';
import { Download, Menu, X } from 'lucide-react';
import { AppleIcon, WindowsIcon } from './Icons';
import { useOS } from '../hooks/useOS';
import { useLatestRelease } from '../hooks/useLatestRelease';
import { triggerDownloadConfetti } from '../utils/confetti';

interface NavbarProps {
  onNavigateToPrivacy?: () => void;
  onNavigateToTerms?: () => void;
}

export function Navbar({ onNavigateToPrivacy, onNavigateToTerms }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const osInfo = useOS();
  const release = useLatestRelease();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const recommendedDownload = release.downloads.find(
    (d) => d.recommendedFor?.includes(osInfo.os)
  ) || release.downloads[0];

  const handleDownloadClick = () => {
    triggerDownloadConfetti();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#090d16]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand with Official App Icon */}
        <a href="#" className="flex items-center gap-3 group">
          <img 
            src="/app-icon.png" 
            alt="Hydrate Icon" 
            className="w-10 h-10 rounded-2xl shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform" 
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white font-sans">Hydrate</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/30">
                100% Free
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:block">Menu Bar & Tray Utility</span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-cyan-400 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">
            How It Works
          </a>
          <a href="#calculator" className="hover:text-cyan-400 transition-colors">
            Hydration Calculator
          </a>
          <a href="#downloads" className="hover:text-cyan-400 transition-colors">
            Downloads
          </a>
          <a href="#faq" className="hover:text-cyan-400 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#downloads"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 rounded-xl transition-all shadow-sm"
          >
            <span>{release.tag} Stable</span>
          </a>

          <a
            href={recommendedDownload.url}
            onClick={handleDownloadClick}
            className="relative group overflow-hidden flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {osInfo.isMac ? (
              <AppleIcon className="w-3.5 h-3.5 fill-current" />
            ) : osInfo.isWindows ? (
              <WindowsIcon className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>
              {osInfo.isMac ? 'Download for Mac' : osInfo.isWindows ? 'Download for Windows' : 'Download Free'}
            </span>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-[#0c1220]/98 backdrop-blur-2xl border-b border-white/10 mt-2 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-cyan-400 py-2 text-sm font-medium border-b border-slate-800/60"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-cyan-400 py-2 text-sm font-medium border-b border-slate-800/60"
          >
            How It Works
          </a>
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-cyan-400 py-2 text-sm font-medium border-b border-slate-800/60"
          >
            Hydration Calculator
          </a>
          <a
            href="#downloads"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-cyan-400 py-2 text-sm font-medium border-b border-slate-800/60"
          >
            Downloads
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-cyan-400 py-2 text-sm font-medium border-b border-slate-800/60"
          >
            FAQ
          </a>
          {onNavigateToPrivacy && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToPrivacy();
              }}
              className="text-left text-slate-300 hover:text-cyan-400 py-2 text-sm font-medium border-b border-slate-800/60 cursor-pointer"
            >
              Privacy Policy
            </button>
          )}
          {onNavigateToTerms && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToTerms();
              }}
              className="text-left text-slate-300 hover:text-cyan-400 py-2 text-sm font-medium border-b border-slate-800/60 cursor-pointer"
            >
              Terms of Service
            </button>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <a
              href={recommendedDownload.url}
              onClick={() => {
                handleDownloadClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl shadow-lg shadow-sky-500/25"
            >
              <Download className="w-4 h-4" />
              <span>
                {osInfo.isMac ? 'Download for macOS' : osInfo.isWindows ? 'Download for Windows' : 'Download Free'}
              </span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
