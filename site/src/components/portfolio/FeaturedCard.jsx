import React from 'react';
import './FeaturedCard.css';

export default function FeaturedCard({ project, onInspect }) {
  if (!project) return null;

  // Extract a concise summary from markdown or fallback
  const getSummary = (p) => {
    if (p.slug === 'odoo-hackathon') {
      return 'Full-duplex conversational voice agent integrating LiveKit WebRTC pipeline with local LLM fallback and sub-400ms end-to-end voice latency.';
    }
    if (p.slug === 'assetflow') {
      return 'Offline-first enterprise asset management platform with deterministic local-first sync, conflict-free state resolution, and multi-tenant isolation.';
    }
    if (p.slug === 'esg-audit-system') {
      return 'Zero-trust multiagent compliance audit engine with deterministic decision verification and cryptographic ledger attestation.';
    }
    if (p.slug === 'crisissignal') {
      return 'Federated on-device behavioral anomaly detection platform with privacy-preserving local ML inferences and zero raw data egress.';
    }

    const md = p.contentMd || p.body_markdown || '';
    const match = md.match(/## Problem\s*\n+([^\n#]+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
    const firstPara = md.split('\n\n').find((block) => block.trim() && !block.startsWith('#'));
    return firstPara ? firstPara.replace(/\n/g, ' ').trim() : 'Production software architecture and systems engineering project.';
  };

  const isHackathonFinalist = project.slug === 'odoo-hackathon' || project.slug === 'assetflow';
  const isShipped = project.status === 'shipped' || project.status === 'done';
  const summary = getSummary(project);

  return (
    <article className="featured-card" id={`featured-${project.slug}`}>
      <div className="featured-card__header">
        <div className="featured-card__meta">
          <span className="featured-card__year">{project.created?.slice(0, 4) || '2026'}</span>
          <span className="featured-card__divider">/</span>
          <span className="featured-card__category">Architecture Case Study</span>
        </div>
        {isHackathonFinalist ? (
          <span className="featured-card__badge featured-card__badge--accolade">
            <span className="featured-card__dot featured-card__dot--gold" />
            Grand Finale Finalist
          </span>
        ) : isShipped ? (
          <span className="featured-card__badge featured-card__badge--shipped">
            <span className="featured-card__dot featured-card__dot--green" />
            Production Shipped
          </span>
        ) : (
          <span className="featured-card__badge">
            <span className="featured-card__dot featured-card__dot--zinc" />
            Active Engineering
          </span>
        )}
      </div>

      <div className="featured-card__content">
        <h3 className="featured-card__title">{project.title}</h3>
        <p className="featured-card__summary">{summary}</p>
      </div>

      <div className="featured-card__specs">
        <div className="featured-card__tags">
          {(project.stack || []).slice(0, 5).map((tech, i) => (
            <span key={i} className="featured-card__tag">
              {tech}
            </span>
          ))}
          {project.decisionCount > 0 && (
            <span className="featured-card__tag featured-card__tag--adr">
              {project.decisionCount} {project.decisionCount === 1 ? 'ADR' : 'ADRs'}
            </span>
          )}
        </div>
      </div>

      <div className="featured-card__footer">
        <button
          type="button"
          className="featured-card__btn-primary"
          onClick={() => onInspect(project)}
          aria-label={`Read case study for ${project.title}`}
        >
          <span>Read Case Study</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {project.repo_reference && (
          <a
            href={project.repo_reference}
            target="_blank"
            rel="noopener noreferrer"
            className="featured-card__btn-secondary"
            aria-label={`View ${project.title} source code on GitHub`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
            {project.stars > 0 && <span className="featured-card__stars">★ {project.stars}</span>}
          </a>
        )}
      </div>
    </article>
  );
}
