import { storeConfig } from '../data/store-config.js';

export function getConfig() {
  return storeConfig;
}

export function getWhatsAppNumber() {
  return storeConfig.whatsapp;
}

export function getBrandName() {
  return storeConfig.brandName;
}

export function getCurrency() {
  return storeConfig.currency;
}

export function getSocialLinks() {
  return storeConfig.social;
}

export function getGovernorates() {
  return storeConfig.governorates;
}

export function applyThemeVariables() {
  const root = document.documentElement;
  root.style.setProperty('--accent', storeConfig.accentColor);
  root.style.setProperty('--accent-hover', storeConfig.accentColorHover);
}
