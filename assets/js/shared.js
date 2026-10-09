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

// Global translation registry
window.__pageTranslations = null;

function findElementByKey(key) {
  let el = document.getElementById(key);
  if (el) return el;

  // Convert camelCase to kebab-case: e.g. secGoogleTitle -> sec-google-title, sec2Title -> sec2-title
  const kebab = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  el = document.getElementById(kebab);
  if (el) return el;

  // Direct lowercase fallback
  el = document.getElementById(key.toLowerCase());
  return el;
}

// Language Handling
function initLanguage(pageTranslations, onApplyLanguage) {
  if (pageTranslations) {
    window.__pageTranslations = pageTranslations;
  }
  const savedLang = getPreferredLanguage();
  applyLanguage(savedLang, pageTranslations, onApplyLanguage);
}

function setLanguage(lang, pageTranslations, onApplyLanguage) {
  if (pageTranslations) {
    window.__pageTranslations = pageTranslations;
  }
  localStorage.setItem('dentatlas_lang', lang);
  applyLanguage(lang, pageTranslations || window.__pageTranslations, onApplyLanguage);
}

function toggleLanguage(pageTranslations, onApplyLanguage) {
  const currentLang = document.documentElement.getAttribute('lang') || 'ar';
  const newLang = currentLang === 'ar' ? 'en' : 'ar';
  setLanguage(newLang, pageTranslations, onApplyLanguage);
}

function applyLanguage(lang, pageTranslations, onApplyLanguage) {
  localStorage.setItem('dentatlas_lang', lang);
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  // Update segmented pills
  const pillAr = document.getElementById('lang-pill-ar');
  const pillEn = document.getElementById('lang-pill-en');
  if (pillAr && pillEn) {
    if (lang === 'ar') {
      pillAr.classList.add('active');
      pillEn.classList.remove('active');
    } else {
      pillEn.classList.add('active');
      pillAr.classList.remove('active');
    }
  }

  // Legacy single toggle button
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

    setT('nl-home', c.navHome);
    setT('nl-about', c.navAbout);
    setT('nl-privacy', c.navPrivacy);
    setT('nl-terms', c.navTerms);
    setT('nl-support', c.navSupport);
    setT('nl-contact', c.navContact);
    setT('nl-delete', c.navDelete);

    setT('fl-home', c.navHome);
    setT('fl-about', c.navAbout);
    setT('fl-privacy', c.navPrivacy);
    setT('fl-terms', c.navTerms);
    setT('fl-support', c.navSupport);
    setT('fl-contact', c.navContact);
    setT('fl-delete', c.navDelete);

    setT('ft-brand', c.ftBrand);
    setT('ft-tagline', c.ftTagline);
    const copyEl = document.getElementById('ft-copy');
    if (copyEl) copyEl.innerHTML = c.ftCopy;
  }

  const translations = pageTranslations || window.__pageTranslations;
  if (translations && translations[lang]) {
    const p = translations[lang];
    for (const [key, val] of Object.entries(p)) {
      try {
        const el = findElementByKey(key);
        if (el) {
          if (typeof val === 'string' && (val.includes('<') || val.includes('&'))) {
            el.innerHTML = val;
          } else {
            el.textContent = val;
          }
        }
      } catch (err) {
        console.warn('i18n replacement error for key:', key, err);
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
