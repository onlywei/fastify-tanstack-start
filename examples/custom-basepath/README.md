# Custom Basepath

This example demonstrates using the `fastify-tanstack-start` plugins with a custom basepath. Just like the basic example, you can still choose between:

1. **Dev and Prod Mode** - Using Fastify for both development and production
2. **Production-Only Mode** - Using Vite dev server for development, Fastify for production only

The only difference is that the Tanstack Start application is made available only on `/my/special/path` instead of `/`.

## 📋 Two Approaches

### Approach 1: Dev and Prod Mode

Uses Fastify with different plugins for both environments:
- **Development**: `tanstackStartDevServer` plugin (Vite middleware mode)
- **Production**: `tanstackStartProduction` plugin
- **Server File**: `fastify-server--dev-and-prod.ts`

### Approach 2: Production-Only Mode

Uses different servers for each environment:
- **Development**: Standard Vite dev server (`vite dev`)
- **Production**: Fastify with `tanstackStartProduction` plugin
- **Server File**: `fastify-server--prod-only.ts`

## 🚀 Getting Started

### Install Dependencies

From the monorepo root:

```bash
pnpm install
```

## 🔧 Approach 1: Dev and Prod Mode

### Development Mode

Run the app in development mode using Fastify + Vite middleware:

```bash
pnpm dev:dev-and-prod
```

Then open your browser to **http://localhost:3000/my/special/path**

This mode provides:
- Hot module replacement (HMR) via Vite
- Fast refresh for React components
- Full Fastify capabilities (add custom routes, plugins, etc.)

### Production Mode

Build and start the Fastify production server:

```bash
pnpm start:dev-and-prod
```

This command:
1. Runs `vite build` to generate production assets in `dist/`
2. Starts the Fastify server in production mode

Then open your browser to **http://localhost:3000/my/special/path**

### How It Works

The `fastify-server--dev-and-prod.ts` file checks for the `--dev` flag:

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

### When to Use This Approach

**Note:** TanStack Start already provides its own API routes and middleware system. Use this approach only if you have **specific requirements** that TanStack Start doesn't cover.

This approach makes sense when you're:
- **Developing custom Fastify routes or plugins** alongside your TanStack app (e.g., building admin APIs, WebSocket endpoints)
- **Testing Fastify-specific integrations** during development that you'll use in production
- Building with **existing Fastify plugins** that need to work in both environments (e.g., company-specific authentication plugins)
- Requiring **dev/prod parity** for complex Fastify configurations (logging, error handling, etc.)

## 🏗️ Approach 2: Production-Only Mode

### Development Mode

Run the app in development mode using Vite's dev server:

```bash
pnpm dev:prod-only
```

Then open your browser to **http://localhost:3000/my/special/path**

The Vite dev server provides hot module replacement (HMR) and fast refresh during development.

### Production Mode

Build and start the Fastify production server:

```bash
pnpm start:prod-only
```

This command:
1. Runs `vite build` to generate production assets in `dist/`
2. Starts the Fastify server defined in `fastify-server--prod-only.ts`

Then open your browser to **http://localhost:3000/my/special/path**

### How It Works

The `fastify-server--prod-only.ts` file uses the `tanstackStartProduction` plugin to:
1. Serve static client assets from `dist/client/assets/`
2. Handle server-side rendering via the built server module at `dist/server/server.js`
3. Route all requests through TanStack Start's request handler

This approach gives you:
- Full control over your production server
- Ability to add custom Fastify routes and plugins
- Standard Vite dev experience during development

### When to Use This Approach

**Recommended for most apps.** Use this approach when:
- You want the fastest development experience with Vite's dev server
- You only need custom Fastify features in production
- You're building a straightforward TanStack Start app
- You don't need to test Fastify-specific integrations during development

## 📁 Key Files

- **`fastify-server--dev-and-prod.ts`** - Fastify server for both dev and prod (Approach 1)
- **`fastify-server--prod-only.ts`** - Fastify production-only server (Approach 2)
- **`vite.config.ts`** - Vite/TanStack Start configuration
- **`src/routes/`** - Your TanStack Start route components
- **`package.json`** - Scripts for both approaches

## 🔨 Build Only

If you just want to build without starting the server:

```bash
pnpm build
```

Then start either Fastify server manually:

```bash
# For dev-and-prod approach
node fastify-server--dev-and-prod.ts

# For prod-only approach
node fastify-server--prod-only.ts
```

## 🎯 Choosing the Right Approach

- **Most apps**: Use Approach 2 (Production-Only) - simpler and faster development
- **Complex Fastify integrations**: Use Approach 1 (Dev and Prod) - test everything in development
