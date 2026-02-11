import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

interface Expense {
  id: string;
  category: string;
  amount: number;
  date?: string | null;
  created_at?: string;
}

const BACKEND_URL = 'http://127.0.0.1:8000';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/expenses'); // Calls our Next.js API route, which proxies to backend
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP error! status: ${res.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const data: Expense[] = await res.json();
      setExpenses(data);
    } catch (err: any) {
      console.error("Failed to fetch expenses:", err);
      setError(`Could not load expenses. Is the backend running at ${BACKEND_URL}? ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'created_at'>) => {
    setError(null);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: expenseData.category,
          amount: Number(expenseData.amount),
          date: expenseData.date, // Sending date if provided by form
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP error! status: ${res.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const newExpense: Expense = await res.json();
      setExpenses((prev) => [...prev, newExpense]);
    } catch (err: any) {
      console.error("Failed to add expense:", err);
      setError(`Failed to add expense: ${err.message}`);
    }
  };

  // Styling for a cute and friendly vibe
  const pink = '#ff66b3'; // Primary cute color
  const bgLight = '#fffdf7'; // Creamy background
  const cardBg = '#ffffff'; // White cards
  const textColor = '#333333'; // Dark text for contrast

  return (
    <div className="min-h-screen bg-bg text-text font-sans p-4" style={{ backgroundColor: bgLight, color: textColor }}>
      <h1 className="text-4xl font-bold mb-8 text-pink text-center drop-shadow-lg">✨ Expense Tracker ✨</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {loading && <p className="text-center mb-4 text-pink animate-pulse">Loading expenses...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="bg-card p-6 rounded-2xl shadow-xl border border-pink-200/50">
          <h2 className="text-3xl font-semibold mb-5 text-pink text-center">Add New Expense <span role="img" aria-label="money-bag">💰</span></h2>
          <ExpenseForm onSubmit={addExpense} />
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-xl border border-pink-200/50">
          <h2 className="text-3xl font-semibold mb-5 text-pink text-center">Your Expenses <span role="img" aria-label="receipt">🧾</span></h2>
          <ExpenseList expenses={expenses} />
        </div>
      </div>
    </div>
  );
}
