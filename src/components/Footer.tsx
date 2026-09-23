import { Heart } from 'lucide-react';
import { useLatestRelease } from '../hooks/useLatestRelease';

interface FooterProps {
  onNavigateToAdmin?: (e?: React.MouseEvent) => void;
}

export function Footer({ onNavigateToAdmin }: FooterProps) {
  const release = useLatestRelease();

  return (
    <footer className="bg-[#05080f] text-slate-400 text-sm border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <a href="#" className="flex items-center gap-3">
              <img src="/app-icon.png" alt="Hydrate" className="w-8 h-8 rounded-xl shadow-md" />
              <span className="font-bold text-lg text-white">Hydrate</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                tryhydrate.app
              </span>
            </a>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The smart, quiet menu bar hydration tracker that syncs with your natural morning routine and active desk work.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              Version {release.tag} • Released {release.publishedAt}
            </div>
          </div>

          {/* Links Col 1: Product */}
          <div className="md:col-span-3 flex flex-col gap-3 text-xs">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
              Product
            </span>
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
              Download Installer (.dmg / .exe)
            </a>
          </div>

          {/* Links Col 2: Support & Release */}
          <div className="md:col-span-2 flex flex-col gap-3 text-xs">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
              Support
            </span>
            <a
              href="https://github.com/erbhuwan/hydrate-app/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              Release Notes & Tags
            </a>
            <a
              href="https://github.com/erbhuwan/hydrate-app/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              Feedback & Issues
            </a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">
              FAQ
            </a>
          </div>

          {/* Links Col 3: Community & Developer */}
          <div className="md:col-span-2 flex flex-col gap-3 text-xs">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
              Developer & Admin
            </span>
            <a
              href="https://bhuwanacharyaupadhyaya.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors flex items-center gap-1.5"
            >
              <span>Bhuwan Acharya</span>
              <span className="text-[10px] text-slate-500">↗</span>
            </a>
            <a
              href="https://github.com/erbhuwan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              GitHub (@erbhuwan)
            </a>
            <a
              href="/admin"
              onClick={onNavigateToAdmin}
              className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 font-mono"
            >
              <span>Admin Portal</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-cyan-400">/admin</span>
            </a>
          </div>
        </div>


        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Hydrate (<span className="text-cyan-400 font-mono">tryhydrate.app</span>). All rights reserved. Free desktop utility.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>by</span>
            <a 
              href="https://bhuwanacharyaupadhyaya.com.np" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium underline underline-offset-2"
            >
              Bhuwan Acharya
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
