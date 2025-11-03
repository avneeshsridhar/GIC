from sqlalchemy import Column, String, Integer, Date, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from .database import Base


class Cafe(Base):
    __tablename__ = "cafes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(String(256), nullable=False)
    location = Column(String(255), nullable=False)
    logo = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    employee_assignments = relationship("EmployeeCafe", back_populates="cafe", cascade="all, delete-orphan")


class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(String(9), primary_key=True)
    name = Column(String(100), nullable=False)
    email_address = Column(String(255), unique=True, nullable=False)
    phone_number = Column(String(8), nullable=False)
    gender = Column(String(10), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    cafe_assignment = relationship("EmployeeCafe", back_populates="employee", uselist=False, cascade="all, delete-orphan")


class EmployeeCafe(Base):
    __tablename__ = "employee_cafe"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(String(9), ForeignKey("employees.id", ondelete="CASCADE"), unique=True, nullable=False)
    cafe_id = Column(UUID(as_uuid=True), ForeignKey("cafes.id", ondelete="CASCADE"), nullable=False)
    start_date = Column(Date, nullable=False)
    
    employee = relationship("Employee", back_populates="cafe_assignment")
    cafe = relationship("Cafe", back_populates="employee_assignments")