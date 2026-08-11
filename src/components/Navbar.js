import { storeConfig } from '../data/store-config.js';
import { getCartCount } from '../services/cartService.js';
import { t, getLanguage } from '../services/i18nService.js';
import { getCategories } from '../services/productService.js';
import { getLocalizedCategory } from '../services/i18nService.js';
import { escapeHtml } from '../utils/dom.js';

function isCategoriesView(path, query) {
  if (path !== '/shop') return false;
  if (query.view === 'categories') return true;
  return Boolean(query.category && query.category !== 'all');
}

function isShopProductsView(path, query) {
  return path === '/shop' && !isCategoriesView(path, query);
}

function buildCategoryMenuItems() {
  return getCategories()
    .map(
      (c) =>
        `<a href="#/shop?category=${escapeHtml(c.id)}" class="nav__dropdown-link">${escapeHtml(getLocalizedCategory(c))}</a>`
    )
    .join('');
}

export function BrandLogo() {
  return `
    <span class="brand-logo">
      <img
        src="/assets/logo.png"
        alt="${escapeHtml(storeConfig.brandName)}"
        class="brand-logo__img"
        width="304"
        height="320"
        loading="eager"
      />
    </span>
  `;
}

export function TopBar() {
  return `
    <div class="topbar">
      <div class="container topbar__inner">
        <span class="topbar__item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          ${escapeHtml(t('topbar.shipping'))}
        </span>
        <span class="topbar__item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          ${escapeHtml(t('topbar.original'))}
        </span>
        <a href="${escapeHtml(storeConfig.social.whatsapp)}" target="_blank" rel="noopener" class="topbar__item topbar__item--link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          ${escapeHtml(t('topbar.whatsapp'))}
        </a>
      </div>
    </div>
  `;
}

export function Navbar(currentPath = '/', query = {}) {
  const cartCount = getCartCount();
  const lang = getLanguage();
  const categoriesOpen = isCategoriesView(currentPath, query);

  const links = [
    { href: '#/', label: t('nav.home'), active: currentPath === '/' },
    { href: '#/shop', label: t('nav.shop'), active: isShopProductsView(currentPath, query) },
    { href: '#/about', label: t('nav.about'), active: currentPath === '/about' },
    { href: '#/contact', label: t('nav.contact'), active: currentPath === '/contact' },
  ];

  const navLinks = links
    .map((l) => `<a href="${l.href}" class="nav__link ${l.active ? 'nav__link--active' : ''}">${escapeHtml(l.label)}</a>`)
    .join('');

  const categoriesDropdown = `
    <div class="nav__dropdown" data-nav-dropdown>
      <a
        href="#/shop?view=categories"
        class="nav__link nav__link--dropdown ${categoriesOpen ? 'nav__link--active' : ''}"
        aria-haspopup="true"
      >
        ${escapeHtml(t('nav.categories'))}
        <svg class="nav__dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </a>
      <div class="nav__dropdown-menu" role="menu">
        <a href="#/shop?view=categories" class="nav__dropdown-link nav__dropdown-link--all" role="menuitem">${escapeHtml(t('shop.allCategories'))}</a>
        ${buildCategoryMenuItems()}
      </div>
    </div>
  `;

  const mobileCategoryLinks = getCategories()
    .map(
      (c) =>
        `<a href="#/shop?category=${escapeHtml(c.id)}" class="nav__link nav__link--sub">${escapeHtml(getLocalizedCategory(c))}</a>`
    )
    .join('');

  const searchQuery = currentPath === '/shop' && query.search ? String(query.search) : '';

  return `
    ${TopBar()}
    <header class="navbar" role="banner">
      <div class="container navbar__inner">
        <a href="#/" class="navbar__brand" aria-label="${escapeHtml(storeConfig.brandName)}">
          ${BrandLogo()}
        </a>

        <nav class="nav nav--desktop" aria-label="Main navigation">${navLinks}${categoriesDropdown}</nav>

        <div class="navbar__actions">
          <button type="button" class="navbar__icon-btn navbar__icon-btn--search" data-action="toggle-search" aria-label="${escapeHtml(t('nav.search'))}" aria-expanded="false" aria-controls="navbar-search-panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
          <a href="#/favorites" class="navbar__icon-btn navbar__icon-btn--favorites" aria-label="${escapeHtml(t('nav.favorites'))}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </a>
          <a href="#/cart" class="navbar__icon-btn navbar__cart" aria-label="${escapeHtml(t('nav.cart'))}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span class="navbar__badge navbar__cart-count ${cartCount > 0 ? 'navbar__badge--visible' : ''}">${cartCount}</span>
          </a>
          <button type="button" class="navbar__lang-btn" data-action="toggle-lang" aria-label="${escapeHtml(t('nav.switchLang'))}">${lang === 'ar' ? 'EN' : 'عربي'}</button>
          <button type="button" class="navbar__menu-btn" aria-label="Open menu" aria-expanded="false" data-mobile-menu-toggle>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <div class="navbar__search-panel" id="navbar-search-panel" data-navbar-search hidden>
        <div class="container navbar__search-inner">
          <form class="navbar__search-form" data-search-form role="search">
            <label class="visually-hidden" for="navbar-search-input">${escapeHtml(t('nav.search'))}</label>
            <input
              type="search"
              id="navbar-search-input"
              class="navbar__search-input"
              data-search-input
              placeholder="${escapeHtml(t('shop.searchPlaceholder'))}"
              value="${escapeHtml(searchQuery)}"
              autocomplete="off"
            />
            <button type="submit" class="navbar__search-submit" aria-label="${escapeHtml(t('nav.search'))}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </form>
        </div>
      </div>
      <div class="mobile-menu" data-mobile-menu hidden>
        <nav class="mobile-menu__nav" aria-label="Mobile navigation">
          <form class="mobile-menu__search" data-search-form role="search">
            <input
              type="search"
              class="mobile-menu__search-input"
              data-search-input
              placeholder="${escapeHtml(t('shop.searchPlaceholder'))}"
              value="${escapeHtml(searchQuery)}"
              autocomplete="off"
            />
            <button type="submit" class="mobile-menu__search-btn" aria-label="${escapeHtml(t('nav.search'))}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </form>
          ${navLinks}
          <a href="#/shop?view=categories" class="nav__link ${categoriesOpen ? 'nav__link--active' : ''}">${escapeHtml(t('nav.categories'))}</a>
          <div class="mobile-menu__sub">${mobileCategoryLinks}</div>
          <button type="button" class="nav__link nav__link--btn" data-action="toggle-lang">${lang === 'ar' ? 'English' : 'عربي'}</button>
        </nav>
      </div>
    </header>
  `;
}

