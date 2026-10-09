// DentAtlas Web Shared Core JavaScript

function initTheme() {
  const savedTheme = localStorage.getItem('dentatlas_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
  
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  updateThemeIcon(isDark);
}

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const newDark = !isDark;
  
  if (newDark) {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('dentatlas_theme', 'dark');
  } else {
    html.removeAttribute('data-theme');
    localStorage.setItem('dentatlas_theme', 'light');
  }
  updateThemeIcon(newDark);
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

function getPreferredLanguage() {
  const saved = localStorage.getItem('dentatlas_lang');
  if (saved === 'ar' || saved === 'en') return saved;
  const navLang = (navigator.languages && navigator.languages[0]) || navigator.language || '';
  if (navLang.toLowerCase().startsWith('ar')) return 'ar';
  return 'en';
}

// Language Handling
function initLanguage(pageTranslations, onApplyLanguage) {
  const savedLang = getPreferredLanguage();
  applyLanguage(savedLang, pageTranslations, onApplyLanguage);
}

function toggleLanguage(pageTranslations, onApplyLanguage) {
  const currentLang = document.documentElement.getAttribute('lang') || 'ar';
  const newLang = currentLang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('dentatlas_lang', newLang);
  applyLanguage(newLang, pageTranslations, onApplyLanguage);
}

function applyLanguage(lang, pageTranslations, onApplyLanguage) {
  localStorage.setItem('dentatlas_lang', lang);
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  const langText = document.getElementById('lang-name');
  if (langText) {
    langText.textContent = lang === 'ar' ? 'English' : 'العربية';
  }

  // Common Header and Footer Localization
  const common = {
    ar: {
      navHome: "الرئيسية",
      navAbout: "حول المنصة",
      navPrivacy: "الخصوصية",
      navTerms: "الشروط",
      navSupport: "الدعم والأسئلة",
      navContact: "تواصل معنا",
      navDelete: "حذف الحساب",
      ftBrand: "دنت أطلس · DENTATLAS",
      ftTagline: "الموسوعة السريرية لطب وجراحة الأسنان — 100% بدون إنترنت",
      ftCopy: "DentAtlas © 2026 · تطوير وتشغيل NuclearMindSys. جميع الحقوق محفوظة."
    },
    en: {
      navHome: "Home",
      navAbout: "About",
      navPrivacy: "Privacy",
      navTerms: "Terms",
      navSupport: "Support & FAQ",
      navContact: "Contact",
      navDelete: "Delete Account",
      ftBrand: "DentAtlas · دنت أطلس",
      ftTagline: "Comprehensive Clinical Dental Reference — 100% Offline-First",
      ftCopy: "DentAtlas © 2026 · Developed & operated by NuclearMindSys. All rights reserved."
    }
  };

  const c = common[lang];
  if (c) {
    const setT = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setT('nav-home', c.navHome);
    setT('nav-about', c.navAbout);
    setT('nav-privacy', c.navPrivacy);
    setT('nav-terms', c.navTerms);
    setT('nav-support', c.navSupport);
    setT('nav-contact', c.navContact);
    setT('nav-delete', c.navDelete);
    setT('ft-brand', c.ftBrand);
    setT('ft-tagline', c.ftTagline);
    const copyEl = document.getElementById('ft-copy');
    if (copyEl) copyEl.innerHTML = c.ftCopy;
  }

  if (pageTranslations && pageTranslations[lang]) {
    const p = pageTranslations[lang];
    for (const [key, val] of Object.entries(p)) {
      const el = document.getElementById(key);
      if (el) {
        if (typeof val === 'string' && (val.includes('<') || val.includes('&'))) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    }
  }

  if (typeof onApplyLanguage === 'function') {
    onApplyLanguage(lang);
  }
}

function toggleMobileNav() {
  const links = document.querySelector('.nav-links');
  if (links) {
    links.classList.toggle('open');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
});
