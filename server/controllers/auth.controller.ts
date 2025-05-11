// Authentication controllers for register and login
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Register a new user
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    // Create and save new user (password hashed in model)
    const user = new User({ email, password });
    await user.save();
    res.json({ message: 'User registered' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Log in a user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    // Find user and verify password
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: 'Login failed' });
  }
};