let navbarToggleBound = false;

export function closeNavbarSearch() {
  const panel = document.querySelector('[data-navbar-search]');
  const toggle = document.querySelector('[data-action="toggle-search"]');
  panel?.setAttribute('hidden', '');
  toggle?.setAttribute('aria-expanded', 'false');
}

export function initNavbar() {
  if (!navbarToggleBound) {
    navbarToggleBound = true;
    const app = document.getElementById('app');

    app.addEventListener('click', (e) => {
      if (e.target.closest('[data-navbar-search]')) {
        return;
      }

      const searchToggle = e.target.closest('[data-action="toggle-search"]');
      if (searchToggle) {
        e.preventDefault();
        const panel = document.querySelector('[data-navbar-search]');
        if (!panel) return;
        panel.removeAttribute('hidden');
        searchToggle.setAttribute('aria-expanded', 'true');
        requestAnimationFrame(() => {
          panel.querySelector('[data-search-input]')?.focus();
        });
        return;
      }

      closeNavbarSearch();

      const btn = e.target.closest('[data-mobile-menu-toggle]');
      if (btn) {
        const m = document.querySelector('[data-mobile-menu]');
        if (!m) return;
        if (m.hasAttribute('hidden')) {
          m.removeAttribute('hidden');
          btn.setAttribute('aria-expanded', 'true');
        } else {
          m.setAttribute('hidden', '');
          btn.setAttribute('aria-expanded', 'false');
        }
        return;
      }

      const menuLink = e.target.closest('.mobile-menu__nav a[href^="#"]');
      if (menuLink) {
        document.querySelector('[data-mobile-menu]')?.setAttribute('hidden', '');
        document.querySelector('[data-mobile-menu-toggle]')?.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNavbarSearch();
    });
  }
}

export function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.navbar__cart-count, .floating-cart__count').forEach((el) => {
    el.textContent = count;
    el.classList.toggle('navbar__badge--visible', count > 0);
    el.classList.toggle('floating-cart__count--visible', count > 0);
  });
}
