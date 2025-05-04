from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi import HTTPException
# from agent import agent_with_db
from langgraph_agent import agent_with_db
from schemas import request
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()
allowed_origins = os.getenv("ALLOWED_ORIGINS").split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
global agent
agent = agent_with_db()

async def parse_user_data(user_data):
    
    if user_data is None:
        return "No user data available"
    
    # Ensure input is a dictionary
    if not isinstance(user_data, dict):
        raise ValueError("Input must be a dictionary or None")
    
    # Create user info dictionary with default values
    user_info = {
        "state_user_belongs_to": (
            user_data.get("state") if user_data.get("state") is not None 
            else "No state information available"
        ),
        "sex_of_user": (
            user_data.get("gender") if user_data.get("gender") is not None 
            else "Information not available"
        )
    }
    
    return user_info

@app.post("/retrieve", status_code=200)
async def retrieve(request:request, url:Request):
    try:
        prev_conv = request.previous_state
        user_info = await parse_user_data(request.user_data)
        
        if prev_conv is None:
            prev_conv = "No previous conversation available, first time"
        query = request.query
        prev_conv = str(prev_conv)
        # user_info = str(user_info) # Was needed in Old-Rag not needed in LangGraph-Rag.
        # Did a mistake by choosing to string format for Old-Rag
        response = agent({"query": query, "previous_conversation": prev_conv, "user_data": user_info, "style": request.user_data["style"]})
        origin = url.headers.get('origin')
        if origin is None:
            origin = url.headers.get('referer')
        print("origin: ", origin)
        return {"response": response["result"]}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
