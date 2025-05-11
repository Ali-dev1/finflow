// Component for listing and filtering transactions
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatRUB } from '../../lib/currency';

// Transaction interface
interface Transaction {
  id: string;
  amount: number;
  type: 'card' | 'cash';
  category: string;
  location: string;
  date: string;
  card: { last4: string; bank: string } | null;
}

// Transaction list component
export function TransactionList() {
  // State for transactions, filter, loading, and error
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState({ category: 'all' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions on mount
  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/transactions')
      .then((response) => {
        setTransactions(response.data.transactions);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load transactions');
        setLoading(false);
      });
  }, []);

  // Filter transactions by category
  const filteredTransactions = transactions.filter(
    (tx) => filter.category === 'all' || tx.category === filter.category
  );

  // Format date for display
  const formatDate = (date: string) => new Intl.DateTimeFormat('en-US').format(new Date(date));

  return (
    // Container for transaction list
    <div className="p-4">
      <h2 className="text-lg font-semibold">Transactions</h2>
      {/* Error message */}
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded" role="alert">
          {error}
        </div>
      )}
      {/* Category filter */}
      <select
        value={filter.category}
        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        className="border p-2 rounded mb-4"
        aria-label="Filter by category"
      >
        <option value="all">All Categories</option>
        <option value="groceries">Groceries</option>
        <option value="transport">Transport</option>
        <option value="dining">Dining</option>
        <option value="entertainment">Entertainment</option>
        <option value="other">Other</option>
      </select>
      {/* Loading state */}
      {loading ? (
        <div className="space-y-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        // Empty state
        <p className="text-gray-600">No transactions found</p>
      ) : (
        // Transaction list
        <div className="space-y-2">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm"
              role="listitem"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{tx.location}</p>
                <p className="text-xs text-gray-500 capitalize">{tx.category.replace(/_/g, ' ')}</p>
                {tx.card && (
                  <p className="text-xs text-gray-400">
                    {tx.card.bank} (** {tx.card.last4})
                  </p>
                )}
              </div>
              <div className="text-right">
                {/* Color-code amount */}
                <p
                  className={`text-sm font-semibold ${
                    tx.amount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatRUB(tx.amount)}
                </p>
                <p className="text-xs text-gray-400">{formatDate(tx.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}