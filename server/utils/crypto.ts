// Utility for encrypting and decrypting sensitive data (card numbers, locations)
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const algorithm = 'aes-256-cbc'; // Use AES-256-CBC encryption
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // Load 32-byte key from .env

// Encrypt text and return IV and encrypted data
export function encrypt(text: string) {
  const iv = randomBytes(16); // Generate random 16-byte initialization vector
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encrypted };
}

// Decrypt text using IV and encrypted data
export function decrypt(iv: string, encrypted: string) {
  const decipher = createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}