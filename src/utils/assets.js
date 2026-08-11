export function assetUrl(path) {
  if (!path) return '';
  const normalized = String(path).replace(/^\/+/, '');
  const base = import.meta.env.BASE_URL || './';
  return `${base}${normalized}`;
}
