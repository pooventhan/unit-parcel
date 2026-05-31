import { Parcel } from '../models/response';
import { ParcelFilters } from '../models/request';

export interface IParcelRepository {
  create(parcel: Omit<Parcel, 'id'>): Promise<Parcel>;
  findAll(
    filters?: ParcelFilters,
    page?: number,
    limit?: number,
  ): Promise<{ data: Parcel[]; total: number }>;
  findById(id: string): Promise<Parcel | null>;
}
