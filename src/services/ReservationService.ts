import { v4 as uuidv4 } from "uuid";
import { isBefore, areIntervalsOverlapping, isFuture } from "date-fns";
import type {
  Reservation,
  CreateReservationInput,
} from "../models/Reservation";
import { ReservationRepository } from "../repositories/ReservationRepository";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../errors/AppErrors";

export class ReservationService {
  private repository: ReservationRepository;

  constructor() {
    this.repository = ReservationRepository.getInstance();
  }

  public async createReservation(
    input: CreateReservationInput,
  ): Promise<Reservation> {
    const { roomId, startTime, endTime } = input;

    // 1. Reservation has to start before it ends
    if (!isBefore(startTime, endTime)) {
      throw new BadRequestError("Reservation must start before it ends.");
    }

    // 2. A room can only be reserved in the future
    if (!isFuture(startTime)) {
      throw new BadRequestError("Reservation must be in the future.");
    }

    // 3. The reservations to a specific room cannot overlap
    const existingReservations = await this.repository.findByRoomId(roomId);
    const hasOverlap = existingReservations.some((existing) =>
      areIntervalsOverlapping(
        { start: startTime, end: endTime },
        { start: existing.startTime, end: existing.endTime },
      ),
    );

    if (hasOverlap) {
      throw new ConflictError("Room is already reserved for this time period.");
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

  public async cancelReservation(id: string): Promise<void> {
    const success = await this.repository.delete(id);
    if (!success) {
      throw new NotFoundError("Reservation not found");
    }
  }

  public async getRoomReservations(roomId: string): Promise<Reservation[]> {
    return this.repository.findByRoomId(roomId);
  }
}
