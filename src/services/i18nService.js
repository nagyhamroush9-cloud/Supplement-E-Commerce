import { storeConfig } from '../data/store-config.js';
import { getItem, setItem } from './storageService.js';
import { translations } from '../i18n/translations.js';

const LANG_KEY = storeConfig.languageStorageKey || 'sh_language';
let currentLang = 'ar';

export function getLanguage() {
  return currentLang;
}

export function initLanguage() {
  const saved = getItem(LANG_KEY, null);
  if (saved === 'en' || saved === 'ar') {
    currentLang = saved;
  } else {
    currentLang = storeConfig.defaultLanguage || 'ar';
  }
  applyDocumentLanguage();
}

export function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'ar') return;
  currentLang = lang;
  setItem(LANG_KEY, lang);
  applyDocumentLanguage();
  window.dispatchEvent(new CustomEvent('language-changed', { detail: { lang } }));
}

export function toggleLanguage() {
  setLanguage(currentLang === 'ar' ? 'en' : 'ar');
}

function applyDocumentLanguage() {
  const html = document.documentElement;
  html.lang = currentLang;
  html.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('is-rtl', currentLang === 'ar');
  document.body.classList.toggle('is-ltr', currentLang === 'en');
}

export function t(key) {
  const keys = key.split('.');
  let value = translations[currentLang];
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
  if (value !== undefined) return value;

  // Fallback to English
  let fallback = translations.en;
  for (const k of keys) {
    fallback = fallback?.[k];
    if (fallback === undefined) break;
  }
  return fallback ?? key;
}

export function isRTL() {
  return currentLang === 'ar';
}

export function getLocalizedCategory(category) {
  if (!category) return '';
  return currentLang === 'ar' && category.nameAr ? category.nameAr : category.name;
}
