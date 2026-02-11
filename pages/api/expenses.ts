import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = 'http://127.0.0.1:8000';

interface ExpenseDataFromBackend {
  id: string;
  category: string;
  amount: number;
  date?: string | null;
  created_at?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${BACKEND_URL}/expenses`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data: ExpenseDataFromBackend[] = await response.json();
      res.status(200).json(data);
    } catch (error: any) {
      console.error("Error fetching expenses from backend:", error);
      res.status(500).json({ message: "Failed to load expenses. Is the backend running?", error: error.message });
    }
  } else if (req.method === 'POST') {
    const { category, amount, date } = req.body;
    if (!category || amount === undefined) {
      return res.status(400).json({ message: 'Category and amount are required' });
    }

    try {
      const response = await fetch(`${BACKEND_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: String(category), amount: Number(amount), date: date }), // Sending date if provided
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const backendResponse: ExpenseDataFromBackend = await response.json();
      res.status(201).json(backendResponse);

    } catch (error: any) {
      console.error("Error sending expense to backend:", error);
      res.status(500).json({ message: "Failed to add expense to backend", error: error.message });
    }
    
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
