import Fastify from 'fastify';
import { tanstackStartDevServer, tanstackStartProduction } from 'fastify-tanstack-start';

const fastify = Fastify({
	logger: true,
	routerOptions: { ignoreTrailingSlash: true },
});

if (process.argv.includes('--dev')) {
	fastify.register(tanstackStartDevServer, {
		basePath: '/my/special/path',
		rootDir: import.meta.dirname,
	});
} else {
	fastify.register(tanstackStartProduction, {
		basePath: '/my/special/path',
		rootDir: import.meta.dirname,
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
