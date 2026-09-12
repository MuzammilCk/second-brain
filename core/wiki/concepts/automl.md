---
title: AutoML and Hyperparameter Optimization
type: concept
sources:
  - raw/claude-exports/Integrating-Google-Vizier-with-MetaTune-hyperparameter-optim.md
  - raw/claude-exports/MetaTune-implementation-phases-and-validation.md
related: []
created: 2026-02-03
last-updated: 2026-08-03
---

# AutoML and Hyperparameter Optimization

AutoML (Automated Machine Learning) refers to the process of automating the end-to-end lifecycle of deploying machine learning models, with hyperparameter optimization (HPO) standing as one of its most computationally intensive phases.

## Core Pillars of Dataset-Aware HPO

Rather than blindly performing brute-force parameters search (Grid/Random) or slowly converging Bayesian sweeps on each training run, adaptive HPO models reuse historical metadata configurations.

### 1. Dataset Meta-Features
- **Definition**: Statistical and structural properties that characterize the nature of a dataset, such as:
  - Dimensional proportions (number of samples $N$ vs features $D$).
  - Missing value densities.
  - Multi-class balance distributions.
  - Numeric kurtosis, skewness, and class correlation indices.
- **Application**: The AutoML engine maps these values to a vector space representational array, extracting feature embeddings representing "dataset similarity".

### 2. Neural Meta-Learners
- **Function**: Neural networks (often multi-layer perceptrons or meta-regressors) trained on historical optimization histories.
- **Task**: Takes dataset meta-features as inputs and outputs predicted score profiles or optimal starting configurations for hyperparameters (e.g. learning rate, batch size, weight decay).

### 3. Black-Box Optimization Platforms (e.g., Google Vizier)
- **Framework**: Distributed systems built to optimize black-box functions. Comprises a server orchestrating studies and a client executing evaluations.
- **Pythia Policies & Bandit Algorithms**: Advanced search configurations utilizing Gaussian Process (GP) regression, early stopping parameters (median stopping rule), and multi-armed bandit approaches to narrow search configurations in real-time.
- Used in the [[metatune|MetaTune]] project to scale parameter evaluations.
