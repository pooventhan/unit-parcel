import { CreateParcelRequest, ParcelFilters } from '../models/request';
import { Parcel } from '../models/response';
import { IParcelRepository } from '../repositories/types';
import { IParcelService } from './types';

export class ParcelService implements IParcelService {
  constructor(private repository: IParcelRepository) {}

  async createParcel(request: CreateParcelRequest): Promise<Parcel> {
    const parcel: Omit<Parcel, 'id'> = {
      deliveryPersonnel: request.deliveryPersonnel,
      trackingNumbers: request.trackingNumbers,
      unitNumber: request.unitNumber,
      status: 'received',
      receivedAt: request.timeStamp,
    };

    return this.repository.create(parcel);
  }

  async getParcels(
    filters?: ParcelFilters,
    page: number = 1,
    limit: number = 30,
  ): Promise<{ data: Parcel[]; total: number }> {
    return this.repository.findAll(filters, page, limit);
  }
}
