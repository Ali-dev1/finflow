// Card model for storing bank card details
import { Schema, model } from 'mongoose';
import { encrypt } from '../utils/crypto';

// Define card schema
const CardSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Link to user
  last4: { type: String, required: true, match: /^\d{4}$/ }, // Last 4 digits
  cardNumber: {
    iv: String, // Initialization vector for encryption
    encrypted: String, // Encrypted card number
  },
  cardholderName: { type: String, required: true }, // Cardholder name
  expiry: { type: String, required: true, match: /^\d{2}\/\d{2}$/ }, // Expiry (MM/YY)
  bank: { type: String, required: true }, // Bank name (e.g., Mir)
}, { timestamps: true });

// Encrypt card number before saving
CardSchema.pre('save', function (next) {
  if (this.isModified('cardNumber')) {
    const { iv, encrypted } = encrypt(this.cardNumber);
    this.cardNumber = { iv, encrypted };
  }
  next();
});

// Method to decrypt card number (not used in UI for security)
CardSchema.methods.getCardNumber = function () {
  return decrypt(this.cardNumber.iv, this.cardNumber.encrypted);
};

// Export Card model
export const Card = model('Card', CardSchema);