import { Reservation } from '../models/Reservation';

export class ReservationRepository {
  private static instance: ReservationRepository;
  private reservations: Reservation[] = [];

  private constructor() {}

  public static getInstance(): ReservationRepository {
    if (!ReservationRepository.instance) {
      ReservationRepository.instance = new ReservationRepository();
    }
    return ReservationRepository.instance;
  }

  public async findAll(): Promise<Reservation[]> {
    return [...this.reservations];
  }

  public async findByRoomId(roomId: string): Promise<Reservation[]> {
    return this.reservations.filter((r) => r.roomId === roomId);
  }

  public async findById(id: string): Promise<Reservation | undefined> {
    return this.reservations.find((r) => r.id === id);
  }

  public async create(reservation: Reservation): Promise<Reservation> {
    this.reservations.push(reservation);
    return reservation;
  }

  public async delete(id: string): Promise<boolean> {
    const initialLength = this.reservations.length;
    this.reservations = this.reservations.filter((r) => r.id !== id);
    return this.reservations.length < initialLength;
  }

  // Helper for testing
  public async clear(): Promise<void> {
    this.reservations = [];
  }
}
