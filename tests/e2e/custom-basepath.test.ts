import { expect, test } from '@playwright/test';
import type { ServerInstance } from './test-helpers.ts';
import { startServer, waitForServer } from './test-helpers.ts';

test.describe('custom-basepath example', () => {
	test.describe('dev-and-prod mode', () => {
		test('dev mode - button click logs to server', async ({ page }) => {
			let server: ServerInstance | null = null;

			try {
				// Start the Fastify dev server (with Vite middleware)
				server = startServer('pnpm', ['dev:dev-and-prod'], 'examples/custom-basepath');

				// Wait for server to be ready
				await waitForServer('http://localhost:3000/my/special/path', 60000);

				// Navigate to the app at the custom basepath
				await page.goto('http://localhost:3000/my/special/path');

				// Wait for the page to be fully loaded
				await page.waitForLoadState('networkidle');

				// Find and click the button
				const button = page.locator('button');
				await expect(button).toBeVisible();
				await button.click();

				// Verify server response appears on the page
				const serverResponse = page.getByTestId('server-response');
				await expect(serverResponse).toBeVisible();
				await expect(serverResponse).toContainText('Server function executed!');

				// Test navigation to second route
				const secondRouteLink = page.getByRole('link', { name: 'Go to Second Route' });
				await expect(secondRouteLink).toBeVisible();
				await secondRouteLink.click();

				// Verify we're on the second route (with custom basepath)
				await page.waitForURL(/\/my\/special\/path\/second-route\/?$/);
				await expect(page.getByRole('heading', { name: 'Second Route' })).toBeVisible();

				// Navigate back to home
				const homeLink = page.getByRole('link', { name: 'Home' });
				await expect(homeLink).toBeVisible();
				await homeLink.click();

				// Verify we're back on the home page (with custom basepath)
				await page.waitForURL(/\/my\/special\/path\/?$/);
				await expect(page.getByRole('heading', { name: 'Hello World' })).toBeVisible();
			} finally {
				// Cleanup: kill the server
				if (server) {
					await server.kill();
				}
			}
		});

		test('production mode - button click logs to server', async ({ page }) => {
			let server: ServerInstance | null = null;

			try {
				// Start the production Fastify server
				server = startServer(
					'node',
					['fastify-server--dev-and-prod.ts'],
					'examples/custom-basepath',
				);

				// Wait for server to be ready
				await waitForServer('http://localhost:3000/my/special/path', 30000);

				// Navigate to the app at the custom basepath
				await page.goto('http://localhost:3000/my/special/path');

				// Wait for the page to be fully loaded
				await page.waitForLoadState('networkidle');

				// Find and click the button
				const button = page.locator('button');
				await expect(button).toBeVisible();
				await button.click();

				// Verify server response appears on the page
				const serverResponse = page.getByTestId('server-response');
				await expect(serverResponse).toBeVisible();
				await expect(serverResponse).toContainText('Server function executed!');

				// Test navigation to second route
				const secondRouteLink = page.getByRole('link', { name: 'Go to Second Route' });
				await expect(secondRouteLink).toBeVisible();
				await secondRouteLink.click();

				// Verify we're on the second route (with custom basepath)
				await page.waitForURL(/\/my\/special\/path\/second-route\/?$/);
				await expect(page.getByRole('heading', { name: 'Second Route' })).toBeVisible();

				// Navigate back to home
				const homeLink = page.getByRole('link', { name: 'Home' });
				await expect(homeLink).toBeVisible();
				await homeLink.click();

				// Verify we're back on the home page (with custom basepath)
				await page.waitForURL(/\/my\/special\/path\/?$/);
				await expect(page.getByRole('heading', { name: 'Hello World' })).toBeVisible();
			} finally {
				// Cleanup: kill the server
				if (server) {
					await server.kill();
				}
			}
		});
	});

	test.describe('prod-only mode', () => {
		test('dev mode - button click logs to server', async ({ page }) => {
			let server: ServerInstance | null = null;

			try {
				// Start the Vite dev server
				server = startServer('pnpm', ['dev:prod-only'], 'examples/custom-basepath');

				// Wait for server to be ready
				await waitForServer('http://localhost:3000/my/special/path', 60000);

				// Navigate to the app at the custom basepath
				await page.goto('http://localhost:3000/my/special/path');

				// Wait for the page to be fully loaded
				await page.waitForLoadState('networkidle');

				// Find and click the button
				const button = page.locator('button');
				await expect(button).toBeVisible();
				await button.click();

				// Verify server response appears on the page
				const serverResponse = page.getByTestId('server-response');
				await expect(serverResponse).toBeVisible();
				await expect(serverResponse).toContainText('Server function executed!');

				// Test navigation to second route
				const secondRouteLink = page.getByRole('link', { name: 'Go to Second Route' });
				await expect(secondRouteLink).toBeVisible();
				await secondRouteLink.click();

				// Verify we're on the second route (with custom basepath)
				await page.waitForURL(/\/my\/special\/path\/second-route\/?$/);
				await expect(page.getByRole('heading', { name: 'Second Route' })).toBeVisible();

				// Navigate back to home
				const homeLink = page.getByRole('link', { name: 'Home' });
				await expect(homeLink).toBeVisible();
				await homeLink.click();

				// Verify we're back on the home page (with custom basepath)
				await page.waitForURL(/\/my\/special\/path\/?$/);
				await expect(page.getByRole('heading', { name: 'Hello World' })).toBeVisible();
			} finally {
				// Cleanup: kill the server
				if (server) {
					await server.kill();
				}
			}
		});

		test('production mode - button click logs to server', async ({ page }) => {
			let server: ServerInstance | null = null;

			try {
				// Start the production Fastify server
				server = startServer('node', ['fastify-server--prod-only.ts'], 'examples/custom-basepath');

				// Wait for server to be ready
				await waitForServer('http://localhost:3000/my/special/path', 30000);

				// Navigate to the app at the custom basepath
				await page.goto('http://localhost:3000/my/special/path');

				// Wait for the page to be fully loaded
				await page.waitForLoadState('networkidle');

				// Find and click the button
				const button = page.locator('button');
				await expect(button).toBeVisible();
				await button.click();

				// Verify server response appears on the page
				const serverResponse = page.getByTestId('server-response');
				await expect(serverResponse).toBeVisible();
				await expect(serverResponse).toContainText('Server function executed!');

				// Test navigation to second route
				const secondRouteLink = page.getByRole('link', { name: 'Go to Second Route' });
				await expect(secondRouteLink).toBeVisible();
				await secondRouteLink.click();

				// Verify we're on the second route (with custom basepath)
				await page.waitForURL(/\/my\/special\/path\/second-route\/?$/);
				await expect(page.getByRole('heading', { name: 'Second Route' })).toBeVisible();

				// Navigate back to home
				const homeLink = page.getByRole('link', { name: 'Home' });
				await expect(homeLink).toBeVisible();
				await homeLink.click();

				// Verify we're back on the home page (with custom basepath)
				await page.waitForURL(/\/my\/special\/path\/?$/);
				await expect(page.getByRole('heading', { name: 'Hello World' })).toBeVisible();
			} finally {
				// Cleanup: kill the server
				if (server) {
					await server.kill();
				}
			}
		});
	});
});
