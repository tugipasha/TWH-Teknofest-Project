import { motion } from 'framer-motion';
import { Brain, Zap, Globe, Activity, ChevronDown } from 'lucide-react';
import { SplineScene } from '@/components/ui/splite';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/40 to-white dark:from-[#0b1120] dark:via-[#0f172a] dark:to-[#0b1120] transition-colors duration-300">
      {/* Immersive 3D Spline Scene as Full-Screen Background - optimized pointer events for seamless mobile touch scrolling */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none md:pointer-events-auto select-none opacity-80 md:opacity-100">
        <SplineScene 
          scene="https://prod.spline.design/G4Au1Il1b-V4enq6/scene.splinecode" 
          className="w-full h-full pointer-events-none md:pointer-events-auto" 
        />
      </div>

      {/* Soft dark/light vignetting ambient mask over the 3D Spline Scene for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/70 dark:from-[#0b1120] dark:via-transparent dark:to-[#0b1120]/70 z-1 pointer-events-none transition-colors duration-300" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white to-transparent dark:from-[#0b1120] dark:to-transparent z-1 pointer-events-none transition-colors duration-300" />

      {/* Visual Content overlay on the Spline Scene */}
      <div className="relative z-10 text-center max-w-4xl px-6 pointer-events-none select-none flex flex-col items-center justify-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-4 text-navy-900 dark:text-white drop-shadow-sm dark:drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] font-sans transition-colors duration-300"
        >
          {t.hero.title}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm sm:text-lg md:text-xl text-navy-700 dark:text-neutral-300 max-w-2xl mb-6 sm:mb-8 leading-relaxed font-semibold dark:font-normal bg-white/60 dark:bg-black/10 border border-navy-150/40 dark:border-white/5 rounded-xl px-3.5 py-2 sm:px-4 sm:py-2 transition-colors duration-300 shadow-sm dark:shadow-none"
        >
          {t.hero.subtitle}
        </motion.p>
        
        {/* Report Metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-2.5 w-full max-w-lg mt-2 sm:mt-4 text-navy-700 dark:text-neutral-350 font-mono text-xs border border-navy-200 dark:border-white/5 bg-white/90 dark:bg-black/65 backdrop-blur-xl p-3 md:p-4 rounded-xl shadow-lg dark:shadow-2xl relative z-10 transition-colors duration-300"
        >
          <div className="flex flex-col gap-0.5 border-b md:border-b-0 md:border-r border-navy-150 dark:border-white/5 pb-2 md:pb-0">
            <span className="text-navy-400 dark:text-neutral-500 text-[10px] uppercase">PROJECT TEAM</span>
            <span className="text-navy-900 dark:text-white font-bold">İAOSB NUMTAL TWH</span>
          </div>
          <div className="flex flex-col gap-0.5 border-b md:border-b-0 md:border-r border-navy-150 dark:border-white/5 pb-2 md:pb-0">
            <span className="text-navy-400 dark:text-neutral-500 text-[10px] uppercase">APPLICATION ID</span>
            <span className="text-navy-900 dark:text-white font-bold">4895713</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-navy-400 dark:text-neutral-500 text-[10px] uppercase">TEAM ID</span>
            <span className="text-navy-900 dark:text-white font-bold">791558</span>
          </div>
        </motion.div>
        
        <div className="text-[11px] font-mono text-navy-500 dark:text-neutral-450 mt-4 uppercase tracking-widest transition-colors duration-300">
          {t.hero.category}
        </div>
      </div>

      {/* Subtle indicator inviting user to scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-xs uppercase tracking-[0.25em] font-bold font-mono text-navy-500 dark:text-neutral-400 transition-colors duration-300">
          {t.hero.scrollDown}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-navy-550 dark:text-neutral-400 transition-colors duration-300" />
        </motion.div>
      </div>
    </section>
  );
}

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-16 md:py-24 lg:py-32 relative border-b border-navy-100 dark:border-navy-900 transition-colors duration-300 bg-white dark:bg-navy-950">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Scope & Purpose */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-50/70 dark:bg-navy-900/40 border border-navy-100 dark:border-navy-800 text-xs font-bold font-mono text-navy-700 dark:text-navy-300 transition-colors">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-450 animate-pulse" />
              {t.about.badge}
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-navy-900 dark:text-white leading-tight transition-colors">
              {t.about.title}
            </h2>
            
            <p className="text-base sm:text-lg text-navy-600 dark:text-navy-300 leading-relaxed transition-colors font-medium">
              {t.about.description}
            </p>
                        <div className="p-6 sm:p-8 rounded-3xl border border-navy-100 dark:border-navy-850 bg-navy-50/30 dark:bg-navy-900/10 backdrop-blur-md transition-colors">
              <h3 className="text-lg font-bold text-navy-800 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded bg-navy-500 dark:bg-navy-400 inline-block" />
                {t.about.purposeTitle}
              </h3>
              <p className="text-navy-550 dark:text-navy-400 text-sm leading-relaxed transition-colors">
                {t.about.purposeDesc}
              </p>
            </div>
          </div>
                    {/* Right Column: AI Metrics Showcase */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            <div className="rounded-3xl p-6 sm:p-8 border border-navy-700/10 dark:border-navy-700 bg-gradient-to-br from-navy-700 to-navy-800 dark:from-navy-800 dark:to-navy-900 text-white flex flex-col items-center justify-center text-center py-8 sm:py-12 relative overflow-hidden group shadow-xl">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
              <span className="text-navy-300 font-mono text-xs uppercase mb-2 tracking-widest">{t.about.statLabel}</span>
              <span className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white drop-shadow-md group-hover:scale-105 transition-transform duration-500">
                {t.about.statVal}
              </span>
              <span className="text-[10px] text-navy-200 font-mono mt-4 border border-white/10 px-3 py-1 rounded-full bg-black/30">TİD MODEL TRAINING ACCURACY</span>
            </div>
            
            <div className="p-6 rounded-2xl border border-navy-150 dark:border-navy-800 bg-white dark:bg-navy-900/35 shadow-sm flex items-center gap-4 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-navy-100 dark:bg-navy-800 border border-navy-200 dark:border-navy-700 flex items-center justify-center text-navy-700 dark:text-blue-400 font-mono font-bold text-sm">TİD</div>
              <div>
                <h4 className="text-sm font-bold text-navy-800 dark:text-white">AUTSL Dataset Reference</h4>
                <p className="text-xs text-navy-550 dark:text-navy-350 leading-relaxed">Türk İşaret Dili (TİD) dataset structure utilized for coordinate classification training</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const { t } = useLanguage();

  const solutions = [
    { title: t.problemSolution.sol1Title, desc: t.problemSolution.sol1Desc, icon: Brain },
    { title: t.problemSolution.sol2Title, desc: t.problemSolution.sol2Desc, icon: Zap },
    { title: t.problemSolution.sol3Title, desc: t.problemSolution.sol3Desc, icon: Activity },
    { title: t.problemSolution.sol4Title, desc: t.problemSolution.sol4Desc, icon: Globe },
  ];

  return (
    <section id="content" className="py-16 md:py-24 lg:py-32 relative border-b border-navy-100 dark:border-navy-900 bg-navy-50/30 dark:bg-navy-900/35 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 dark:border-rose-500/25 text-xs font-bold font-mono text-rose-600 dark:text-rose-400 mb-6 transition-colors">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            {t.problemSolution.badge}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mt-4 items-start">
            <div className="lg:col-span-5 p-6 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] border border-rose-100 dark:border-rose-950/20 bg-rose-50/40 dark:bg-rose-950/5 backdrop-blur-xl relative overflow-hidden shadow-sm transition-colors">
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl" />
              <h3 className="text-2xl md:text-3xl font-black text-rose-600 dark:text-rose-400 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                {t.problemSolution.problemTitle}
              </h3>
              <p className="text-rose-900/85 dark:text-rose-200/70 leading-relaxed text-sm md:text-base font-medium transition-colors">
                {t.problemSolution.problemDesc}
              </p>
            </div>
            
            <div className="lg:col-span-7">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy-900 dark:text-white mb-6 md:mb-8 transition-colors">
                {t.problemSolution.solutionTitle}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {solutions.map((sol, index) => (
                  <div key={index} className="p-6 rounded-2xl bg-white dark:bg-navy-800/45 border border-navy-100 dark:border-navy-800 hover:border-navy-300 dark:hover:border-navy-700 hover:bg-navy-50/30 dark:hover:bg-navy-900/40 transition-all duration-300 group shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-navy-50 dark:bg-navy-800 border border-navy-150 dark:border-navy-750 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500/20 transition-all duration-300 text-navy-600 dark:text-navy-300">
                      <sol.icon className="w-5 h-5 transition-colors" />
                    </div>
                    <h4 className="text-base font-bold text-navy-850 dark:text-navy-100 mb-2 transition-colors">{sol.title}</h4>
                    <p className="text-navy-550 dark:text-navy-350 text-xs leading-relaxed transition-colors">{sol.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
 export function ArchitectureSection() {
  const { t } = useLanguage();

  const techStack = [
    { title: t.architecture.tfTitle, desc: t.architecture.tfDesc, badge: 'MODEL CORE' },
    { title: t.architecture.mpTitle, desc: t.architecture.mpDesc, badge: 'VISION LINE' },
    { title: t.architecture.slTitle, desc: t.architecture.slDesc, badge: 'SCALING' },
    { title: t.architecture.pnTitle, desc: t.architecture.pnDesc, badge: 'MATH MATRIX' }
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 relative border-b border-navy-100 dark:border-navy-900 transition-colors duration-300 bg-white dark:bg-navy-950">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-12 md:mb-20 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/10 dark:border-cyan-500/25 text-xs font-bold font-mono text-cyan-600 dark:text-cyan-400 mb-6 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {t.architecture.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-navy-900 dark:text-white mb-6 transition-colors">
            {t.architecture.title}
          </h2>
          <p className="text-lg text-navy-600 dark:text-navy-300 transition-colors font-medium">
            {t.architecture.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techStack.map((tech, index) => (
            <div key={index} className="p-6 rounded-2xl border border-navy-100 dark:border-navy-800 bg-white dark:bg-navy-900/45 hover:bg-navy-50/50 dark:hover:bg-navy-900/60 transition-all duration-300 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                <h3 className="font-bold text-lg text-navy-850 dark:text-white font-mono transition-colors">{tech.title}</h3>
                <span className="text-[10px] w-fit font-mono font-bold bg-navy-50 dark:bg-navy-800 text-navy-600 dark:text-navy-300 border border-navy-150 dark:border-navy-750 px-2.5 py-1 rounded-full uppercase tracking-wider">{tech.badge}</span>
              </div>
              <p className="text-xs sm:text-sm text-navy-550 dark:text-navy-350 leading-relaxed font-sans transition-colors">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TimelineSection() {
  const { t } = useLanguage();

  const steps = [
    { title: t.timeline.p1Title, desc: t.timeline.p1Desc, date: 'October 2025' },
    { title: t.timeline.p2Title, desc: t.timeline.p2Desc, date: 'Oct - Nov 2025' },
    { title: t.timeline.p3Title, desc: t.timeline.p3Desc, date: 'December 2025' },
    { title: t.timeline.p4Title, desc: t.timeline.p4Desc, date: 'Jan - Feb 2026' }
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 relative border-b border-navy-100 dark:border-navy-900 bg-white dark:bg-navy-950 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-12 md:mb-20 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/25 text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mb-6 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t.timeline.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-navy-900 dark:text-white mb-6 transition-colors font-sans">
            {t.timeline.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Responsive line guide (vertical on mobile, horizontal on desktop) */}
          <div className="block md:hidden absolute left-[27px] top-[28px] bottom-[28px] w-[1.5px] bg-navy-100 dark:bg-navy-800 z-0" />
          <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-[1.5px] bg-navy-100 dark:bg-navy-800 z-0 transition-colors" />
          
          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col pl-14 md:pl-0">
              {/* Bullets (shifted left on mobile so the timeline fits) */}
              <div className="absolute left-0 top-0 md:relative w-14 h-14 rounded-full bg-navy-50 dark:bg-navy-800 border border-navy-200 dark:border-navy-700 flex items-center justify-center mb-6 text-sm font-bold font-mono text-navy-800 dark:text-navy-200 transition-colors">
                0{index + 1}
              </div>
              <span className="text-xs font-mono text-navy-500 dark:text-navy-450 uppercase tracking-widest mb-1.5 inline-block">{step.date}</span>
              <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-3 leading-snug transition-colors">{step.title}</h3>
              <p className="text-xs text-navy-550 dark:text-navy-355 leading-relaxed font-sans transition-colors">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShowcaseSection() {
  // Keeping this for potential fallback or backwards imports as empty or lightweight spacer
  return null;
}

export function StatsSection() {
  // Stats now handled beautifully inside About Section as accuracy block
  return null;
}

export function TestimonialSection() {
  // Dropping generic testimonial for high relevance to the Teknofest academic report
  return null;
}

export function CtaSection() {
  const { t, language } = useLanguage();
  const { user, setAuthModalOpen, setAuthMode, logout } = useAuth();

  return (
    <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-br from-navy-50 to-white dark:from-navy-900 dark:to-navy-800 border-t border-b border-navy-150 dark:border-navy-800 transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-blue-600/10 dark:to-transparent blur-[150px] pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-navy-900 dark:text-white mb-6 tracking-tight leading-tight max-w-4xl mx-auto transition-colors">
          {language === 'en' ? 'Cross Communication Barriers with Real-Time AI feedback.' : 'Anlık Yapay Zekâ Geri Bildirimiyle Engelleri Aşın.'}
        </h3>
        <p className="text-navy-600 dark:text-navy-200/80 text-sm md:text-base max-w-2xl mx-auto mb-10 font-semibold dark:font-medium leading-relaxed transition-colors">
          {language === 'en' 
            ? 'Sign up to explore real-time hand gesture tracking metrics, expert-curated modules, and personalized coordinate feedback tools.' 
            : 'Gerçek zamanlı el hareketi takip grafiklerini, uzman müfredatları ve kişiselleştirilmiş geri bildirim modüllerini denemek için şimdi ücretsiz hesap açın.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
          {user ? (
            <button 
              onClick={logout}
              className="w-full sm:w-auto px-6 py-3.5 sm:px-10 sm:py-5 text-base sm:text-lg rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-450 border border-rose-500/20 dark:border-rose-500/30 font-bold transition-all duration-300 hover:scale-[1.02] shadow-lg cursor-pointer"
            >
              {user.name} ({language === 'en' ? 'Sign Out' : 'Çıkış Yap'})
            </button>
          ) : (
            <button 
              onClick={() => {
                setAuthMode('signup');
                setAuthModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3.5 sm:px-10 sm:py-5 text-base sm:text-lg rounded-full bg-navy-950 text-white hover:bg-navy-850 dark:bg-white dark:text-navy-950 dark:hover:bg-navy-50 font-bold transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-white/10 cursor-pointer"
            >
              {t.nav.getStarted}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-12 md:py-16 border-t border-navy-100 dark:border-navy-800 bg-navy-50/50 dark:bg-navy-900/40 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-6 gap-y-10 gap-x-6 md:gap-8 mb-16">
        <div className="col-span-2 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-8 h-8 flex items-center justify-center">
              {/* Visual background layers */}
              <div className="absolute inset-0 bg-navy-100 dark:bg-navy-900 border border-navy-200 dark:border-navy-850 rounded-lg" />
              <div className="absolute w-4 h-4 border-2 border-navy-700 dark:border-white/85 rounded-sm transform rotate-45 animate-pulse" />
            </div>
            <span className="text-navy-900 dark:text-white font-bold text-xl tracking-wide">TWH</span>
          </div>
          <p className="text-navy-600 dark:text-navy-400 max-w-xs leading-relaxed text-sm transition-colors">
            {t.footer.desc}
          </p>
        </div>
        
        <div className="col-span-1">
          <h4 className="text-navy-900 dark:text-white font-bold mb-6 text-sm transition-colors">Product</h4>
          <ul className="space-y-4 text-sm text-navy-500 dark:text-navy-450 transition-colors">
            <li><a href="#home" className="hover:text-navy-900 dark:hover:text-white transition-colors">{t.nav.home}</a></li>
            <li><a href="#about" className="hover:text-navy-900 dark:hover:text-white transition-colors">{t.nav.about}</a></li>
            <li><a href="#content" className="hover:text-navy-900 dark:hover:text-white transition-colors">{t.nav.content}</a></li>
            <li><a href="#contact" className="hover:text-navy-900 dark:hover:text-white transition-colors">{t.nav.contact}</a></li>
          </ul>
        </div>
        
        <div className="col-span-1">
          <h4 className="text-navy-900 dark:text-white font-bold mb-6 text-sm transition-colors">Competitions</h4>
          <ul className="space-y-4 text-sm text-navy-550 dark:text-navy-400 font-mono text-[11px] transition-colors">
            <li className="text-navy-700 dark:text-navy-300 font-bold">TEKNOFEST 2026</li>
            <li>Digital Education</li>
            <li>ID: 4895713</li>
          </ul>
        </div>
        
        <div className="col-span-1">
          <h4 className="text-navy-900 dark:text-white font-bold mb-6 text-sm transition-colors">Institution</h4>
          <ul className="space-y-4 text-sm text-navy-550 dark:text-navy-400 transition-colors">
            <li className="text-navy-700 dark:text-navy-300 font-bold text-xs">İAOSB NUMTAL</li>
            <li className="text-xs">İzmir Atatürk Org. San. Bölgesi</li>
          </ul>
        </div>
        
        <div className="col-span-1">
          <h4 className="text-navy-900 dark:text-white font-bold mb-6 text-sm transition-colors">Legal</h4>
          <ul className="space-y-4 text-sm text-navy-550 dark:text-navy-400 transition-colors">
            <li><a href="#" className="hover:text-navy-900 dark:hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-navy-900 dark:hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-[1400px] mx-auto px-6 pt-8 border-t border-navy-150 dark:border-navy-900 flex flex-col md:flex-row items-center justify-between text-sm text-navy-400 dark:text-navy-500 transition-colors">
        <div>{t.footer.rights}</div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-navy-900 dark:hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-navy-900 dark:hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-navy-900 dark:hover:text-white transition-colors">Discord</a>
        </div>
      </div>
    </footer>
  );
}
