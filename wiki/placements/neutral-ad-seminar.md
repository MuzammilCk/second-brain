# NeuTraL AD Seminar Presentation

NeuTraL AD (Self-Supervised Anomaly Detection with Neural Transformations) is a machine learning paper published in IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI) 2025. Muzammil Ck is preparing for his 2nd academic approval seminar on this paper.

## Core Paper Concepts

- **Task**: Anomaly detection (identifying weird or outlier patterns in multi-dimensional datasets without labeled negative examples).
- **Core Method**: Self-supervised learning. The model trains by creating artificial dataset transformations (augmentations) and learning to identify which transformations were applied to the input samples.
- **Neural Transformations**: Utilizes parameter-dependent neural architectures (Transformations) rather than static geometric transformations (like crop/rotate in computer vision) to scale anomaly detection to complex, multi-variate tabular and time-series data.
- **Loss Function**: Formulated using contrastive learning bounds (NCE) that force anomalous samples to score low on learned representation vectors.

## Prep Status and Artifacts
- **Audit state**: Preparations include detailed presentation slide scripts and math proof cheat sheets.
- **Presenter**: [[wiki/people/muzammil-ck|Muzammil Ck]].

## Sources
- `raw/claude-exports/conversations-memory.md`
