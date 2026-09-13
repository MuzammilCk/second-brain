import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ArchitecturalPivots.css';

const TURNING_POINTS = [
  {
    id: 'assetflow-gist',
    slug: 'assetflow',
    date: '2026-08-03',
    project: 'AssetFlow',
    title: 'Relational Concurrency Locks Over Application Memory',
    context: 'During the 8-hour Odoo Hackathon sprint, organizations managing physical assets faced catastrophic double-booking race conditions.',
    initial: 'Application-layer JavaScript array filtering checking overlapping timestamps in memory before dispatching bookings.',
    failure: 'Concurrent simulated requests arrived in parallel, passing the in-memory checks simultaneously and silently double-allocating physical gear.',
    constraint: 'Node.js single-threaded event loop cannot atomically guarantee distributed reservation state without database locks.',
    pivot: 'Moved interval intersection checks directly into PostgreSQL transactions using btree_gist exclusion constraints (EXCLUDE USING gist with tsrange).',
    invariant: 'Database engine rejects overlapping reservations at the storage layer. Application code never mediates reservation concurrency.',
    beforeSnippet: '// FLAGGED: Race Condition\nconst conflict = bookings.find(b => b.start < newEnd && b.end > newStart);\nif (!conflict) await db.booking.create(...);',
    afterSnippet: '-- INVARIANT: Postgres GiST Exclusion\nALTER TABLE "Booking" ADD CONSTRAINT "no_double_book"\nEXCLUDE USING gist (asset_id WITH =, time_range WITH &&);'
  },
  {
    id: 'metatune-webrtc',
    slug: 'metatune',
    date: '2026-05-18',
    project: 'MetaTune',
    title: 'UDP WebRTC Media Tracks Over WebSocket TCP Streaming',
    context: 'Building a full-duplex conversational voice agent where human natural interruption requires sub-400ms end-to-end latency.',
    initial: 'Streaming raw PCM audio chunks over a single bidirectional WebSocket connection.',
    failure: 'Under real-world 4G network jitter, TCP head-of-line blocking stalled audio frames, ballooning conversation latency to over 850ms.',
    constraint: 'TCP guarantees packet delivery order by pausing the stream until dropped packets retransmit — fatal for conversational audio.',
    pivot: 'Replaced WebSocket audio transport with LiveKit WebRTC media tracks running over UDP, coupled with client-side VAD barge-in under 14ms.',
    invariant: 'Voice media packets are time-sensitive and loss-tolerant: UDP transport guarantees sub-400ms flow over cellular networks.',
    beforeSnippet: '// FLAGGED: Head-of-line blocking\nws.send(audioChunk); // TCP stalls on packet drop',
    afterSnippet: '// INVARIANT: WebRTC UDP Track\npeerConnection.addTrack(audioMediaStreamTrack);\n// sub-14ms client-side VAD barge-in'
  },
  {
    id: 'crisissignal-federated',
    slug: 'crisissignal',
    date: '2026-07-20',
    project: 'CrisisSignal',
    title: 'Zero-Egress Federated Training Over Centralized Storage',
    context: 'Predicting adolescent mental health emergencies through passive typing cadence and behavioral mobility variance.',
    initial: 'Encrypted cloud SQL database collecting mobility trails, keystroke dynamics, and sleep schedules.',
    failure: 'Institutional legal review and student trial participants universally rejected the platform over catastrophic location privacy risks.',
    constraint: 'No level of cloud encryption satisfies HIPAA/institutional governance when collecting continuous raw student mobility telemetry.',
    pivot: 'Scrapped cloud storage completely. Rebuilt as an on-device 8.4MB quantized PyTorch LSTM autoencoder with Flower (flwr) federated aggregation.',
    invariant: 'Zero raw behavioral telemetry ever leaves the student phone. Only gradient updates communicate with the aggregation coordinator.',
    beforeSnippet: '// FLAGGED: Centralized Telemetry\nPOST /api/telemetry/mobility { coords: [...], keystrokes: [...] }',
    afterSnippet: '// INVARIANT: Local On-Device Inference\nval anomalyScore = tfliteAutoencoder.reconstruct(localBuffer)\n// Only model weights sent in Flower round'
  },
  {
    id: 'ytclfr-lifecycle',
    slug: 'ytclfr',
    date: '2026-02-28',
    project: 'ytclfr',
    title: 'Stack-Local Event Loops Over Subprocess Asyncio Runs',
    context: 'Orchestrating multi-stage video extraction (Whisper, PaddleOCR, Scene Detection) via Celery workers on a Windows ThinkPad L13 host.',
    initial: 'Calling asyncio.run() inside Celery task wrappers to execute asynchronous media probes and scraping pipelines.',
    failure: 'Celery worker sub-processes on Windows Python 3.13 threw Event loop is closed deadlocks and crashed concurrent worker threads.',
    constraint: 'Windows default ProactorEventLoop has lifecycle constraints when invoked inside daemon worker processes spawned by Celery.',
    pivot: 'Implemented custom loop lifecycle management using asyncio.new_event_loop() with stack-local helper context and pinned amqp==5.2.0.',
    invariant: 'Asynchronous workers on Windows must explicitly own and close their event loop lifecycle per task execution.',
    beforeSnippet: '# FLAGGED: Windows Celery Deadlock\ndef run_probe():\n    return asyncio.run(fetch_metadata())',
    afterSnippet: '# INVARIANT: Explicit Loop Lifecycle\nloop = asyncio.new_event_loop()\nasyncio.set_event_loop(loop)\ntry: return loop.run_until_complete(...)\nfinally: loop.close()'
  }
];

