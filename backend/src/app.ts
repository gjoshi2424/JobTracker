import express from 'express';
import cors from 'cors';
import applicationRoutes from './routes/applicationRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/applications', applicationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
