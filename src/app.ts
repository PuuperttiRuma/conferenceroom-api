import express from 'express';
import reservationRoutes from './routes/reservationRoutes';

const app = express();

app.use(express.json());

app.use('/api', reservationRoutes);

export default app;
