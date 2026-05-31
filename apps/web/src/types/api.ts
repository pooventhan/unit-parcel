export interface DeliveryPersonnel {
  contactNumber: string;
  identityNumber: string;
}

export interface CreateParcelRequest {
  deliveryPersonnel: DeliveryPersonnel;
  trackingNumbers: string[];
  unitNumber: string;
  timeStamp: string;
}

export interface Parcel {
  id: string;
  deliveryPersonnel: DeliveryPersonnel;
  trackingNumbers: string[];
  unitNumber: string;
  status: 'received' | 'released';
  receivedAt: string;
  releasedAt?: string;
}

export interface ParcelFilters {
  unitNumber?: string;
  status?: string;
}

export interface GetParcelsResponse {
  data: Array<{
    unitNumber: string;
    trackingNumbers: string[];
  }>;
  page: number;
  total: number;
}

export interface ApiResponse<T> {
  status: 'Success' | 'Failed';
  description?: string;
  data?: T;
}
