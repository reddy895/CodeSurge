import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { getStats } from './controllers/adminController.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'HACKATHON REGISTRATION BACKEND',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/stats', getStats);

// Centralized Error Handler
app.use(errorHandler);

export default app;
