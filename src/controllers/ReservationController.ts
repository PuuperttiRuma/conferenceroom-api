import { Request, Response } from 'express';
import { ReservationService } from '../services/ReservationService';

export class ReservationController {
  private service: ReservationService;

  constructor() {
    this.service = new ReservationService();
  }

  public create = async (req: Request, res: Response) => {
    try {
      const { roomId, startTime, endTime } = req.body;
      const reservation = await this.service.createReservation({
        roomId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      });
      return res.status(201).json(reservation);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  public cancel = async (req: Request, res: Response) => {
    const { id } = req.params;
    const success = await this.service.cancelReservation(id);
    if (success) {
      return res.status(204).send();
    }
    return res.status(404).json({ message: 'Reservation not found' });
  };

  public listByRoom = async (req: Request, res: Response) => {
    const { roomId } = req.params;
    const reservations = await this.service.getRoomReservations(roomId);
    return res.json(reservations);
  };
}
