# MetaTune Decision Log

Decision journal and architectural audit trail for the MetaTune AutoML Platform project.

## 2026-02-03 — DR-MT-01: Adapting Meta-Learning and Bilevel Optimization
**Context:** Traditional hyperparameter optimization sweeps (grid/random search) are slow, expensive, and blind to specific meta-attributes (dataset size, feature distribution shape, noise) of the data being trained.
**Decision:** Selected a two-layered neural meta-learner built with PyTorch, coupled with bilevel gradient optimization, to dynamically map statistical dataset meta-features to starting hyperparameters.
**Alternatives considered:** Bayesian Optimization alone (avoided because it doesn't transfer knowledge representation across completely different dataset dimensions as efficiently as a meta-trained net).
**Status:** active

## 2026-02-03 — DR-MT-02: Google Vizier Black-Box Optimizer Integration
**Context:** Orchestrating complex parameter spaces, early stopping parameters, and custom study histories from scratch creates duplicate framework logic and lacks standard benchmark comparison.
**Decision:** Integrated Google Vizier's open-source server/client architecture as the backend optimizer engine, routing hyperparameter suggestions through Pythia policies.
**Alternatives considered:** Writing custom GP-bandit estimators (unnecessary work given Google Vizier's highly optimized, robust distributed architecture).
**Status:** active
