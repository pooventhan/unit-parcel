import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateParcelRequest, ParcelFilters } from '../models/request';
import { IParcelService } from '../services/types';

export function createParcelHandler(service: IParcelService) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as CreateParcelRequest;
      const parcel = await service.createParcel(body);

      return reply.code(201).send({
        status: 'Success',
        data: parcel,
      });
    } catch (error) {
      return reply.code(400).send({
        status: 'Failed',
        description: (error as Error).message,
      });
    }
  };
}

export function getParcelsHandler(service: IParcelService) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as Record<string, string>;

      const filters: ParcelFilters = {};
      if (query.unitNumber) {
        filters.unitNumber = query.unitNumber;
      }
      if (query.status) {
        filters.status = query.status;
      }

      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = query.limit ? parseInt(query.limit, 10) : 30;

      const result = await service.getParcels(filters, page, limit);

      return reply.code(200).send({
        data: result.data.map((parcel) => ({
          unitNumber: parcel.unitNumber,
          trackingNumbers: parcel.trackingNumbers,
        })),
        page,
        total: result.total,
      });
    } catch (error) {
      return reply.code(400).send({
        status: 'Failed',
        description: (error as Error).message,
      });
    }
  };
}
