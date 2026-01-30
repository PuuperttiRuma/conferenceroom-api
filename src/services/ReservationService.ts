import { v4 as uuidv4 } from 'uuid';
import { isBefore, areIntervalsOverlapping, isFuture } from 'date-fns';
import { Reservation, CreateReservationInput } from '../models/Reservation';
import { ReservationRepository } from '../repositories/ReservationRepository';

export class ReservationService {
  private repository: ReservationRepository;

  constructor() {
    this.repository = ReservationRepository.getInstance();
  }

  public async createReservation(input: CreateReservationInput): Promise<Reservation> {
    const { roomId, startTime, endTime } = input;

    // 1. Reservation has to start before it ends
    if (!isBefore(startTime, endTime)) {
      throw new Error('Reservation must start before it ends.');
    }

    // 2. A room can only be reserved in the future
    if (!isFuture(startTime)) {
      throw new Error('Reservation must be in the future.');
    }

    // 3. The reservations to a specific room cannot overlap
    const existingReservations = await this.repository.findByRoomId(roomId);
    const hasOverlap = existingReservations.some((existing) =>
      areIntervalsOverlapping(
        { start: startTime, end: endTime },
        { start: existing.startTime, end: existing.endTime }
      )
    );

    if (hasOverlap) {
      throw new Error('Room is already reserved for this time period.');
    }

    const newReservation: Reservation = {
      id: uuidv4(),
      roomId,
      startTime,
      endTime,
      createdAt: new Date(),
    };

    return this.repository.create(newReservation);
  }

  public async cancelReservation(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  public async getRoomReservations(roomId: string): Promise<Reservation[]> {
    return this.repository.findByRoomId(roomId);
  }
}
