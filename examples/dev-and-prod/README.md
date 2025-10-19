# Dev and Prod Example

This example demonstrates using the `fastify-tanstack-start` plugins for **both development and production modes**. Instead of using Vite's dev server, Fastify handles both environments with different plugins.

## 📋 Overview

- **Development**: Uses Fastify with the `tanstackStartDevServer` plugin (Vite middleware mode)
- **Production**: Uses Fastify with the `tanstackStartProduction` plugin

Both modes use the same `fastify-server.ts` file, which switches plugins based on the `--dev` flag.

## 🚀 Getting Started

### Install Dependencies

From the monorepo root:

```bash
pnpm install
```

### Development Mode

Run the app in development mode using Fastify + Vite middleware:

```bash
pnpm dev
```

Then open your browser to:
- **http://localhost:3000**

This mode provides:
- Hot module replacement (HMR) via Vite
- Fast refresh for React components
- Full Fastify capabilities (add custom routes, plugins, etc.)

## 🏗️ Production Mode

### Build and Start

Build the application and start the Fastify production server:

```bash
pnpm start
```

This command:
1. Runs `vite build` to generate production assets in `dist/`
2. Starts the Fastify server in production mode

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

- **`fastify-server.ts`** - Single Fastify server for both dev and prod
- **`vite.config.ts`** - Vite/TanStack Start configuration
- **`src/routes/`** - Your TanStack Start route components

## 🔍 How It Works

The `fastify-server.ts` file checks for the `--dev` flag:

```ts
if (process.argv.includes('--dev')) {
  // Development: Vite middleware mode
  fastify.register(tanstackStartDevServer, {
    basePath: '/',
    serverEntry: './src/server.ts',
  });
} else {
  // Production: Serve built assets
  fastify.register(tanstackStartProduction, {
    basePath: '/',
    builtServerModule: './dist/server/server.js',
    builtClientAssetsDir: './dist/client/assets',
  });
}
```

## 🎯 Why Use This Approach?

**Note:** TanStack Start already provides its own API routes and middleware system. You should use this dev-and-prod approach only if you have **specific requirements** that TanStack Start doesn't cover.

Using Fastify for both dev and production makes sense when you're:
- **Developing custom Fastify routes or plugins** alongside your TanStack app (e.g., building admin APIs, WebSocket endpoints)
- **Testing Fastify-specific integrations** during development that you'll use in production
- Building with **existing Fastify plugins** that need to work in both environments (e.g., company-specific authentication plugins)
- Requiring **dev/prod parity** for complex Fastify configurations (logging, error handling, etc.)

**For most apps**, the [production-only](../production-only) example is simpler and recommended. Use this approach only when you're actively developing features that require Fastify's capabilities during development.
