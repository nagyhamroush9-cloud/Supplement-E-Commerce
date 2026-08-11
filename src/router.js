import { scrollToTop } from './utils/dom.js';

export function createRouter(routes, onNavigate) {
  let currentPath = '/';
  let currentQuery = {};
  let pageState = {};

  function parseHash() {
    const hash = window.location.hash.slice(1) || '/';
    const [pathPart, queryPart] = hash.split('?');
    const path = pathPart || '/';
    const query = {};
    if (queryPart) {
      new URLSearchParams(queryPart).forEach((v, k) => {
        query[k] = v;
      });
    }
    return { path, query };
  }

  function matchRoute(path) {
    for (const route of routes) {
      if (route.path === path) return { route, params: {} };
      if (route.pattern) {
        const match = path.match(route.pattern);
        if (match) {
          const params = {};
          route.paramNames?.forEach((name, i) => {
            params[name] = match[i + 1];
          });
          return { route, params };
        }
      }
    }
    return null;
  }

  function navigate(path, query = {}, state = {}) {
    pageState = { ...pageState, ...state };
    let newHash = `#${path}`;
    const qs = new URLSearchParams(query).toString();
    if (qs) newHash += `?${qs}`;

    if (window.location.hash === newHash) {
      handleRoute();
      return;
    }

    window.location.hash = newHash;
  }

  function handleRoute(options = {}) {
    const { preserveScroll = false } = options;
    const scrollY = preserveScroll ? window.scrollY : 0;

    const { path, query } = parseHash();
    currentPath = path;
    currentQuery = query;

    const matched = matchRoute(path);
    if (!matched) {
      onNavigate({ route: { name: 'not-found' }, params: {}, query, state: pageState });
    } else {
      onNavigate({
        route: matched.route,
        params: matched.params,
        query,
        state: pageState,
      });
    }

    if (preserveScroll) {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    } else {
      scrollToTop();
    }
  }

  window.addEventListener('hashchange', handleRoute);

  return {
    navigate,
    refresh: (options = {}) => handleRoute(options),
    getCurrentPath: () => currentPath,
    getQuery: () => currentQuery,
    getState: () => pageState,
    setState: (s) => {
      pageState = { ...pageState, ...s };
    },
    start: () => {
      if (!window.location.hash) window.location.hash = '/';
      handleRoute();
    },
  };
}

export function route(pattern, name, paramNames = []) {
  if (!pattern.includes(':')) {
    return { path: pattern, name };
  }
  const regex = pattern.replace(/:[^/]+/g, '([^/]+)');
  return { pattern: new RegExp(`^${regex}$`), name, paramNames };
}
