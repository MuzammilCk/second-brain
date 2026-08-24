---
title: CrisisSignal
type: project
status: active
stack: Python 3.11, TensorFlow, Keras, TensorFlow Lite, Scikit-learn, SHAP, Pandas, NumPy, Streamlit, Kotlin, Android SDK, Flower
sources:
  - mirror/project-sync/Mental Health/context.md
related: []
created: 2026-07-10
last-updated: 2026-08-03
---

# CrisisSignal

CrisisSignal is a passive, on-device AI early-warning system developed for student mental health crises. The system uses behavioral indicators (gps data, sleep patterns, typing, call stats, and social media activity) to flag behavioral anomalies 5–7 days before a crisis peaks.

Constructed for the **AI For Good 2026** competition (helmed by the Connecting Dreams Foundation), the prototype aims to provide a proactive, cost-free, and privacy-first student wellness system.

## System Architecture

### Processing Pipeline
1. **Feature Extraction**: Takes datasets (built on the Dartmouth StudentLife logs) and processes them (`preprocess.py`) into 30-day sliding windows containing 5 crucial features: GPS mobility, social engagement, typing error variance, call drop frequency, and sleep disruption.
2. **LSTM Autoencoder Model**: An anomaly detection baseline (`train_lstm.py` generating `baseline_lstm.h5`) trained exclusively on data representing normal behavior.
3. **Android Quantization (TFLite)**: Quantized neural maps (`export_tflite.py` creating `crisissignal_v1.tflite`) ensuring fast, native execution on low-cost smartphones without network latency.
4. **Anonymized Action Dashboard**: Streamlit interface rendering 7-day risk trajectories, explaining outputs using SHAP values for accountability.

## Privacy Model
CrisisSignal runs user behavior inference strictly on-device to protect student identities. Global model training is coordinated utilizing **Flower (flwr)**, a federated learning framework that communicates localized gradient data rather than raw user logs.

## Historical Decisions & Pivots
See the complete list of system designs and code changes in [[crisissignal-decisions|CrisisSignal Decision Log]].
