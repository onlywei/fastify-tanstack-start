import { resolve } from 'node:path';
import middie from '@fastify/middie';
import type {
	FastifyContentTypeParser,
	FastifyInstance,
	FastifyPluginAsync,
	RouteHandler,
} from 'fastify';
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
	 * Root directory for resolving relative paths.
	 * Use `import.meta.dirname` to make the server runnable from any working directory.
	 * @default process.cwd()
	 */
	rootDir?: string;

	/**
	 * Path to the server entry point for development
	 * Can be absolute or relative to rootDir
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
	const {
		basePath = '/',
		rootDir = process.cwd(),
		serverEntry = resolve(rootDir, 'src', 'server.ts'),
		viteConfig = {},
	} = options;

	// Create Vite dev server in middleware mode
	const vite = await import('vite');
	const viteDevServer: ViteDevServer = await vite.createServer({
		root: rootDir,
		base: basePath,
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

			const handler: RouteHandler = async (request, reply) => {
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
			};

			// Catch-all routes for TanStack Start
			// We need both '/' and '/*' to match the prefix path itself and all subpaths
			app.all('/', handler);
			app.all('/*', handler);
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
