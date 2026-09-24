import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { HydrationCalculator } from './components/HydrationCalculator';
import { DownloadsMatrix } from './components/DownloadsMatrix';
import { FAQ } from './components/FAQ';
import { GitHubTrust } from './components/GitHubTrust';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';

export type ActivePage = 'home' | 'privacy' | 'terms';

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');

  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.includes('/privacy') || hash.includes('/privacy')) {
        setActivePage('privacy');
      } else if (path.includes('/terms') || hash.includes('/terms')) {
        setActivePage('terms');
      } else {
        setActivePage('home');
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, []);

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateToPrivacy = () => {
    window.history.pushState({}, '', '/privacy');
    setActivePage('privacy');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateToTerms = () => {
    window.history.pushState({}, '', '/terms');
    setActivePage('terms');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (activePage === 'privacy') {
    return (
      <PrivacyPolicy
        onNavigateHome={navigateToHome}
        onNavigateToTerms={navigateToTerms}
      />
    );
  }

  if (activePage === 'terms') {
    return (
      <TermsOfService
        onNavigateHome={navigateToHome}
        onNavigateToPrivacy={navigateToPrivacy}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient background grid pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar
          onNavigateToPrivacy={navigateToPrivacy}
          onNavigateToTerms={navigateToTerms}
        />
        <main className="flex-1">
          <Hero />
          <Features />
          <HowItWorks />
          <HydrationCalculator />
          <DownloadsMatrix />
          <FAQ />
          <GitHubTrust />
        </main>
        <Footer
          onNavigateToPrivacy={navigateToPrivacy}
          onNavigateToTerms={navigateToTerms}
        />
      </div>
    </div>
  );
}

export default App;
