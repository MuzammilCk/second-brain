---
id: "crisissignal"
title: CrisisSignal
type: project
status: active
export: "true"
repo_reference: https://github.com/MuzammilCk/crisissignal
last_verified: 2026-08-03
stack: Python 3.11, TensorFlow, Keras, TensorFlow Lite, Scikit-learn, SHAP, Pandas, NumPy, Streamlit, Kotlin, Android SDK, Flower
sources:
  - mirror/project-sync/Mental Health/context.md
related: []
created: 2026-07-10
last-updated: 2026-08-03
---

# CrisisSignal

Passive, on-device AI early-warning system for student mental health crises. Uses behavioral signals — GPS mobility, sleep patterns, typing variance, call statistics, social media activity — to detect anomalies 5–7 days before a crisis peaks. Built for the AI For Good 2026 competition (Connecting Dreams Foundation).

## Problem

Student mental health crises (depression, acute stress, suicidal ideation) often manifest in observable behavioral changes days before reaching a crisis point. Existing intervention systems are reactive — they respond after a crisis event rather than before. On-device passive monitoring can surface early warning signals without requiring students to self-report or interact with any application actively. Cost and privacy are non-negotiable constraints for deployment in college environments.

## Architecture

A four-stage on-device ML pipeline:

1. **Feature Extraction**: Processes behavioral sensor datasets (derived from Dartmouth StudentLife logs) into 30-day sliding window feature vectors: GPS mobility entropy, social engagement frequency, typing error variance, call drop frequency, and sleep disruption index.
2. **LSTM Autoencoder (Anomaly Detection)**: Trained exclusively on normal-behavior data (`train_lstm.py → baseline_lstm.h5`). Anomalies are detected as reconstruction errors exceeding a learned threshold, not as labeled crisis classifications.
3. **TFLite Quantization**: The trained model is quantized and exported (`export_tflite.py → crisissignal_v1.tflite`) for fast, native execution on low-cost Android devices without network round-trips.
4. **Dashboard**: Streamlit interface rendering 7-day risk trajectories. SHAP values explain which behavioral features contributed to each anomaly score, providing accountability to counselors.

**Federated Learning**: Global model improvement is coordinated via Flower (flwr). Devices communicate local gradient updates — not raw behavioral logs — to the central aggregator, preserving student privacy.

## Constraints & Trade-offs

- **On-device constraint**: All inference must run on-device (TFLite). No raw behavioral data may leave the phone. This rules out cloud-hosted models.
- **Anomaly detection, not classification**: The system cannot label a student as "in crisis." It detects behavioral deviation from that individual's baseline. A human counselor interprets the alert.
- **Federated training complexity**: Flower requires persistent connectivity between the aggregation server and student devices. In practice, training rounds are infrequent (weekly) to accommodate intermittent connectivity.
- **Dataset gap**: The Dartmouth StudentLife dataset is the primary training source, but it was collected in a US university context. Demographic drift may reduce accuracy for Indian college populations.

## Implementation Evidence

- LSTM Autoencoder trained on 5-feature 30-day windows from StudentLife dataset.
- TFLite model export with full integer quantization for CPU inference on low-end Android.
- SHAP explainability layer integrated into Streamlit dashboard outputs.
- Flower federated training round coordination tested with simulated clients.
- Android Kotlin app prototype for background sensor collection.

## Current State

Prototype built and submitted for AI For Good 2026. Core pipeline (feature extraction → anomaly detection → dashboard) functional. Federated training tested in simulation. Live deployment pending institutional partnership for real student data collection.

## Decisions

See the complete list of system designs and code changes in [[crisissignal-decisions|CrisisSignal Decision Log]].


