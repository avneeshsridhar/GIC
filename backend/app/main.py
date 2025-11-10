from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers.cafes import router as cafe_router
from .routers.employee import router as employee_router

app = FastAPI()

import os

# Get allowed origins from environment variable or use defaults
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,http://localhost").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cafe_router)
app.include_router(employee_router)

@app.get("/")
def root():
    return {"message": "Welcome"}