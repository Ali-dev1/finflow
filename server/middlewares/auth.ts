// Authentication middleware using JWT
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string }; // Add user ID to request
    }
  }
}

// Middleware to verify JWT token
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Extract token from Authorization header (Bearer <token>)
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    // Verify token and attach user ID to request
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};