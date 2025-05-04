from model import load_model, classify
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
import uvicorn
from typing import List
app = FastAPI()

class InputData(BaseModel):
    features: List[float]

# class InputData(BaseModel):
#     features: List[float]
    
#     @field_validator('features')
#     def check_features_length(cls, v):
#         if len(v) != 384:
#             raise ValueError('Features must be a list of length 384')
#         return v

global model

model = load_model()

@app.post("/classify")
async def classify_data(data: InputData):
    try:
        # Convert input to numpy array for model
        features = np.array(data.features)
        
        # Get prediction using the imported classify function
        prediction, confidence = classify(model, features)
        
        return {"prediction": prediction, "confidence": confidence}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during classification: {str(e)}")
