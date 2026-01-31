import type { Request, Response } from "express";
import { ReservationService } from "../services/ReservationService";
import { AppError } from "../errors/AppErrors";

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
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public cancel = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.cancelReservation(id);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  public listByRoom = async (req: Request, res: Response) => {
    try {
      const { roomId } = req.params;
      const reservations = await this.service.getRoomReservations(roomId);
      return res.json(reservations);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}