import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

export function AuthModal() {
  const { user, isAuthModalOpen, authMode, setAuthModalOpen, setAuthMode, login, signup } = useAuth();
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!email || !password || (authMode === 'signup' && !name)) {
      setError(language === 'en' ? 'Please fill in all standard fields.' : 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (!email.includes('@')) {
      setError(language === 'en' ? 'Please use a valid email.' : 'Geçerli bir e-posta adresi yazın.');
      return;
    }

    if (password.length < 6) {
      setError(language === 'en' ? 'Security requires at least 6 characters.' : 'Güvenlik için şifre en az 6 karakter olmalıdır.');
      return;
    }

    setIsLoading(true);

    // Simulate Network Latency for realism
    setTimeout(() => {
      let result;
      if (authMode === 'signup') {
        result = signup(email, name, password);
      } else {
        result = login(email, password);
      }

      setIsLoading(false);

      if (!result.success) {
        if (result.error === 'USER_NOT_FOUND') {
          setError(language === 'en' 
            ? 'Account not found. Please verify your email or register.' 
            : 'E-posta adresi bulunamadı. Lütfen kontrol edin veya kayıt olun.');
        } else if (result.error === 'INCORRECT_PASSWORD') {
          setError(language === 'en' 
            ? 'Incorrect password. Please try again.' 
            : 'Hatalı şifre. Lütfen tekrar deneyin.');
        } else if (result.error === 'EMAIL_EXISTS') {
          setError(language === 'en' 
            ? 'This email address is already registered. Try signing in!' 
            : 'Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin!');
        } else {
          setError(result.error || (language === 'en' ? 'An unexpected error occurred.' : 'Beklenmedik bir hata oluştu.'));
        }
        return;
      }

      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
        setPassword('');
        setName('');
        setAuthModalOpen(false);
      }, 1500);
    }, 1200);
  };

  const isEn = language === 'en';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (!isLoading && !isSuccess) setAuthModalOpen(false);
        }}
        className="absolute inset-0 bg-navy-950/65 backdrop-blur-md"
      />

      {/* Main card box with high visual priority */}
      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative bg-white dark:bg-navy-950 border border-navy-150 dark:border-navy-850 text-navy-900 dark:text-white w-full max-w-md rounded-3xl p-8 overflow-hidden shadow-2xl transition-colors duration-300 z-20"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-500/5 dark:bg-navy-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button Header */}
        {!isLoading && !isSuccess && (
          <button 
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-6 right-6 text-navy-450 hover:text-navy-900 dark:hover:text-white hover:bg-navy-50 dark:hover:bg-navy-900 rounded-full p-1.5 transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Success screen frame content */}
        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex flex-col items-center justify-center text-center py-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400"
            >
              <CheckCircle className="w-8 h-8" />
            </motion.div>
            <h3 className="text-2xl font-black text-navy-900 dark:text-white mb-2">
              {authMode === 'signup' 
                ? (isEn ? 'Account Created!' : 'Hesap Oluşturuldu!')
                : (isEn ? 'Welcome Back!' : 'Tekrar Hoş Geldiniz!')
              }
            </h3>
            <p className="text-navy-500 dark:text-navy-400 text-sm max-w-sm">
              {authMode === 'signup'
                ? (isEn ? 'Initializing interactive sign language practice workspace for you...' : 'Size özel etkileşimli işaret dili pratik çalışma alanı yükleniyor...')
                : (isEn ? 'Restoring deep learning coordinates dataset tracker details...' : 'Derin öğrenme koordinat veri seti takip paneli geri yükleniyor...')
              }
            </p>
          </motion.div>
        ) : (
          <div>
            <div className="flex items-center gap-2.5 mb-6 text-navy-500 dark:text-navy-400 font-mono text-[10px] tracking-widest uppercase transition-colors">
              <Cpu className="w-4 h-4 text-navy-400 dark:text-navy-500" />
              <span>{isEn ? 'TWH DIGITAL WORKSPACE' : 'TWH DİJİTAL ÇALIŞMA ALANI'}</span>
            </div>

            {/* Modals Switchers Tab Bar */}
            <div className="flex border-b border-navy-100 dark:border-navy-850 gap-6 mb-8 text-sm transition-colors">
              <button
                onClick={() => {
                  setError('');
                  setAuthMode('signup');
                }}
                className={`pb-3 font-bold relative transition-colors cursor-pointer ${
                  authMode === 'signup' ? 'text-navy-900 dark:text-white' : 'text-navy-400 hover:text-navy-900 dark:hover:text-neutral-300'
                }`}
              >
                {isEn ? 'Sign Up' : 'Kayıt Ol'}
                {authMode === 'signup' && (
                  <motion.div layoutId="activeAuthTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-navy-600 dark:bg-white" />
                )}
              </button>
              <button
                onClick={() => {
                  setError('');
                  setAuthMode('login');
                }}
                className={`pb-3 font-bold relative transition-colors cursor-pointer ${
                  authMode === 'login' ? 'text-navy-900 dark:text-white' : 'text-navy-400 hover:text-navy-900 dark:hover:text-neutral-300'
                }`}
              >
                {isEn ? 'Sign In / Log In' : 'Giriş Yap'}
                {authMode === 'login' && (
                  <motion.div layoutId="activeAuthTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-navy-600 dark:bg-white" />
                )}
              </button>
            </div>

            {/* Title Block */}
            <h3 className="text-2xl font-black text-navy-900 dark:text-white mb-1 tracking-tight transition-colors">
              {authMode === 'signup'
                ? (isEn ? 'Create absolute account' : 'Yeni hesap oluşturun')
                : (isEn ? 'Sign in to workspace' : 'Kullanıcı girişi yapın')
              }
            </h3>
            <p className="text-navy-500 dark:text-navy-400 text-xs mb-6 transition-colors font-medium">
              {authMode === 'signup'
                ? (isEn ? 'Join modern web and AI gesture learning platform' : 'Yapay zeka el izleme ve modern işaret dili platformuna katılın')
                : (isEn ? 'Access custom letters, coordinates progress, and accuracy stats' : 'Harflere, el koordinat gelişimine ve başarı istatistiklerinize erişin')
              }
            </p>

            {/* Error Message block */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3 mb-5 text-rose-400 bg-rose-500/10 border border-rose-500/15 rounded-xl text-xs flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field (Sign Up Only) */}
              {authMode === 'signup' && (
                <div className="space-y-1.5 align-left text-left">
                  <label className="text-navy-500 dark:text-navy-400 text-[11px] font-mono tracking-wider uppercase">{isEn ? 'Display Name' : 'Görüntülenecek İsim'}</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400 dark:text-navy-600" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isEn ? "e.g., Ada Lovelace" : "Örn: Ada Yılmaz"}
                      className="w-full bg-navy-50/70 dark:bg-navy-950/40 border border-navy-150 dark:border-navy-800 text-navy-900 dark:text-white placeholder-navy-350 dark:placeholder-navy-600 text-sm rounded-xl py-3 pl-11 pr-4 outline-none hover:border-navy-200 dark:hover:border-navy-700 focus:border-navy-500 dark:focus:border-navy-400 focus:bg-white dark:focus:bg-[#050505] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5 align-left text-left">
                <label className="text-navy-500 dark:text-navy-400 text-[11px] font-mono tracking-wider uppercase">{isEn ? 'Email Address' : 'E-Posta Adresi'}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400 dark:text-navy-600" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isEn ? "your.name@example.com" : "isim@ornek.com"}
                    className="w-full bg-navy-50/70 dark:bg-navy-950/40 border border-navy-150 dark:border-navy-800 text-navy-900 dark:text-white placeholder-navy-350 dark:placeholder-navy-600 text-sm rounded-xl py-3 pl-11 pr-4 outline-none hover:border-navy-200 dark:hover:border-navy-700 focus:border-navy-500 dark:focus:border-navy-400 focus:bg-white dark:focus:bg-[#050505] transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 align-left text-left">
                <label className="text-navy-500 dark:text-navy-400 text-[11px] font-mono tracking-wider uppercase">{isEn ? 'Password' : 'Şifre'}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400 dark:text-navy-600" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isEn ? "••••••" : "••••••"}
                    className="w-full bg-navy-50/70 dark:bg-navy-950/40 border border-navy-150 dark:border-navy-800 text-navy-900 dark:text-white placeholder-navy-350 dark:placeholder-navy-600 text-sm rounded-xl py-3 pl-11 pr-4 outline-none hover:border-navy-200 dark:hover:border-navy-700 focus:border-navy-500 dark:focus:border-navy-400 focus:bg-white dark:focus:bg-[#050505] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-3.5 bg-navy-600 hover:bg-navy-500 active:scale-[0.98] dark:bg-white text-white dark:text-black font-bold text-sm rounded-xl transition-all disabled:opacity-55 shadow-md shadow-navy-600/10 dark:shadow-none cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-current border-t-transparent animate-spin inline-block" />
                    <span>{isEn ? 'Connecting...' : 'Bağlanıyor...'}</span>
                  </span>
                ) : (
                  <span>
                    {authMode === 'signup' 
                      ? (isEn ? 'Create Free Account' : 'Ücretsiz Hesap Oluştur')
                      : (isEn ? 'Access Workspace' : 'Çalışma Alanına Giriş Yap')
                    }
                  </span>
                )}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
