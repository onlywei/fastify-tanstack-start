/// <reference types="@fastify/middie" />
import middie from '@fastify/middie';
import type { FastifyContentTypeParser, FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { toNodeHandler } from 'srvx/node';
import type { ViteDevServer } from 'vite';

export interface FastifyTanstackStartDevServerOptions {
	/**
	 * Base path for the app (e.g., '/app' or '/my/special-path')
	 * @default '/'
	 */
	basePath?: string;

	/**
	 * Path to the server entry point for development
	 * @default './src/server.ts'
	 */
	serverEntry?: string;

	/**
	 * Additional Vite dev server configuration
	 */
	viteConfig?: Record<string, unknown>;
}

const tanstackStartDevServer: FastifyPluginAsync<FastifyTanstackStartDevServerOptions> = async (
	fastify,
	options,
) => {
	const { basePath = '/', serverEntry = './src/server.ts', viteConfig = {} } = options;

	// Create Vite dev server in middleware mode
	const vite = await import('vite');
	const viteDevServer: ViteDevServer = await vite.createServer({
		server: { middlewareMode: true },
		...viteConfig,
	});

	// Register all routes with the specified prefix
	await fastify.register(
		async (app: FastifyInstance) => {
			// Register middie to support Connect/Express style middlewares
			await app.register(middie);

			// Use Vite's middlewares
			app.use(viteDevServer.middlewares);

			// No-op content parser to prevent Fastify from consuming the request body
			// This is necessary because srvx needs to read the raw body stream
			const noOpParser: FastifyContentTypeParser = (_req, payload, done) => done(null, payload);

			// Override Fastify's default body parsers
			// Only the two content types Fastify parses by default need to be overridden
			app.addContentTypeParser('application/json', noOpParser);
			app.addContentTypeParser('application/x-www-form-urlencoded', noOpParser);

			// Catch-all route for TanStack Start
			app.all('/*', async (request, reply) => {
				// If a response was already sent (e.g., by Vite middlewares), don't handle it
				if (reply.sent) {
					return;
				}

				try {
					// Dynamically load the server module via Vite's SSR
					const { default: handler } = await viteDevServer.ssrLoadModule(serverEntry);
					const nodeHandler = toNodeHandler(handler.fetch);

					// Hijack the response to give full control to srvx/TanStack Start
					reply.hijack();
					await nodeHandler(request.raw, reply.raw);
				} catch (error) {
					// Fix stack traces for better error messages
					if (typeof error === 'object' && error instanceof Error) {
						viteDevServer.ssrFixStacktrace(error);
					}
					throw error;
				}
			});
		},
		{ prefix: basePath },
	);

	// Clean up Vite dev server when Fastify closes
	fastify.addHook('onClose', async () => {
		await viteDevServer.close();
	});
};

export default fp(tanstackStartDevServer, {
	fastify: '5.x',
	name: 'fastify-tanstack-start-dev-server',
});
