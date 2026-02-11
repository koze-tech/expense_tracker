import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

const BACKEND_URL = 'http://127.0.0.1:8000';

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/expenses');
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP error! status: ${res.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setError(`Could not load expenses. Is the backend running at /api/expenses? ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async (expenseData) => {
    setError(null);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: expenseData.category, amount: Number(expenseData.amount) }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP error! status: ${res.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const newExpense = await res.json();
      setExpenses((prev) => [...prev, newExpense]);
    } catch (err) {
      console.error("Failed to add expense:", err);
      setError(`Failed to add expense: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-700">Simple Expense Tracker</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {loading && <p className="text-center mb-4">Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add New Expense</h2>
          <ExpenseForm onSubmit={addExpense} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Expenses</h2>
          <ExpenseList expenses={expenses} />
        </div>
      </div>
    </div>
  );
}
