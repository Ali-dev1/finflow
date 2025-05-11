// Budget model for category-based spending limits
import { Schema, model } from 'mongoose';

// Define budget schema
const BudgetSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Link to user
  category: {
    type: String,
    enum: ['groceries', 'transport', 'dining', 'entertainment', 'other'],
    required: true, // Budget category
  },
  limit: { type: Number, required: true, min: 0 }, // Spending limit (RUB)
}, { timestamps: true });

// Export Budget model
export const Budget = model('Budget', BudgetSchema);