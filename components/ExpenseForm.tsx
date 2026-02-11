import React, { useState } from 'react';

interface ExpenseFormData {
  category: string;
  amount: string; // Keep as string for input, convert later
  date?: string | null;
}

interface ExpenseFormProps {
  onSubmit: (data: Omit<ExpenseFormData, 'date'> & { date?: string | null }) => void;
}

export default function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) {
      // Basic validation feedback can be added here
      alert('Please enter both category and amount!');
      return;
    }
    onSubmit({ category, amount, date }); // Pass date as is, let parent handle parsing if needed
    setCategory('');
    setAmount('');
    setDate('');
  };

  // Cute styling and input placeholders
  const inputClasses = "border-2 border-pink-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500";
  const labelClasses = "block text-lg font-medium text-gray-700 mb-2";
  const buttonClasses = "bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg";
  const datePickerClasses = "border-2 border-pink-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500";


  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-5 bg-white rounded-2xl shadow-lg border border-pink-200/50">
      <div>
        <label htmlFor="category" className={labelClasses}>Item Category <span role="img" aria-label="tag">🏷️</span></label>
        <input
          id="category"
          className={inputClasses}
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Groceries, Coffee"
          required
        />
      </div>
      <div>
        <label htmlFor="amount" className={labelClasses}>Amount <span role="img" aria-label="money-bag">💰</span></label>
        <input
          id="amount"
          className={inputClasses}
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 15.50"
          required
        />
      </div>
      <div>
        <label htmlFor="date" className={labelClasses}>Date <span role="img" aria-label="calendar">📅</span></label>
        <input
          id="date"
          className={datePickerClasses}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <button className={buttonClasses} type="submit">
        Add Expense <span role="img" aria-label="plus">➕</span>
      </button>
    </form>
  );
}
