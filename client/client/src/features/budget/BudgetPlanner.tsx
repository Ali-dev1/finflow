// Component for managing budgets
import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatRUB } from '../../lib/currency';

// Budget interface
interface Budget {
  _id: string;
  category: string;
  limit: number;
  spent: number;
}

// Budget planner component
export function BudgetPlanner() {
  // State for budgets, new budget form, loading, and error
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [newBudget, setNewBudget] = useState({ category: '', limit: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch budgets on mount
  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/budgets')
      .then((response) => {
        setBudgets(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load budgets');
        setLoading(false);
      });
  }, []);

  // Handle adding a new budget
  const handleAddBudget = async () => {
    const limit = parseFloat(newBudget.limit);
    // Validate inputs
    if (!newBudget.category || isNaN(limit) || limit <= 0) {
      setError('Please select a category and enter a valid limit');
      return;
    }
    try {
      // Send budget to server
      const response = await axios.post('/api/budgets', {
        category: newBudget.category,
        limit,
      });
      setBudgets([...budgets, response.data]);
      setNewBudget({ category: '', limit: '' }); // Reset form
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to add budget');
    }
  };

  return (
    // Container for budget planner
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold">Budget Planner</h2>
      {/* Error message */}
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded" role="alert">
          {error}
        </div>
      )}
      {/* Loading state */}
      {loading ? (
        <div className="space-y-2">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
        </div>
      ) : (
        <>
          {/* New budget form */}
          <div className="mb-4 space-y-2">
            <select
              value={newBudget.category}
              onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              className="border p-2 rounded w-full"
              aria-label="Category"
            >
              <option value="">Select Category</option>
              <option value="groceries">Groceries</option>
              <option value="transport">Transport</option>
              <option value="dining">Dining</option>
              <option value="entertainment">Entertainment</option>
              <option value="other">Other</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Limit (₽)"
              value={newBudget.limit}
              onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
              className="border p-2 rounded w-full"
              aria-label="Limit"
            />
            <button
              onClick={handleAddBudget}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
              disabled={!newBudget.category || !newBudget.limit}
            >
              Add Budget
            </button>
          </div>
          {/* Budget list */}
          <h3 className="text-md font-medium mt-4">Your Budgets</h3>
          {budgets.length === 0 ? (
            <p className="text-gray-600">No budgets set</p>
          ) : (
            <ul className="space-y-2">
              {budgets.map((budget) => (
                <li key={budget._id} className="p-2 border rounded">
                  <div className="flex justify-between">
                    <span>{budget.category.replace(/_/g, ' ')}</span>
                    <span>
                      {formatRUB(budget.spent)} / {formatRUB(budget.limit)}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        budget.spent > budget.limit ? 'bg-red-600' : 'bg-blue-500'
                      }`}
                      style={{
                        width: ${Math.min((budget.spent / budget.limit) * 100, 100)}%,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}