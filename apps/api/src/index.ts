import { createServer } from './server';
import { ParcelRepository } from './repositories/parcel.repository';
import { ParcelService } from './services/parcel.service';
import { registerParcelRoutes } from './routes/parcel.routes';

async function main() {
  const app = await createServer();

  const repository = new ParcelRepository();
  const service = new ParcelService(repository);

  registerParcelRoutes(app, service);

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen({ port, host: '0.0.0.0' });

  console.log(`Server running at http://0.0.0.0:${port}`);
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
