# IRONFLEX Nutrition — Premium Supplement E-Commerce

A production-quality, **100% static** frontend e-commerce website for a fitness supplements brand. Browse products, manage a cart, and submit orders via WhatsApp — no backend, database, or paid services required.

## Features

- Premium dark theme with configurable accent color
- Full product catalog with search, filters, and sorting
- Product details with image gallery, tabs, flavor & quantity selectors
- Client-side shopping cart (localStorage)
- Wishlist / favorites
- Recently viewed products
- Quick View modal
- Checkout with form validation
- Arabic WhatsApp order message generation
- Responsive design (mobile-first)
- Toast notifications
- SEO basics (meta tags, robots.txt, sitemap)
- PWA-ready manifest
- Analytics event hooks (ready for future integration)

## Tech Stack

- HTML5, CSS3, Modern JavaScript (ES Modules)
- Vite (build tool & dev server)
- Vanilla JavaScript — no framework dependencies
- Hash-based routing (works on all static hosts)

## Project Structure

```
├── public/                  # Static assets served as-is
│   ├── assets/              # Product & category images
│   ├── favicon.svg
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── data/
│   │   ├── products.json    # All product data
│   │   ├── categories.json  # Category definitions
│   │   └── store-config.js  # ★ Central configuration
│   ├── services/            # Business logic layer
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page renderers
│   ├── utils/               # Helpers (format, dom, seo, validation)
│   ├── styles/main.css      # Global styles
│   ├── router.js            # Client-side router
│   ├── app.js               # App bootstrap
│   └── main.js              # Entry point
├── scripts/
│   └── generate-assets.js   # Generate placeholder SVG images
├── index.html
├── vite.config.js
└── package.json
```

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed

### Install & Run

```bash
npm install
node scripts/generate-assets.js
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

Output goes to the `dist/` folder — deploy this folder to any static host.

## Product Management

All products live in **`src/data/products.json`**. To add a product:

1. Add a product object to the JSON array:

```json
{
  "id": "unique-id",
  "slug": "url-friendly-slug",
  "name": "Product Name",
  "category": "protein",
  "price": 1200,
  "oldPrice": null,
  "currency": "EGP",
  "images": ["/assets/products/your-product/main.svg"],
  "thumbnail": "/assets/products/your-product/main.svg",
  "shortDescription": "Brief description",
  "description": "Full description",
  "benefits": ["Benefit 1"],
  "ingredients": ["Ingredient 1"],
  "usage": "How to use",
  "warnings": ["Warning 1"],
  "weight": "2 kg",
  "flavors": ["Chocolate"],
  "rating": 4.5,
  "reviewCount": 0,
  "stock": 50,
  "featured": false,
  "bestSeller": false,
  "newArrival": true,
  "tags": ["tag1", "tag2"]
}
```

2. Set `stock: 0` for out-of-stock products.
3. Use valid category IDs from `categories.json`.

## Image Management

1. Create a folder: `public/assets/products/your-product-slug/`
2. Add images (SVG, WebP, or PNG recommended)
3. Reference paths in the product JSON: `/assets/products/your-product-slug/main.svg`
4. Run `node scripts/generate-assets.js` to regenerate placeholder SVGs

## Configuration

**All store settings are in `src/data/store-config.js`:**

| Setting | Description |
|---------|-------------|
| `brandName` | Store name |
| `whatsapp` | WhatsApp number (international, no +) |
| `phone` | Display phone number |
| `email` | Contact email |
| `currency` / `currencySymbol` | Price formatting |
| `accentColor` | Theme accent color |
| `social` | Instagram, Facebook, TikTok, WhatsApp URLs |
| `governorates` | Delivery governorates list |
| `deliveryInfo` | Delivery policy text |

Change the WhatsApp number in **one place** — `storeConfig.whatsapp`.

## WhatsApp Order System

When a customer confirms an order:

1. Cart items, totals, and customer info are compiled
2. A formatted **Arabic message** is generated
3. WhatsApp opens via click-to-chat URL (`wa.me`)
4. The customer sends the pre-filled message manually

No WhatsApp API is used. Orders are **not** stored server-side.

## Deployment

Deploy the `dist/` folder to any static hosting platform:

### Netlify
```bash
npm run build
# Drag & drop dist/ folder, or connect Git repo
# Build command: npm run build
# Publish directory: dist
```

### Vercel
```bash
npm run build
# Import repo — Vite is auto-detected
```

### GitHub Pages
```bash
npm run build
# Push dist/ contents to gh-pages branch
# base: './' is already configured in vite.config.js
```

### Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`

Update `storeConfig.seo.siteUrl` and `public/sitemap.xml` with your actual domain.

## Routes

| Route | Page |
|-------|------|
| `#/` | Home |
| `#/shop` | Product catalog |
| `#/product/:slug` | Product details |
| `#/cart` | Shopping cart |
| `#/checkout` | Checkout form |
| `#/order-confirm` | Order review & WhatsApp |
| `#/favorites` | Wishlist |
| `#/about` | About page |
| `#/contact` | Contact page |
| `#/privacy` | Privacy policy (placeholder) |
| `#/terms` | Terms (placeholder) |
| `#/shipping` | Shipping policy (placeholder) |
| `#/returns` | Return policy (placeholder) |

## Future Backend Migration

The architecture separates concerns for easy backend integration:

```
DATA (JSON)  →  SERVICES  →  UI COMPONENTS  →  PAGES
                    ↓
              API Layer (future)
                    ↓
              Backend + Database
```

Replace service implementations (e.g. `productService.getProducts()`) with API calls without rewriting UI components.

## License

Demo project — replace placeholder content and images with your brand assets before production use.
