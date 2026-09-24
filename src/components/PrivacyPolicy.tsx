import { Shield, Lock, HardDrive, Calendar, User, Database, Key, Mail, ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react';
import { GithubIcon } from './Icons';

interface PrivacyPolicyProps {
  onNavigateHome: () => void;
  onNavigateToTerms: () => void;
}

export function PrivacyPolicy({ onNavigateHome, onNavigateToTerms }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-30 z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-sky-500/10 via-cyan-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Nav */}
      <header className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-xl border-b border-white/10 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
              <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-cyan-300 transition-colors" />
            </div>
            <div className="flex items-center gap-2">
              <img src="/app-icon.png" alt="Hydrate" className="w-7 h-7 rounded-lg" />
              <span className="font-bold text-base text-white tracking-tight">Hydrate</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Legal
              </span>
            </div>
          </button>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={onNavigateHome}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:block"
            >
              Home
            </button>
            <span className="text-slate-600 hidden sm:block">•</span>
            <button
              onClick={onNavigateToTerms}
              className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer font-medium"
            >
              Terms of Service →
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Title & Metadata Hero Card */}
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-white/10 mb-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Privacy-First Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Privacy Policy for Hydrate
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 font-mono pb-6 border-b border-slate-800">
            <span><strong>Effective Date:</strong> September 24, 2026</span>
            <span>•</span>
            <span><strong>Last Updated:</strong> September 24, 2026</span>
          </div>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mt-6">
            Hydrate (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the app&rdquo;) is a privacy-first, open-source macOS and desktop hydration reminder and wellness tracking application. We respect your privacy and are committed to protecting your personal data.
          </p>
        </div>

        {/* Section 1: Information We Collect and Process */}
        <section className="mb-10 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              1
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Information We Collect and Process
            </h2>
          </div>

          {/* Sub-item A: Local Data */}
          <div className="p-6 rounded-2xl bg-[#0b1322] border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-sky-400 font-bold text-lg">
              <Database className="w-5 h-5 text-sky-400" />
              <span>A. Local Hydration & Ergonomics Data</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-300 pl-4 list-disc marker:text-cyan-400 leading-relaxed">
              <li>
                <strong className="text-white">What is stored:</strong> Daily water intake logs, reminder intervals, custom sound settings, and active desk/sitting duration.
              </li>
              <li>
                <strong className="text-white">Where it is stored:</strong> All data is stored locally on your device in standard JSON files.
              </li>
            </ul>
          </div>

          {/* Sub-item B: Google Account & Cloud Services (Optional) */}
          <div className="p-6 rounded-2xl bg-[#0b1322] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
                <Lock className="w-5 h-5 text-cyan-400" />
                <span>B. Google Account & Cloud Services (Optional)</span>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                100% User-Opt-In
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              When you choose to connect your Google account, Hydrate uses the following permissions:
            </p>

            <div className="space-y-3 pt-2">
              {/* Google Drive */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div className="text-sm">
                  <div className="font-bold text-white flex items-center gap-2 flex-wrap">
                    <span>Google Drive</span>
                    <code className="text-xs font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      https://www.googleapis.com/auth/drive.appdata
                    </code>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                    Used exclusively to save and restore your hydration backup file (<code className="text-cyan-300">hydrate_backup.json</code>) inside your private, hidden Google Drive application folder (<code className="text-cyan-300">appDataFolder</code>). Hydrate does not have access to any other files or folders in your Google Drive.
                  </p>
                </div>
              </div>

              {/* Google Calendar */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-sm">
                  <div className="font-bold text-white flex items-center gap-2 flex-wrap">
                    <span>Google Calendar</span>
                    <code className="text-xs font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      https://www.googleapis.com/auth/calendar.readonly
                    </code>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                    Used in a read-only manner to display your today&apos;s schedule on the dashboard and automatically snooze reminder notifications while you are in busy meetings. We never create, edit, or delete calendar events.
                  </p>
                </div>
              </div>

              {/* Basic Profile */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-sm">
                  <div className="font-bold text-white flex items-center gap-2 flex-wrap">
                    <span>Basic Profile & Email</span>
                    <code className="text-xs font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      openid, userinfo.email, userinfo.profile
                    </code>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                    Used to display your name and profile avatar inside the app.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: How Your Data Is Used */}
        <section className="mb-10 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              2
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              How Your Data Is Used
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-[#0b1322] border border-slate-800 flex flex-col gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">Calculate & Notify</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calculates your daily hydration progress and sends timely prompts when it&apos;s time to drink water.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b1322] border border-slate-800 flex flex-col gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">Intelligent Pause</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pauses reminders while you are in scheduled Google Calendar meetings or away from your desk.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b1322] border border-slate-800 flex flex-col gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">Personal Cloud Sync</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Synchronizes your settings and logs across your workstations via your private Google Drive account.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Data Sharing & Third Parties */}
        <section className="mb-10 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              3
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Data Sharing & Third Parties
            </h2>
          </div>

          <div className="space-y-3 pt-2 text-sm text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-[#0b1322] border border-slate-800">
              <strong className="text-white block mb-1">Zero Third-Party Tracking:</strong>
              We do not sell, rent, monetize, or transmit your personal data or hydration logs to any third-party advertising or analytics networks.
            </div>
            <div className="p-4 rounded-xl bg-[#0b1322] border border-slate-800">
              <strong className="text-white block mb-1">Direct Google API Communication:</strong>
              All cloud sync communication happens directly between the desktop app and official Google APIs using secure HTTPS.
            </div>
          </div>
        </section>

        {/* Section 4: Data Security & Storage */}
        <section className="mb-10 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              4
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Data Security & Storage
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm text-slate-300">
            <div className="p-5 rounded-2xl bg-[#0b1322] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>Keychain Encryption</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Authentication tokens stored locally on macOS are encrypted using the native macOS Keychain via Electron <code className="text-cyan-300">safeStorage</code>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b1322] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Full User Control</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                You can disconnect your Google account or delete your local data at any time directly through the app settings.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Contact & Open Source */}
        <section className="mb-12 p-8 rounded-3xl glass-panel border border-cyan-500/20 shadow-2xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold">
              5
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Contact & Open Source
            </h2>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Hydrate is open source and community-driven. If you have any questions or privacy inquiries, please reach out to us:
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href="mailto:v1acharya34@gmail.com"
              className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500/60 text-slate-200 hover:text-white transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400">Developer Email</div>
                <div className="text-xs font-semibold text-cyan-300 font-mono">v1acharya34@gmail.com</div>
              </div>
            </a>

            <a
              href="https://github.com/erbhuwan/hydrate-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500/60 text-slate-200 hover:text-white transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center group-hover:text-white transition-colors">
                <GithubIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400 flex items-center gap-1">
                  <span>Source Code</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
                <div className="text-xs font-semibold text-white font-mono">github.com/erbhuwan/hydrate-app</div>
              </div>
            </a>
          </div>
        </section>

        {/* Bottom Back Button */}
        <div className="text-center pt-4">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-sm font-semibold transition-all cursor-pointer shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Hydrate Homepage</span>
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#05080f] text-slate-400 text-xs border-t border-white/5 py-8 mt-16 text-center">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} Hydrate (tryhydrate.app). Open Source & Privacy First.</div>
          <div className="flex items-center gap-4">
            <button onClick={onNavigateHome} className="hover:text-white transition-colors cursor-pointer">
              Home
            </button>
            <span>•</span>
            <button onClick={onNavigateToTerms} className="hover:text-white transition-colors cursor-pointer">
              Terms of Service
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
