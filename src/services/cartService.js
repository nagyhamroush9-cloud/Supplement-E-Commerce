import { storeConfig } from '../data/store-config.js';
import { getItem, setItem } from './storageService.js';
import { getProductById, isInStock } from './productService.js';

const CART_KEY = storeConfig.cartStorageKey;
let normalized = false;

/**
 * Merge duplicate cart entries (same id + flavor) into one item.
 */
export function normalizeCart(cart) {
  if (!Array.isArray(cart)) return [];

  const map = new Map();

  for (const raw of cart) {
    if (!raw || typeof raw.id !== 'string') continue;

    const flavor = raw.flavor || '';
    const key = `${raw.id}::${flavor}`;
    const qty = Math.max(1, Math.floor(Number(raw.quantity)) || 1);
    const price = Number(raw.price);

    if (isNaN(price) || price < 0) continue;

    const product = getProductById(raw.id);
    if (!product) continue;

    if (map.has(key)) {
      const existing = map.get(key);
      existing.quantity += qty;
    } else {
      map.set(key, {
        id: raw.id,
        slug: raw.slug || product.slug,
        name: raw.name || product.name,
        price: product.price,
        thumbnail: raw.thumbnail || product.thumbnail,
        quantity: qty,
        flavor,
        maxStock: product.stock,
      });
    }
  }

  return Array.from(map.values()).map((item) => {
    const product = getProductById(item.id);
    if (product && item.quantity > product.stock) {
      item.quantity = product.stock;
    }
    if (product) {
      item.price = product.price;
      item.maxStock = product.stock;
    }
    return item;
  });
}

function getCart() {
  const raw = getItem(CART_KEY, []);
  const cart = normalizeCart(raw);

  if (!normalized && Array.isArray(raw) && raw.length !== cart.length) {
    setItem(CART_KEY, cart);
  }
  normalized = true;

  return cart;
}

function saveCart(cart) {
  const normalizedCart = normalizeCart(cart);
  setItem(CART_KEY, normalizedCart);
  window.dispatchEvent(new CustomEvent('cart-updated'));
}

function findIndex(cart, productId, flavor) {
  return cart.findIndex(
    (item) => item.id === productId && (item.flavor || '') === (flavor || '')
  );
}

export function getCartItems() {
  return getCart();
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function addToCart(productId, quantity = 1, flavor = '') {
  const product = getProductById(productId);
  if (!product) return { success: false, message: 'invalid' };
  if (!isInStock(product)) return { success: false, message: 'stock' };

  const qty = Math.max(1, Math.floor(Number(quantity)) || 1);
  const cart = getCart();
  const idx = findIndex(cart, productId, flavor);

  if (idx >= 0) {
    const newQty = cart[idx].quantity + qty;
    if (newQty > product.stock) {
      return { success: false, message: 'stock_limit', stock: product.stock };
    }
    cart[idx].quantity = newQty;
  } else {
    if (qty > product.stock) {
      return { success: false, message: 'stock_limit', stock: product.stock };
    }
    cart.push({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: qty,
      flavor: flavor || (product.flavors?.[0] || ''),
      maxStock: product.stock,
    });
  }

  saveCart(cart);
  return { success: true, message: 'added' };
}

export function removeFromCart(productId, flavor = '') {
  const cart = getCart().filter(
    (item) => !(item.id === productId && (item.flavor || '') === (flavor || ''))
  );
  saveCart(cart);
  return { success: true, message: 'removed' };
}

export function updateQuantity(productId, quantity, flavor = '') {
  const product = getProductById(productId);
  if (!product) return { success: false, message: 'invalid' };

  const qty = Math.floor(Number(quantity));
  if (qty < 1) return removeFromCart(productId, flavor);
  if (qty > product.stock) {
    return { success: false, message: 'stock_limit', stock: product.stock };
  }

  const cart = getCart();
  const idx = findIndex(cart, productId, flavor);
  if (idx < 0) return { success: false, message: 'invalid' };

  cart[idx].quantity = qty;
  saveCart(cart);
  return { success: true };
}

export function clearCart() {
  saveCart([]);
}

export function isInCart(productId, flavor = '') {
  return findIndex(getCart(), productId, flavor) >= 0;
}

// Run normalization on module load
getCart();
