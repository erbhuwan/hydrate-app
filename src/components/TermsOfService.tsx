import { FileText, ArrowLeft, CheckCircle2, HeartHandshake, Cloud, AlertCircle, Mail, ExternalLink } from 'lucide-react';
import { GithubIcon } from './Icons';

interface TermsOfServiceProps {
  onNavigateHome: () => void;
  onNavigateToPrivacy: () => void;
}

export function TermsOfService({ onNavigateHome, onNavigateToPrivacy }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient background grid pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-30 z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-indigo-500/10 via-cyan-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

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
                Terms
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
              onClick={onNavigateToPrivacy}
              className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer font-medium"
            >
              Privacy Policy →
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Title & Metadata Hero Card */}
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-white/10 mb-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-4">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Usage & Service Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Terms of Service for Hydrate
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 font-mono pb-6 border-b border-slate-800">
            <span><strong>Effective Date:</strong> September 24, 2026</span>
            <span>•</span>
            <span><strong>Last Updated:</strong> September 24, 2026</span>
          </div>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mt-6">
            Welcome to Hydrate (&ldquo;Hydrate&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), a desktop hydration tracking and ergonomics reminder application available at <code className="text-cyan-300 font-mono">tryhydrate.app</code>. By downloading, installing, accessing, or using Hydrate, you agree to be bound by these Terms of Service.
          </p>
        </div>

        {/* Section 1: Acceptance & License */}
        <section className="mb-10 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              1
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Open Source License & Use Rights
            </h2>
          </div>

          <div className="space-y-3 text-sm text-slate-300 leading-relaxed pt-2">
            <p>
              Hydrate is free, open-source software provided to users worldwide. You are granted a non-exclusive, worldwide, royalty-free license to use, install, inspect, and contribute to the software in accordance with open-source licensing principles.
            </p>
            <div className="p-4 rounded-xl bg-[#0b1322] border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Free Forever:</strong> There are no hidden fees, recurring subscriptions, feature gates, or advertisements contained within the standard release of the Hydrate app.
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Wellness & Health Disclaimer */}
        <section className="mb-10 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              2
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Wellness & Non-Medical Disclaimer
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-slate-300 text-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <AlertCircle className="w-5 h-5" />
              <span>Important Medical Disclaimer</span>
            </div>
            <p className="leading-relaxed">
              Hydrate is strictly a personal habit reminder and desk ergonomics utility. The hydration recommendations, calculators, interval reminders, and desk activity statistics generated by the application are approximate estimates and do NOT constitute professional medical advice, diagnosis, or treatment.
            </p>
            <p className="leading-relaxed text-xs text-slate-400">
              Always seek the advice of a qualified physician or healthcare provider regarding individual hydration requirements, kidney function, or any medical conditions. Never disregard medical advice due to information provided by Hydrate.
            </p>
          </div>
        </section>

        {/* Section 3: Third-Party & Google API Services */}
        <section className="mb-10 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              3
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Google Account & Cloud Integrations
            </h2>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed pt-2">
            Hydrate offers optional integrations with Google APIs (Google Drive and Google Calendar). When you elect to use these features:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-[#0b1322] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Cloud className="w-4 h-4 text-sky-400" />
                <span>Google Drive App Data</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hydrate accesses only its designated <code className="text-cyan-300">appDataFolder</code> to store backup files (<code className="text-cyan-300">hydrate_backup.json</code>). It never accesses, modifies, or scans any other personal documents in your Google Drive.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b1322] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <HeartHandshake className="w-4 h-4 text-indigo-400" />
                <span>Google Calendar Read-Only</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hydrate reads today&apos;s event start and end times purely on your device to automatically snooze notifications during meetings. Hydrate never writes, modifies, or deletes calendar entries.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pt-2">
            Hydrate complies with the <strong className="text-slate-200">Google API Services User Data Policy</strong>, including the Limited Use requirements. Communication with Google APIs is direct from your device over HTTPS with zero intermediate data warehousing.
          </p>
        </section>

        {/* Section 4: Disclaimer of Warranties & Limitation of Liability */}
        <section className="mb-10 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              4
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Disclaimer of Warranties & Limitation of Liability
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b1322] border border-slate-800 space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              HYDRATE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;, WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-xs text-slate-400">
              IN NO EVENT SHALL THE DEVELOPERS, CONTRIBUTORS, OR AFFILIATED PARTIES BE LIABLE FOR ANY CLAIM, DAMAGES, LOSS OF DATA, OR OTHER LIABILITY ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </p>
          </div>
        </section>

        {/* Section 5: Modifications & Termination */}
        <section className="mb-10 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              5
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Modifications & User Termination
            </h2>
          </div>

          <div className="space-y-3 text-sm text-slate-300 leading-relaxed pt-2">
            <p>
              We reserve the right to update or modify these Terms of Service at any time. Changes become effective upon posting the revised Terms with an updated &ldquo;Effective Date&rdquo; on <code className="text-cyan-300 font-mono">tryhydrate.app/terms</code>.
            </p>
            <p>
              You may terminate your agreement with Hydrate at any time simply by uninstalling the application and disconnecting any optional cloud accounts.
            </p>
          </div>
        </section>

        {/* Section 6: Contact & Support */}
        <section className="mb-12 p-8 rounded-3xl glass-panel border border-cyan-500/20 shadow-2xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold">
              6
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Questions & Contact Information
            </h2>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            If you have questions, inquiries, or feedback regarding these Terms of Service, please reach out to:
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
                  <span>Repository</span>
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
          <div>© {new Date().getFullYear()} Hydrate (tryhydrate.app). All rights reserved.</div>
          <div className="flex items-center gap-4">
            <button onClick={onNavigateHome} className="hover:text-white transition-colors cursor-pointer">
              Home
            </button>
            <span>•</span>
            <button onClick={onNavigateToPrivacy} className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
