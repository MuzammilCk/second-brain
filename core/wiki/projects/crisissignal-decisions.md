# CrisisSignal Decision Log

Decision journal and architectural audit trail for the CrisisSignal project.

## 2026-07-12 — DR-CS-01: Anomaly-Based Autoencoder Schema
**Context:** Standard supervised learning maps require labeled dataset records for target crises, which are scarce, subjective, highly imbalanced, and carry validation issues.
**Decision:** Implemented an unsupervised anomaly detection mapping utilizing an LSTM Autoencoder configuration. The model is trained purely on normal/baseline behavioral data to learn reconstruction representations; high reconstruction error is flagged as a crisis anomaly.
**Alternatives considered:** Supervised Multi-Layer Perceptrons (MLPs) or Random Forests (rejected due to severe class imbalance issues and target label volatility).
**Status:** active

## 2026-07-20 — DR-CS-02: Privacy-Preserving Federated Learning Core
**Context:** Centralizing raw behavioral indicators (such as location trails, text sequences, and sleep times) on cloud databases presents a severe student privacy risk.
**Decision:** Configured a decentralized model using Flower (`flwr`) to coordinate weights updates. All inference and behavioral analysis occur locally on the student's device, and only model parameters are sent to the coordination server.
**Alternatives considered:** Centralized SQL storage with database encryption (rejected; still vulnerable to admin leakage and subpoena risk).
**Status:** active
