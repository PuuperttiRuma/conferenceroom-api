import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import app from '@/app';
import { ReservationRepository } from '@/repositories/ReservationRepository';

// Mock uuid to control generated IDs in tests
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

describe('Reservation API Integration Tests', () => {
  const repository = ReservationRepository.getInstance();

  beforeEach(async () => {
    await repository.clear(); // Clear the repository before each test
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-29T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create a new reservation', async () => {
    const reservationData = {
      roomId: 'roomA',
      startTime: new Date('2026-01-29T11:00:00Z').toISOString(),
      endTime: new Date('2026-01-29T12:00:00Z').toISOString(),
    };

    const res = await request(app)
      .post('/api/reservations')
      .send(reservationData)
      .expect(201);

    expect(res.body).toHaveProperty('id', 'mock-uuid');
    expect(res.body.roomId).toBe(reservationData.roomId);
    expect(new Date(res.body.startTime).toISOString()).toBe(new Date(reservationData.startTime).toISOString());
    expect(new Date(res.body.endTime).toISOString()).toBe(new Date(reservationData.endTime).toISOString());
  });

  it('should return 400 for invalid reservation data', async () => {
    const invalidData = {
      roomId: '',
      startTime: 'invalid-date',
      endTime: 'another-invalid-date',
    };

    const res = await request(app)
      .post('/api/reservations')
      .send(invalidData)
      .expect(400);

    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body.errors).toBeInstanceOf(Array);
  });

  it('should return 400 if reservation start time is after end time', async () => {
    const reservationData = {
      roomId: 'roomB',
      startTime: new Date('2026-01-29T12:00:00Z').toISOString(),
      endTime: new Date('2026-01-29T11:00:00Z').toISOString(),
    };

    const res = await request(app)
      .post('/api/reservations')
      .send(reservationData)
      .expect(400);
    
    expect(res.body).toHaveProperty('message', 'Reservation must start before it ends.');
  });

  it('should return 400 if reservation is in the past', async () => {
    const reservationData = {
      roomId: 'roomC',
      startTime: new Date('2026-01-01T10:00:00Z').toISOString(),
      endTime: new Date('2026-01-01T11:00:00Z').toISOString(),
    };

    const res = await request(app)
      .post('/api/reservations')
      .send(reservationData)
      .expect(400);
    
    expect(res.body).toHaveProperty('message', 'Reservation must be in the future.');
  });

  it('should return 400 if reservations overlap', async () => {
    const existingStartTime = new Date('2026-01-29T11:00:00Z');
    const existingEndTime = new Date('2026-01-29T12:00:00Z');

    await repository.create({
      id: 'existing-id',
      roomId: 'roomD',
      startTime: existingStartTime,
      endTime: existingEndTime,
      createdAt: new Date(),
    });

    const overlappingReservationData = {
      roomId: 'roomD',
      startTime: new Date('2026-01-29T11:30:00Z').toISOString(),
      endTime: new Date('2026-01-29T12:30:00Z').toISOString(),
    };

    const res = await request(app)
      .post('/api/reservations')
      .send(overlappingReservationData)
      .expect(400);

    expect(res.body).toHaveProperty('message', 'Room is already reserved for this time period.');
  });

  it('should list reservations for a specific room', async () => {
    const roomEId = 'roomE';
    const reservation1 = {
      id: 'res-e1',
      roomId: roomEId,
      startTime: new Date('2026-01-29T11:00:00Z'),
      endTime: new Date('2026-01-29T12:00:00Z'),
      createdAt: new Date(),
    };
    const reservation2 = {
      id: 'res-e2',
      roomId: roomEId,
      startTime: new Date('2026-01-29T13:00:00Z'),
      endTime: new Date('2026-01-29T14:00:00Z'),
      createdAt: new Date(),
    };

    await repository.create(reservation1);
    await repository.create(reservation2);

    const res = await request(app)
      .get(`/api/rooms/${roomEId}/reservations`)
      .expect(200);

    expect(res.body).toHaveLength(2);
    expect(res.body.map((r: any) => r.id)).toEqual(expect.arrayContaining([reservation1.id, reservation2.id]));
  });

  it('should cancel a reservation', async () => {
    const reservationId = 'res-to-cancel';
    await repository.create({
      id: reservationId,
      roomId: 'roomF',
      startTime: new Date('2026-01-29T11:00:00Z'),
      endTime: new Date('2026-01-29T12:00:00Z'),
      createdAt: new Date(),
    });

    await request(app)
      .delete(`/api/reservations/${reservationId}`)
      .expect(204);

    const found = await repository.findById(reservationId);
    expect(found).toBeUndefined();
  });

  it('should return 404 if trying to cancel a non-existent reservation', async () => {
    await request(app)
      .delete('/api/reservations/non-existent-id')
      .expect(404);
  });
});