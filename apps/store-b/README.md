# Store B - ShadowBox Frames FrameCraft Storefront

ShadowBox Frames storefront built on the FrameCraft multi-store platform.

## Overview

Store B (ShadowboxFrames.com) is built using Next.js 14+ with the App Router and integrates with all shared packages from the monorepo.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Install dependencies from the monorepo root:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.local.example .env.local
   ```

3. Fill in your environment variables in `.env.local`

### Development

Run the development server:

```bash
npm run dev --filter=@framecraft/store-b
```

Or from the store-b directory:

```bash
cd apps/store-b
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Building

Build for production:

```bash
npm run build --filter=@framecraft/store-b
```

### Type Checking

Run TypeScript type checking:

```bash
npm run type-check --filter=@framecraft/store-b
```

## Project Structure

```
apps/store-b/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/        # Store-specific components
│   └── lib/              # Utilities and helpers
├── public/               # Static assets
├── .env.local            # Environment variables (local)
└── package.json          # Dependencies and scripts
```

## Environment Variables

See `.env.local` for all configured environment variables.

### Deploying to Vercel

On Vercel, **you must set the CDN URLs** or mat/frame images will 404:

- **`NEXT_PUBLIC_CDN_SHARED_URL`** – Base URL for shared assets (mats, lifestyle images, etc.). Example: `https://pub-xxxx.r2.dev` (no trailing slash).
- **`NEXT_PUBLIC_CDN_STORE_URL`** – Base URL for store-b assets. Example: `https://pub-xxxx.r2.dev` (no trailing slash).

If these are not set, the app returns relative URLs like `/mats/1.jpg` and `/frames/wide-black/corner-a.jpg`. The browser then requests them from your Vercel domain; the asset API has no files, so you get 404s. Setting the env vars makes the app return full CDN URLs.

Add both variables in **Vercel → Project → Settings → Environment Variables**, then redeploy.

## Dependencies

Store B uses the following shared packages:

- `@framecraft/ui` - Shared UI components
- `@framecraft/core` - Core business logic and services
- `@framecraft/config` - Configuration system
- `@framecraft/types` - TypeScript type definitions
- `@framecraft/data` - Product catalog data

## Brand Configuration

Store B is configured with:

- **Theme**: Dark charcoal primary (#1F2937) with purple accent (#8B5CF6)
- **Fonts**: Playfair Display (headings), Inter (body), Montserrat (accent)
- **Domain**: shadowboxframes.com
- **Store ID**: store-b

Customize branding in `src/brand.config.ts`.

## License

MIT
