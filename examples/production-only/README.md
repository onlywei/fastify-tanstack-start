# Production-Only Example

This example demonstrates using the `fastify-tanstack-start` plugin **only in production mode**. In development, it uses the standard Vite dev server that comes with TanStack Start.

## 📋 Overview

- **Development**: Uses `vite dev` (standard TanStack Start behavior)
- **Production**: Uses Fastify with the `tanstackStartProduction` plugin

## 🚀 Getting Started

### Install Dependencies

From the monorepo root:

```bash
pnpm install
```

### Development Mode

Run the app in development mode using Vite's dev server:

```bash
pnpm dev
```

Then open your browser to:
- **http://localhost:3000**

The Vite dev server provides hot module replacement (HMR) and fast refresh during development.

## 🏗️ Production Mode

### Build and Start

Build the application and start the Fastify production server:

```bash
pnpm start
```

This command:
1. Runs `vite build` to generate production assets in `dist/`
2. Starts the Fastify server defined in `fastify-server.ts`

Then open your browser to:
- **http://localhost:3000**

### Build Only

If you just want to build without starting the server:

```bash
pnpm build
```

Then start the Fastify server separately:

```bash
node fastify-server.ts
```

## 📁 Key Files

- **`fastify-server.ts`** - Fastify production server configuration
- **`vite.config.ts`** - Vite/TanStack Start configuration
- **`src/routes/`** - Your TanStack Start route components

## 🔍 How It Works

The `fastify-server.ts` file uses the `tanstackStartProduction` plugin to:
1. Serve static client assets from `dist/client/assets/`
2. Handle server-side rendering via the built server module at `dist/server/server.js`
3. Route all requests through TanStack Start's request handler

This approach gives you:
- Full control over your production server
- Ability to add custom Fastify routes and plugins
- Standard Vite dev experience during development
