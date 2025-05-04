from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
from typing import List
import os
import numpy as np
from PIL import Image
import io
from embedding_generator import load_model, process_image

app = FastAPI(title="Medical Image Embedding Generator")


global infer
infer = load_model()


@app.post("/embeddings")
async def generate_embeddings(file: UploadFile = File(...)):
    """
    Upload a medical image (JPEG, PNG, TIFF) and get embeddings
    """
    content_type = file.content_type
    if not (content_type.startswith("image/") or 
            file.filename.endswith((".tif", ".tiff", ".jpg", ".jpeg", ".png", ".bmp"))):
        raise HTTPException(status_code=400, detail="File must be an image (JPEG, PNG, BMP) or TIFF format")
    
    try:
        # Read the file content
        embedding = process_image(file.file, infer)
        if embedding is None:
            raise HTTPException(status_code=500, detail="Error processing image")
        
        return_content = {
            "filename": file.filename,
            "embedding": embedding.tolist(),
        }
        
        return JSONResponse(content=return_content)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to Medical Image Embedding Generator API. Use /embeddings endpoint to upload images."}