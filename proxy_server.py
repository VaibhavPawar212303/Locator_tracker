from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
import httpx
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

class ActionDetail(BaseModel):
    action_type: str
    css_selector: Optional[str] = None
    xpath: Optional[str] = None
    text: Optional[str] = None
    id: Optional[str] = None
    class_name: Optional[str] = None

class UserActions(BaseModel):
    actions: List[ActionDetail]

# Allow CORS for specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your allowed origins or keep "*" for all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/proxy")
async def proxy(url: str):
    if not url:
        raise HTTPException(status_code=400, detail="No URL specified")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            return HTMLResponse(content=response.text, status_code=response.status_code)
        except httpx.RequestError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=str(exc))

# Directory and file path
DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)
FILE_PATH = os.path.join(DATA_DIR, "user_actions.json")

@app.post("/save_actions")
async def save_actions(action_data: UserActions):
    try:
        with open('data/actions.json', 'w') as file:
            json.dump(action_data.dict(), file, indent=4)
        return {"message": "Actions saved successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

