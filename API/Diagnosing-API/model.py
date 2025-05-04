import os
# import h5py
import numpy as np
# import pandas as pd
# from sklearn.model_selection import train_test_split
import torch
import torch.nn as nn
import torch.nn.functional as F
# from torch.utils.data import Dataset, DataLoader
from monai.networks.nets import SegResNet
from huggingface_hub import hf_hub_download
# from tqdm.notebook import tqdm, trange

# class EmbeddingsDataset(Dataset):
#     """Helper class to load and work with the stored embeddings"""
    
#     def __init__(self, embeddings_path, metadata_path, transform=None):
#         """
#         Initialize the dataset
        
#         Args:
#             embeddings_path: Path to the directory containing H5 embedding files
#             metadata_path: Path to the directory containing metadata files
#             transform: Optional transforms to apply to the data
#         """
#         self.embeddings_path = embeddings_path
#         self.metadata_path = metadata_path
#         self.transform = transform
#         self.master_metadata = pd.read_parquet(os.path.join(metadata_path, "master_metadata.parquet"))
#         # Limit to data with labels
#         self.metadata = self.master_metadata.dropna(subset=['label'])
        
#     def __len__(self):
#         return len(self.metadata)
    
#     def __getitem__(self, idx):
#         """Get embedding and label for a specific index"""
#         row = self.metadata.iloc[idx]
#         batch_name = row['embedding_batch']
#         embedding_index = row['embedding_index']
#         label = row['label']
        
#         # Load the embedding
#         h5_path = os.path.join(self.embeddings_path, f"{batch_name}.h5")
#         with h5py.File(h5_path, 'r') as h5f:
#             embedding = h5f['embeddings'][embedding_index]
        
#         # Convert to PyTorch tensor
#         embedding = torch.tensor(embedding, dtype=torch.float32)
        
#         # Reshape for CNN input - we expect embeddings of shape (384,)
#         # Reshape to (1, 384, 1, 1) for network input
#         embedding = embedding.view(1, 384, 1)
        
#         # Convert label to tensor (0=negative, 1=positive)
#         label = torch.tensor(label, dtype=torch.long)
        
#         if self.transform:
#             embedding = self.transform(embedding)
            
#         return embedding, label
    
#     def get_embedding(self, file_id):
#         """Get embedding for a specific file ID"""
#         # Find the file in metadata
#         file_info = self.master_metadata[self.master_metadata['file_id'] == file_id]
        
#         if len(file_info) == 0:
#             raise ValueError(f"File ID {file_id} not found in metadata")
        
#         # Get the batch and index
#         batch_name = file_info['embedding_batch'].iloc[0]
#         embedding_index = file_info['embedding_index'].iloc[0]
        
#         # Load the embedding
#         h5_path = os.path.join(self.embeddings_path, f"{batch_name}.h5")
#         with h5py.File(h5_path, 'r') as h5f:
#             embedding = h5f['embeddings'][embedding_index]
            
#         return embedding, file_info['label'].iloc[0] if 'label' in file_info.columns else None

class SelfSupervisedHead(nn.Module):
    """Self-supervised learning head for cancer classification
    
    Since no coordinates or bounding boxes are available, this head focuses on
    learning from the entire embedding through self-supervision.
    """
    def __init__(self, in_channels, num_classes=2):
        super(SelfSupervisedHead, self).__init__()
        self.conv = nn.Conv2d(in_channels, 128, kernel_size=1)
        self.bn = nn.BatchNorm2d(128)
        self.relu = nn.ReLU(inplace=True)
        self.global_pool = nn.AdaptiveAvgPool2d(1)
        
        # Self-supervised projector (MLP)
        self.projector = nn.Sequential(
            nn.Linear(128, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(inplace=True),
            nn.Linear(256, 128)
        )
        
        # Classification layer
        self.fc = nn.Linear(128, num_classes)
        
    def forward(self, x):
        x = self.conv(x)
        x = self.bn(x)
        x = self.relu(x)
        x = self.global_pool(x)
        x = x.view(x.size(0), -1)
        
        # Apply projector for self-supervised learning
        features = self.projector(x)
        
        # Classification output
        output = self.fc(features)
        return output, features

class SelfSupervisedCancerModel(nn.Module):
    """SegResNet with self-supervised learning head for cancer classification"""
    def __init__(self, num_classes=2):
        super(SelfSupervisedCancerModel, self).__init__()
        # Initialize SegResNet as backbone
        # Modified to work with 1-channel input and small input size
        self.backbone = SegResNet(
            spatial_dims=2,
            in_channels=1,
            out_channels=2,
            blocks_down=[3, 4, 23, 3],
            blocks_up=[3, 6, 3],
            upsample_mode="deconv",
            init_filters=32,
        )
        
        # We know from the structure that the final conv layer outputs 2 channels
        # Look at the print of self.backbone.conv_final showing Conv2d(8, 2, ...)
        backbone_out_channels = 2
        
        # Replace classifier with our self-supervised head
        self.ssl_head = SelfSupervisedHead(backbone_out_channels, num_classes)
        
        # Remove original classifier if needed
        if hasattr(self.backbone, 'class_layers'):
            self.backbone.class_layers = nn.Identity()
        
    def forward(self, x, return_features=False):
        # Run through backbone
        features = self.backbone(x)
        
        # Apply self-supervised head
        output, proj_features = self.ssl_head(features)
        
        if return_features:
            return output, proj_features
        return output

def load_model():
    path = hf_hub_download(repo_id="Arpit-Bansal/Medical-Diagnosing-models", filename="cancer_detector_model.pth",
                    )
    model = SelfSupervisedCancerModel(num_classes=2)
    state_dict = torch.load(path, map_location=torch.device('cpu'))

    model.load_state_dict(state_dict=state_dict)

    return model.eval()


def classify(model, embedding):
    """Classify a single embedding using the trained model"""
    # Ensure the model is in evaluation
    embedding_tensor = torch.tensor(embedding, dtype=torch.float32).view(1, 1, 384, 1)

    with torch.no_grad():
        output = model(embedding_tensor)
        probs = torch.softmax(output, dim=1)
        predicted_class = torch.argmax(probs, dim=1).item()
        confidence = probs[0, predicted_class].item()
    prediction = "positive" if predicted_class == 1 else "negative"
    
    return prediction, confidence


