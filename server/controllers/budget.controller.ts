// Budget controllers for managing budgets
import { Request, Response } from 'express';
import { Budget } from '../models/Budget';
import { Transaction } from '../models/Transaction';

// Get user’s budgets with spending
export const getBudgets = async (req: Request, res: Response) => {
  try {
    // Fetch budgets
    const budgets = await Budget.find({ user: req.user.id });
    // Fetch transactions for the last month
    const transactions = await Transaction.find({
      user: req.user.id,
      date: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    });

    // Calculate spending per category
    const spentByCategory = transactions.reduce((acc, tx) => {
      if (tx.get('amount') < 0) { // Only count expenses
        acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.get('amount'));
      }
      return acc;
    }, {} as Record<string, number>);

    // Add spent amount to each budget
    const budgetsWithSpent = budgets.map((budget) => ({
      ...budget.toObject(),
      spent: spentByCategory[budget.category] || 0,
    }));

    res.json(budgetsWithSpent);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

// Add a new budget
export const addBudget = async (req: Request, res: Response) => {
  const { category, limit } = req.body;
  // Validate inputs
  if (!category || !limit || isNaN(limit) || limit <= 0) {
    return res.status(400).json({ error: 'Invalid category or limit' });
  }
  try {
    // Create and save new budget
    const budget = new Budget({
      user: req.user.id,
      category,
      limit,
    });
    await budget.save();
    res.json(budget);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};