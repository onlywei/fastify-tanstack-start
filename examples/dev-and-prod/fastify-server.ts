import { resolve } from 'node:path';
import Fastify from 'fastify';
import { tanstackStartDevServer, tanstackStartProduction } from 'fastify-tanstack-start';

const fastify = Fastify({
	logger: true,
	routerOptions: { ignoreTrailingSlash: true },
});

if (process.argv.includes('--dev')) {
	fastify.register(tanstackStartDevServer, {
		basePath: '/',
		serverEntry: resolve(import.meta.dirname, 'src', 'server.ts'),
	});
} else {
	fastify.register(tanstackStartProduction, {
		basePath: '/',
		builtServerModule: resolve(import.meta.dirname, 'dist', 'server', 'server.js'),
		builtClientAssetsDir: resolve(import.meta.dirname, 'dist', 'client', 'assets'),
	});
}

try {
	await fastify.listen({
		port: 3000,
	});
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
