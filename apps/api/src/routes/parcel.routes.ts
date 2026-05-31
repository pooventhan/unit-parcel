import { FastifyInstance } from 'fastify';
import { createParcelHandler, getParcelsHandler } from '../handlers/parcel.handler';
import { IParcelService } from '../services/types';

export function registerParcelRoutes(
  app: FastifyInstance,
  service: IParcelService,
): void {
  app.post('/api/v1/parcels', createParcelHandler(service));
  app.get('/api/v1/parcels', getParcelsHandler(service));
}
