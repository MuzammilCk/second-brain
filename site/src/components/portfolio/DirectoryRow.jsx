import React from 'react';
import './DirectoryRow.css';

export default function DirectoryRow({ project, onInspect }) {
  if (!project) return null;

  // Derive a short 1-sentence technical pitch
  const getPitch = (p) => {
    if (p.slug === 'crisissignal') return 'On-device behavioral anomaly detection with local ML & zero raw egress.';
    if (p.slug === 'hadi') return 'High-concurrency tree-based commission and payout calculation engine.';
    if (p.slug === 'fitness-platform') return 'Type-safe monorepo platform with zero runtime schema drift.';
    if (p.slug === 'repomind') return 'Fast semantic codebase indexing with AST extraction and query synthesis.';
    if (p.slug === 'ytclfr') return 'Distributed video intelligence extraction pipeline with background workers.';
    if (p.slug === 'metatune') return 'AutoML hyperparameter optimization platform with real-time trial tracking.';
    if (p.slug === 'invoice-studio') return 'Client-side invoice generation engine with structured data export.';
    if (p.slug === 'masm-studio') return 'Browser-based 8086 assembly simulator and interactive memory visualizer.';
    if (p.slug === 'healthsync') return 'Clinical health tracking suite with strict client-side privacy controls.';
    if (p.slug === 'realme') return 'Interactive 3D WebGL portfolio workspace with physics-based shaders.';
    if (p.slug === 'viva') return 'Corporate portal platform built on Next.js App Router architecture.';
    if (p.slug === 'esg-audit-system') return 'Zero-trust multiagent compliance audit engine with cryptographic ledger.';
    if (p.slug === 'odoo-hackathon') return 'Full-duplex conversational voice agent with sub-400ms end-to-end latency.';
    if (p.slug === 'assetflow') return 'Offline-first ERP asset manager with double-allocation prevention.';

    const md = p.contentMd || p.body_markdown || '';
    const match = md.match(/## Problem\s*\n+([^\n#]+)/);
    if (match && match[1]) {
      return match[1].slice(0, 85) + (match[1].length > 85 ? '...' : '');
    }
    return 'Production systems engineering and software architecture project.';
  };

  const isShipped = project.status === 'shipped' || project.status === 'done';
  const pitch = getPitch(project);

  return (
    <div className="directory-row" id={`directory-${project.slug}`}>
      <div className="directory-row__main">
        <div className="directory-row__title-wrap">
          <span className={`directory-row__status-dot ${isShipped ? 'directory-row__status-dot--green' : 'directory-row__status-dot--zinc'}`} />
          <h4 className="directory-row__title">{project.title}</h4>
          <span className="directory-row__status-label">{isShipped ? 'Shipped' : 'Active'}</span>
        </div>
        <p className="directory-row__pitch">{pitch}</p>
      </div>

      <div className="directory-row__stack">
        {(project.stack || []).slice(0, 3).map((tech, i) => (
          <span key={i} className="directory-row__tech-pill">
            {tech}
          </span>
        ))}
      </div>

      <div className="directory-row__actions">
        {project.repo_reference && (
          <a
            href={project.repo_reference}
            target="_blank"
            rel="noopener noreferrer"
            className="directory-row__link"
            aria-label={`View ${project.title} on GitHub`}
          >
            <span>GitHub</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
        <button
          type="button"
          className="directory-row__inspect-btn"
          onClick={() => onInspect(project)}
          aria-label={`Inspect case study for ${project.title}`}
        >
          <span>Inspect</span>
        </button>
      </div>
    </div>
  );
}
