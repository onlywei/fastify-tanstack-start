import { expect, test } from '@playwright/test';
import type { ServerInstance } from './test-helpers.ts';
import { startServer, waitForLogMessage, waitForServer } from './test-helpers.ts';

test.describe('dev-and-prod example', () => {
	test('dev mode - button click logs to server', async ({ page }) => {
		let server: ServerInstance | null = null;

		try {
			// Start the Fastify dev server (with Vite middleware)
			server = startServer('pnpm', ['dev'], 'examples/dev-and-prod');

			// Wait for server to be ready
			await waitForServer('http://localhost:3000', 60000);

			// Navigate to the app
			await page.goto('http://localhost:3000');

			// Wait for the page to be fully loaded
			await page.waitForLoadState('networkidle');

			// Find and click the button
			const button = page.locator('button');
			await expect(button).toBeVisible();
			await button.click();

			// Wait for the log message to appear in server logs
			const logFound = await waitForLogMessage(server.logs, 'Something was logged', 10000);

			expect(logFound).toBe(true);

			// Test navigation to second route
			const secondRouteLink = page.getByRole('link', { name: 'Go to Second Route' });
			await expect(secondRouteLink).toBeVisible();
			await secondRouteLink.click();

			// Verify we're on the second route
			await page.waitForURL('**/second-route');
			await expect(page.getByRole('heading', { name: 'Second Route' })).toBeVisible();

			// Navigate back to home
			const homeLink = page.getByRole('link', { name: 'Home' });
			await expect(homeLink).toBeVisible();
			await homeLink.click();

			// Verify we're back on the home page
			await page.waitForURL('**/');
			await expect(page.getByRole('heading', { name: 'Hello World' })).toBeVisible();
		} finally {
			// Cleanup: kill the server
			if (server) {
				server.kill();
				// Give it a moment to cleanup
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}
	});

	test('production mode - button click logs to server', async ({ page }) => {
		let server: ServerInstance | null = null;

		try {
			// Start the production Fastify server
			server = startServer('node', ['fastify-server.ts'], 'examples/dev-and-prod');

			// Wait for server to be ready
			await waitForServer('http://localhost:3000', 30000);

			// Navigate to the app
			await page.goto('http://localhost:3000');

			// Wait for the page to be fully loaded
			await page.waitForLoadState('networkidle');

			// Find and click the button
			const button = page.locator('button');
			await expect(button).toBeVisible();
			await button.click();

			// Wait for the log message to appear in server logs
			const logFound = await waitForLogMessage(server.logs, 'Something was logged', 10000);

			expect(logFound).toBe(true);

			// Test navigation to second route
			const secondRouteLink = page.getByRole('link', { name: 'Go to Second Route' });
			await expect(secondRouteLink).toBeVisible();
			await secondRouteLink.click();

			// Verify we're on the second route
			await page.waitForURL('**/second-route');
			await expect(page.getByRole('heading', { name: 'Second Route' })).toBeVisible();

			// Navigate back to home
			const homeLink = page.getByRole('link', { name: 'Home' });
			await expect(homeLink).toBeVisible();
			await homeLink.click();

			// Verify we're back on the home page
			await page.waitForURL('**/');
			await expect(page.getByRole('heading', { name: 'Hello World' })).toBeVisible();
		} finally {
			// Cleanup: kill the server
			if (server) {
				server.kill();
				// Give it a moment to cleanup
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}
	});
});
