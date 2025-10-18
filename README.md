# fastify-tanstack-start

Convenience plugin to serve [Tanstack Start](https://tanstack.com/start) apps on a Fastify server.

## Why?

While Tanstack Start uses `vite` as a development server for local development, Tanstack Start is relatively unopinionated when it comes to how it is hosted or served in production. Running `vite build` in a Tanstack Start app produces a server module that needs to be connected to some sort of production server. There are a lot of choices to choose from for the production server - and one of them is Fastify!

## Installation
```bash
npm install fastify-tanstack-start
```

## Usage

### Production Server Only

In this mode, you will continue to use `vite dev` to run your Tanstack Start application in development. You will only use Fastify in production mode to serve the files that were built using `vite build`. This will not only serve the static client assets, but will also connect all the Tanstack Start server functions to the Fastify server.

```ts
// fastify-server.ts
import Fastify from 'fastify';
import { tanstackStartProduction } from 'fastify-tanstack-start';

const fastify = Fastify({/* options */});

// Register the plugin 
fastify.register(tanstackStartProduction, {
	basePath: '/your/app', // must match the "base" config in your vite config
	builtServerModule: './dist/server/server.js', // module produced by "vite build"
	builtClientAssetsDir: './dist/client/assets',
});

try {
	await fastify.listen({ /* options */});
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}

```

Be sure to inspect your `dist/` directory after running `vite build` to get the correct values for the `builtServerModule` and `builtClientAssetsDir` paths.

After that, you should be able run the following to start your application in production mode:

```
vite build
node fastify-server.ts
```

### Development Server

If you want to use Fastify in development mode in addition to production mode, this package exposes a second Fastify plugin to help you do that. Doing so is completely optional; you may only want to do so if you want to write some application endpoints using Fastify instead of Tanstack Start.

```ts
// fastify-server.ts
import Fastify from 'fastify';
import { tanstackStartDevServer, tanstackStartProduction } from 'fastify-tanstack-start';

const fastify = Fastify({/* options */});

// You decide how you want to determine development mode vs production mode.
// It can be an environment variable, a CLI argument, or whatever you want.
if (DEVELOPMENT) {
	fastify.register(tanstackStartDevServer, {
		// options
	});
} else {
	// Now use the production mode plugin, see above for details
	fastify.register(tanstackStartProduction, {/* options */});
}

try {
	await fastify.listen({ /* options */});
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
```
