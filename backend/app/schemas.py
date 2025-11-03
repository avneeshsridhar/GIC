from pydantic import BaseModel
from typing import Optional
from pydantic import validator

class CafeSchema(BaseModel):
    id: Optional[str]
    name: str
    description: str
    logo: Optional[str]
    location: str
    employees: int

    class Config:
        form_attributes = True

class EmployeeSchema(BaseModel):   
    id: Optional[str]
    name: str
    email_address: str
    phone_number: int
    gender: str
    class Config:
        form_attributes = True

class CreateCafe(BaseModel):
    name:str
    location:str
    description:str
    logo:Optional[str]
    class Config:
        form_attributes = True

    

class UpdateCafe(BaseModel):
    name:Optional[str]
    location:Optional[str]
    description:Optional[str]
    logo:Optional[str]
    class Config:
        form_attributes = True  
class CreateEmployee(BaseModel):
    name:str
    email_address:str
    phone_number:str
    gender:str
    cafe_id:int
    class Config:   
        form_attributes = True

    @validator('email_address')
    def validate_email(cls, v):
        if "@" not in v or "." not in v:
            raise ValueError("Invalid email address")
        return v
    
    @validator('phone_number')
    def validate_phone_number(cls, v):  
        if len(str(v)) !=8:
            raise ValueError("Invalid phone number")
        if v[0] not in ['8','9']:
            raise ValueError("Phone number must start with 8 or 9")
        return v
    
    @validator('gender')
    def validate_gender(cls, v):
        if v.lower() not in ['male', 'female', 'other']:
            raise ValueError("Gender must be 'male', 'female', or 'other'")
        return v.lower()

class UpdateEmployee(BaseModel):
    name : Optional[str]
    email_address : Optional[str]
    phone_number : Optional[str]
    gender : Optional[str]
    
    class Config:
        form_attributes = True

