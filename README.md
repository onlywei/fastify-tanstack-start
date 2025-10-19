# fastify-tanstack-start

Monorepo for Fastify plugins to serve [TanStack Start](https://tanstack.com/start) applications.

## 📦 Package

This repository contains the [`fastify-tanstack-start`](./packages/fastify-tanstack-start) package - a convenient Fastify plugin that allows you to serve TanStack Start applications in both development and production modes.

**👉 [View full documentation and usage instructions](./packages/fastify-tanstack-start/README.md)**

## 🚀 Quick Links

- **NPM Package**: [fastify-tanstack-start](https://www.npmjs.com/package/fastify-tanstack-start) _(when published)_
- **Package Source**: [`packages/fastify-tanstack-start`](./packages/fastify-tanstack-start)
- **Examples**: [`examples/`](./examples)

## 📚 Examples

This repository includes working examples demonstrating how to use the plugin:

- [`production-only`](./examples/production-only) - Uses Vite for dev, Fastify for production only
- [`dev-and-prod`](./examples/dev-and-prod) - Uses Fastify for both development and production

## 🛠️ Development

This is a pnpm workspace. To work on this repository:

```bash
# Install all dependencies
pnpm install

# Build the plugin package
pnpm build

# Run E2E tests
pnpm test

# Format code
pnpm format

# Check formatting
pnpm check-format

# Clean all build artifacts and node_modules
pnpm clean
```

### Running Tests

The repository includes end-to-end tests that verify both examples work correctly in dev and production modes.

**First-time setup:**
```bash
# Install Playwright browsers (only needed once)
pnpm exec playwright install chromium
```

**Running tests:**
```bash
# Run all tests
pnpm test

# Run with UI (great for debugging)
pnpm test:ui

# Run in debug mode
pnpm test:debug
```

See [`tests/README.md`](./tests/README.md) for more details.

### Working on the Plugin

The main plugin code is in [`packages/fastify-tanstack-start/src`](./packages/fastify-tanstack-start/src):
- `prod-plugin.ts` - Production mode plugin
- `dev-plugin.ts` - Development mode plugin  
- `index.ts` - Main exports

### Testing Changes

Use the example apps to test your changes:

```bash
# Terminal 1: Build the plugin in watch mode
cd packages/fastify-tanstack-start
pnpm dev

# Terminal 2: Run an example
cd examples/dev-and-prod
pnpm dev
```

## 📄 License

MIT © Wei Wang
