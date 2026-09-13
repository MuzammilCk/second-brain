import { useState } from 'react';
import { Link } from 'react-router-dom';
import conceptsData from '../../data/generated/concepts.json';
import './ThinkingLab.css';

const PIPELINE_STAGES = [
  {
    id: 'audio',
    name: '01. Audio Extraction',
    tech: 'FFmpeg + Whisper',
    input: 'Raw MP4 Video Stream',
    output: 'Timestamped Word Segments',
    desc: 'Extracts 16kHz mono audio track, performs voice activity detection, and streams phonetic transcription.'
  },
  {
    id: 'keyframes',
    name: '02. Keyframe Sampling',
    tech: 'OpenCV + SSIM',
    input: '1080p Video Buffer',
    output: 'De-duplicated Slide Frames',
    desc: 'Computes Structural Similarity Index (SSIM) between consecutive frames to discard duplicate slide transitions.'
  },
  {
    id: 'ocr',
    name: '03. Visual OCR Parsing',
    tech: 'EasyOCR + Tesseract',
    input: 'De-duplicated Frames',
    output: 'Bounding Box Text Regions',
    desc: 'Performs OCR across on-screen code editors, diagram labels, and slides with bounding box coordinates.'
  },
  {
    id: 'fusion',
    name: '04. Cross-Modal Fusion',
    tech: 'Temporal Alignment Core',
    input: 'Audio Tokens + OCR Tokens',
    output: 'Synchronized Knowledge Graph',
    desc: 'Aligns what was spoken with what was visually displayed on screen at each exact millisecond mark.'
  }
];

export default function ThinkingLab() {
  const [activeStage, setActiveStage] = useState(PIPELINE_STAGES[0]);

  // Curate 3 atomic concepts from conceptsData
  const curatedConcepts = (conceptsData || []).slice(0, 3);

  return (
    <section className="thinking-lab" aria-label="Thinking lab, playground experiments, and atomic concepts">
      <div className="section-label">
        <span>04 / THE THINKING LAB : EXPERIMENTS & ATOMIC CONCEPTS</span>
        <span className="section-count">SANDBOX & GARDEN</span>
      </div>

      <div className="thinking-lab__grid">
        {/* Interactive Experiment: ytclfr Video Intelligence */}
        <div className="lab-card lab-card--experiment">
          <div className="lab-card__header">
            <span className="lab-badge">ACTIVE EXPERIMENT / ROOM 04</span>
            <Link to="/playground" className="lab-link">
              Interactive Playground →
            </Link>
          </div>

          <h3 className="lab-title">ytclfr: Staged Video-Intelligence Pipeline</h3>
          <p className="lab-desc">
            Processing video tutorials into clean structured markdown notes without relying on naive cloud video multimodal APIs.
          </p>

          <div className="pipeline-chips">
            {PIPELINE_STAGES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`pipeline-chip ${activeStage.id === s.id ? 'pipeline-chip--active' : ''}`}
                onClick={() => setActiveStage(s)}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="pipeline-inspector">
            <div className="inspector-row">
              <span className="inspector-label">ENGINE</span>
              <span className="inspector-val">{activeStage.tech}</span>
            </div>
            <div className="inspector-row">
              <span className="inspector-label">INPUT / OUTPUT</span>
              <span className="inspector-val">{activeStage.input} → {activeStage.output}</span>
            </div>
            <p className="inspector-desc">{activeStage.desc}</p>
          </div>
        </div>

        {/* Conceptual Garden Notes */}
        <div className="lab-card lab-card--concepts">
          <div className="lab-card__header">
            <span className="lab-badge">DIGITAL GARDEN / KNOWLEDGE ATOMS</span>
            <Link to="/garden" className="lab-link">
              Open Vault Garden →
            </Link>
          </div>

          <h3 className="lab-title">Core Mental Models & Concepts</h3>
          <p className="lab-desc">
            Atomic technical notes distilled from daily research, architecture patterns, and systems papers.
          </p>

          <div className="concepts-stream">
            {curatedConcepts.map((concept) => (
              <Link
                key={concept.slug || concept.id}
                to={`/garden/${concept.slug || concept.id}`}
                className="concept-entry"
              >
                <div className="concept-entry__head">
                  <span className="concept-category">{concept.category || 'CONCEPT'}</span>
                  <span className="concept-arrow">↗</span>
                </div>
                <h4 className="concept-title">{concept.title}</h4>
                <p className="concept-excerpt">
                  {concept.description || concept.body_markdown?.slice(0, 100) || 'Systems architecture conceptual model.'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
