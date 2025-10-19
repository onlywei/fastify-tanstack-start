// This file manually declares the @fastify/middie type augmentation
// because TypeScript is not consistently loading it from the package itself,
// especially in CI environments with pnpm workspaces (hoist: false).
//
// This is based on @fastify/middie's type definitions:
// https://github.com/fastify/middie/blob/main/types/index.d.ts

import type { IncomingMessage, ServerResponse } from 'node:http';

declare module 'fastify' {
	interface FastifyInstance {
		use(fn: (req: IncomingMessage, res: ServerResponse, next: (err?: Error) => void) => void): this;
		use(
			route: string,
			fn: (req: IncomingMessage, res: ServerResponse, next: (err?: Error) => void) => void,
		): this;
		use(
			routes: string[],
			fn: (req: IncomingMessage, res: ServerResponse, next: (err?: Error) => void) => void,
		): this;
	}
}
