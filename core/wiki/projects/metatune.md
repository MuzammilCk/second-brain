---
title: MetaTune AutoML Platform
type: project
status: active
export: "true"
repo_reference: https://github.com/MuzammilCk/metatune
last_verified: 2026-08-03
stack: Python, PyTorch, Streamlit, Google Vizier
sources:
  - raw/claude-exports/Integrating-Google-Vizier-with-MetaTune-hyperparameter-optim.md
  - raw/claude-exports/MetaTune-implementation-phases-and-validation.md
  - raw/claude-exports/conversations-memory.md
related: []
created: 2026-02-03
last-updated: 2026-08-03
---

# MetaTune AutoML Platform

AutoML platform that automates and adapts ML model hyperparameters dynamically based on dataset characteristics (meta-features) and real-time training behavior. Addresses the core limitation of grid/random search — computational exhaustion without dataset awareness.

## Problem

Grid search and random search evaluate hyperparameters without any knowledge of the dataset being trained on. They treat every dataset identically, leading to thousands of redundant evaluations. A meta-learning system that extracts dataset properties and uses them to predict good starting hyperparameters, then refines them using gradient feedback during training, can dramatically reduce the search space.

## Architecture

- **Meta-Feature Extraction**: Computes statistical descriptors of the training dataset: dimensionality bounds, noise indicators, feature dispersion, class imbalance ratios. These become input features for the meta-learner.
- **Neural Meta-Learner** (PyTorch): A neural network trained on prior (dataset, best-hyperparameters) pairs. Given a new dataset's meta-features, it predicts optimal initial hyperparameter values without any trial runs.
- **Bilevel Optimization**: The meta-learner's predictions are refined using gradient-based bilevel optimization during actual model training — inner loop updates model weights, outer loop updates hyperparameter estimates.
- **Google Vizier Backend**: For complex, high-dimensional search spaces, Vizier acts as a black-box optimization server. MetaTune submits trial suggestions to Vizier and reports evaluation results. Vizier's GP bandit and Pythia policies manage the search more efficiently than random sampling.
- **Streamlit Dashboard**: Visualizes meta-feature extraction results, tuning logs, and comparative model training trajectories across hyperparameter configurations.

## Constraints & Trade-offs

- **Vizier client/server overhead**: Vizier requires a running server. For small search spaces, the local meta-learner is faster. Vizier is invoked only for high-dimensional configuration spaces.
- **Meta-learner cold start**: Requires a pre-training corpus of (dataset, hyperparameter) pairs. Quality of initial predictions degrades outside the training distribution.
- **PyTorch bilevel optimization**: Bilevel optimization requires computing second-order gradients, which is memory-intensive. Approximation methods (first-order MAML-style) are used to keep memory bounded.

## Implementation Evidence

- Meta-feature extractor computing ~15 dataset statistics used as neural meta-learner inputs.
- PyTorch meta-learner trained on scikit-learn benchmark datasets.
- Bilevel optimization loop with first-order gradient approximation.
- Vizier client integrated for GP bandit and Pythia joint meta-feature-aware studies.
- Early stopping delegation to Vizier's adaptive stopping rules.
- Streamlit dashboard displaying feature extraction, tuning log replay, and trajectory comparison.

## Current State

Active development. Meta-learner and Vizier integration implemented and validated on benchmark datasets. Deployment as a usable CLI tool is the next milestone.

## Decisions

See the complete list of AutoML platform adjustments in [[metatune-decisions|MetaTune Decision Log]].

