// Budget routes
import { Router } from 'express';
import { getBudgets, addBudget } from '../controllers/budget.controller';
import { authMiddleware } from '../middlewares/auth';

// Create router
const router = Router();

// Apply authentication middleware
router.use(authMiddleware);
// Get budgets endpoint
router.get('/', getBudgets);
// Add budget endpoint
router.post('/', addBudget);

// Export router
export default router;