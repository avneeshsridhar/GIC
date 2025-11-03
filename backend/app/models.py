from sqlalchemy import Column, String,Text, Integer, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID as UUID
from sqlalchemy.types import TIMESTAMP
from datetime import datetime
from pydantic import validate
from uuid import uuid4

from database import Base

class Cafe(Base):
    __tablename__ = "cafes"
    id=Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name=Column(String(100), nullable=False)
    logo=Column(Text,nullable=True)
    description=Column(String(256), nullable=False)
    location=Column(String(255), nullable=False)
    created_at= Column(TIMESTAMP, default=datetime.utcnow)

    employee_assignments = relationship("EmployeeCafe", back_populates="cafe", cascade="all, delete-orphan")

    def __repr__(self):
        return f"Cafe(id={self.id}, name={self.name}, employees={self.employees}, location={self.location})"

class employees(Base):
    __tablename__ = "employees"
    id=Column(UUID, primary_key=True, default=uuid4)
    name=Column(String(100), nullable=False)
    email_address=Column(String(256), nullable=False)
    phone_number=Column(String(8), nullable=False)
    gender=Column(String(10), nullable=False)
    created_at= Column(TIMESTAMP, default=datetime.utcnow)
    
    cafe_assignment = relationship("EmployeeCafe", back_populates="employee", uselist=False, cascade="all, delete-orphan")


    def __repr__(self):
        return f"employees(id={self.id}, name={self.name}, email_address={self.email_address}, phone_number={self.phone_number}, gender ={self.gender})"   

class EmployeeCafe(Base):
    __tablename__ = "employee_cafe"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(String(9), ForeignKey("employees.id", ondelete="CASCADE"), unique=True, nullable=False)
    cafe_id = Column(UUID(as_uuid=True), ForeignKey("cafes.id", ondelete="CASCADE"), nullable=False)
    start_date = Column(Date, nullable=False)
    
    employee = relationship("Employee", back_populates="cafe_assignment")
    cafe = relationship("Cafe", back_populates="employee_assignments")
    
    def __repr__(self):
        return f"<EmployeeCafe(employee_id={self.employee_id}, cafe_id={self.cafe_id}, start_date={self.start_date})>" 
    
