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
import { AdminRouter } from './components/admin/AdminRouter';

export function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      setIsAdminMode(path.startsWith('/admin'));
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  const navigateToAdmin = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    window.history.pushState({}, '', '/admin/users');
    setIsAdminMode(true);
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setIsAdminMode(false);
  };

  if (isAdminMode) {
    return (
      <AdminRouter
        onNavigateHome={navigateToHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient background grid pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar onNavigateToAdmin={navigateToAdmin} />
        <main className="flex-1">
          <Hero />
          <Features />
          <HowItWorks />
          <HydrationCalculator />
          <DownloadsMatrix />
          <FAQ />
          <GitHubTrust />
        </main>
        <Footer onNavigateToAdmin={navigateToAdmin} />
      </div>
    </div>
  );
}

export default App;
