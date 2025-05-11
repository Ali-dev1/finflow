// Transaction routes
import { Router } from 'express';
import { addTransaction, getTransactions } from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth';

// Create router
const router = Router();

// Apply authentication middleware
router.use(authMiddleware);
// Add transaction endpoint
router.post('/', addTransaction);
// Get transactions endpoint
router.get('/', getTransactions);

// Export router
export default router;