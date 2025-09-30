from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class UserRequest(BaseModel):
    userId: str

@app.post("/recommend")
def recommend(data: UserRequest):
    # Dummy AI logic placeholder
    return {"matches": ["pro1", "pro2", "pro3"], "user": data.userId}
