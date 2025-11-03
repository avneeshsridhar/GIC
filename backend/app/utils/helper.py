import random
import string
from datetime import date


def generate_employee_id() -> str:
    chars = string.ascii_uppercase + string.digits
    random_part = ''.join(random.choices(chars, k=7))
    return f"UI{random_part}"


def calculate_days_worked(start_date: date) -> int:
    if not start_date:
        return 0
    return (date.today() - start_date).days