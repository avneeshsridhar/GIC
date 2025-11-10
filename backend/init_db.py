from app.database import engine, Base
from app.models import Cafe, Employee, EmployeeCafe

Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")
