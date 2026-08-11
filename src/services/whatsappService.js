import { storeConfig } from '../data/store-config.js';
import { formatPrice } from '../utils/format.js';

/**
 * Generate Arabic WhatsApp order message and click-to-chat URL.
 */
export function buildOrderMessage(cartItems, customer, totals) {
  const lines = cartItems.map(
    (item) =>
      `• ${item.name}${item.flavor ? ` (${item.flavor})` : ''} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`
  );

  let message = `السلام عليكم، أريد طلب المنتجات التالية:\n\n`;
  message += `🛒 الطلب:\n\n`;
  message += lines.join('\n');
  message += `\n\n💰 الإجمالي: ${formatPrice(totals.total)}`;

  message += `\n\n👤 بيانات العميل:\n`;
  message += `الاسم: ${customer.fullName}\n`;
  message += `الهاتف: ${customer.phone}\n`;
  message += `المحافظة: ${customer.governorate}\n`;
  message += `المدينة: ${customer.city}\n`;
  message += `العنوان: ${customer.address}`;

  if (customer.deliveryTime) {
    message += `\nوقت التوصيل المفضل: ${customer.deliveryTime}`;
  }
  if (customer.notes) {
    message += `\n\nملاحظات: ${customer.notes}`;
  }

  message += `\n\nتم إرسال الطلب من الموقع.`;

  return message;
}

export function getWhatsAppUrl(message) {
  const number = storeConfig.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppOrder(cartItems, customer, totals) {
  const message = buildOrderMessage(cartItems, customer, totals);
  const url = getWhatsAppUrl(message);
  window.open(url, '_blank', 'noopener,noreferrer');
  return url;
}
