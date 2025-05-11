// Component for adding transactions
import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatRUB } from '../../lib/currency';

// Add transaction component
export function AddTransaction() {
  // State for form inputs
  const [form, setForm] = useState({
    amount: '',
    type: 'expense' as 'income' | 'expense',
    location: '',
    category: 'other',
    cardId: '',
    date: new Date().toISOString().split('T')[0], // Default to today
  });
  // State for user’s cards
  const [cards, setCards] = useState<{ _id: string; last4: string; bank: string }[]>([]);
  // State for error, success, and loading
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch cards on mount
  useEffect(() => {
    axios
      .get('/api/cards')
      .then((response) => setCards(response.data))
      .catch(() => setError('Failed to load cards'));
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const amount = parseFloat(form.amount);
      // Validate inputs
      if (!amount || amount <= 0) {
        setError('Invalid amount');
        return;
      }
      if (!form.location.trim()) {
        setError('Location is required');
        return;
      }
      if (form.cardId && !cards.find((c) => c._id === form.cardId)) {
        setError('Invalid card selected');
        return;
      }

      // Send transaction to server
      await axios.post('/api/transactions', {
        amount: form.type === 'expense' ? -amount : amount, // Negative for expenses
        type: form.cardId ? 'card' : 'cash',
        location: form.location.trim(),
        category: form.category,
        cardId: form.cardId || undefined,
        date: form.date,
      });
      setSuccess('Transaction added');
      setError(null);
      // Reset form
      setForm({
        amount: '',
        type: 'expense',
        location: '',
        category: 'other',
        cardId: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to add transaction');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Form container
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold">Add Transaction</h2>
      <div className="space-y-2">
        {/* Amount input */}
        <div>
          <label className="block text-sm font-medium">Amount (₽)</label>
          <input
            type="number"
            step="0.01"
            placeholder="1000.00"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            aria-label="Amount"
            disabled={loading}
          />
        </div>
        {/* Type dropdown */}
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as 'income' | 'expense' })}
            className="w-full px-3 py-2 border rounded-md"
            aria-label="Type"
            disabled={loading}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        {/* Location input */}
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            placeholder="e.g., Pyaterochka"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            aria-label="Location"
            disabled={loading}
          />
        </div>
        {/* Category dropdown */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            aria-label="Category"
            disabled={loading}
          >
            <option value="other">Other</option>
            <option value="groceries">Groceries</option>
            <option value="transport">Transport</option>
            <option value="dining">Dining</option>
            <option value="entertainment">Entertainment</option>
          </select>
        </div>
        {/* Card dropdown */}
        <div>
          <label className="block text-sm font-medium">Card (Optional)</label>
          <select
            value={form.cardId}
            onChange={(e) => setForm({ ...form, cardId: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            aria-label="Card"
            disabled={loading}
          >
            <option value="">No Card (Cash)</option>
            {cards.map((card) => (
              <option key={card._id} value={card._id}>
                {card.bank} (** {card.last4})
              </option>
            ))}
          </select>
        </div>
        {/* Date input */}
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            aria-label="Date"
            disabled={loading}
          />
        </div>
        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
        {/* Error or success message */}
        {error && <p className="text-red-600" role="alert">{error}</p>}
        {success && <p className="text-green-600" role="alert">{success}</p>}
      </div>
    </div>
  );
}