// Transaction controllers for adding and retrieving transactions
import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { Card } from '../models/Card';

// Add a new transaction
export const addTransaction = async (req: Request, res: Response) => {
  const { amount, type, location, category, cardId, date } = req.body;
  // Validate inputs
  if (!amount || !type || !location || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!['card', 'cash'].includes(type)) {
    return res.status(400).json({ error: 'Invalid transaction type' });
  }
  if (Math.abs(amount) <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date format (YYYY-MM-DD)' });
  }
  if (cardId) {
    // Validate card exists and belongs to user
    const card = await Card.findOne({ _id: cardId, user: req.user.id });
    if (!card) {
      return res.status(400).json({ error: 'Invalid card' });
    }
  }

  try {
    // Create and save transaction (location encrypted in model)
    const transaction = new Transaction({
      user: req.user.id,
      amount,
      type,
      location,
      category: category || 'other',
      card: cardId || undefined,
      date,
    });
    await transaction.save();
    res.json({ message: 'Transaction added' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get user’s transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    // Fetch transactions with card details
    const transactions = await Transaction.find({ user: req.user.id })
      .populate('card', 'last4 bank')
      .sort({ date: -1 });
    res.json({
      transactions: transactions.map((tx) => ({
        id: tx._id,
        amount: tx.get('amount'),
        type: tx.type,
        category: tx.category,
        location: tx.getLocation(),
        date: tx.date,
        card: tx.card ? { last4: tx.card.last4, bank: tx.card.bank } : null,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};