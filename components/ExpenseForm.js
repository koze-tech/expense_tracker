import React, { useState } from 'react';

export default function ExpenseForm({ onSubmit }) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !amount) return;
    onSubmit({ category, amount: parseFloat(amount), date: date || new Date().toISOString() });
    setCategory('');
    setAmount('');
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Category</label>
        <input className="border p-2 w-full" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div>
        <label>Amount</label>
        <input className="border p-2 w-full" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div>
        <label>Date</label>
        <input className="border p-2 w-full" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <button className="bg-blue-500 text-white px-4 py-2" type="submit">Add Expense</button>
    </form>
  );
}
