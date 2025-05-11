// Main server entry point
import express from 'express';
import transactionRoutes from './routes/transaction.routes';
import cardRoutes from './routes/card.routes';
import budgetRoutes from './routes/budget.routes';
import authRoutes from './routes/auth.routes';
import { securityMiddleware } from './middlewares/security';
import mongoose from 'mongoose';

// Create Express app
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Apply middleware
app.use(express.json()); // Parse JSON bodies
app.use(securityMiddleware); // Apply security headers and rate limiting

// Set up routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/auth', authRoutes);

// Start server on port 3000
app.listen(3000, () => console.log('Server running on port 3000'))