import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Trash2, Clock, History } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: string;
}

export function ContactSection() {
  const { t, language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Safely mount and load existing inquiries on client-side
  useEffect(() => {
    try {
      const saved = localStorage.getItem('twh_inquiries');
      if (saved) {
        setInquiries(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error reading localStorage inquiries:', e);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      return;
    }
    
    setStatus('sending');
    // Simulate real high-fidelity transmission
    setTimeout(() => {
      const ts = new Date().toLocaleString(language === 'en' ? 'en-US' : 'tr-TR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });

      const newInquiry: Inquiry = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: ts,
        status: language === 'en' ? 'Verified Transmission' : 'İletildi & Onaylandı'
      };

      const updated = [newInquiry, ...inquiries];
      setInquiries(updated);
      localStorage.setItem('twh_inquiries', JSON.stringify(updated));

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      
      // Reset status gently
      setTimeout(() => setStatus('idle'), 4000);
    }, 1500);
  };

  const deleteInquiry = (id: string) => {
    const updated = inquiries.filter(item => item.id !== id);
    setInquiries(updated);
    localStorage.setItem('twh_inquiries', JSON.stringify(updated));
  };

  const clearAllInquiries = () => {
    setInquiries([]);
    localStorage.removeItem('twh_inquiries');
  };

  return (
    <section id="contact" className="py-16 md:py-24 lg:py-32 relative overflow-hidden border-t border-navy-100 dark:border-navy-800 bg-white dark:bg-navy-950 transition-colors duration-300">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.02] dark:bg-navy-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Left info & LocalStorage History column */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-50/70 dark:bg-navy-900/40 border border-navy-150 dark:border-navy-800 text-xs font-bold font-mono text-navy-700 dark:text-navy-300 mb-6 w-fit transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                {t.contact.badge}
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-navy-900 dark:text-white leading-tight transition-colors font-sans">
                {t.contact.title}
              </h2>
              
              <p className="text-lg text-navy-600 dark:text-navy-350 leading-relaxed max-w-md transition-colors font-medium">
                {t.contact.description}
              </p>
            </div>

            {/* LocalStorage Submissions Timeline Widget */}
            <div className="p-6 rounded-2xl border border-navy-150 dark:border-navy-850 bg-navy-50/10 dark:bg-navy-900/10 backdrop-blur-md transition-all flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-navy-800 dark:text-white flex items-center gap-2 font-mono">
                  <History className="w-4.5 h-4.5 text-navy-500 dark:text-navy-400" />
                  {language === 'en' ? 'LOCAL INQUIRY LOG' : 'YEREL İLETİŞİM GEÇMİŞİ'}
                </h3>
                {inquiries.length > 0 && (
                  <button
                    onClick={clearAllInquiries}
                    className="text-[10px] font-bold font-mono text-rose-500 dark:text-rose-400 bg-rose-500/5 hover:bg-rose-500/15 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'CLEAR LOG' : 'LİSTEYİ TEMİZLE'}
                  </button>
                )}
              </div>

              <div className="max-h-[220px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {inquiries.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-navy-450 dark:text-navy-500 py-6 text-center italic"
                    >
                      {language === 'en' ? 'No local transmissions stored in current browser stage.' : 'Tarayıcı hafızasında kayıtlı gönderim bulunmuyor.'}
                    </motion.div>
                  ) : (
                    inquiries.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-3 bg-white dark:bg-navy-900/40 rounded-xl border border-navy-150/50 dark:border-navy-800 relative group transition-colors shadow-xs"
                      >
                        <button
                          onClick={() => deleteInquiry(item.id)}
                          className="absolute right-2 top-2 p-1.5 rounded-lg text-navy-400 hover:text-rose-500 hover:bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          title={language === 'en' ? 'Delete log' : 'Kayıttan sil'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-navy-455 dark:text-navy-400 font-bold">
                          <Clock className="w-3 h-3 text-navy-400" />
                          <span>{item.timestamp}</span>
                          <span className="text-emerald-500">• {item.status}</span>
                        </div>
                        <h4 className="text-[11px] font-bold text-navy-800 dark:text-neutral-200 mt-1 block truncate max-w-[85%]">
                          {item.name} <span className="text-navy-450 font-normal">({item.email})</span>
                        </h4>
                        <p className="text-[11px] text-navy-550 dark:text-navy-350 mt-1 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] border border-navy-150 dark:border-navy-800 bg-white dark:bg-navy-900/35 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[11px] font-bold font-mono text-navy-500 dark:text-navy-400 uppercase tracking-wider">
                      {t.contact.nameLabel}
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.contact.namePlaceholder}
                      className="w-full h-12 px-4 rounded-xl bg-navy-50/70 dark:bg-navy-950/40 border border-navy-150 dark:border-navy-800 text-navy-900 dark:text-white placeholder-navy-400 dark:placeholder-navy-600 focus:outline-none focus:border-navy-500 dark:focus:border-navy-400 focus:ring-1 focus:ring-navy-500/20 transition-all text-sm font-medium"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[11px] font-bold font-mono text-navy-500 dark:text-navy-400 uppercase tracking-wider">
                      {t.contact.emailLabel}
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.contact.emailPlaceholder}
                      className="w-full h-12 px-4 rounded-xl bg-navy-50/70 dark:bg-navy-950/40 border border-navy-150 dark:border-navy-800 text-navy-900 dark:text-white placeholder-navy-400 dark:placeholder-navy-600 focus:outline-none focus:border-navy-500 dark:focus:border-navy-400 focus:ring-1 focus:ring-navy-500/20 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-[11px] font-bold font-mono text-navy-500 dark:text-navy-400 uppercase tracking-wider">
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.contact.messagePlaceholder}
                    className="w-full p-4 rounded-xl bg-navy-50/70 dark:bg-navy-950/40 border border-navy-150 dark:border-navy-800 text-navy-900 dark:text-white placeholder-navy-400 dark:placeholder-navy-600 focus:outline-none focus:border-navy-500 dark:focus:border-navy-400 focus:ring-1 focus:ring-navy-500/20 transition-all text-sm font-medium resize-none"
                  />
                </div>

                {/* State Alerts */}
                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 dark:border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all"
                  >
                    <CheckCircle className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>{t.contact.successMsg}</span>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/15 dark:border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all"
                  >
                    <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>{t.contact.errorMsg}</span>
                  </motion.div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full h-12 rounded-xl bg-navy-600 hover:bg-navy-500 active:scale-[0.98] dark:bg-white text-white dark:text-black font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-md shadow-navy-600/10 dark:shadow-none text-sm animate-none"
                >
                  {status === 'sending' ? (
                    <div className="w-5 h-5 border-2 border-white/30 dark:border-black/35 border-t-white dark:border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t.contact.submitBtn}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
