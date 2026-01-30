export interface Reservation {
  id: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
}

export type CreateReservationInput = Omit<Reservation, 'id' | 'createdAt'>;
