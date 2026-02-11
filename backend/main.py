from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel

import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

app = FastAPI()

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME", "expense_tracker"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "Admin123"),
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432")
}

def get_connection():
    try:
        return psycopg2.connect(cursor_factory=RealDictCursor, **DB_CONFIG)
    except psycopg2.Error as e:
        print(f"Error connecting to database: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")

class ExpenseCreate(BaseModel):
    category: str
    amount: float

@app.get("/")
def root():
    return {"message": "Expense Tracker API Running"}

# Add Expense
@app.post("/expenses")
def add_expense(expense: ExpenseCreate):
    con = get_connection()
    cur = con.cursor()

    try:
        cur.execute(
            """
            INSERT INTO expenses (category, amount)
            VALUES (%s, %s)
            RETURNING id, category, amount, created_at;
            """,
            (expense.category, expense.amount)
        )
        new_expense = cur.fetchone()
        con.commit()
    except Exception as e:
        con.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        con.close()

    return new_expense

# View All Expenses
@app.get("/expenses")
def get_expenses():
    con = get_connection()
    cur = con.cursor()

    cur.execute("SELECT * FROM expenses ORDER BY created_at DESC;")
    expenses = cur.fetchall()

    cur.close()
    con.close()
    return expenses

# View Expense by ID 
@app.get("/expenses/{expense_id}")
def get_expense(expense_id: int):
    con = get_connection()
    cur = con.cursor()

    cur.execute(
        "SELECT * FROM expenses WHERE id = %s;",
        (expense_id,)
    )

    expense = cur.fetchone()
    cur.close()
    con.close()

    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")

    return expense

#  Delete Expense 
@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int):
    con = get_connection()
    cur = con.cursor()

    cur.execute(
        "SELECT * FROM expenses WHERE id = %s;",
        (expense_id,)
    )
    expense = cur.fetchone()

    if expense is None:
        cur.close()
        con.close()
        raise HTTPException(status_code=404, detail="Expense not found")

    cur.execute(
        "DELETE FROM expenses WHERE id = %s;",
        (expense_id,)
    )

    con.commit()
    cur.close()
    con.close()

    return expense
