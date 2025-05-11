import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';
import cardRoutes from './routes/card.routes';
import { securityMiddleware } from './middlewares/security';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(securityMiddleware);

// Database
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/cards', cardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));