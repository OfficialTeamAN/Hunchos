import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import { usePerformance } from './components/PerformanceContext';
import LoadingScreen from './components/LoadingScreen';

function ScrollToTop({ lenisRef }) {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const scrollTarget = params.get('scroll');

    if (scrollTarget === 'vip-ranks') {
      setTimeout(() => {
        const el = document.getElementById('vip-ranks');
        if (el && lenisRef.current) {
          lenisRef.current.scrollTo(el, { duration: 1.2 });
        }
      }, 150);
    } else {
      setTimeout(() => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
          lenisRef.current.resize(); // Recalculate dimensions for Lenis
        } else {
          window.scrollTo(0, 0);
        }
      }, 50); // delay allows route mount/exit animation height shifts to settle
    }
  }, [pathname, search, lenisRef]);

  return null;
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AppContent({ lenisRef }) {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <LoadingScreen />
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/leaderboard" element={<PageWrapper><Leaderboard /></PageWrapper>} />
            <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const lenisRef = useRef(null);
  const perf = usePerformance();
  const enableLenis = perf ? perf.settings.enableLenis : true;

  useEffect(() => {
    if (!enableLenis) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [enableLenis]);

  return (
    <BrowserRouter>
      <ScrollToTop lenisRef={lenisRef} />
      <AppContent lenisRef={lenisRef} />
    </BrowserRouter>
  );
}
