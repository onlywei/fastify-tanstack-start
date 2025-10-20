import Fastify from 'fastify';
import { tanstackStartProduction } from 'fastify-tanstack-start';

const fastify = Fastify({
	logger: true,
	routerOptions: { ignoreTrailingSlash: true },
});

// Register the plugin
fastify.register(tanstackStartProduction, {
	basePath: '/my/special/path',
	rootDir: import.meta.dirname,
});

try {
	await fastify.listen({
		port: 3001,
	});
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
