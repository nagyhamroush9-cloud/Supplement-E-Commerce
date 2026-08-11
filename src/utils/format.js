import { storeConfig } from '../data/store-config.js';
import { getLanguage } from '../services/i18nService.js';

export function formatPrice(amount) {
  const lang = getLanguage();
  const formatted = Number(amount).toLocaleString(storeConfig.currencyLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const symbol = lang === 'ar' ? storeConfig.currencySymbolAr : storeConfig.currencySymbol;
  const template = lang === 'ar' ? storeConfig.priceFormatAr : storeConfig.priceFormat;

  return template.replace('{amount}', formatted).replace('{symbol}', symbol);
}

export function formatRating(rating) {
  return Number(rating).toFixed(1);
}
