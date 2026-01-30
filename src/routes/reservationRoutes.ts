import { Router } from 'express';
import { ReservationController } from '../controllers/ReservationController';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();
const controller = new ReservationController();

const createReservationSchema = z.object({
  body: z.object({
    roomId: z.string().min(1, 'Room ID is required'),
    startTime: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid start time'),
    endTime: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end time'),
  }),
});

router.post('/reservations', validate(createReservationSchema), controller.create);
router.delete('/reservations/:id', controller.cancel);
router.get('/rooms/:roomId/reservations', controller.listByRoom);

export default router;
