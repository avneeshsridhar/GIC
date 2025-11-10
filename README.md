# Cafe Management App

Simple app for managing cafes and employees. Built with React + FastAPI.

## Stack

- Frontend: React with AG Grid
- Backend: FastAPI (Python)
- Database: PostgreSQL on Supabase

## Running it locally

Backend:
```bash
cd backend
pip install -r requirements.txt
python init_db.py  
uvicorn app.main:app --reload --port 8000
```
If change in port, change frontend/service/api.js too
Frontend:
```bash
cd frontend
npm install
npm run dev
```

## How it works

The frontend talks to the backend through nginx proxy at `/api`. Backend connects to Supabase PostgreSQL database.

Three tables: cafes, employees, and employee_cafe (join table for assignments).

Employee IDs are auto-generated as UI followed by 7 digits.

## API endpoints

**Cafes:**
- GET /cafes (add ?location= to filter)
- POST /cafes
- PUT /cafes/{id}
- DELETE /cafes/{id}

**Employees:**
- GET /employees (add ?cafe= to filter)
- POST /employees
- PUT /employees/{id}
- DELETE /employees/{id}

