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

// Register the plugin with default options
// This assumes you run the server from your project directory
fastify.register(tanstackStartProduction);

// Or customize the options:
fastify.register(tanstackStartProduction, {
	basePath: '/your/app', // defaults to '/'
	rootDir: import.meta.dirname, // defaults to process.cwd() - use import.meta.dirname to run from any directory
	builtServerModule: './dist/server/server.js', // defaults to './dist/server/server.js'
	builtClientAssetsDir: './dist/client/assets', // defaults to './dist/client/assets'
});

try {
	await fastify.listen({ /* options */});
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}

```

#### Plugin Options

- **`basePath`** (optional, default: `'/'`): Base path for your app (e.g., `'/app'` or `'/my/special-path'`). Must match the `base` config in your Vite config.
- **`rootDir`** (optional, default: `process.cwd()`): Root directory for resolving relative paths. Use `import.meta.dirname` to make your server runnable from any working directory.
- **`builtServerModule`** (optional, default: `'./dist/server/server.js'`): Path to the server entry point that was built by `vite build`. Can be absolute or relative to `rootDir`.
- **`builtClientAssetsDir`** (optional, default: `'./dist/client/assets'`): Path to the client assets directory. Can be absolute or relative to `rootDir`.

Be sure to inspect your `dist/` directory after running `vite build` to verify the correct paths for your setup.

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
		rootDir: import.meta.dirname, // recommended for running from any directory
	});
} else {
	fastify.register(tanstackStartProduction, {
		rootDir: import.meta.dirname,
	});
}

try {
	await fastify.listen({ /* options */});
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
```

#### Development Server Options

- **`basePath`** (optional, default: `'/'`): Base path for your app.
- **`rootDir`** (optional, default: `process.cwd()`): Root directory for resolving relative paths. Use `import.meta.dirname` to make your server runnable from any working directory.
- **`serverEntry`** (optional, default: `'./src/server.ts'`): Path to the server entry point for development. Can be absolute or relative to `rootDir`.
- **`viteConfig`** (optional): Additional Vite dev server configuration options.
