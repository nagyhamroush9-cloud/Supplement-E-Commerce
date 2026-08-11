/**
 * Analytics event hooks — replace with real analytics later.
 */
const listeners = [];

export function onEvent(callback) {
  listeners.push(callback);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

export function track(eventName, data = {}) {
  const payload = { event: eventName, data, timestamp: Date.now() };
  listeners.forEach((cb) => {
    try {
      cb(payload);
    } catch {
      /* ignore */
    }
  });
  if (import.meta.env.DEV) {
    console.debug('[Analytics]', eventName, data);
  }
}

export const Events = {
  PRODUCT_VIEWED: 'product_viewed',
  ADD_TO_CART: 'product_added_to_cart',
  CHECKOUT_STARTED: 'checkout_started',
  WHATSAPP_ORDER: 'whatsapp_order_clicked',
  SEARCH: 'search_performed',
  CATEGORY_SELECTED: 'category_selected',
};
