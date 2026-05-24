import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Dumbbell, 
  BarChart2, 
  Sliders, 
  LogOut, 
  CheckCircle2, 
  Lock, 
  User, 
  Award, 
  Zap, 
  Compass, 
  AlertCircle,
  Menu,
  X,
  Globe,
  Sun,
  Moon,
  TrendingUp,
  History
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { PracticeLab } from './PracticeLab';
import { DashboardSettings } from './DashboardSettings';

export function DashboardLayout() {
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'exercises' | 'progress' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // States loaded from storage dynamically
  const [localStats, setLocalStats] = useState({
    totalXp: 0,
    completedLessonsCount: 0,
    streakDays: 1,
    highestAccuracy: 91.24,
    practicedLetters: [] as string[],
    history: [] as any[]
  });

  // Re-load stats on mount and whenever subTab changes (to ensure settings synchronization)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('twh_practice_sessions_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        setLocalStats({
          totalXp: parsed.totalXp || 0,
          completedLessonsCount: parsed.completedLessonsCount || 0,
          streakDays: parsed.streakDays || 1,
          highestAccuracy: parsed.highestAccuracy || 91.24,
          practicedLetters: parsed.practicedLetters || [],
          history: parsed.history || []
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeSubTab]);

  if (!user) return null;

  // Derive initial initials for avatar
  const getInitials = (name: string) => {
    if (!name) return 'UN';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Dynamic calculations for progress circle to prevent "undefined%" or "NaN%"
  const totalLetters = 6; // supported TID letters is 6 (A, B, C, T, I, D)
  const practicedCount = user.progress?.practicedLetters?.length || localStats.practicedLetters?.length || 0;
  const progressPercent = Math.min(100, Math.round((practicedCount / totalLetters) * 100));
  const remainingLessons = Math.max(0, totalLetters - practicedCount);

  // Sidebar navigation options
  const sidebarItems = [
    {
      id: 'dashboard' as const,
      enLabel: 'Dashboard',
      trLabel: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'exercises' as const,
      enLabel: 'Exercises',
      trLabel: 'Egzersizler',
      icon: Dumbbell,
    },
    {
      id: 'progress' as const,
      enLabel: 'My Progress',
      trLabel: 'İlerlemem',
      icon: BarChart2,
    },
    {
      id: 'settings' as const,
      enLabel: 'Settings',
      trLabel: 'Ayarlar',
      icon: Sliders,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-neutral-100 flex relative transition-colors duration-300">
      
      {/* 1. SIDEBAR SIDE CONTAINER */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#0f1423] text-white transition-all duration-300 flex flex-col justify-between border-r border-white/[0.04] ${
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1">
          {/* Sidebar Header Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/[0.05]">
            <div className={`items-center gap-3 ${isSidebarOpen ? 'flex' : 'hidden md:flex'}`}>
              <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
                <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg" />
                <div className="absolute w-3.5 h-3.5 border-2 border-white/90 rounded-sm transform rotate-45" />
              </div>
              {isSidebarOpen && (
                <span className="font-extrabold text-lg tracking-wider text-slate-100 font-sans">
                  TalkWithHand
                </span>
              )}
            </div>

            {/* Manual Toggle overlay on small layout */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-1 rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
              title="Toggle sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links inside Sidebar */}
          <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSubTab(item.id);
                    // On small screen auto close sidebar after layout navigation select
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold font-sans transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600/85 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={language === 'en' ? item.enLabel : item.trLabel}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  {isSidebarOpen && (
                    <span className="tracking-wide">
                      {language === 'en' ? item.enLabel : item.trLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Details */}
        <div className="p-4 border-t border-white/[0.05] space-y-3">
          {/* Tech/Theme Quick controls toggles inside sidebar */}
          {isSidebarOpen && (
            <div className="flex items-center justify-between pb-1 px-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.08] text-slate-300 hover:text-white transition-all cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.08] text-[10px] font-extrabold font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Change Language"
              >
                {language === 'en' ? 'TR' : 'EN'}
              </button>
            </div>
          )}

          {isSidebarOpen && (
            <div className="px-2 text-center">
              <p className="text-[10px] font-mono font-bold tracking-widest text-slate-500">
                TEKNOFEST 2026
              </p>
            </div>
          )}

          <button
            onClick={() => {
              if (confirm(language === 'en' ? 'Are you sure you want to sign out?' : 'Çıkış yapmak istediğinizden emin misiniz?')) {
                logout();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-black font-mono transition-all cursor-pointer border border-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            {isSidebarOpen && (
              <span>{language === 'en' ? 'Sign Out' : 'Çıkış Yap'}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for small mobile layout */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <main 
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'md:pl-64' : 'md:pl-20'
        }`}
      >
        {/* Header Ribbon bar */}
        <header className="h-16 border-b border-slate-200/60 dark:border-navy-850 px-6 flex items-center justify-between bg-white/80 dark:bg-navy-900/40 backdrop-blur-md sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Toggle sidebar Layout"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-black tracking-wide text-slate-500 dark:text-navy-400 uppercase font-mono">
              {language === 'en' 
                ? `${activeSubTab.toUpperCase()} PANEL` 
                : `${activeSubTab === 'dashboard' ? 'KONTROL PANELİ' : activeSubTab === 'exercises' ? 'UYGULAMA LABİ' : activeSubTab === 'progress' ? 'GELİŞİM VERİLERİ' : 'ORTAM AYARLARI'}`}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick stats streak display */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-extrabold font-sans text-amber-600 dark:text-amber-400">
              <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse fill-amber-500" />
              <span>{language === 'en' ? `${localStats.streakDays} Day Streak` : `${localStats.streakDays} Günlük Seri`}</span>
            </div>

            {/* Quick User Badge Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-md border border-white/20 select-none">
                {getInitials(user.name)}
              </div>
              <span className="hidden sm:inline text-xs font-black text-slate-800 dark:text-slate-200">
                {user.name}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Subviews Component */}
        <div className="flex-1 p-6 sm:p-8 max-w-[1400px] w-full mx-auto space-y-8">
          <AnimatePresence mode="wait">
            
            {/* SUB-TAB A: CORE DASHBOARD */}
            {activeSubTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Greeting banner card styled beautifully */}
                <div className="bg-white dark:bg-[#161f30] rounded-3xl border border-slate-200/50 dark:border-white/[0.04] p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all duration-300">
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-500/5 to-transparent rounded-r-3xl pointer-events-none" />
                  
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5 font-sans">
                    {language === 'en' ? `Welcome, ${user.name}! 🌟` : `Hoş Geldin, ${user.name}! 👋`}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    {language === 'en' 
                      ? 'What would you like to practice and master in sign language today?' 
                      : 'Bugün yeni bir şeyler öğrenmeye ne dersin?'}
                  </p>
                </div>

                {/* 2-Column Responsive Bento Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* LEFT: LEARNING ROADMAP MODULES (Col 7) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-2 px-2">
                      <Compass className="w-4.5 h-4.5 text-blue-500" />
                      <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-400 dark:text-navy-400">
                        {language === 'en' ? 'Learning Path' : 'Öğrenme Yolun'}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* CARD 1: Harfler - Bölüm 1 (COMPLETED) */}
                      <div className="bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01] rounded-2xl border border-emerald-500/20 p-5 flex items-start gap-4 transition-all hover:bg-emerald-500/[0.05]">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
                              {language === 'en' ? 'COMPLETED' : 'TAMAMLANDI'}
                            </span>
                          </div>
                          <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">
                            {language === 'en' ? 'Letters - Section 1' : 'Harfler - Bölüm 1'}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {language === 'en' 
                              ? 'You have successfully practice and validated letters: A, B, C, D.' 
                              : 'A, B, C, D harflerini tamamladın.'}
                          </p>
                        </div>
                      </div>

                      {/* CARD 2: Harfler - Bölüm 2 (ACTIVE) */}
                      <div className="bg-white dark:bg-[#161f30] rounded-2xl border-2 border-blue-500/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-600/10 border-2 border-blue-500 flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold font-sans text-sm flex-shrink-0">
                            2
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400">
                              {language === 'en' ? 'IN PROGRESS' : 'SIRADAKİ ADIM'}
                            </span>
                            <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">
                              {language === 'en' ? 'Letters - Section 2' : 'Harfler - Bölüm 2'}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              {language === 'en' 
                                ? 'Practice and classify deep coordinates for letters: E, F, G, H.' 
                                : 'E, F, G, H harfleriyle devam et.'}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveSubTab('exercises')}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wide uppercase transition-all duration-200 shadow-md cursor-pointer select-none text-center transform active:scale-95"
                        >
                          {language === 'en' ? 'Continue' : 'Devam Et'}
                        </button>
                      </div>

                      {/* CARD 3: Temel Selamlaşma (LOCKED) */}
                      <div className="bg-slate-100/40 dark:bg-navy-950/40 rounded-2xl border border-slate-200/50 dark:border-navy-850 p-5 flex items-start gap-4 opacity-75">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-navy-900 border border-slate-350 dark:border-navy-800 flex items-center justify-center text-slate-400 dark:text-navy-500 flex-shrink-0">
                          <Lock className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold font-mono tracking-wider text-slate-400 dark:text-navy-500">
                            {language === 'en' ? 'LOCKED' : 'KİLİTLİ'}
                          </span>
                          <h4 className="text-base font-extrabold text-slate-400 dark:text-navy-500 mt-1">
                            {language === 'en' ? 'Basic Greetings' : 'Temel Selamlaşma'}
                          </h4>
                          <p className="text-xs text-slate-450 dark:text-slate-600 mt-1">
                            {language === 'en' ? 'Not yet accessible.' : 'Henüz erişilemez.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: OVERVIEW PROGRESS WHEEL & TELEMETRY (Col 5) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center gap-2 px-2">
                      <Award className="w-4.5 h-4.5 text-blue-500" />
                      <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-400 dark:text-navy-400">
                        {language === 'en' ? 'General Progress' : 'Genel İlerleme'}
                      </h3>
                    </div>

                    <div className="bg-white dark:bg-[#161f30] rounded-3xl border border-slate-200/50 dark:border-white/[0.04] p-6 shadow-sm space-y-6 flex flex-col items-center justify-center text-center transition-colors duration-300">
                      
                      {/* FIXED Circular Progress wheel ring container */}
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {/* Background Ring Track */}
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            className="stroke-slate-100 dark:stroke-navy-850"
                            strokeWidth="9"
                            fill="transparent"
                          />
                          {/* Glowing Accent Indicator Ring */}
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            className="stroke-blue-600 dark:stroke-blue-500 transition-all duration-1000 ease-out"
                            strokeWidth="9"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 42}`}
                            strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressPercent / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        
                        {/* Centered Percentage string representation */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-slate-900 dark:text-white font-sans">
                            %{progressPercent}
                          </span>
                          <span className="text-[10px] font-bold font-mono tracking-widest text-slate-400 dark:text-navy-400 uppercase">
                            {language === 'en' ? 'LEARNED' : 'TAMAM'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 w-full">
                        <h4 className="text-sm font-black text-slate-800 dark:text-white">
                          {language === 'en' ? 'Doing fantastic!' : 'Harika Gidiyorsun!'}
                        </h4>
                        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                          {language === 'en' 
                            ? `Practice and secure ${remainingLessons} more letters to finalize the TID coordinate curriculum.`
                            : `Hedefine ulaşmak için ${remainingLessons} ders daha tamamlamalısın.`}
                        </p>
                      </div>
                    </div>

                    {/* Stats summary card list */}
                    <div className="bg-white dark:bg-[#161f30] rounded-3xl border border-slate-200/50 dark:border-white/[0.04] p-6 shadow-sm space-y-4 transition-colors duration-300">
                      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-navy-850 pb-3">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <h4 className="text-xs font-black uppercase font-mono tracking-wider text-slate-700 dark:text-neutral-200">
                          {language === 'en' ? 'Your Telemetry' : 'İstatistiklerin'}
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-150/40 dark:border-navy-850">
                          <p className="text-[10px] font-bold font-mono text-slate-400 dark:text-navy-400 uppercase">
                            {language === 'en' ? 'LEARNED LETTERS' : 'ÖĞRENİLEN HARF'}
                          </p>
                          <p className="text-lg font-black text-slate-800 dark:text-white mt-1">
                            {practicedCount} / {totalLetters}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-150/40 dark:border-navy-850">
                          <p className="text-[10px] font-bold font-mono text-slate-400 dark:text-navy-400 uppercase">
                            {language === 'en' ? 'COMPLETED TESTS' : 'TAMAMLANAN TEST'}
                          </p>
                          <p className="text-lg font-black text-slate-800 dark:text-white mt-1">
                            {localStats.completedLessonsCount}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-150/40 dark:border-navy-850">
                          <p className="text-[10px] font-bold font-mono text-slate-400 dark:text-navy-400 uppercase">
                            {language === 'en' ? 'TOTAL SCORE XP' : 'KAZANILAN TP'}
                          </p>
                          <p className="text-lg font-black text-slate-800 dark:text-white mt-1">
                            {localStats.totalXp} XP
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-150/40 dark:border-navy-850">
                          <p className="text-[10px] font-bold font-mono text-slate-400 dark:text-navy-400 uppercase">
                            {language === 'en' ? 'MAX ACCURACY' : 'EN YÜKSEK DOĞRULUK'}
                          </p>
                          <p className="text-lg font-black text-slate-800 dark:text-white mt-1">
                            {localStats.highestAccuracy}%
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* SUB-TAB B: EXERCISES (Interactive PracticeLab) */}
            {activeSubTab === 'exercises' && (
              <motion.div
                key="exercises"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-white dark:bg-[#161f30] rounded-3xl border border-slate-200/50 dark:border-white/[0.04] p-1 md:p-3 overflow-hidden shadow-md transition-colors duration-300">
                  <PracticeLab />
                </div>
              </motion.div>
            )}

            {/* SUB-TAB C: PROGRESS (Telemetry charts list) */}
            {activeSubTab === 'progress' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Visual history tracking elements */}
                <div className="bg-white dark:bg-[#161f30] rounded-3xl border border-slate-200/50 dark:border-white/[0.04] p-6 sm:p-8 shadow-sm transition-colors duration-300">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-navy-850 pb-4 mb-6">
                    <History className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {language === 'en' ? 'Real-Time Evaluation History' : 'Egzersiz Sonuç Defteri'}
                    </h3>
                  </div>

                  {localStats.history && localStats.history.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-navy-850 text-[10px] font-bold font-mono tracking-widest text-slate-400 dark:text-navy-400 uppercase">
                            <th className="py-3 px-4">{language === 'en' ? 'Date & Time' : 'Tarih & Saat'}</th>
                            <th className="py-3 px-4">{language === 'en' ? 'Target Letter' : 'Hedef Harf'}</th>
                            <th className="py-3 px-4">{language === 'en' ? 'Confidence' : 'Doğruluk'}</th>
                            <th className="py-3 px-4">{language === 'en' ? 'Result' : 'Sonuç'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50 dark:divide-navy-850/50 text-xs">
                          {localStats.history.slice().reverse().map((entry: any, i: number) => (
                            <tr key={entry.id || i} className="hover:bg-slate-50/50 dark:hover:bg-navy-850/20 transition-colors">
                              <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                                {new Date(entry.timestamp).toLocaleString(language === 'en' ? 'en-US' : 'tr-TR', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold flex items-center justify-center border border-blue-500/15">
                                  {entry.letter}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-extrabold font-sans">
                                {entry.accuracy}%
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  entry.status === 'Success' || entry.status === 'Başarılı'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15'
                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-500/15'
                                }`}>
                                  {entry.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 px-4 space-y-3">
                      <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-xs font-mono font-bold text-slate-400 uppercase">
                        {language === 'en' ? 'NO PRACTICE LOGS DETECTED' : 'KAYITLI VERİ BULUNAMADI'}
                      </p>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {language === 'en' 
                          ? 'Open the interactive sign language practice lab and execute coordinate evaluations to populate telemetry.'
                          : 'Uygulama labına gidip kamera eşleştirmesi yaparak ilk test verilerinizi kaydedebilirsiniz.'}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SUB-TAB D: SETTINGS (Calibration options) */}
            {activeSubTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <DashboardSettings />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
