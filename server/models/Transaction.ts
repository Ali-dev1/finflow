// Transaction model for cash and card transactions
import { Schema, model } from 'mongoose';
import { encrypt, decrypt } from '../utils/crypto';

// Define transaction schema
const TransactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Link to user
  amount: {
    type: Number,
    required: true,
    set: (v: number) => Math.round(v * 100), // Store in kopecks
    get: (v: number) => v / 100, // Convert to RUB
  },
  type: { type: String, enum: ['card', 'cash'], required: true }, // Card or cash
  category: {
    type: String,
    enum: ['groceries', 'transport', 'dining', 'entertainment', 'other'],
    default: 'other', // Default category
  },
  location: {
    iv: String, // Initialization vector
    encrypted: String, // Encrypted location
  },
  card: { type: Schema.Types.ObjectId, ref: 'Card' }, // Optional card link
  date: { type: Date, required: true }, // Transaction date
}, {
  timestamps: true,
  toJSON: { getters: true }, // Apply getter for amount
});

// Encrypt location before saving
TransactionSchema.pre('save', function (next) {
  if (this.isModified('location')) {
    const { iv, encrypted } = encrypt(this.location);
    this.location = { iv, encrypted };
  }
  next();
});

// Method to decrypt location
TransactionSchema.methods.getLocation = function () {
  return decrypt(this.location.iv, this.location.encrypted);
};

// Validate amount is an integer (kopecks)
TransactionSchema.path('amount').validate((value: number) => {
  return Number.isInteger(value);
}, 'Amount must be in kopecks (integer)');

// Indexes for faster queries
TransactionSchema.index({ user: 1, date: -1 });
TransactionSchema.index({ user: 1, type: 1 });

// Export Transaction model
export const Transaction = model('Transaction', TransactionSchema);