import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface ExpenseData {
  id: string;
  category: string;
  amount: number;
  date?: string | null;
  created_at?: string;
}

const dataFilePath = path.join(process.cwd(), 'data', 'expenses.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      if (!fs.existsSync(dataFilePath)) {
        // If file doesn't exist, return empty array
        return res.status(200).json([]);
      }
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      const data: ExpenseData[] = JSON.parse(fileData);
      res.status(200).json(data);
    } catch (error: any) {
      console.error("Error reading expenses from file:", error);
      res.status(500).json({ message: "Failed to load expenses.", error: error.message });
    }
  } else if (req.method === 'POST') {
    const { category, amount, date } = req.body;
    if (!category || amount === undefined) {
      return res.status(400).json({ message: 'Category and amount are required' });
    }

    try {
      let expenses: ExpenseData[] = [];
      if (fs.existsSync(dataFilePath)) {
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        try {
            expenses = JSON.parse(fileData);
        } catch (e) {
            // If file is corrupted or empty, start fresh
            expenses = [];
        }
      }

      const newExpense: ExpenseData = {
        id: new Date().toISOString(), // Simple ID generation
        category: String(category),
        amount: Number(amount),
        date: date || new Date().toISOString().split('T')[0], // Default to today if not provided
        created_at: new Date().toISOString(),
      };

      expenses.push(newExpense);

      fs.writeFileSync(dataFilePath, JSON.stringify(expenses, null, 2));
      
      res.status(201).json(newExpense);

    } catch (error: any) {
      console.error("Error saving expense to file:", error);
      res.status(500).json({ message: "Failed to add expense.", error: error.message });
    }
    
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
