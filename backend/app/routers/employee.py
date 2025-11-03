from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from ..database import get_db
from ..models import Employee, EmployeeCafe, Cafe
from ..schemas import CreateEmployee, UpdateEmployee, EmployeeResponse
from ..utils.helper import generate_employee_id, calculate_days_worked

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.get("", response_model=List[EmployeeResponse])
def get_employees(cafe: Optional[str] = Query(None), db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    result = []
    for employee in employees:
        assignment = employee.cafe_assignment
        cafe_name = None
        days_worked = 0
        
        if assignment:
            cafe_name = assignment.cafe.name
            if cafe and cafe_name != cafe:
                continue
            days_worked = calculate_days_worked(assignment.start_date)
        else:
            if cafe:
                continue
        
        result.append({
            "id": employee.id,
            "name": employee.name,
            "email_address": employee.email_address,
            "phone_number": employee.phone_number,
            "gender": employee.gender,
            "days_worked": days_worked,
            "cafe": cafe_name or ""
        })
    result.sort(key=lambda x: x['days_worked'], reverse=True)
    return result

@router.post("", response_model=EmployeeResponse, status_code=201)
def create_employee(employee_data: CreateEmployee, db: Session = Depends(get_db)):
    employee_id = generate_employee_id()
    new_employee = Employee(
        id=employee_id,
        name=employee_data.name,
        email_address=employee_data.email_address,
        phone_number=employee_data.phone_number,
        gender=employee_data.gender
    )
    db.add(new_employee)
    db.commit()
    
    cafe_name = None
    if employee_data.cafe_id:
        cafe = db.query(Cafe).filter(Cafe.id == employee_data.cafe_id).first()
        if cafe:
            assignment = EmployeeCafe(
                employee_id=employee_id,
                cafe_id=employee_data.cafe_id,
                start_date=date.today()
            )
            db.add(assignment)
            db.commit()
            cafe_name = cafe.name
    
    return {
        "id": employee_id,
        "name": new_employee.name,
        "email_address": new_employee.email_address,
        "phone_number": new_employee.phone_number,
        "gender": new_employee.gender,
        "days_worked": 0,
        "cafe": cafe_name or ""
    }

@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(employee_id: str, employee_data: UpdateEmployee, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if employee_data.name is not None:
        employee.name = employee_data.name
    if employee_data.email_address is not None:
        employee.email_address = employee_data.email_address
    if employee_data.phone_number is not None:
        employee.phone_number = employee_data.phone_number
    if employee_data.gender is not None:
        employee.gender = employee_data.gender
    db.commit()
    
    cafe_name = None
    days_worked = 0
    if employee_data.cafe_id is not None:
        old_assignment = db.query(EmployeeCafe).filter(EmployeeCafe.employee_id == employee_id).first()
        if old_assignment:
            db.delete(old_assignment)
        
        if employee_data.cafe_id:
            cafe = db.query(Cafe).filter(Cafe.id == employee_data.cafe_id).first()
            if cafe:
                new_assignment = EmployeeCafe(
                    employee_id=employee_id,
                    cafe_id=employee_data.cafe_id,
                    start_date=date.today()
                )
                db.add(new_assignment)
                cafe_name = cafe.name
        db.commit()
    else:
        assignment = employee.cafe_assignment
        if assignment:
            cafe_name = assignment.cafe.name
            days_worked = calculate_days_worked(assignment.start_date)
    
    return {
        "id": employee.id,
        "name": employee.name,
        "email_address": employee.email_address,
        "phone_number": employee.phone_number,
        "gender": employee.gender,
        "days_worked": days_worked,
        "cafe": cafe_name or ""
    }

@router.delete("/{employee_id}", status_code=204)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(employee)
    db.commit()