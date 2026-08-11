/**
 * Central store configuration — S.H Supplements
 */
export const storeConfig = {
  brandName: 'S.H Supplements',
  brandTagline: 'Fuel Your Potential',
  brandSlogan: 'Train Hard. Recover Better.',
  logoText: 'S.H',
  logoSubtext: 'SUPPLEMENTS',

  // WhatsApp: international format without + (wa.me)
  whatsapp: '201025922606',
  phone: '01025922606',
  email: 'info@shsupplements.com',

  defaultLanguage: 'ar',
  languageStorageKey: 'sh_language',

  currency: 'EGP',
  currencySymbol: 'EGP',
  currencySymbolAr: 'جنيه',
  currencyLocale: 'ar-EG',
  priceFormat: '{amount} {symbol}',
  priceFormatAr: '{amount} {symbol}',

  logoColor: '#1a2744',
  brandRed: '#E84E1B',
  accentColor: '#E84E1B',
  accentColorHover: '#C43E12',

  storeDescription:
    'The strongest nutritional supplements for athletes — Original quality — Guaranteed results.',

  aboutText:
    'S.H Supplements is a premium supplement brand dedicated to supporting athletes across Egypt. We offer carefully selected original products for strength, recovery, and overall performance with fast delivery and reliable service.',

  deliveryInfo: 'Shipping to all Egyptian governorates. Fees confirmed via WhatsApp.',
  deliveryNote: 'Delivery fees will be confirmed via WhatsApp.',
  deliveryType: 'manual',
  fixedDeliveryFee: 0,
  workingHours: 'Daily 10:00 AM – 10:00 PM',

  social: {
    instagram: 'https://instagram.com/shsupplements',
    facebook: 'https://facebook.com/shsupplements',
    tiktok: 'https://www.tiktok.com/@s.h_supplements',
    whatsapp: 'https://wa.me/201025922606',
  },

  governorates: [
    'القاهرة',
    'الجيزة',
    'الإسكندرية',
    'الدقهلية',
    'البحيرة',
    'الشرقية',
    'الغربية',
    'المنوفية',
    'القليوبية',
    'بورسعيد',
    'الإسماعيلية',
    'السويس',
    'كفر الشيخ',
    'دمياط',
    'الفيوم',
    'بني سويف',
    'المنيا',
    'أسيوط',
    'سوهاج',
    'قنا',
    'الأقصر',
    'أسوان',
    'البحر الأحمر',
    'مطروح',
    'شمال سيناء',
    'South Sinai',
    'الوادي الجديد',
  ],

  disclaimer:
    'These products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease. Consult a healthcare professional before use.',

  recentlyViewedLimit: 8,
  cartStorageKey: 'shsupplements_cart',
  favoritesStorageKey: 'shsupplements_favorites',
  recentlyViewedStorageKey: 'shsupplements_recently_viewed',
  themeStorageKey: 'shsupplements_theme',

  seo: {
    defaultTitle: 'S.H Supplements — Premium Supplements',
    defaultDescription:
      'Shop premium protein, creatine, pre-workout, vitamins & more. Order easily via WhatsApp.',
    siteUrl: 'https://your-domain.com',
  },

  benefits: [
    { icon: 'quality', titleKey: 'highlights.original', descriptionKey: 'highlights.original' },
    { icon: 'delivery', titleKey: 'highlights.shipping', descriptionKey: 'highlights.shipping' },
    { icon: 'support', titleKey: 'highlights.support', descriptionKey: 'highlights.support' },
    { icon: 'returns', titleKey: 'highlights.returns', descriptionKey: 'highlights.returns' },
  ],
};

export default storeConfig;
