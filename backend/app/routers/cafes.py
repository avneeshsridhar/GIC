from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from typing import List
from schemas import CafeSchema, CreateCafe, UpdateCafe
from models import Cafe
from database import get_db
from sqlalchemy.orm import Session

cafe_router = APIRouter(tags=["Cafes"])

@cafe_router.get("/cafes",response_model=List[CafeSchema])
async def get_cafes(location: Optional[str]=None,db:Session = Depends(get_db)):
    db.query(Cafe)
    if location:
        cafes = cafes.filter(Cafe.location.like(f"%{location}%"))
    return cafes.all()

@cafe_router.post("/cafes",response_model=CafeSchema)
async def create_cafe(cafe:CreateCafe,db:Session = Depends(get_db)):
    new_cafe = Cafe(
        name=cafe.name,
        location=cafe.location,
        logo=cafe.logo,
        employees=cafe.employees
    )
    db.add(new_cafe)
    db.commit()
    db.refresh(new_cafe)
    return new_cafe

@cafe_router.put("/cafes/{cafe_id}",response_model=CafeSchema)
async def update_cafe(cafe_id:str, cafe:UpdateCafe, db:Session = Depends(get_db)):
    existing_cafe = db.query(Cafe).filter(Cafe.id == cafe_id).first()
    if not existing_cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    else:
        if cafe.name is not None:
            existing_cafe.name = cafe.name
        if cafe.location is not None:
            existing_cafe.location = cafe.location
        if cafe.logo is not None:
            existing_cafe.logo = cafe.logo
        if cafe.employees is not None:
            existing_cafe.employees = cafe.employees
    db.commit()
    db.refresh(existing_cafe)
    return existing_cafe

@cafe_router.delete('/cafes/{cafe_id}')
async def delete_cafe(cafe_id:int, db:Session = Depends(get_db), response_model=CafeSchema):
    existing_cafe=db.query(Cafe).filter(Cafe.id==cafe_id).first()
    if not existing_cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    else:
        db.delete(existing_cafe)
        db.commit()
        return existing_cafe



