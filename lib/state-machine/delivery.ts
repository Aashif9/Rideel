import { DeliveryStatus } from '@/types';

export const ALLOWED_STATUS_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
  BOOKED: ['MATCHED', 'ACCEPTED', 'CANCELLED'],
  MATCHED: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['PICKUP_PENDING', 'CANCELLED'],
  PICKUP_PENDING: ['PICKED_UP', 'CANCELLED', 'DISPUTED'],
  PICKED_UP: ['IN_TRANSIT', 'DISPUTED'],
  IN_TRANSIT: ['DELIVERY_PENDING', 'DISPUTED'],
  DELIVERY_PENDING: ['DELIVERED', 'DISPUTED'],
  DELIVERED: ['DISPUTED'],
  CANCELLED: [],
  DISPUTED: ['DELIVERED', 'CANCELLED']
};

export function canTransitionDeliveryStatus(currentStatus: DeliveryStatus, targetStatus: DeliveryStatus): boolean {
  if (currentStatus === targetStatus) return true;
  const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
}
