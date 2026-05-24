import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'tr';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      content: 'System & Tech',
      team: 'Project Team',
      contact: 'Contact',
      getStarted: 'Sign Up',
    },
    hero: {
      tag: 'TEKNOFEST 2026 PRE-EVALUATION REPORT',
      category: 'Category: Digital Education & Learning Systems',
      title: 'TalkWithHand',
      subtitle: 'The new voice of a silent world. An interactive, AI-powered sign language learning platform analyzing hand gestures in real-time.',
      scrollDown: 'Scroll down to explore report',
      ids: {
        teamName: 'Team Name: IAOSB NUMTAL TWH',
        appId: 'Application ID: 4895713',
        teamId: 'Team ID: 791558'
      }
    },
    about: {
      badge: 'Project Summary & Scope',
      title: 'Bridging communication gaps with artificial intelligence.',
      description: 'TalkWithHand is an interactive, AI-supported sign language learning system developed to remove communication hurdles. Traditional methods lack real-time feedback; TalkWithHand uses standard computer webcams to process hand gestures on-the-fly, empowering users to learn naturally with an absolute feedback loop.',
      purposeTitle: 'Core Purpose & Social Benefit',
      purposeDesc: 'Guided by the "new voice of the silent world" vision and aligned with UNESCO "Education for All" guidelines, TWH strives to democratize sign language access. By removing the financial barrier of expensive courses and hardware, it bridges the digital divide and aids societal integration.',
      statLabel: 'AI Accurately Achieved',
      statVal: '91.24%',
    },
    problemSolution: {
      badge: 'Problem & Integrated Solution',
      problemTitle: 'The Core Challenge',
      problemDesc: 'Static videos and books cannot detect subtle hand coordination errors. Inaccurate gestures go uncorrected, leading to fossilized mistakes and impaired communication patterns. High equipment costs and sparse expert educators further restrict accessibility.',
      solutionTitle: 'Our Integrated Digital Ecosystem',
      sol1Title: 'AI-Powered Vision',
      sol1Desc: 'Real-time hand coordinate and pose classification to evaluate gesture precision immediately.',
      sol2Title: 'Interactive Labs',
      sol2Desc: 'Dynamic, expert-curated curriculums with instant visual validation using your standard webcam.',
      sol3Title: 'Adaptive Growth Profiler',
      sol3Desc: 'Personalized progress dashboards reflecting key coordinates, speed, and targeted letter correction.',
      sol4Title: 'Zero Barrier Access',
      sol4Desc: 'A high-performance web platform that eliminates expensive local compute hardware entirely.',
    },
    architecture: {
      badge: 'Technical Architecture & Framework',
      title: 'High-fidelity engine running inside the browser.',
      desc: 'TalkWithHand leverages a modular deep learning pipeline optimized for sub-pixel hand tracking and low-latency classification.',
      tfTitle: 'TensorFlow & Keras',
      tfDesc: 'The backbone used for complex neural network styling, deep training flow, and real-time inference optimization.',
      mpTitle: 'MediaPipe Hands',
      mpDesc: 'Tracks 21 distinct 3D skeletal joint markers in real-time, mapping absolute pixel values into dynamic data matrices.',
      slTitle: 'Scikit-Learn',
      slDesc: 'Orchestrates advanced data shuffling, multi-dimensional scaling, and coordinate normalization during training.',
      pnTitle: 'Pandas & NumPy',
      pnDesc: 'Handles high-speed processing of 126-column mathematical coordinate vectors at solid frame rates.',
    },
    timeline: {
      badge: 'Development Roadmap (Oct 2025 - Feb 2026)',
      title: 'Phase-by-phase system deployment.',
      p1Title: 'Planning (Oct 2025)',
      p1Desc: 'Needs assessment, functional task division, and initial system architecture definitions.',
      p2Title: 'Design & Code (Oct - Nov 2025)',
      p2Desc: 'Designing responsive high-fidelity UI layout interfaces and building Web infrastructure.',
      p3Title: 'Model Training (Dec 2025)',
      p3Desc: 'Training Deep Neural Networks utilizing MediaPipe with TID (Turkish Sign Language) dataset outputs to secure 91.24% test accuracy.',
      p4Title: 'Refinement & Integration (Jan - Feb 2026)',
      p4Desc: 'Optimizing UX parameters, increasing camera frames throughput, and smoothing interactive elements.',
    },
    team: {
      badge: 'Project Team',
      title: 'Engineered by IAOSB NUMTAL TWH.',
      advisor: 'Academic Advisor',
      advisorDesc: 'Academic guidance, system verification, and overall technical mentorship.',
      leader: 'Team Leader',
      leaderDesc: 'Data aggregation, resource scheduling, structural planning, and lead research.',
      member1: 'AI & Web Integrator',
      member1Desc: 'MediaPipe pipelines, deep model optimization, GitHub Pages entegration, and data analytics.',
      member2: 'Designer & Architect',
      member2Desc: 'Visual environment styling, interface layouts, interaction flow components, and custom branding.',
    },
    contact: {
      badge: 'Contact & Feedback',
      title: 'Reach out to TWH Team.',
      description: 'Have inquiries about the Teknofest evaluation, technical dataset, or potential educational collaborations?',
      nameLabel: 'Full Name',
      namePlaceholder: 'Enter your name',
      emailLabel: 'Email',
      emailPlaceholder: 'your.name@example.com',
      messageLabel: 'Message',
      messagePlaceholder: 'Your feedback or technical questions...',
      submitBtn: 'Transmit Message',
      successMsg: 'Message successfully sent to IAOSB NUMTAL TWH team.',
      errorMsg: 'Please complete all required fields.',
    },
    footer: {
      desc: 'An AI-powered, interactive Turkish Sign Language learning system developed for Teknofest 2026 (Digital Education and Learning Systems).',
      rights: '© 2026 TalkWithHand (TWH). All rights reserved.',
    }
  },
  tr: {
    nav: {
      home: 'Ana Sayfa',
      about: 'Özet & Kapsam',
      content: 'Sistem & Teknoloji',
      team: 'Proje Ekibi',
      contact: 'İletişim',
      getStarted: 'Kayıt Ol',
    },
    hero: {
      tag: 'TEKNOFEST 2026 ÖN DEĞERLENDİRME RAPORU',
      category: 'Kategori: Dijital Eğitim ve Öğrenme Sistemleri',
      title: 'TalkWithHand',
      subtitle: 'Sessiz dünyanın yeni sesi. Yapay zeka destekli, el hareketlerini gerçek zamanlı analiz eden interaktif işaret dili öğrenme platformu.',
      scrollDown: 'Rapora gitmek için aşağı kaydırın',
      ids: {
        teamName: 'Takım Adı: İAOSB NUMTAL TWH',
        appId: 'Başvuru ID: 4895713',
        teamId: 'Takım ID: 791558'
      }
    },
    about: {
      badge: 'Proje Özeti ve Kapsamı',
      title: 'Yapay zeka ile iletişim engellerini ortadan kaldırıyoruz.',
      description: 'TalkWithHand, işitme ve konuşma engelli bireyler ile toplum arasındaki iletişimi kolaylaştırmak için geliştirilmiş interaktif, yapay zeka destekli bir eğitim sistemidir. Geleneksel yaklaşımların aksine, kullanıcının yaptığı işaretleri bilgisayar kamerası üzerinden gerçek zamanlı analiz ederek anlık geribildirim sunar.',
      purposeTitle: 'Temel Amaç ve Toplumsal Fayda',
      purposeDesc: '"Sessiz dünyanın yeni sesi" vizyonuyla ve UNESCO "Herkes için Eğitim" ilkeleri doğrultusunda, işaret dili eğitimini herkes için erişilebilir kılmayı amaçlıyoruz. Donanım maliyetlerini ve pahalı kurs engellerini sıfırlayarak dijital uçurumu en aza indirir ve toplumsal entegrasyonu hızlandırır.',
      statLabel: 'YZ Başarı Oranı (Accuracy)',
      statVal: '%91,24',
    },
    problemSolution: {
      badge: 'Sorun ve Bütüncül Çözüm',
      problemTitle: 'Temel Zorluk',
      problemDesc: 'Statik video ve kitaplar kullanıcının el koordinasyonundaki hataları denetleyemez. Yanlış öğrenilen hareketler kalıcı hale gelerek iletişim hatalarına yol açar. Kalifiye eğitmen sayısının azlığı ve yüksek eğitim maliyetleri erişilebilirliği kısıtlamaktadır.',
      solutionTitle: 'Bütüncül Dijital Ekosistemimiz',
      sol1Title: 'Yapay Zekâ Destekli Analiz',
      sol1Desc: 'Kullanıcının el hareketlerini anlık izleyerek hata analizi yapan ve öğrenme sürecini kesintisiz kılan derin öğrenme motoru.',
      sol2Title: 'İnteraktif Uygulama',
      sol2Desc: 'Uzman içerikli görsel derslerin ardından kameranın açılmasıyla öğrenilen işaretleri test eden pratik modülleri.',
      sol3Title: 'Detaylı Gelişim Takibi',
      sol3Desc: 'Kullanıcının zorlandığı harf ve kelimeleri grafiklerle analiz eden, kişiselleştirilmiş veri panelleri.',
      sol4Title: 'Evrensel Erişilebilirlik',
      sol4Desc: 'Web tabanlı mimarisi sayesinde herhangi bir ek donanım maliyeti gerektirmeden geniş kitlelere erişim olanağı.',
    },
    architecture: {
      badge: 'Teknik Altyapı ve Mimarimiz',
      title: 'Tarayıcıda çalışan yüksek hassasiyetli derin öğrenme.',
      desc: 'TalkWithHand, alt piksel el takibi ve düşük gecikmeli sınıflandırma için optimize edilmiş modüler bir yapay zeka hattı kullanır.',
      tfTitle: 'TensorFlow & Keras',
      tfDesc: 'Derin sinir ağlarının tasarımı, optimizasyonu ve gerçek zamanlı tahmin süreçlerinde kullanılan temel yapay zeka kütüphanesi.',
      mpTitle: 'MediaPipe Hands',
      mpDesc: 'Kamera akışındaki elleri tespit ederek 21 eklem noktasını (x,y,z koordinatlarında) yüksek hızda sayısal veriye dönüştürür.',
      slTitle: 'Scikit-Learn',
      slDesc: 'Eğitim aşamasında verilerin karıştırılması (shuffle), ölçeklendirilmesi (scaling) ve normalize edilmesini yönetir.',
      pnTitle: 'Pandas & NumPy',
      pnDesc: '126 sütunlu devasa sayısal veri matrislerinin tarayıcıda yüksek performansla ve sıfır gecikmeyle işlenmesini sağlar.',
    },
    timeline: {
      badge: 'Proje Zaman Planı ve Çalışma Yöntemi (Ekim 2025 - Şubat 2026)',
      title: 'Aşama aşama hayata geçirilen kararlı sistem.',
      p1Title: 'Planlama (Ekim 2025)',
      p1Desc: 'İhtiyaç analizi, görev dağılımları, müfredat tasarımı ve teknik rollerin belirlenmesi.',
      p2Title: 'Tasarım ve Kodlama (Ekim - Kasım 2025)',
      p2Desc: 'Kullanıcı dostu arayüz tasarımı, GitHub Pages üzerinde web yayıncılığı altyapısının kurulması.',
      p3Title: 'Model Eğitimi (Aralık 2025)',
      p3Desc: 'Python ve MediaPipe kullanılarak TİD (Türk İşaret Dili) veri seti üzerinden %91,24 başarılı derin öğrenme modelinin eğitilmesi.',
      p4Title: 'İyileştirme ve Test (Ocak - Şubat 2026)',
      p4Desc: 'Gerçek zamanlı analiz kapasitesinin artırılması, kamera koordinat hassasiyetlerinin iyileştirilmesi ve kullanıcı deneyimi (UX) optimizasyonu.',
    },
    team: {
      badge: 'Proje Ekibi',
      title: 'İAOSB NUMTAL TWH Takımı.',
      advisor: 'Proje Danışmanı',
      advisorDesc: 'Akademik yönlendirme, sistem denetleme ve genel teknik rehberlik desteği.',
      leader: 'Takım Lideri',
      leaderDesc: 'Kaynak toplama, görev dağılımı, proje planlaması ve literatür araştırması.',
      member1: 'Yapay Zeka & Entegrasyon',
      member1Desc: 'MediaPipe hattı, derin öğrenme modeli optimizasyonu, GitHub Pages entegrasyonu ve veri süreçleri.',
      member2: 'Genel Tasarım',
      member2Desc: 'Etkileşim kurguları, mobil uyumlu kullanıcı arayüz modelleri, marka kimliği ve sunum görselleşimi.',
    },
    contact: {
      badge: 'İletişim ve Geri Bildirim',
      title: 'TWH Ekibiyle İletişim.',
      description: 'Teknofest değerlendirme süreci, teknik altyapı detayları veya eğitim ortaklıkları ile ilgili sorularınız mı var?',
      nameLabel: 'Adınız Soyadınız',
      namePlaceholder: 'Adınızı girin',
      emailLabel: 'E-posta',
      emailPlaceholder: 'isim@ornek.com',
      messageLabel: 'Mesajınız',
      messagePlaceholder: 'Görüş, öneri veya teknik sorularınızı yazın...',
      submitBtn: 'Mesajı İlet',
      successMsg: 'Mesajınız başarıyla İAOSB NUMTAL TWH ekibine ulaştırıldı.',
      errorMsg: 'Lütfen zorunlu alanları doldurun.',
    },
    footer: {
      desc: 'Teknofest 2026 (Dijital Eğitim ve Öğrenme Sistemleri) için geliştirilmiş, yapay zeka destekli interaktif Türk İşaret Dili öğrenim sistemi.',
      rights: '© 2026 TalkWithHand (TWH). Tüm hakları saklıdır.',
    }
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('twh_lang');
    return (saved === 'en' || saved === 'tr') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('twh_lang', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
