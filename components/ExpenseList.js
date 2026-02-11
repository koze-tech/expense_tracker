import React from 'react';

export default function ExpenseList({ expenses = [] }) {
  if (!expenses || expenses.length === 0) return <p>No expenses yet.</p>;
  return (
    <ul className="space-y-2">
      {expenses.map((e) => (
        <li key={e.id} className="border p-3 rounded shadow-sm bg-white">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">{e.category}</span>
            <span className="font-semibold text-blue-600">${e.amount.toFixed(2)}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {e.date ? new Date(e.date).toLocaleDateString() : 'Date unknown'}
            {e.created_at && ` (Added ${new Date(e.created_at).toLocaleString()})`}
          </div>
        </li>
      ))}
    </ul>
  );
}
