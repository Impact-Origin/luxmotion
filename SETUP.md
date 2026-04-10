# EasyTransfer Hotel - Project Setup Guide

## 📋 Project Overview

This is a **monorepo** project for EasyTransfer Hotel, a hotel transfer booking platform. It uses:

- **Turbo** - For monorepo task orchestration
- **pnpm** - Package manager (configured as `pnpm@10.27.0`)
- **Next.js 15** - React framework with App Router
- **Convex** - Backend-as-a-Service (database & API)
- **Clerk** - Authentication provider
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **next-intl** - Internationalization (i18n)

## 🏗️ Project Structure

```
easytransfer-hotel/
├── apps/
│   └── web/              # Main Next.js application
├── packages/
│   ├── convex/           # Convex backend functions & schema
│   ├── ui/               # Shared UI components (shadcn/ui)
│   ├── eslint-config/    # Shared ESLint configuration
│   └── typescript-config/# Shared TypeScript configuration
└── package.json          # Root workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** 10.27.0 (or use `corepack enable` to use the version from package.json)
- **Convex account** (free tier available)
- **Clerk account** (for authentication)
- **Google Maps API key** (for location features)

### Step 1: Install Dependencies

From the root directory:

```bash
# Using pnpm (recommended)
pnpm install

# OR using bun (if you prefer)
bun install
```

This will install all dependencies for the root workspace and all packages.

### Step 2: Set Up Environment Variables

Create a `.env.local` file in `apps/web/` with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex Backend
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
CLERK_JWT_ISSUER_DOMAIN=your_clerk_jwt_issuer_domain

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Backend API (if you have a separate backend)
NEXT_PUBLIC_BACKEND_API_BASE_URL=your_backend_api_url

# Amadeus Flight API (for flight lookup)
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret

# IfThenPay Payment Gateway
IFTHENPAY_MB_KEY=your_ifthenpay_multibanco_key
IFTHENPAY_MBWAY_KEY=your_ifthenpay_mbway_key
IFTHENPAY_CCARD_KEY=your_ifthenpay_credit_card_key
IFTHENPAY_ANTIPHISHING_KEY=your_anti_phishing_key_min_15_chars

# Webhook Security
INTEGRATION_WEBHOOK_HEADER_AUHTORIZATION=your_webhook_authorization_header
```

**How to get these values:**

1. **Clerk**: 
   - Sign up at https://clerk.com
   - Create a new application
   - Copy the publishable key and secret key from the dashboard
   - Set up JWT template for Convex integration

2. **Convex**:
   - Sign up at https://convex.dev
   - Create a new project
   - Run `pnpm --filter @workspace/convex dev` to initialize
   - Copy the deployment URL from the output
   - **Custom domain**: If you set a custom domain in the Convex dashboard (e.g. `convex.easytransferportugal.com`), use that URL as `NEXT_PUBLIC_CONVEX_URL`. Update payment provider webhooks (e.g. IfThenPay) to call `https://your-convex-custom-domain.com/payments/webhook` instead of the default `*.convex.site` URL.

3. **Google Maps**:
   - Go to https://console.cloud.google.com
   - Create a new project or select existing
   - Enable Maps JavaScript API
   - Create an API key

### Step 3: Initialize Convex

Navigate to the convex package and set it up:

```bash
cd packages/convex
pnpm dev
```

This will:
- Initialize your Convex project (if not already done)
- Start the Convex development server
- Generate TypeScript types from your schema
- Watch for changes in your Convex functions

**Keep this terminal running** - it needs to stay active during development.

### Step 4: Run the Development Server

From the **root directory**, run:

```bash
pnpm dev
```

This uses Turbo to run the `dev` script in all packages that have one. The main Next.js app will start on:

**http://localhost:3000**

## 📜 Available Scripts

### Root Level (Monorepo)

```bash
# Start all development servers
pnpm dev

# Build all packages and apps
pnpm build

# Lint all packages
pnpm lint

# Format code with Prettier
pnpm format
```

### Web App (`apps/web/`)

```bash
# Start Next.js dev server (with Turbopack)
pnpm --filter web dev

# Build for production
pnpm --filter web build

# Start production server
pnpm --filter web start

# Run type checking
pnpm --filter web typecheck

# Lint and fix
pnpm --filter web lint:fix
```

### Convex Package (`packages/convex/`)

```bash
# Start Convex dev server
pnpm --filter @workspace/convex dev

# Initialize Convex (run until success)
pnpm --filter @workspace/convex setup

# Type check Convex code
pnpm --filter @workspace/convex typecheck
```

## 🔧 How It Works

### Monorepo Architecture

- **Turbo** orchestrates tasks across packages
- **pnpm workspaces** manage dependencies
- Shared packages are referenced using `workspace:*` protocol
- Changes in shared packages are automatically reflected

### Development Flow

1. **Convex** runs in the background, syncing your database schema and functions
2. **Next.js** runs the frontend with hot reload
3. **TypeScript** types are generated from Convex schema automatically
4. Changes to shared UI components are immediately available

### Key Technologies

- **Convex**: Handles all backend logic, database, and real-time updates
- **Clerk**: Manages user authentication and sessions
- **next-intl**: Provides multi-language support (en, pt, es, fr, de, nl)
- **shadcn/ui**: Component library in `packages/ui`

## 🐛 Troubleshooting

### "Workspace dependency not found"

If you see workspace dependency errors:
- Make sure you ran `pnpm install` from the root
- Check that `workspaces` field exists in root `package.json`

### "Missing NEXT_PUBLIC_CONVEX_URL"

- Make sure Convex dev server is running
- Check your `.env.local` file in `apps/web/`
- Verify the Convex deployment URL is correct

### "Clerk authentication errors"

- Verify Clerk keys in `.env.local`
- Check that Clerk JWT template is configured for Convex
- Ensure `CLERK_JWT_ISSUER_DOMAIN` matches your Clerk instance

### Port already in use

If port 3000 is taken:
```bash
# Next.js will automatically use the next available port
# Or specify a different port:
pnpm --filter web dev -- -p 3001
```

## 📦 Production Build

To build for production:

```bash
# Build all packages
pnpm build

# The built app will be in apps/web/.next
# Start production server:
pnpm --filter web start
```

## 🌐 Deployment

The project is set up for deployment on platforms like:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**

Make sure to:
1. Set all environment variables in your deployment platform
2. Deploy Convex separately (it's a separate service)
3. Configure Clerk for your production domain
4. Update CORS settings if needed

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [Turbo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
