import { Schema, model } from 'mongoose';

const TransactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { 
    type: Number, 
    required: true,
    set: (v: number) => Math.round(v * 100),
    get: (v: number) => v / 100
  },
  type: { type: String, enum: ['card', 'cash'], required: true },
  category: {
    type: String,
    enum: ['groceries', 'transport', 'dining', 'entertainment', 'other'],
    default: 'other'
  },
  description: String,
  card: { type: Schema.Types.ObjectId, ref: 'Card' },
  date: { type: Date, default: Date.now }
}, { timestamps: true, toJSON: { getters: true } });

export const Transaction = model('Transaction', TransactionSchema);