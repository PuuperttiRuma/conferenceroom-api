import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ReservationService } from '@/services/ReservationService';
import { ReservationRepository } from '@/repositories/ReservationRepository';
import { CreateReservationInput } from '@/models/Reservation';

// Mock uuid to control generated IDs in tests
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

describe('ReservationService', () => {
  let service: ReservationService;
  let repository: ReservationRepository;

  beforeEach(async () => {
    repository = ReservationRepository.getInstance();
    await repository.clear(); // Clear repository before each test
    service = new ReservationService();

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-29T10:00:00Z')); // Set a fixed future date for tests
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create a reservation successfully', async () => {
    const input: CreateReservationInput = {
      roomId: 'room1',
      startTime: new Date('2026-01-29T11:00:00Z'),
      endTime: new Date('2026-01-29T12:00:00Z'),
    };

    const reservation = await service.createReservation(input);

    expect(reservation).toBeDefined();
    expect(reservation.id).toBe('mock-uuid');
    expect(reservation.roomId).toBe(input.roomId);
    expect(reservation.startTime.toISOString()).toBe(input.startTime.toISOString());
    expect(reservation.endTime.toISOString()).toBe(input.endTime.toISOString());
    expect(await repository.findById('mock-uuid')).toEqual(reservation);
  });

  it('should throw error if reservation starts after or at end time', async () => {
    const input: CreateReservationInput = {
      roomId: 'room1',
      startTime: new Date('2026-01-29T12:00:00Z'),
      endTime: new Date('2026-01-29T11:00:00Z'),
    };

    await expect(service.createReservation(input)).rejects.toThrow(
      'Reservation must start before it ends.'
    );
  });

  it('should throw error if reservation is in the past', async () => {
    vi.setSystemTime(new Date('2026-02-01T10:00:00Z')); // Set system time to a future date
    const input: CreateReservationInput = {
      roomId: 'room1',
      startTime: new Date('2026-01-01T10:00:00Z'), // A past date relative to current system time
      endTime: new Date('2026-01-01T11:00:00Z'),
    };

    await expect(service.createReservation(input)).rejects.toThrow(
      'Reservation must be in the future.'
    );
  });

  it('should throw error if reservations overlap', async () => {
    const existingReservation = {
      id: 'existing-id',
      roomId: 'room1',
      startTime: new Date('2026-01-29T11:00:00Z'),
      endTime: new Date('2026-01-29T12:30:00Z'),
      createdAt: new Date(),
    };
    await repository.create(existingReservation);

    const input: CreateReservationInput = {
      roomId: 'room1',
      startTime: new Date('2026-01-29T12:00:00Z'),
      endTime: new Date('2026-01-29T13:00:00Z'),
    };

    await expect(service.createReservation(input)).rejects.toThrow(
      'Room is already reserved for this time period.'
    );
  });

  it('should cancel a reservation', async () => {
    const input: CreateReservationInput = {
      roomId: 'room1',
      startTime: new Date('2026-01-29T10:00:00Z'),
      endTime: new Date('2026-01-29T11:00:00Z'),
    };
    const reservation = await service.createReservation(input);

    const cancelled = await service.cancelReservation(reservation.id);
    expect(cancelled).toBe(true);
    expect(await repository.findById(reservation.id)).toBeUndefined();
  });

  it('should return false if trying to cancel a non-existent reservation', async () => {
    const cancelled = await service.cancelReservation('non-existent-id');
    expect(cancelled).toBe(false);
  });

  it('should get all reservations for a specific room', async () => {
    const room1Reservation1 = await service.createReservation({
      roomId: 'room1',
      startTime: new Date('2026-01-29T11:00:00Z'),
      endTime: new Date('2026-01-29T12:00:00Z'),
    });
    // Change mocked uuid for the second reservation
    vi.mock('uuid', () => ({ v4: () => 'mock-uuid-2' }));
    const room1Reservation2 = await service.createReservation({
      roomId: 'room1',
      startTime: new Date('2026-01-29T12:00:00Z'),
      endTime: new Date('2026-01-29T13:00:00Z'),
    });
    await service.createReservation({
      roomId: 'room2',
      startTime: new Date('2026-01-29T11:00:00Z'),
      endTime: new Date('2026-01-29T12:00:00Z'),
    });

    const room1Reservations = await service.getRoomReservations('room1');
    expect(room1Reservations).toHaveLength(2);
    expect(room1Reservations.map(r => r.id)).toEqual(expect.arrayContaining([room1Reservation1.id, room1Reservation2.id]));
  });
});