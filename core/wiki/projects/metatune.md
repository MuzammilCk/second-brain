---
title: MetaTune AutoML Platform
type: project
status: active
stack: Python, PyTorch, Streamlit, Google Vizier
sources:
  - raw/claude-exports/Integrating-Google-Vizier-with-MetaTune-hyperparameter-optim.md
  - raw/claude-exports/MetaTune-implementation-phases-and-validation.md
  - raw/claude-exports/conversations-memory.md
related: []
created: 2026-02-03
last-updated: 2026-08-03
---

# MetaTune (AI-Driven Dataset-Aware Hyperparameter Optimization)

`MetaTune` is an AutoML platform designed to automate and adapt ML model hyperparameters dynamically based on dataset characteristics (meta-features) and real-time training behaviour.

## System Architecture

- **Traditional Limitation**: Methods like grid search or random search are computationally exhaustive and do not adjust to changing statistics in datasets.
- **Adaptive Meta-Learning**: `MetaTune` extracts statistical meta-features (dimension boundaries, noise indicators, feature dispersion, target ratios) and feeds them into a PyTorch *neural meta-learner*.
- **Gradient-Based Optimization**: The meta-learner predicts optimal initial hyperparameter values and executes bilevel optimizations based on gradient feedback during model training cycles.
- **Frontend Console**: A Streamlit dashboard allowing users to visualize dataset feature extractions, view tuning logs, and compare model training trajectories.

## Google Vizier Integration

To escalate the system's performance, `MetaTune` integrates Google's black-box optimization framework (Vizier) as a backend service:
- Uses Vizier client/server architectures to manage complex search space dimensions.
- Composes joint meta-feature-aware studies, matching baseline estimators against GP (Gaussian Process) bandits and Pythia policies.
- Accelerates early stopping triggers by delegating evaluations to Vizier's adaptive stopping rules.

## Historical Decisions & Pivots
See the complete list of AutoML platform adjustments in [[metatune-decisions|MetaTune Decision Log]].
