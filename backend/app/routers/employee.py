from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import string
import random
from database import get_db
from models import employees, Cafe, EmployeeCafe
from schemas import CreateEmployee, UpdateEmployee

employee_router = APIRouter(tags=["Employee"])

def generate_employee_id(db: Session) -> str:
    while True:
        random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))
        employee_id = f"UI{random_part}"
        if not db.query(employees).filter(employees.id == employee_id).first():
            return employee_id

@employee_router.get('/employees')
async def get_employees(cafe: Optional[str] = None, db: Session = Depends(get_db)):
    all_employees = db.query(employees).all()
    
    result = []
    for emp in all_employees:
        assignment = db.query(EmployeeCafe).filter(EmployeeCafe.employee_id == emp.id).first()
        
        cafe_name = ""
        days_worked = 0
        
        if assignment:
            cafe_obj = db.query(Cafe).filter(Cafe.id == assignment.cafe_id).first()
            if cafe_obj:
                cafe_name = cafe_obj.name
                days_worked = (datetime.now().date() - assignment.start_date).days
        
        if cafe and cafe_name != cafe:
            continue
        
        result.append({
            'id': emp.id,
            'name': emp.name,
            'email_address': emp.email_address,
            'phone_number': emp.phone_number,
            'days_worked': days_worked,
            'cafe': cafe_name
        })
    
    return result

@employee_router.post('/employees')
async def create_employee(employee: CreateEmployee, db: Session = Depends(get_db)):
    
    employee_id = generate_employee_id(db)
    
    new_employee = employees(
        id=employee_id,
        name=employee.name,
        email_address=employee.email_address,
        phone_number=employee.phone_number,
        gender=employee.gender
    )
    
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    
    if employee.cafe_id:
        assignment = EmployeeCafe(
            employee_id=employee_id,
            cafe_id=employee.cafe_id,
            start_date=datetime.now().date()
        )
        db.add(assignment)
        db.commit()
    
    return {
        'id': new_employee.id,
        'name': new_employee.name,
        'email_address': new_employee.email_address,
        'phone_number': new_employee.phone_number,
        'gender': new_employee.gender
    }

@employee_router.put('/employees/{employee_id}')
async def update_employee(employee_id: str, employee: UpdateEmployee, db: Session = Depends(get_db)):
    """Update employee details"""
    
    # Find employee
    emp = db.query(employees).filter(employees.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Update fields if provided
    if employee.name:
        emp.name = employee.name
    if employee.email_address:
        emp.email_address = employee.email_address
    if employee.phone_number:
        emp.phone_number = employee.phone_number
    if employee.gender:
        emp.gender = employee.gender
    
    db.commit()
    return {"message": "Employee updated", "id": employee_id}

@employee_router.delete('/employees/{employee_id}')
async def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    """Delete employee"""
    
    # Find employee
    emp = db.query(employees).filter(employees.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Delete assignment if exists
    assignment = db.query(EmployeeCafe).filter(EmployeeCafe.employee_id == employee_id).first()
    if assignment:
        db.delete(assignment)
    
    # Delete employee
    db.delete(emp)
    db.commit()
    
    return {"message": "Employee deleted", "id": employee_id}