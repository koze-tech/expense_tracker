import React from 'react';

interface Expense {
  id: string;
  category: string;
  amount: number;
  date?: string | null;
  created_at?: string;
}

interface ExpenseListProps {
  expenses: Expense[];
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center p-6 bg-pink-50 rounded-2xl border-2 border-pink-300/50">
        <p className="text-lg text-pink-700 font-medium">No expenses recorded yet!</p>
        <p className="text-md text-pink-500 mt-2">Add your first expense using the form on the left. <span role="img" aria-label="sparkles">✨</span></p>
      </div>
    );
  }

  // Helper to format date nicely
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Unknown Date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <ul className="space-y-4">
      {expenses.map((e) => (
        <li key={e.id} className="bg-white p-5 rounded-2xl shadow-lg border border-pink-200/50">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xl text-pink-700">{e.category}</span>
            <span className="font-extrabold text-2xl text-blue-600">${e.amount.toFixed(2)}</span>
          </div>
          <div className="text-sm text-gray-600 flex justify-between items-center">
            <span>Date: {formatDate(e.date)}</span>
            {e.created_at && (
              <span className="text-xs text-gray-400">Added: {new Date(e.created_at).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
