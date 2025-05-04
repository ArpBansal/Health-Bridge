This folder contains the training notebook.

training/histopath_cancer_training.ipynb contains model training code: training on Multi-GPU distributed.

It handles distributed Training. Training Self-Supervised classification head with SygResNet as backbone.

training/histopath-cancer-preprocess.ipynb contains preprocessing code for dataset.

It created (384,) dimension embeddings using google/path-foundation.