// This file is required to use the Fastify Tanstack Start plugin in development mode
import handler from '@tanstack/react-start/server-entry';

export default {
	fetch(request: Request) {
		return handler.fetch(request);
	},
};
