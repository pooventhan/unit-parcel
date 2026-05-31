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

export interface ParcelFilters {
  unitNumber?: string;
  status?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}
