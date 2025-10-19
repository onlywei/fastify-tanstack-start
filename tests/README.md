# E2E Tests

End-to-end tests for the example applications using Playwright.

## Setup

**First time only:** Install Playwright browsers

```bash
pnpm exec playwright install webkit
```

This downloads the WebKit browser that Playwright uses for testing. WebKit is the smallest and fastest to install, plus we are not testing any fancy browser behavior so it is sufficient for this plugin.

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
pnpm test production-only

# Run in headed mode (see the browser)
pnpm test --headed
```

## What Gets Tested

Each example app is tested in both development and production modes:

### production-only
- **Dev mode**: Starts with `vite dev`, then:
  - Verifies button click logs to server
  - Tests navigation to second route
  - Tests navigation back to home
- **Production mode**: Builds with `vite build`, starts Fastify server, then:
  - Verifies button click logs to server
  - Tests navigation to second route
  - Tests navigation back to home

### dev-and-prod
- **Dev mode**: Starts Fastify with dev plugin, then:
  - Verifies button click logs to server
  - Tests navigation to second route
  - Tests navigation back to home
- **Production mode**: Builds with `vite build`, starts Fastify in prod mode, then:
  - Verifies button click logs to server
  - Tests navigation to second route
  - Tests navigation back to home

## Test Structure

- `e2e/` - Test files
  - `production-only.test.ts` - Tests for production-only example
  - `dev-and-prod.test.ts` - Tests for dev-and-prod example
  - `test-helpers.ts` - Shared utilities for starting servers and capturing logs

## How It Works

1. **Start Server**: Spawns a child process running the server
2. **Capture Logs**: Collects stdout/stderr from the server process
3. **Wait for Ready**: Polls the server URL until it responds
4. **Browser Actions**: Uses Playwright to click the button
5. **Verify Logs**: Checks that "Something was logged" appears in server output
6. **Cleanup**: Kills the server process

## Configuration

See `playwright.config.ts` in the root directory for test configuration.

Key settings:
- Tests run sequentially to avoid port conflicts
- 2 minute timeout per test (accounts for build time)
- Only tests WebKit browser because there's not a lot of browser logic to test
- Reports generated in `playwright-report/`

