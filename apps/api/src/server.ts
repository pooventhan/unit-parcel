import Fastify from 'fastify';
import cors from '@fastify/cors';
import staticPlugin from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createServer() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: true,
  });

  // Health check route
  app.get('/health', async () => {
    return { status: 'ok' };
  });

  // Serve static files from public directory (built web app)
  const publicPath = path.resolve(__dirname, '../public');
  try {
    await app.register(staticPlugin, {
      root: publicPath,
      prefix: '/',
      constraints: {},
    });

    // SPA fallback: serve index.html for unmatched routes (for React Router)
    app.setNotFoundHandler(async (request, reply) => {
      if (request.url === '/' || !request.url.includes('.')) {
        return reply.sendFile('index.html');
      }
      return reply.code(404).send({ error: 'Not found' });
    });
  } catch (error) {
    console.warn('Public directory not found or static plugin registration failed:', error);
    // This is fine during development; the public directory will exist in production
  }

  return app;
}
