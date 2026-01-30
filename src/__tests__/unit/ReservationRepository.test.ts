import { describe, it, expect, beforeEach } from 'vitest';
import { ReservationRepository } from '@/repositories/ReservationRepository';
import { Reservation } from '@/models/Reservation';

describe('ReservationRepository', () => {
  let repository: ReservationRepository;

  beforeEach(async () => {
    repository = ReservationRepository.getInstance();
    await repository.clear(); // Clear data before each test
  });

  it('should return an empty array if no reservations exist', async () => {
    const reservations = await repository.findAll();
    expect(reservations).toEqual([]);
  });

  it('should create and retrieve a reservation', async () => {
    const newReservation: Reservation = {
      id: '1',
      roomId: 'A',
      startTime: new Date('2026-02-01T10:00:00Z'),
      endTime: new Date('2026-02-01T11:00:00Z'),
      createdAt: new Date(),
    };
    const created = await repository.create(newReservation);
    expect(created).toEqual(newReservation);

    const found = await repository.findById('1');
    expect(found).toEqual(newReservation);
  });

  it('should find reservations by room ID', async () => {
    const reservation1: Reservation = {
      id: '1',
      roomId: 'B',
      startTime: new Date('2026-02-01T10:00:00Z'),
      endTime: new Date('2026-02-01T11:00:00Z'),
      createdAt: new Date(),
    };
    const reservation2: Reservation = {
      id: '2',
      roomId: 'B',
      startTime: new Date('2026-02-01T12:00:00Z'),
      endTime: new Date('2026-02-01T13:00:00Z'),
      createdAt: new Date(),
    };
    const reservation3: Reservation = {
      id: '3',
      roomId: 'C',
      startTime: new Date('2026-02-01T10:00:00Z'),
      endTime: new Date('2026-02-01T11:00:00Z'),
      createdAt: new Date(),
    };

    await repository.create(reservation1);
    await repository.create(reservation2);
    await repository.create(reservation3);

    const roomBReservations = await repository.findByRoomId('B');
    expect(roomBReservations).toEqual(expect.arrayContaining([reservation1, reservation2]));
    expect(roomBReservations).toHaveLength(2);
  });

  it('should delete a reservation by ID', async () => {
    const newReservation: Reservation = {
      id: '1',
      roomId: 'A',
      startTime: new Date('2026-02-01T10:00:00Z'),
      endTime: new Date('2026-02-01T11:00:00Z'),
      createdAt: new Date(),
    };
    await repository.create(newReservation);

    const deleted = await repository.delete('1');
    expect(deleted).toBe(true);

    const found = await repository.findById('1');
    expect(found).toBeUndefined();
  });

  it('should return false if trying to delete a non-existent reservation', async () => {
    const deleted = await repository.delete('nonexistent');
    expect(deleted).toBe(false);
  });

  it('should clear all reservations', async () => {
    const reservation1: Reservation = {
      id: '1',
      roomId: 'A',
      startTime: new Date('2026-02-01T10:00:00Z'),
      endTime: new Date('2026-02-01T11:00:00Z'),
      createdAt: new Date(),
    };
    await repository.create(reservation1);
    expect((await repository.findAll()).length).toBe(1);

    await repository.clear();
    expect((await repository.findAll()).length).toBe(0);
  });
});
