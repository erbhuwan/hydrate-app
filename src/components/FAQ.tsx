import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'Is Hydrate free to use?',
    a: 'Yes! Hydrate is 100% free to download and use for macOS and Windows. There are no subscriptions, paywalls, or feature locks.',
  },
  {
    q: 'How does Google Drive backup and Google Calendar integration work?',
    a: 'Hydrate communicates directly with official Google APIs via encrypted HTTPS without any intermediate third-party servers. Google Drive backup uses the private, hidden appDataFolder to save your hydrate_backup.json file (it cannot read any other files in your Drive). Google Calendar uses read-only permission solely on your device to detect when you are in meetings and automatically snooze hydration prompts.',
  },
  {
    q: 'How does Work Mode protect my privacy?',
    a: 'Hydrate uses native OS event listeners solely to detect if keyboard or mouse events have occurred recently. It NEVER records keystrokes, letters typed, mouse coordinates, screen contents, or application names. Everything is evaluated locally in volatile RAM and immediately discarded.',
  },
  {
    q: 'How does the custom hydration day reset work?',
    a: 'Human sleep and wake cycles do not conform to midnight calendar boundaries. If you drink water late at night while working, that intake belongs to your current active session. Hydrate allows you to configure a custom morning rollover time (e.g. 6:00 AM) that matches your actual waking routine.',
  },
  {
    q: 'Does Hydrate require an internet connection?',
    a: 'Not at all. Hydrate is architected offline-first. All your logs, streaks, and settings are stored locally on your device in standard JSON files. Connecting your Google account for Google Drive backup and Google Calendar smart snooze is completely optional.',
  },
  {
    q: 'How lightweight is the background footprint?',
    a: 'Hydrate runs as a background tray/menu bar daemon consuming minimal CPU and under 45 MB of memory. It will never bog down your workstation or impact battery life.',
  },
  {
    q: 'How do updates work?',
    a: 'Hydrate periodically checks for new stable releases. When an update is published, a subtle notification appears allowing you to update in one click.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative bg-[#090d16]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30">
            Answers & Clarity
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-3">
            Everything you need to know about privacy, platform compatibility, Google integrations, and features.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-panel border border-white/5 overflow-hidden transition-all duration-200 hover:border-slate-700"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-base font-semibold text-white tracking-tight flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
