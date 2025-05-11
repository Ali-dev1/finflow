// Form for adding a bank card
import { useState, useCallback } from 'react';
import axios from 'axios';
import { detectRussianBank } from '../../lib/bankUtils';

// Props interface
interface CardFormProps {
  onSuccess: (cardId: string) => void; // Callback for successful card addition
}

// Card form component
export function CardForm({ onSuccess }: CardFormProps) {
  // State for form inputs
  const [form, setForm] = useState({
    cardNumber: '',
    cardholderName: '',
    expiry: '',
    cvc: '',
  });
  // State for error, bank, and loading
  const [error, setError] = useState<string | null>(null);
  const [bank, setBank] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validate card number using Luhn algorithm
  const validateCardNumber = useCallback((number: string) => {
    const clean = number.replace(/\D/g, '');
    if (!/^\d{16}$/.test(clean)) return false; // Must be 16 digits
    let sum = 0;
    for (let i = 0; i < clean.length; i++) {
      let digit = parseInt(clean[i]);
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0; // Valid if divisible by 10
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const cleanCardNumber = form.cardNumber.replace(/\D/g, '');
      // Validate inputs
      if (!validateCardNumber(cleanCardNumber)) {
        setError('Invalid card number');
        return;
      }
      if (!form.cardholderName.trim()) {
        setError('Cardholder name is required');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
        setError('Invalid expiry format (MM/YY)');
        return;
      }
      if (!/^\d{3}$/.test(form.cvc)) {
        setError('Invalid CVC (3 digits)');
        return;
      }

      // Send card data to server
      const response = await axios.post('/api/cards', {
        cardNumber: cleanCardNumber,
        cardholderName: form.cardholderName.trim(),
        expiry: form.expiry,
        cvc: form.cvc,
        bank: detectRussianBank(cleanCardNumber) || 'Unknown',
      });
      setError(null);
      onSuccess(response.data.cardId); // Call success callback
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save card');
    } finally {
      setLoading(false);
    }
  };

  // Handle card number input with formatting
  const handleCardNumberChange = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length <= 16) {
      // Format as XXXX XXXX XXXX XXXX
      const formatted = clean.replace(/(\d{4})(?=\d)/g, '$1 ');
      setForm({ ...form, cardNumber: formatted });
      setBank(detectRussianBank(clean)); // Update detected bank
    }
  };

  return (
    // Form container
    <div className="space-y-4">
      {/* Cardholder name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
        <input
          type="text"
          value={form.cardholderName}
          onChange={(e) => setForm({ ...form, cardholderName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Ivan Petrov"
          aria-label="Cardholder Name"
          disabled={loading}
        />
      </div>
      {/* Card number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
        <input
          type="text"
          value={form.cardNumber}
          onChange={(e) => handleCardNumberChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="2200 1234 5678 9010"
          maxLength={19}
          aria-label="Card Number"
          disabled={loading}
        />
        {/* Display detected bank */}
        {bank && (
          <p className="text-sm text-green-600 mt-1">
            Detected: {bank} {bank === 'Mir' && '(National Payment System)'}
          </p>
        )}
      </div>
      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <input
            type="text"
            value={form.expiry}
            onChange={(e) => setForm({ ...form, expiry: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="MM/YY"
            maxLength={5}
            aria-label="Expiry Date"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
          <input
            type="text"
            value={form.cvc}
            onChange={(e) => setForm({ ...form, cvc: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="123"
            maxLength={3}
            aria-label="CVC"
            disabled={loading}
          />
        </div>
      </div>
      {/* Submit button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Card'}
      </button>
      {/* Error message */}
      {error && <p className="text-red-600" role="alert">{error}</p>}
    </div>
  );
}