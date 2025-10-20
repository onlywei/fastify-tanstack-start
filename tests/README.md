# E2E Tests

End-to-end tests for the example applications using Playwright.

## Setup

**First time only:** Install Playwright browsers

```bash
pnpm exec playwright install chromium
```

## Running Tests

From the monorepo root:

```bash
# Run all tests
pnpm test

# Run tests with UI mode (great for debugging)
pnpm test:ui

# Run tests in debug mode
pnpm test:debug

# Run specific test file
pnpm test basic
pnpm test custom-basepath

# Run in headed mode (see the browser)
pnpm test --headed
```

## What Gets Tested

Each example is tested with both deployment approaches:
- **Dev-and-prod mode**: Fastify for both development and production
- **Prod-only mode**: Vite dev server for development, Fastify for production

Tests verify:
- Server functions execute correctly
- Client-side navigation works
- Static assets are served properly

See the test files for detailed test scenarios.

## Test Structure

- `e2e/` - Test files
  - `basic.test.ts` - Tests for basic example
  - `custom-basepath.test.ts` - Tests for custom-basepath example with custom base path
  - `test-helpers.ts` - Shared utilities for starting servers and waiting for them to be ready

## Configuration

See `playwright.config.ts` in the root directory for test configuration.

Key settings:
- Tests run sequentially to avoid port conflicts
- 2 minute timeout per test (accounts for build time)
- Only tests Chromium browser (more reliable in CI)
- Reports generated in `playwright-report/`

