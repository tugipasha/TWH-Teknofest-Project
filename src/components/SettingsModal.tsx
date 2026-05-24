import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Sliders, Shield, CircleDot, Info } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { language } = useLanguage();
  const { user, login } = useAuth();
  
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [fps, setFps] = useState('30');
  const [threshold, setThreshold] = useState('91.24');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      // Grab stored user settings from our registry if present
      try {
        const storedStr = localStorage.getItem('twh_registered_users');
        if (storedStr) {
          const registry = JSON.parse(storedStr);
          const found = registry.find((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
          if (found && found.settings) {
            setLevel(found.settings.level || 'Beginner');
            setFps(found.settings.fps || '30');
            setThreshold(found.settings.threshold || '91.24');
          }
        }
      } catch (e) {
        console.error('Error loading custom settings:', e);
      }
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const storedStr = localStorage.getItem('twh_registered_users');
      if (storedStr) {
        const registry = JSON.parse(storedStr);
        const updatedRegistry = registry.map((u: any) => {
          if (u.email.toLowerCase() === user.email.toLowerCase()) {
            return {
              ...u,
              name: name.trim(),
              settings: {
                level,
                fps,
                threshold
              }
            };
          }
          return u;
        });

        localStorage.setItem('twh_registered_users', JSON.stringify(updatedRegistry));
        
        // Refresh active logged-in user state details by calling local login flow update
        const currentUserData = localStorage.getItem('twh_user');
        if (currentUserData) {
          const activeUser = JSON.parse(currentUserData);
          activeUser.name = name.trim();
          localStorage.setItem('twh_user', JSON.stringify(activeUser));
          // Just trigger state refresh
          window.location.reload();
        }
      }

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm"
        />

        {/* Modal Body Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-2xl p-6 sm:p-8 overflow-hidden z-10 transition-colors"
        >
          {/* Top subtle visual decorative elements */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-navy-900 dark:text-white flex items-center gap-2 font-sans">
              <Sliders className="w-5 h-5 text-blue-500" />
              {language === 'en' ? 'Profile Settings' : 'Profil Ayarları'}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-navy-50 dark:hover:bg-navy-850 text-navy-400 hover:text-navy-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display Name Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-navy-450 dark:text-navy-400 block uppercase tracking-wider">
                {language === 'en' ? 'YOUR DISPLAY NAME' : 'GÖRÜNEN ADINIZ'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'en' ? 'Enter display name' : 'Görünen adı giriniz'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-150 dark:border-navy-800 bg-navy-50/50 dark:bg-navy-950 font-medium text-sm text-navy-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Simulated Practice Level */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-navy-450 dark:text-navy-400 block uppercase tracking-wider">
                {language === 'en' ? 'SIGN LANGUAGE LEVEL' : 'İŞARET DİLİ SEVİYESİ'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Expert'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`py-2 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer ${
                      level === lvl
                        ? 'bg-blue-600 text-white dark:bg-blue-500 border-blue-500 shadow-md'
                        : 'bg-navy-50 dark:bg-navy-950 text-navy-600 dark:text-navy-200 border-navy-100 dark:border-navy-800 hover:bg-navy-100 dark:hover:bg-navy-900'
                    }`}
                  >
                    {language === 'en' 
                      ? lvl 
                      : (lvl === 'Beginner' ? 'Başlangıç' : lvl === 'Intermediate' ? 'Orta Seviye' : 'Uzman')}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Accuracy Validation Threshold */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-navy-450 dark:text-navy-400 block uppercase tracking-wider">
                {language === 'en' ? 'MODEL THRESHOLD SENSITIVITY' : 'MODEL DOĞRULAMA DUYARLILIĞI'}
              </label>
              <select
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-navy-150 dark:border-navy-800 bg-navy-50/50 dark:bg-navy-950 font-medium text-xs text-navy-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                title={language === 'en' ? 'Threshold select' : 'Doğrulama seç'}
              >
                <option value="91.24">{language === 'en' ? 'Standard Validation (91.24%)' : 'Standart Kararlılık (%91.24)'}</option>
                <option value="94.50">{language === 'en' ? 'Intermediate Rigorous (%94.50)' : 'Orta Sertlik (%94.50)'}</option>
                <option value="97.80">{language === 'en' ? 'Expert Strict (%97.80)' : 'Katı Doğrulayıcı (%97.80)'}</option>
              </select>
            </div>

            {/* Simulated WebCam Refresh FPS rate */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-navy-450 dark:text-navy-400 block uppercase tracking-wider">
                {language === 'en' ? 'CAMERA FPS DECAY CALIBRATION' : 'KAMERA FPS YENİLEME DEĞERİ'}
              </label>
              <select
                value={fps}
                onChange={(e) => setFps(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-navy-150 dark:border-navy-800 bg-navy-50/50 dark:bg-navy-950 font-medium text-xs text-navy-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                title={language === 'en' ? 'Camera FPS select' : 'Kamera FPS ayarı seç'}
              >
                <option value="15">{language === 'en' ? 'Adaptive Battery Saver (15 FPS)' : 'Pil Tasarrufu Dengeli (15 FPS)'}</option>
                <option value="30">{language === 'en' ? 'Standard Real-time Tracking (30 FPS)' : 'Standart Akıcı Takip (30 FPS)'}</option>
                <option value="60">{language === 'en' ? 'Hyper-fidelity Stream Render (60 FPS)' : 'Yüksek Hızlı Akış (60 FPS)'}</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaved}
                className="w-full py-3 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-850 dark:hover:bg-neutral-50 font-bold font-mono text-xs transition duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:bg-emerald-500 disabled:text-white dark:disabled:bg-emerald-600"
              >
                {isSaved ? (
                  <>
                    <CircleDot className="w-4 h-4 animate-ping" />
                    <span>{language === 'en' ? 'SETTINGS SAVED & PERSISTED' : 'AYARLAR KAYDEDİLDİ'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{language === 'en' ? 'SAVE AND REBOOT' : 'AYARLARI KAYDET VE YENİLE'}</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[10px] leading-relaxed text-blue-600 dark:text-blue-400 font-medium">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                {language === 'en'
                  ? 'Saving changes will reboot configurations and synchronize details seamlessly inside your localStorage registry container.'
                  : 'Ayarları kaydetmek, test aygıtını yenileyecek ve bilgilerinizi tarayıcı yerel depolama kaydınızla anında senkronize edecektir.'}
              </span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
