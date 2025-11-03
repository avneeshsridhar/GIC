from pydantic import BaseModel, validator
from typing import Optional

class CafeResponse(BaseModel):
    id: str
    name: str
    description: str
    logo: Optional[str]
    location: str
    employees: int
    
    class Config:
        from_attributes = True

class CreateCafe(BaseModel):
    name: str
    description: str
    location: str
    logo: Optional[str] = None
    
    @validator('name')
    def validate_name(cls, v):
        if len(v) < 6 or len(v) > 10:
            raise ValueError('Name must be between 6 and 10 characters')
        return v
    
    @validator('description')
    def validate_description(cls, v):
        if len(v) > 256:
            raise ValueError('Description must be max 256 characters')
        return v

class UpdateCafe(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    logo: Optional[str] = None
    
    @validator('name')
    def validate_name(cls, v):
        if v and (len(v) < 6 or len(v) > 10):
            raise ValueError('Name must be between 6 and 10 characters')
        return v
    
    @validator('description')
    def validate_description(cls, v):
        if v and len(v) > 256:
            raise ValueError('Description must be max 256 characters')
        return v

class EmployeeResponse(BaseModel):
    id: str
    name: str
    email_address: str
    phone_number: str
    gender: str
    days_worked: int
    cafe: str
    
    class Config:
        from_attributes = True

class CreateEmployee(BaseModel):
    name: str
    email_address: str
    phone_number: str
    gender: str
    cafe_id: Optional[str] = None
    
    @validator('name')
    def validate_name(cls, v):
        if len(v) < 6 or len(v) > 10:
            raise ValueError('Name must be between 6 and 10 characters')
        return v
    
    @validator('email_address')
    def validate_email(cls, v):
        if '@' not in v or '.' not in v:
            raise ValueError('Invalid email address')
        return v
    
    @validator('phone_number')
    def validate_phone(cls, v):
        if len(v) != 8:
            raise ValueError('Phone number must be 8 digits')
        if v[0] not in ['8', '9']:
            raise ValueError('Phone number must start with 8 or 9')
        if not v.isdigit():
            raise ValueError('Phone number must contain only digits')
        return v
    
    @validator('gender')
    def validate_gender(cls, v):
        if v not in ['Male', 'Female']:
            raise ValueError('Gender must be Male or Female')
        return v

class UpdateEmployee(BaseModel):
    name: Optional[str] = None
    email_address: Optional[str] = None
    phone_number: Optional[str] = None
    gender: Optional[str] = None
    cafe_id: Optional[str] = None
    
    @validator('name')
    def validate_name(cls, v):
        if v and (len(v) < 6 or len(v) > 10):
            raise ValueError('Name must be between 6 and 10 characters')
        return v
    
    @validator('email_address')
    def validate_email(cls, v):
        if v and ('@' not in v or '.' not in v):
            raise ValueError('Invalid email address')
        return v
    
    @validator('phone_number')
    def validate_phone(cls, v):
        if v:
            if len(v) != 8:
                raise ValueError('Phone number must be 8 digits')
            if v[0] not in ['8', '9']:
                raise ValueError('Phone number must start with 8 or 9')
            if not v.isdigit():
                raise ValueError('Phone number must contain only digits')
        return v
    
    @validator('gender')
    def validate_gender(cls, v):
        if v and v not in ['Male', 'Female']:
            raise ValueError('Gender must be Male or Female')
        return v