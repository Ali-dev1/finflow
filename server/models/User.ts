// User model for authentication
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define user schema
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true }, // Unique email
  password: { type: String, required: true }, // Hashed password
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Use 10 rounds
  }
  next();
});

// Method to compare passwords during login
UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Export User model
export const User = model('User', UserSchema);