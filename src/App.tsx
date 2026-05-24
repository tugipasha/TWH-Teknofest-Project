import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { 
  HeroSection, 
  AboutSection,
  FeaturesSection, 
  ArchitectureSection,
  TimelineSection,
  CtaSection, 
  Footer 
} from "@/components/landing";
import { LanguageProvider } from "@/components/LanguageContext";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { ThemeProvider } from "@/components/ThemeContext";
import { AuthModal } from "@/components/AuthModal";
import { ContactSection } from "@/components/ContactSection";
import { DashboardLayout } from "@/components/DashboardLayout";

function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-400/60 dark:from-white dark:via-neutral-300 dark:to-white/60 z-[100] transition-all duration-75"
      style={{ width: `${scrollProgress}%` }}
    />
  );
}

function AppContent() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      // past the hero section (which is approximately 100vh)
      setShowBackToTop(window.scrollY > window.innerHeight * 0.9);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Securely render the completely separate dashboard screen when logged in, with no impact to the public landing page!
  if (user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 font-sans select-none">
        <DashboardLayout />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-navy-950 text-neutral-900 dark:text-white selection:bg-indigo-500/30 font-sans relative transition-colors duration-300">
      {/* Dynamic active scroll progress indicator */}
      <ScrollProgress />

      <Navbar />
      <main className="relative">
        {/* Full-screen fixed 3D Hero background layer */}
        <div className="fixed top-0 left-0 w-full h-screen md:h-[100dvh] z-0">
          <HeroSection />
        </div>
        
        {/* Overlapping Content layer that slides upward over the top of the Home page */}
        <div id="content-container" className="relative z-10 mt-[100vh] md:mt-[100dvh] bg-white dark:bg-navy-950 shadow-[0_-30px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_-30px_60px_rgba(15,23,42,0.45)] border-t border-neutral-200 dark:border-white/[0.04] transition-colors duration-300">
          
          <AboutSection />
          <FeaturesSection />
          <ArchitectureSection />
          <TimelineSection />
          <ContactSection />
          <CtaSection />
          <Footer />
        </div>
      </main>

      {/* Beautiful Animated Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            id="back-to-top-btn"
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="fixed bottom-8 right-8 z-[60] p-4 rounded-full bg-white dark:bg-navy-900 text-neutral-900 dark:text-white border border-neutral-150 dark:border-navy-800 shadow-xl hover:shadow-2xl hover:bg-neutral-50 dark:hover:bg-navy-800 transition-all cursor-pointer flex items-center justify-center group"
            aria-label="Back to top"
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-5 h-5 text-neutral-750 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Stateful modal popup trigger views */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
