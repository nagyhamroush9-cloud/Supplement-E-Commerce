import { storeConfig } from '../data/store-config.js';
import { getItem, setItem } from './storageService.js';

const KEY = storeConfig.recentlyViewedStorageKey;
const LIMIT = storeConfig.recentlyViewedLimit;

export function getRecentlyViewed() {
  const list = getItem(KEY, []);
  return Array.isArray(list) ? list.filter((id) => typeof id === 'string') : [];
}

export function addRecentlyViewed(productId) {
  let list = getRecentlyViewed().filter((id) => id !== productId);
  list.unshift(productId);
  list = list.slice(0, LIMIT);
  setItem(KEY, list);
}
