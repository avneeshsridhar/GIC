from fastapi import FastAPI
from routers.cafes import cafe_router
from routers.employees import employee_router

app = FastAPI()
app.include_router(cafe_router)
app.include_router(employee_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Cafe API"}

