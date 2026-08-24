import { useState } from 'react';
import { motion } from 'framer-motion';
import './Playground.css';

const STAGES = [
  {
    id: 'stage-a',
    label: 'Stage A',
    title: 'Signal Census',
    color: '#06d6f0',
    desc: 'Inspects media metadata and stream contents to output a Signal Manifest — detecting speech, music, text overlays, scene counts, and subtitles.',
    details: ['Audio classification (speech/music/silent)', 'OCR overlay detection', 'Temporal cut counting', 'Aspect ratio & container analysis']
  },
  {
    id: 'stage-b',
    label: 'Stage B',
    title: 'Targeted Extraction',
    color: '#8b5cf6',
    desc: 'Selectively runs expensive extractors based on Stage A manifest. Only activates what\'s needed.',
    details: ['faster-whisper (ASR) — only if speech detected', 'PaddleOCR — only if text overlays found', 'Frame sampler — only if visual analysis needed']
  },
  {
    id: 'stage-c',
    label: 'Stage C',
    title: 'Evidence Fusion',
    color: '#d946ef',
    desc: 'Merges all extracted events into a unified queryable evidence log, resolving temporal overlaps.',
    details: ['Multi-sensor timeline alignment', 'Spoken ↔ visual text correlation', 'Confidence scoring', 'Deduplication']
  },
  {
    id: 'stage-d',
    label: 'Stage D',
    title: 'Taxonomy & Intent',
    color: '#34d399',
    desc: 'Triggers structured LLM queries for final categories, user intents, and domain-specific schemas.',
    details: ['Category classification', 'Structured data extraction', 'Playlist/recipe/product mapping', 'JSON schema output']
  }
];

function PipelineVisualizer() {
  const [activeStage, setActiveStage] = useState(null);

  return (
    <div className="pipeline" id="pipeline-visualizer">
      <h3 className="playground-demo__title">
        <span className="gradient-text">ytclfr</span> Video Intelligence Pipeline
      </h3>
      <p className="playground-demo__desc">
        Click any stage to explore how raw video URLs become structured, queryable data.
      </p>

      <div className="pipeline__stages">
        {STAGES.map((stage, i) => (
          <div key={stage.id} className="pipeline__stage-wrapper">
            <motion.button
              className={`pipeline__stage ${activeStage === stage.id ? 'pipeline__stage--active' : ''}`}
              style={{ '--stage-color': stage.color }}
              onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              id={stage.id}
            >
              <span className="pipeline__stage-label">{stage.label}</span>
              <span className="pipeline__stage-title">{stage.title}</span>
            </motion.button>
            {i < STAGES.length - 1 && (
              <div className="pipeline__connector">
                <svg width="40" height="20" viewBox="0 0 40 20">
                  <path d="M0 10 L30 10 L24 4 M30 10 L24 16" stroke="#5a5a78" strokeWidth="2" fill="none" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {activeStage && (
        <motion.div
          className="pipeline__detail glass-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeStage}
        >
          {(() => {
            const s = STAGES.find(x => x.id === activeStage);
            return (
              <>
                <h4 style={{ color: s.color }}>{s.title}</h4>
                <p>{s.desc}</p>
                <ul className="pipeline__detail-list">
                  {s.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}

function TerminalDemo() {
  const [lines, setLines] = useState([
    { type: 'cmd', text: '$ codex /briefing' },
    { type: 'info', text: '📅 2026-08-24 — Morning Briefing' },
    { type: 'out', text: '  Active projects: ytclfr, MetaTune, AI Invoice Studio' },
    { type: 'out', text: '  Focus areas: Placement prep, DSA, DevOps' },
    { type: 'out', text: '  Blockers: none' },
    { type: 'success', text: '✅ Briefing complete. Ready to build.' },
  ]);

  const commands = [
    {
      cmd: '$ codex /log "shipped Pipeline Stage A refactor"',
      output: [
        { type: 'info', text: '📝 Appending to wiki/log.md...' },
        { type: 'success', text: '✅ Entry logged: 2026-08-24 — shipped Pipeline Stage A refactor' },
      ]
    },
    {
      cmd: '$ codex /standup',
      output: [
        { type: 'info', text: '📊 Cross-project digest:' },
        { type: 'out', text: '  ytclfr: Stage A refactored (moved)' },
        { type: 'out', text: '  MetaTune: quiet for 5 days (⚠️)' },
        { type: 'out', text: '  Invoice Studio: Ollama migration in progress' },
        { type: 'success', text: '✅ 3 projects scanned.' },
      ]
    },
    {
      cmd: '$ codex /review wiki/concepts/automl',
      output: [
        { type: 'info', text: '🧠 Active recall quiz from automl.md:' },
        { type: 'out', text: '  Q1: What are the three meta-feature families in AutoML?' },
        { type: 'out', text: '  Q2: Why does Vizier use transfer learning across trials?' },
        { type: 'success', text: '✅ 5 questions generated. Type answers to check.' },
      ]
    }
  ];

  const runCommand = (cmdObj) => {
    setLines(prev => [
      ...prev,
      { type: 'cmd', text: cmdObj.cmd },
      ...cmdObj.output
    ]);
  };

  return (
    <div className="terminal-demo" id="terminal-demo">
      <h3 className="playground-demo__title">Vault Command Terminal</h3>
      <p className="playground-demo__desc">
        See how the Codex vault commands work — a simulated terminal showing real workflows.
      </p>

      <div className="glass-card terminal-container">
        <div className="terminal-header">
          <span className="terminal-dot terminal-dot--red" />
          <span className="terminal-dot terminal-dot--yellow" />
          <span className="terminal-dot terminal-dot--green" />
          <span className="terminal-title">codex — pwsh</span>
        </div>
        <div className="terminal-body terminal-scroll">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              className={`terminal-demo__line terminal-demo__line--${line.type}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              {line.text}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="terminal-actions">
        {commands.map((cmd, i) => (
          <button
            key={i}
            className="btn btn-ghost"
            onClick={() => runCommand(cmd)}
            id={`terminal-cmd-${i}`}
          >
            Run: {cmd.cmd.split('"')[0].replace('$ codex ', '/')}
          </button>
        ))}
        <button
          className="btn btn-ghost"
          onClick={() => setLines([{ type: 'cmd', text: '$ codex /briefing' }])}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default function Playground() {
  return (
    <div className="playground-page" id="playground-page">
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Experiments</span>
            <h1 className="section-title">Playground</h1>
            <p className="section-subtitle">
              Interactive demos and visualizations — click, explore, and see how things work under the hood.
            </p>
          </div>

          <div className="playground-demos">
            <PipelineVisualizer />
            <TerminalDemo />
          </div>
        </div>
      </section>
    </div>
  );
}
