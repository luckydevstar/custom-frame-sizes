# Store A - FrameCraft Multi-Store Platform

First production storefront for the FrameCraft multi-store platform.

## Overview

Store A is built using Next.js 14+ with the App Router and integrates with all shared packages from the monorepo.

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
npm run dev --filter=@framecraft/store-a
```

Or from the store-a directory:

```bash
cd apps/store-a
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Building

Build for production:

```bash
npm run build --filter=@framecraft/store-a
```

### Type Checking

Run TypeScript type checking:

```bash
npm run type-check --filter=@framecraft/store-a
```

## Project Structure

```
apps/store-a/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/        # Store-specific components
│   └── lib/              # Utilities and helpers
├── public/               # Static assets
├── .env.local.example    # Environment variable template
└── package.json          # Dependencies and scripts
```

## Environment Variables

See `.env.local.example` for all required environment variables.

## Dependencies

Store A uses the following shared packages:

- `@framecraft/ui` - Shared UI components
- `@framecraft/core` - Core business logic and services
- `@framecraft/config` - Configuration system
- `@framecraft/types` - TypeScript type definitions
- `@framecraft/data` - Product catalog data

## License

MIT
