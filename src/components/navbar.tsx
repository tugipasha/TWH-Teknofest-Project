import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Sun, Moon, LayoutDashboard, Sliders, LogOut } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { SettingsModal } from './SettingsModal';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, setAuthModalOpen, setAuthMode, logout, activeTab, setActiveTab } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: '#home' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.content, href: '#content' },
    { name: t.nav.contact, href: '#contact' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white/85 dark:bg-navy-950/80 backdrop-blur-lg border-b border-neutral-200 dark:border-white/[0.08] shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] h-16'
          : 'bg-white/45 dark:bg-navy-950/40 backdrop-blur-md border-b border-neutral-100 dark:border-white/[0.03] h-20'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => {
            setActiveTab('learn');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className="flex-shrink-0 flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Visual background layers */}
            <div className="absolute inset-0 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg group-hover:border-neutral-400 dark:group-hover:border-white/25 group-hover:scale-105 transition-all duration-300" />
            <div className="absolute w-4 h-4 border-2 border-neutral-800 dark:border-white/85 rounded-sm transform rotate-45 group-hover:rotate-90 transition-all duration-500" />
          </div>
          <span className="text-neutral-900 dark:text-white font-bold text-xl tracking-wide transition-all duration-300">
            TWH
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => {
                setActiveTab('learn');
              }}
              className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-350 dark:hover:text-white text-sm font-bold transition-all duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-neutral-800 dark:bg-white/80 transition-all duration-300 group-hover:w-full rounded-full" />
            </a>
          ))}
        </nav>

        {/* Right Actions: Theme Toggle, Lang Switcher & CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 hover:border-neutral-350 dark:hover:border-white/20 transition-all duration-200 cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 h-9 rounded-lg border border-neutral-200 dark:border-white/10 text-xs font-bold font-mono text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 hover:border-neutral-350 dark:hover:border-white/20 transition-all duration-200 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'TR' : 'EN'}</span>
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-sky-500 dark:to-indigo-500 text-white flex items-center justify-center text-sm font-black shadow-md hover:scale-105 transition-all cursor-pointer select-none border border-white/20 active:scale-95"
                title={user.name}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
              
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-navy-900 border border-neutral-100 dark:border-navy-800 shadow-xl py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2"
                    >
                      <div className="px-4 py-3 border-b border-neutral-100 dark:border-navy-850">
                        <p className="text-xs font-black text-neutral-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-neutral-450 dark:text-neutral-400 font-mono truncate mt-0.5">{user.email}</p>
                      </div>
                      
                       <div className="py-1">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setActiveTab('practice');
                            setTimeout(() => {
                              const el = document.getElementById('content-container');
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 80);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold font-mono text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-navy-850 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
                          <span>{language === 'en' ? 'Dashboard' : 'Kontrol Paneli'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setActiveTab('practice');
                            setTimeout(() => {
                              const el = document.getElementById('settings-section');
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }, 80);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold font-mono text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-navy-850 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5 text-blue-500" />
                          <span>{language === 'en' ? 'Settings' : 'Ayarlar'}</span>
                        </button>
                      </div>

                      <div className="border-t border-neutral-100 dark:border-navy-850 my-1" />

                      <div className="px-2 py-1">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold font-mono text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 dark:bg-red-500/10 dark:hover:bg-red-500/15 flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Sign Out' : 'Çıkış Yap'}</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button 
              onClick={() => {
                setAuthMode('signup');
                setAuthModalOpen(true);
              }}
              className="relative inline-flex h-9 items-center justify-center rounded-[10px] bg-neutral-950 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 px-5 text-sm font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              {t.nav.getStarted}
            </button>
          )}
        </div>

        {/* Mobile Menu & Lang/Theme toggler wrapper */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 h-8 rounded-lg border border-neutral-200 dark:border-white/10 text-xs font-bold font-mono text-neutral-600 dark:text-neutral-300"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'en' ? 'TR' : 'EN'}</span>
          </button>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors duration-300 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-navy-950/95 backdrop-blur-[16px] border-b border-neutral-200 dark:border-white/[0.05] shadow-2xl"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white text-base font-bold transition-colors duration-300"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveTab('learn');
                  }}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-5 border-t border-neutral-200 dark:border-white/[0.06] mt-2">
               {user ? (
                  <div className="space-y-4">
                    {/* User Mini Info */}
                    <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-navy-900 rounded-xl border border-neutral-200/50 dark:border-navy-800">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-base font-black">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-neutral-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-neutral-500 dark:text-navy-400 font-mono truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setActiveTab('practice');
                          setTimeout(() => {
                            const el = document.getElementById('content-container');
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 80);
                        }}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-neutral-50 dark:bg-navy-900 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-navy-800 text-xs font-bold font-mono cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-blue-500" />
                        <span>{language === 'en' ? 'Dashboard' : 'Panel'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setActiveTab('practice');
                          setTimeout(() => {
                            const el = document.getElementById('settings-section');
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }, 80);
                        }}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-neutral-50 dark:bg-navy-900 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-navy-800 text-xs font-bold font-mono cursor-pointer"
                      >
                        <Sliders className="w-4 h-4 text-blue-500" />
                        <span>{language === 'en' ? 'Settings' : 'Ayarlar'}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full inline-flex h-11 items-center justify-center rounded-[12px] bg-red-500/10 hover:bg-red-500/15 text-red-600 dark:text-red-450 px-6 text-sm font-bold border border-red-500/20 text-center cursor-pointer transition-all"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Sign Out' : 'Çıkış Yap'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setAuthMode('signup');
                      setAuthModalOpen(true);
                    }}
                    className="w-full inline-flex h-11 items-center justify-center rounded-[12px] bg-neutral-950 text-white dark:bg-white dark:text-black px-6 text-sm font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 text-center cursor-pointer opacity-100"
                  >
                    {t.nav.getStarted}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </header>
  );
}
