import Fastify from 'fastify';
import cors from '@fastify/cors';

export async function createServer() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: true,
  });

  // Health check route
  app.get('/health', async () => {
    return { status: 'ok' };
  });

  return app;
}
