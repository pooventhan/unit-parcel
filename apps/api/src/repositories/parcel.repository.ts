import { randomUUID } from 'crypto';
import { Parcel } from '../models/response';
import { ParcelFilters } from '../models/request';
import { IParcelRepository } from './types';

export class ParcelRepository implements IParcelRepository {
  private parcels: Map<string, Parcel> = new Map();

  async create(parcel: Omit<Parcel, 'id'>): Promise<Parcel> {
    const id = randomUUID();
    const newParcel: Parcel = {
      ...parcel,
      id,
    };
    this.parcels.set(id, newParcel);
    return newParcel;
  }

  async findAll(
    filters?: ParcelFilters,
    page: number = 1,
    limit: number = 30,
  ): Promise<{ data: Parcel[]; total: number }> {
    let filteredParcels = Array.from(this.parcels.values());

    if (filters?.unitNumber) {
      filteredParcels = filteredParcels.filter(
        (p) => p.unitNumber === filters.unitNumber,
      );
    }

    if (filters?.status) {
      filteredParcels = filteredParcels.filter(
        (p) => p.status === filters.status,
      );
    }

    const total = filteredParcels.length;
    const offset = (page - 1) * limit;
    const paginatedParcels = filteredParcels.slice(offset, offset + limit);

    return {
      data: paginatedParcels,
      total,
    };
  }

  async findById(id: string): Promise<Parcel | null> {
    return this.parcels.get(id) || null;
  }
}
