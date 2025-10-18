import { resolve } from 'node:path';
import Fastify from 'fastify';
import { tanstackStartProduction } from 'fastify-tanstack-start';

const fastify = Fastify({
	logger: true,
	routerOptions: { ignoreTrailingSlash: true },
});

// Register the plugin
fastify.register(tanstackStartProduction, {
	basePath: '/',
	builtServerModule: resolve(import.meta.dirname, 'dist', 'server', 'server.js'),
	builtClientAssetsDir: resolve(import.meta.dirname, 'dist', 'client', 'assets'),
});

try {
	await fastify.listen({
		port: 3000,
	});
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
