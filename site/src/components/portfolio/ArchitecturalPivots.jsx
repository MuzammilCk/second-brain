import { useState } from 'react';
import './ArchitecturalPivots.css';

const PIVOT_STORIES = [
  {
    id: 'assetflow-concurrency',
    date: '2026-08-03',
    project: 'AssetFlow',
    title: 'Relational Concurrency Locks Over Application Code',
    initial: 'Application-layer JavaScript array filtering to check conflicting equipment booking time slots.',
    constraint: 'Concurrent requests produced race conditions, causing silent double-allocations during peak demo simulations.',
    pivot: 'Moved conflict detection into PostgreSQL transaction exclusion locks (EXCLUDE USING gist) via Prisma.',
    invariant: 'Database guarantees relational integrity. Application code never mediates overlapping time reservations.'
  },
  {
    id: 'crisissignal-federated',
    date: '2026-07-20',
    project: 'CrisisSignal',
    title: 'Zero-Egress Federated Training Over Centralized Warehouses',
    initial: 'Encrypted cloud SQL database centralizing GPS mobility trails, typing entropy, and sleep variance.',
    constraint: 'Institutional legal liability and complete student refusal to adopt centralized behavioral tracking.',
    pivot: 'Replaced backend storage with on-device TFLite LSTM autoencoder and Flower (flwr) federated aggregation.',
    invariant: 'Zero raw behavioral telemetry ever leaves the student phone. Only gradient weights are communicated.'
  },
  {
    id: 'repomind-ast-parser',
    date: '2026-07-25',
    project: 'RepoMind',
    title: 'Syntactic AST Boundary Chunking Over Fixed Token Offsets',
    initial: 'Fixed 500-token chunk windows with 50-token overlaps across multi-file source codebases.',
    constraint: 'Arbitrary chunk splits sliced methods in half, yielding broken syntactic ASTs and degraded RAG retrieval.',
    pivot: 'Replaced regex chunking with Tree-sitter AST parser extracting complete class and method boundaries.',
    invariant: 'Code embeddings must preserve syntactically valid grammar constructs.'
  }
];

export default function ArchitecturalPivots() {
  const [selectedPivot, setSelectedPivot] = useState(PIVOT_STORIES[0].id);

  return (
    <section className="architectural-pivots" aria-label="Engineering evolution and architectural turning points">
      <div className="section-label">
        <span>03 / ARCHITECTURAL EVOLUTION : CRUCIAL TURNING POINTS</span>
        <span className="section-count">3 ARCHITECTURAL DECISIONS</span>
      </div>

      <div className="pivots-container">
        {PIVOT_STORIES.map((story) => {
          const isSelected = selectedPivot === story.id;
          return (
            <div
              key={story.id}
              className={`pivot-card ${isSelected ? 'pivot-card--active' : ''}`}
              onClick={() => setSelectedPivot(story.id)}
            >
              <div className="pivot-card__header">
                <div className="pivot-card__meta">
                  <span className="pivot-date">{story.date}</span>
                  <span className="pivot-project-tag">{story.project}</span>
                </div>
                <h4 className="pivot-title">{story.title}</h4>
              </div>

              {/* 4-Step Narrative Progression */}
              <div className="pivot-stepper">
                <div className="pivot-step">
                  <div className="step-badge step-badge--initial">01. INITIAL APPROACH</div>
                  <p className="step-text">{story.initial}</p>
                </div>

                <div className="pivot-arrow">↓</div>

                <div className="pivot-step">
                  <div className="step-badge step-badge--constraint">02. CONSTRAINT DISCOVERED</div>
                  <p className="step-text">{story.constraint}</p>
                </div>

                <div className="pivot-arrow">↓</div>

                <div className="pivot-step">
                  <div className="step-badge step-badge--pivot">03. ARCHITECTURE CHANGED</div>
                  <p className="step-text">{story.pivot}</p>
                </div>

                <div className="pivot-arrow">↓</div>

                <div className="pivot-step">
                  <div className="step-badge step-badge--invariant">04. INVARIANT ACCEPTED</div>
                  <p className="step-text step-text--highlight">{story.invariant}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
