// Card routes
import { Router } from 'express';
import { addCard, getCards } from '../controllers/card.controller';
import { authMiddleware } from '../middlewares/auth';

// Create router
const router = Router();

// Apply authentication middleware
router.use(authMiddleware);
// Add card endpoint
router.post('/', addCard);
// Get cards endpoint
router.get('/', getCards);

// Export router
export default router;