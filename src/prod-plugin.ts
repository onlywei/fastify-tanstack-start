import fastifyStatic from '@fastify/static';
import type { FastifyContentTypeParser, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { toNodeHandler } from 'srvx/node';

export interface FastifyTanstackStartOptions {
	/**
	 * Base path for the app (e.g., '/app' or '/my/special-path')
	 * @default '/'
	 */
	basePath?: string;

	/**
	 * Path to the server entry point that was built by "vite build"
	 * @default './dist/server/server.js'
	 */
	builtServerModule?: string;

	/**
	 * Path to the client assets directory
	 * @default './dist/client/assets'
	 */
	builtClientAssetsDir?: string;
}

const tanstackStartProduction: FastifyPluginAsync<FastifyTanstackStartOptions> = async (
	fastify,
	options,
) => {
	const {
		basePath = '/',
		builtServerModule: serverEntry = './dist/server/server.js',
		builtClientAssetsDir: clientAssets = './dist/client/assets',
	} = options;

	// Import the TanStack Start server handler
	const { default: handler } = await import(serverEntry);
	const nodeHandler = toNodeHandler(handler.fetch);

	// Register all routes with the specified prefix
	await fastify.register(
		async (app) => {
			// Serve static assets from the directory that Vite builds with the Tanstack Start plugin
			await app.register(fastifyStatic, {
				root: clientAssets,
				prefix: '/assets',
			});

			// No-op content parser to prevent Fastify from consuming the request body
			// This is necessary because srvx needs to read the raw body stream
			const noOpParser: FastifyContentTypeParser = (_req, payload, done) => done(null, payload);

			// Override Fastify's default body parsers
			// Only the two content types Fastify parses by default need to be overridden
			app.addContentTypeParser('application/json', noOpParser);
			app.addContentTypeParser('application/x-www-form-urlencoded', noOpParser);

			// Catch-all route for TanStack Start
			app.all('/*', async (request, reply) => {
				// If static files already sent a response, don't handle it
				if (reply.sent) {
					return;
				}

				// Hijack the response to give full control to srvx/TanStack Start
				reply.hijack();
				await nodeHandler(request.raw, reply.raw);
			});
		},
		{ prefix: basePath },
	);
};

export default fp(tanstackStartProduction, {
	fastify: '5.x',
	name: 'fastify-tanstack-start-production',
});
