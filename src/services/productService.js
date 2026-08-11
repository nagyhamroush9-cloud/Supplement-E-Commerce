import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

let products = [...productsData];
let categories = [...categoriesData];

export function getProducts() {
  return products;
}

export function getCategories() {
  return categories;
}

export function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug) || null;
}

export function getProductsByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return products;
  return products.filter((p) => p.category === categoryId);
}

export function getFeaturedProducts(limit = 8) {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getBestSellers(limit = 8) {
  return products.filter((p) => p.bestSeller).slice(0, limit);
}

export function getNewArrivals(limit = 8) {
  return products.filter((p) => p.newArrival).slice(0, limit);
}

export function getRelatedProducts(product, limit = 4) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function searchProducts(query) {
  const q = normalizeSearchText(query);
  if (!q) return products;

  const terms = q.split(' ').filter(Boolean);

  return products.filter((p) => {
    const category = getCategoryById(p.category);
    const searchable = normalizeSearchText(
      [
        p.name,
        p.slug,
        p.category,
        category?.name,
        category?.nameAr,
        category?.description,
        p.shortDescription,
        p.description,
        ...(p.tags || []),
        ...(p.flavors || []),
        getArabicSearchHints(p, category),
      ].join(' ')
    );

    return terms.every((term) => termMatchesSearchable(term, searchable));
  });
}

const QUERY_ALIASES = {
  واي: 'whey',
  بروتين: 'protein',
  كرياتين: 'creatine',
  فيتامين: 'vitamin',
  فيتامينات: 'vitamins',
  شيكر: 'shaker',
  امينو: 'amino',
  'أحماض': 'amino',
  امينية: 'amino',
  'أمينية': 'amino',
  تمرين: 'workout',
  قبل: 'pre',
  استشفاء: 'recovery',
  طاقة: 'energy',
  تركيز: 'focus',
};

function getArabicSearchHints(product, category) {
  const hints = [];
  if (category?.nameAr) hints.push(category.nameAr);

  const name = String(product.name || '').toLowerCase();
  if (name.includes('whey') || (product.tags || []).includes('whey')) hints.push('واي');
  if (name.includes('creatine') || (product.tags || []).includes('creatine')) hints.push('كرياتين');
  if (name.includes('protein') || (product.tags || []).includes('protein')) hints.push('بروتين');
  if (name.includes('vitamin') || (product.tags || []).includes('vitamins')) hints.push('فيتامين', 'فيتامينات');
  if (name.includes('pre-workout') || product.category === 'pre-workout') hints.push('قبل التمرين');
  if (name.includes('shaker') || (product.tags || []).includes('shaker')) hints.push('شيكر');
  if (name.includes('bcaa') || (product.tags || []).includes('bcaa')) hints.push('بي سي اي اي');
  if (name.includes('casein')) hints.push('كازين');

  return hints.join(' ');
}

function termMatchesSearchable(term, searchable) {
  const variants = [term];
  const alias = QUERY_ALIASES[term];
  if (alias) variants.push(normalizeSearchText(alias));
  return variants.some((variant) => searchable.includes(variant));
}

function normalizeSearchText(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function filterProducts({ category, minPrice, maxPrice, inStockOnly }, source = null) {
  let result = source ? [...source] : [...products];

  if (category && category !== 'all') {
    result = result.filter((p) => p.category === category);
  }
  if (minPrice != null && minPrice !== '') {
    result = result.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice != null && maxPrice !== '') {
    result = result.filter((p) => p.price <= Number(maxPrice));
  }
  if (inStockOnly) {
    result = result.filter((p) => p.stock > 0);
  }

  return result;
}

export function sortProducts(list, sortBy) {
  const arr = [...list];
  switch (sortBy) {
    case 'newest':
      return arr.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'best-selling':
      return arr.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    case 'rating':
      return arr.sort((a, b) => b.rating - a.rating);
    case 'featured':
    default:
      return arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
}

export function getCategoryById(id) {
  return categories.find((c) => c.id === id) || null;
}

export function getPriceRange() {
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function isInStock(product) {
  return product && product.stock > 0;
}

export function getDiscountPercent(product) {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}
