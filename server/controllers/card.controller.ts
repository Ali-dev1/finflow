// Card controllers for adding and retrieving cards
import { Request, Response } from 'express';
import { Card } from '../models/Card';

// Add a new card
export const addCard = async (req: Request, res: Response) => {
  const { cardNumber, cardholderName, expiry, cvc, bank } = req.body;
  // Validate inputs
  if (!cardNumber || !cardholderName || !expiry || !cvc || !bank) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!/^\d{16}$/.test(cardNumber)) {
    return res.status(400).json({ error: 'Invalid card number' });
  }
  if (!/^[a-zA-Z\s]+$/.test(cardholderName)) {
    return res.status(400).json({ error: 'Invalid cardholder name' });
  }
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return res.status(400).json({ error: 'Invalid expiry format' });
  }
  if (!/^\d{3}$/.test(cvc)) {
    return res.status(400).json({ error: 'Invalid CVC' });
  }

  try {
    // Create and save new card (cardNumber encrypted in model)
    const card = new Card({
      user: req.user.id,
      last4: cardNumber.slice(-4),
      cardNumber,
      cardholderName,
      expiry,
      bank,
    });
    await card.save();
    res.json({ cardId: card._id });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get user’s cards
export const getCards = async (req: Request, res: Response) => {
  try {
    // Fetch cards for authenticated user
    const cards = await Card.find({ user: req.user.id }).select('last4 bank cardholderName');
    res.json(cards);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
};