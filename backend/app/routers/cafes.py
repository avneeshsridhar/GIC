from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Cafe
from ..schemas import CreateCafe, UpdateCafe, CafeResponse

router = APIRouter(prefix="/cafes", tags=["Cafes"])

@router.get("", response_model=List[CafeResponse])
def get_cafes(location: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Cafe)
    if location:
        query = query.filter(Cafe.location.ilike(f"%{location}%"))
    cafes = query.all()
    
    result = []
    for cafe in cafes:
        result.append({
            "id": str(cafe.id),
            "name": cafe.name,
            "description": cafe.description,
            "location": cafe.location,
            "logo": cafe.logo,
            "employees": len(cafe.employee_assignments)
        })
    result.sort(key=lambda x: x['employees'], reverse=True)
    return result

@router.post("", response_model=CafeResponse, status_code=201)
def create_cafe(cafe: CreateCafe, db: Session = Depends(get_db)):
    new_cafe = Cafe(
        name=cafe.name,
        description=cafe.description,
        location=cafe.location,
        logo=cafe.logo
    )
    db.add(new_cafe)
    db.commit()
    db.refresh(new_cafe)
    return {
        "id": str(new_cafe.id),
        "name": new_cafe.name,
        "description": new_cafe.description,
        "location": new_cafe.location,
        "logo": new_cafe.logo,
        "employees": 0
    }

@router.put("/{cafe_id}", response_model=CafeResponse)
def update_cafe(cafe_id: str, cafe_data: UpdateCafe, db: Session = Depends(get_db)):
    cafe = db.query(Cafe).filter(Cafe.id == cafe_id).first()
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    
    if cafe_data.name is not None:
        cafe.name = cafe_data.name
    if cafe_data.description is not None:
        cafe.description = cafe_data.description
    if cafe_data.location is not None:
        cafe.location = cafe_data.location
    if cafe_data.logo is not None:
        cafe.logo = cafe_data.logo
    
    db.commit()
    db.refresh(cafe)
    return {
        "id": str(cafe.id),
        "name": cafe.name,
        "description": cafe.description,
        "location": cafe.location,
        "logo": cafe.logo,
        "employees": len(cafe.employee_assignments)
    }

@router.delete("/{cafe_id}", status_code=204)
def delete_cafe(cafe_id: str, db: Session = Depends(get_db)):
    cafe = db.query(Cafe).filter(Cafe.id == cafe_id).first()
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    db.delete(cafe)
    db.commit()