from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers.cafes import router as cafe_router
from .routers.employee import router as employee_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cafe_router)
app.include_router(employee_router)

@app.get("/")
def root():
    return {"message": "Welcome"}