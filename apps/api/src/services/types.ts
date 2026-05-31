import { Parcel } from '../models/response';
import { CreateParcelRequest, ParcelFilters } from '../models/request';

export interface IParcelService {
  createParcel(request: CreateParcelRequest): Promise<Parcel>;
  getParcels(
    filters?: ParcelFilters,
    page?: number,
    limit?: number,
  ): Promise<{ data: Parcel[]; total: number }>;
}
