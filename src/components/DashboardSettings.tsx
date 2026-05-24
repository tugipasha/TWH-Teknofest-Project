import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Palette, 
  Bell, 
  AlertTriangle, 
  ChevronDown,
  Info 
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

export function DashboardSettings() {
  const { language } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Local settings states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [biography, setBiography] = useState('');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState<'A-' | 'A' | 'A+'>('A');
  const [dailyReminder, setDailyReminder] = useState(true);
  const [emailAnnouncements, setEmailAnnouncements] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load from user properties
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      
      // Load biography and font settings from localStorage safely
      try {
        const storedBio = localStorage.getItem(`twh_bio_${user.email}`);
        if (storedBio) setBiography(storedBio);
        else setBiography(language === 'en' ? "I'm here to learn sign language!" : "İşaret dilini öğrenmek için buradayım!");

        const storedFont = localStorage.getItem(`twh_fontFamily_${user.email}`);
        if (storedFont) setFontFamily(storedFont);

        const storedFontSize = localStorage.getItem(`twh_fontSize_${user.email}`);
        if (storedFontSize) setFontSize(storedFontSize as 'A-' | 'A' | 'A+');

        const storedReminder = localStorage.getItem(`twh_reminder_${user.email}`);
        if (storedReminder !== null) setDailyReminder(storedReminder === 'true');

        const storedEmailAnn = localStorage.getItem(`twh_emailAnn_${user.email}`);
        if (storedEmailAnn !== null) setEmailAnnouncements(storedEmailAnn === 'true');
      } catch (e) {
        console.error('Error loading customization settings', e);
      }
    }
  }, [user, language]);

  if (!user) return null;

  // Handle profile info update
  const handleUpdateProfile = () => {
    if (!name.trim()) return;

    try {
      // 1. Update registered users registry
      const storedStr = localStorage.getItem('twh_registered_users');
      if (storedStr) {
        const registry = JSON.parse(storedStr);
        const updatedRegistry = registry.map((u: any) => {
          if (u.email.toLowerCase() === user.email.toLowerCase()) {
            return {
              ...u,
              name: name.trim()
            };
          }
          return u;
        });
        localStorage.setItem('twh_registered_users', JSON.stringify(updatedRegistry));
      }

      // 2. Update active user instance
      const currentUserData = localStorage.getItem('twh_user');
      if (currentUserData) {
        const activeUser = JSON.parse(currentUserData);
        activeUser.name = name.trim();
        localStorage.setItem('twh_user', JSON.stringify(activeUser));
      }

      // 3. Save biography
      localStorage.setItem(`twh_bio_${user.email}`, biography);

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);

      // Trigger a small page reload to sync state with layout
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle font size change
  const handleFontSizeChange = (size: 'A-' | 'A' | 'A+') => {
    setFontSize(size);
    localStorage.setItem(`twh_fontSize_${user.email}`, size);
  };

  // Handle fontFamily change
  const handleFontFamilyChange = (font: string) => {
    setFontFamily(font);
    localStorage.setItem(`twh_fontFamily_${user.email}`, font);
  };

  // Switch dark theme and state sync
  const handleToggleDarkTheme = () => {
    toggleTheme();
  };

  // Daily alert notification change
  const handleToggleReminder = () => {
    const val = !dailyReminder;
    setDailyReminder(val);
    localStorage.setItem(`twh_reminder_${user.email}`, String(val));
  };

  // Email notifications change
  const handleToggleEmailAnn = () => {
    const val = !emailAnnouncements;
    setEmailAnnouncements(val);
    localStorage.setItem(`twh_emailAnn_${user.email}`, String(val));
  };

  // Account removal procedure
  const handleDeleteAccount = () => {
    const confirmMsg = language === 'en' 
      ? 'WARNING: Are you absolutely sure you want to delete your account? This action is permanent!' 
      : 'UYARI: Hesabınızı silmek istediğinizden kesinlikle emin misiniz? Bu işlem geri alınamaz!';
    if (confirm(confirmMsg)) {
      try {
        const storedStr = localStorage.getItem('twh_registered_users');
        if (storedStr) {
          const registry = JSON.parse(storedStr);
          const filtered = registry.filter((u: any) => u.email.toLowerCase() !== user.email.toLowerCase());
          localStorage.setItem('twh_registered_users', JSON.stringify(filtered));
        }
        logout();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      
      {/* CARD 1: Profil Bilgileri */}
      <div className="bg-white dark:bg-[#161f30] rounded-3xl border border-slate-200/50 dark:border-white/[0.04] p-6 sm:p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/[0.05] pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {language === 'en' ? 'Profile Information' : 'Profil Bilgileri'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'en' ? 'Manage your personal details and public biography' : 'Kişisel bilgilerinizi ve biyografinizi yönetin'}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Full Name Ad Soyad */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'en' ? 'Full Name' : 'Ad Soyad'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0f1423] font-medium text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
              placeholder="Ahmet Yılmaz"
            />
          </div>

          {/* E-posta */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'en' ? 'Email Address' : 'E-posta'}
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-100/80 dark:bg-[#0c101c] font-medium text-sm text-slate-400 dark:text-slate-500 cursor-not-allowed transition-colors"
              placeholder="ahmet@gmail.com"
            />
          </div>

          {/* Biography Biyografi */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'en' ? 'Biography' : 'Biyografi'}
            </label>
            <textarea
              rows={3}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0f1423] font-medium text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 resize-none transition-colors"
              placeholder="İşaret dilini öğrenmek için buradayım!"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleUpdateProfile}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-center"
            >
              {isSaved 
                ? (language === 'en' ? 'PROFILE UPDATED' : 'BİLGİLER GÜNCELLENDİ') 
                : (language === 'en' ? 'UPDATE INFO' : 'Bilgileri Güncelle')}
            </button>

            {isSaved && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <Info className="w-4 h-4" />
                <span>{language === 'en' ? 'Successfully stored in local storage cache.' : 'Yerel depolama başarıyla güncellendi.'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CARD 2: Görünüm ve Tema */}
      <div className="bg-white dark:bg-[#161f30] rounded-3xl border border-slate-200/50 dark:border-white/[0.04] p-6 sm:p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/[0.05] pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Palette className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {language === 'en' ? 'Appearance and Theme' : 'Görünüm ve Tema'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'en' ? 'Configure Dark mode toggle, fonts families and sizes scale' : 'Karanlık modu, yazı tipini ve boyut aralığını özelleştirin'}
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/[0.05] space-y-5">
          {/* Row 1: Koyu Tema */}
          <div className="flex items-center justify-between py-1 pt-2">
            <div className="max-w-[70%]">
              <h4 className="text-sm font-black text-slate-800 dark:text-white">
                {language === 'en' ? 'Dark Theme' : 'Koyu Tema'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'en' ? 'Activate dark layout to minimize ocular fatigue.' : 'Göz yorgunluğunu azaltmak için karanlık modu aktifleştirin.'}
              </p>
            </div>
            
            {/* Custom styled iOS toggle switch to match precisely */}
            <button
              onClick={handleToggleDarkTheme}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer outline-none relative flex items-center ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Row 2: Yazı Tipi */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-5 gap-3">
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white">
                {language === 'en' ? 'Font Family' : 'Yazı Tipi'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'en' ? 'Select an active readable typeface family.' : 'Okunabilirliği artırmak için yazı tipini değiştirin.'}
              </p>
            </div>

            <div className="relative min-w-[180px]">
              <select
                value={fontFamily}
                onChange={(e) => handleFontFamilyChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0f1423] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Inter">{language === 'en' ? 'Inter (Default)' : 'Inter (Varsayılan)'}</option>
                <option value="system-ui">{language === 'en' ? 'System Serif' : 'Sistem Serif'}</option>
                <option value="Courier">Courier Mono</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Row 3: Yazı Boyutu */}
          <div className="flex items-center justify-between py-5">
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white">
                {language === 'en' ? 'Font Size' : 'Yazı Boyutu'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'en' ? 'Calibrate active size scale of page texts.' : 'Yazıların büyüklüğünü ayarlayın.'}
              </p>
            </div>

            <div className="flex items-center p-1 bg-slate-100 dark:bg-[#0f1423] rounded-xl border border-slate-200 dark:border-white/[0.05]">
              {(['A-', 'A', 'A+'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                    fontSize === size
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-450 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: Bildirimler */}
      <div className="bg-white dark:bg-[#161f30] rounded-3xl border border-slate-200/50 dark:border-white/[0.04] p-6 sm:p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/[0.05] pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Bell className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {language === 'en' ? 'Notifications' : 'Bildirimler'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'en' ? 'Configure reminder emails and prompt alerts schedule' : 'E-posta veya hatırlatıcı takvimi bildirimlerini ayarlayın'}
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/[0.05] space-y-5">
          {/* Row 1: Günlük Hatırlatıcı */}
          <div className="flex items-center justify-between py-1 pt-2">
            <div className="max-w-[70%]">
              <h4 className="text-sm font-black text-slate-800 dark:text-white">
                {language === 'en' ? 'Daily Reminders' : 'Günlük Hatırlatıcı'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'en' ? 'Get reminders to complete your training streak loop.' : 'Öğrenme serini bozmamak için her gün bildirim al.'}
              </p>
            </div>
            
            <button
              onClick={handleToggleReminder}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer outline-none relative flex items-center ${
                dailyReminder ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                  dailyReminder ? 'translate-x-[24px]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Row 2: E-posta Duyuruları */}
          <div className="flex items-center justify-between py-5">
            <div className="max-w-[70%]">
              <h4 className="text-sm font-black text-slate-800 dark:text-white">
                {language === 'en' ? 'Email Announcements' : 'E-posta Duyuruları'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'en' ? 'Recieve updates, educational logs and patch news.' : 'Yeni dersler ve güncellemeler hakkında bilgi al.'}
              </p>
            </div>
            
            <button
              onClick={handleToggleEmailAnn}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer outline-none relative flex items-center ${
                emailAnnouncements ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                  emailAnnouncements ? 'translate-x-[24px]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* CARD 4: Tehlikeli Bölge */}
      <div className="bg-red-500/[0.04] dark:bg-red-500/[0.02] rounded-3xl border-2 border-red-500/30 dark:border-red-500/20 p-6 sm:p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 border-b border-red-500/10 dark:border-red-500/10 pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-red-600 dark:text-red-500">
              {language === 'en' ? 'Danger Zone' : 'Tehlikeli Bölge'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'en' ? 'Actions that cannot be undone' : 'Geri dönüşü olmayan eylemler'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="max-w-md">
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">
              {language === 'en' ? 'Delete Account' : 'Hesabı Sil'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'en' ? 'Permanently purge all lessons, progress and metrics history.' : 'Tüm verilerin kalıcı olarak silinecektir. Bu işlem geri alınamaz.'}
            </p>
          </div>

          <button
            onClick={handleDeleteAccount}
            className="px-5 py-3 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-extrabold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer max-w-max"
          >
            {language === 'en' ? 'Delete Account Permanently' : 'Hesabı Kalıcı Olarak Sil'}
          </button>
        </div>
      </div>

    </div>
  );
}
