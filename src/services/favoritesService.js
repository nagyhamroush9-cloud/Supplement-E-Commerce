import { storeConfig } from '../data/store-config.js';
import { getItem, setItem } from './storageService.js';

const KEY = storeConfig.favoritesStorageKey;

function getFavorites() {
  const favs = getItem(KEY, []);
  return Array.isArray(favs) ? favs.filter((id) => typeof id === 'string') : [];
}

export function getFavoriteIds() {
  return getFavorites();
}

export function isFavorite(productId) {
  return getFavorites().includes(productId);
}

export function toggleFavorite(productId) {
  const favs = getFavorites();
  const idx = favs.indexOf(productId);
  if (idx >= 0) {
    favs.splice(idx, 1);
    setItem(KEY, favs);
    window.dispatchEvent(new CustomEvent('favorites-updated'));
    return { added: false, message: 'Removed from favorites.' };
  }
  favs.push(productId);
  setItem(KEY, favs);
  window.dispatchEvent(new CustomEvent('favorites-updated'));
  return { added: true, message: 'Added to favorites.' };
}

export function removeFavorite(productId) {
  const favs = getFavorites().filter((id) => id !== productId);
  setItem(KEY, favs);
  window.dispatchEvent(new CustomEvent('favorites-updated'));
}
