export interface ParcelProps {
  id: string;
  trackingNumber: string;
  unitNumber: string;
  status: 'received' | 'released';
  receivedAt: Date;
  releasedAt: Date;
}