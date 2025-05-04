from huggingface_hub import login, from_pretrained_keras

import os
import glob
import time
import h5py
import numpy as np
# import pandas as pd
from PIL import Image
from tqdm import tqdm
import tensorflow as tf
from dotenv import load_dotenv

load_dotenv()

hf_token = os.getenv("HF_TOKEN")
if hf_token is None:
    print("Hugging Face token not found. Please set the HF_TOKEN environment variable.")
login(token=hf_token)

def load_model():
    """Load PathFoundation model from Hugging Face"""
    print("Loading PathFoundation model...")
    model = from_pretrained_keras("google/path-foundation")
    infer = model.signatures["serving_default"]
    print("Model loaded!")
    return infer

def load_model():
    """Load PathFoundation model from Hugging Face"""
    print("Loading PathFoundation model...")
    import tensorflow as tf
    import keras
    from huggingface_hub import snapshot_download
    
    # Download the model from HuggingFace
    model_path = snapshot_download(repo_id="google/path-foundation")
    
    # Load as TFSMLayer
    model = keras.layers.TFSMLayer(
        model_path,
        call_endpoint='serving_default'
    )
    print("Model loaded!")
    return model


def process_image(image_input, infer_function):
    """Process a single image and get embedding
    
    Args:
        image_input: Either a file path (str) or image data (bytes/BytesIO/numpy array)
        infer_function: The model inference function
    
    Returns:
        Embedding vector or None if processing fails
    """
    try:
        # Handle different input types
        if isinstance(image_input, str):
            # It's a file path
            img = Image.open(image_input).convert('RGB')
        elif isinstance(image_input, bytes) or hasattr(image_input, 'read'):
            # It's image data from frontend (bytes or BytesIO)
            img = Image.open(image_input).convert('RGB')
        elif isinstance(image_input, np.ndarray):
            # It's already a numpy array
            img = Image.fromarray(image_input.astype('uint8')).convert('RGB')
        else:
            raise ValueError(f"Unsupported image input type: {type(image_input)}")
        
        # Resize to 224x224 if needed
        if img.size != (224, 224):
            img = img.resize((224, 224))
        # Convert to tensor and normalize
        tensor = tf.cast(tf.expand_dims(np.array(img), axis=0), tf.float32) / 255.0
        
        # Get embedding
        embeddings = infer_function(tf.constant(tensor))

        embedding_vector = embeddings['output_0'].numpy().flatten()
   
        return embedding_vector
    except Exception as e:
        print(f"Error processing image: {e}")
        return None
