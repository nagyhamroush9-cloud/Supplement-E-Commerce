import { storeConfig } from '../data/store-config.js';

export function updateSEO({ title, description, image, url }) {
  const fullTitle = title
    ? `${title} | ${storeConfig.brandName}`
    : storeConfig.seo.defaultTitle;

  document.title = fullTitle;

  setMeta('description', description || storeConfig.seo.defaultDescription);
  setMetaProperty('og:title', fullTitle);
  setMetaProperty('og:description', description || storeConfig.seo.defaultDescription);
  setMetaProperty('og:url', url || storeConfig.seo.siteUrl);
  if (image) setMetaProperty('og:image', image);
  setMetaName('twitter:title', fullTitle);
  setMetaName('twitter:description', description || storeConfig.seo.defaultDescription);
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setMetaProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setMetaName(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}
