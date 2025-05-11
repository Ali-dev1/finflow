// Security middleware for Express app
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { RequestHandler } from 'express';
import xss from 'xss-clean';

// Array of security middleware
export const securityMiddleware: RequestHandler[] = [
  // Set security headers (CSP, XSS protection, etc.)
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Restrict sources
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
      },
    },
  }),
  // Limit requests to prevent abuse
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // 300 requests per IP
    message: 'Too many requests, please try again later',
  }),
  // Sanitize inputs to prevent XSS
  xss(),
];