export default function ArchitecturalPivots() {
  const [selectedId, setSelectedId] = useState(TURNING_POINTS[0].id);
  const [activeTab, setActiveTab] = useState('narrative'); // 'narrative' | 'code'

  const activeStory = TURNING_POINTS.find((s) => s.id === selectedId) || TURNING_POINTS[0];

  return (
    <section className="architectural-pivots" id="evolution" aria-label="Engineering evolution and architectural turning points">
      {/* ── Section Header ── */}
      <div className="architectural-pivots__header">
        <div>
          <div className="architectural-pivots__pill">
            04 // THE FORGE : FAILURES & INVARIANTS
          </div>
          <h2 className="architectural-pivots__title">
            Failure is not an anomaly. It is the teacher.
          </h2>
          <p className="architectural-pivots__subtitle">
            What I tried, why it broke under real-world pressure, and the permanent architectural invariants that came out of the fire.
          </p>
        </div>

        <div className="architectural-pivots__selector-pills" role="tablist" aria-label="Select turning point">
          {TURNING_POINTS.map((story) => (
            <button
              key={story.id}
              type="button"
              className={`architectural-pivots__selector-btn ${
                selectedId === story.id ? 'architectural-pivots__selector-btn--active' : ''
              }`}
              onClick={() => setSelectedId(story.id)}
              role="tab"
              aria-selected={selectedId === story.id}
            >
              <span>{story.project}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Active Story Card ── */}
      <div className="architectural-pivots__stage">
        {/* Story Top Metadata */}
        <div className="architectural-pivots__stage-top">
          <div className="architectural-pivots__meta">
            <span className="architectural-pivots__date">{activeStory.date}</span>
            <span className="architectural-pivots__project-badge">{activeStory.project}</span>
            <span className="architectural-pivots__sep">/</span>
            <span className="architectural-pivots__status">VERIFIED IN PRODUCTION</span>
          </div>

          <div className="architectural-pivots__view-toggle">
            <button
              type="button"
              className={`architectural-pivots__view-btn ${activeTab === 'narrative' ? 'architectural-pivots__view-btn--active' : ''}`}
              onClick={() => setActiveTab('narrative')}
            >
              4-Step Narrative
            </button>
            <button
              type="button"
              className={`architectural-pivots__view-btn ${activeTab === 'code' ? 'architectural-pivots__view-btn--active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              Before & After Code
            </button>
          </div>
        </div>

        <h3 className="architectural-pivots__headline">
          {activeStory.title}
        </h3>

        <p className="architectural-pivots__context">
          <strong>The Context:</strong> {activeStory.context}
        </p>

        {activeTab === 'narrative' ? (
          /* ── 4-Stage Narrative Stepper ── */
          <div className="architectural-pivots__stepper">
            {/* Step 1: Initial Approach */}
            <div className="architectural-pivots__step">
              <div className="architectural-pivots__step-badge architectural-pivots__step-badge--initial">
                01. WHAT I TRIED
              </div>
              <p className="architectural-pivots__step-text">{activeStory.initial}</p>
            </div>

            <div className="architectural-pivots__arrow" aria-hidden="true">→</div>

            {/* Step 2: What Broke */}
            <div className="architectural-pivots__step architectural-pivots__step--failure">
              <div className="architectural-pivots__step-badge architectural-pivots__step-badge--failure">
                02. WHY IT BROKE
              </div>
              <p className="architectural-pivots__step-text">{activeStory.failure}</p>
            </div>

            <div className="architectural-pivots__arrow" aria-hidden="true">→</div>

            {/* Step 3: Hard Constraint */}
            <div className="architectural-pivots__step architectural-pivots__step--constraint">
              <div className="architectural-pivots__step-badge architectural-pivots__step-badge--constraint">
                03. HARD CONSTRAINT
              </div>
              <p className="architectural-pivots__step-text">{activeStory.constraint}</p>
            </div>

            <div className="architectural-pivots__arrow" aria-hidden="true">→</div>

            {/* Step 4: The Invariant */}
            <div className="architectural-pivots__step architectural-pivots__step--invariant">
              <div className="architectural-pivots__step-badge architectural-pivots__step-badge--invariant">
                04. THE INVARIANT
              </div>
              <p className="architectural-pivots__step-text architectural-pivots__step-text--highlight">
                {activeStory.invariant}
              </p>
            </div>
          </div>
        ) : (
          /* ── Code Comparison View ── */
          <div className="architectural-pivots__code-grid">
            <div className="architectural-pivots__code-box architectural-pivots__code-box--before">
              <div className="architectural-pivots__code-header">
                <span className="material-symbols-outlined">close</span>
                <span>BEFORE: THE FAILED ATTEMPT</span>
              </div>
              <pre className="architectural-pivots__code-pre">
                <code>{activeStory.beforeSnippet}</code>
              </pre>
            </div>

            <div className="architectural-pivots__code-box architectural-pivots__code-box--after">
              <div className="architectural-pivots__code-header">
                <span className="material-symbols-outlined">check</span>
                <span>AFTER: THE HARDENED INVARIANT</span>
              </div>
              <pre className="architectural-pivots__code-pre">
                <code>{activeStory.afterSnippet}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Story Footer Door Link */}
        <div className="architectural-pivots__stage-footer">
          <Link to={`/projects/${activeStory.slug}`} className="architectural-pivots__story-link">
            <span>Read full {activeStory.project} architecture case study</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
