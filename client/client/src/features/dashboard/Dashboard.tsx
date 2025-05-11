// Dashboard component combining all features
import { CardConnect } from '../cards/CardConnect';
import { AddTransaction } from '../transactions/AddTransaction';
import { TransactionList } from '../transactions/TransactionList';
import { BudgetPlanner } from '../budget/BudgetPlanner';

// Dashboard component
export function Dashboard() {
  return (
    // Container for dashboard
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">FinFlow</h1>
      {/* Card and transaction forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardConnect />
        <AddTransaction />
      </div>
      {/* Budget and transaction list */}
      <BudgetPlanner />
      <TransactionList />
    </div>
  );
}