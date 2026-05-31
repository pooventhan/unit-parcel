export interface Parcel {
  id: string;
  deliveryPersonnel: {
    contactNumber: string;
    identityNumber: string;
  };
  trackingNumbers: string[];
  unitNumber: string;
  status: 'received' | 'released';
  receivedAt: string;
  releasedAt?: string;
}

export interface CreateParcelResponse {
  status: 'Success' | 'Failed';
  description?: string;
  data?: Parcel;
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
