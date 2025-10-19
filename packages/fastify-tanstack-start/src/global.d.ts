// This file forces TypeScript to load @fastify/middie type augmentations
// in all compilation contexts (local dev, CI, etc.)
//
// Without this explicit import, TypeScript may not consistently load the
// module augmentation that adds the .use() method to FastifyInstance,
// especially when using moduleResolution: "NodeNext"
//
// See: https://github.com/fastify/middie#typescript-support
import '@fastify/middie';
