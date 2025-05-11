// Authentication routes
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

// Create router
const router = Router();

// Register endpoint
router.post('/register', register);
// Login endpoint
router.post('/login', login);

// Export router
export default router;