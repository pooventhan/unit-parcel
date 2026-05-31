import { HttpClient } from './http-client';
import {
  CreateParcelRequest,
  GetParcelsResponse,
  ParcelFilters,
  ApiResponse,
  Parcel,
} from '../../types/api';

export class ParcelService {
  constructor(private httpClient: HttpClient) {}

  async createParcel(
    payload: CreateParcelRequest,
  ): Promise<ApiResponse<Parcel>> {
    return this.httpClient.post<ApiResponse<Parcel>>(
      '/api/v1/parcels',
      payload,
    );
  }

  async getParcels(filters?: ParcelFilters): Promise<GetParcelsResponse> {
    const queryParams = new URLSearchParams();

    if (filters?.unitNumber) {
      queryParams.append('unitNumber', filters.unitNumber);
    }

    if (filters?.status) {
      queryParams.append('status', filters.status);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/api/v1/parcels?${queryString}` : '/api/v1/parcels';

    return this.httpClient.get<GetParcelsResponse>(url);
  }

  async getParcelsWithPagination(
    filters?: ParcelFilters,
    page: number = 1,
    limit: number = 30,
  ): Promise<GetParcelsResponse> {
    const queryParams = new URLSearchParams();

    if (filters?.unitNumber) {
      queryParams.append('unitNumber', filters.unitNumber);
    }

    if (filters?.status) {
      queryParams.append('status', filters.status);
    }

    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    const queryString = queryParams.toString();
    const url = `/api/v1/parcels?${queryString}`;

    return this.httpClient.get<GetParcelsResponse>(url);
  }
}
