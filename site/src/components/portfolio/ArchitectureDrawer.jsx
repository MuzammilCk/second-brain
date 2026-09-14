import React, { useEffect, useRef } from 'react';
import { tactileAudio } from '../../utils/tactileAudio';
import './ArchitectureDrawer.css';

export default function ArchitectureDrawer({ project, onClose }) {
  const drawerRef = useRef(null);

  // Play mechanical clunk on drawer open
  useEffect(() => {
    tactileAudio.playSwitchClunk(true);
  }, []);

  const handleClose = () => {
    tactileAudio.playSwitchClunk(false);
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent background scrolling while drawer is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Focus trap / initial focus
  useEffect(() => {
    drawerRef.current?.focus();
  }, []);

  if (!project) return null;

  // Parse structured markdown sections
  const parseSections = (md = '') => {
    const sections = {};
    const lines = md.split('\n');
    let currentHeader = 'intro';
    let buffer = [];

    for (const line of lines) {
      const match = line.match(/^##\s+(.+)/);
      if (match) {
        if (currentHeader) {
          sections[currentHeader] = buffer.join('\n').trim();
        }
        currentHeader = match[1].trim().toLowerCase();
        buffer = [];
      } else {
        buffer.push(line);
      }
    }
    if (currentHeader) {
      sections[currentHeader] = buffer.join('\n').trim();
    }
    return sections;
  };

  const sections = parseSections(project.contentMd || project.body_markdown || '');
  const isShipped = project.status === 'shipped' || project.status === 'done';
  const isFinalist = project.slug === 'odoo-hackathon' || project.slug === 'assetflow';
  const decisions = project.decisions || [];

  // Format inline markdown (bold and code spans)
  const formatInline = (str = '') => {
    const parts = str.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="case-study-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="case-study-code">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  // Helper to render markdown text paragraphs and bullet lists
  const renderFormattedText = (text = '') => {
    if (!text) return <p className="case-study-placeholder">Specification not documented for this section.</p>;
    const paragraphs = text.split(/\n\n+/);

    return paragraphs.map((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed
          .split(/\n[-*]\s+/)
          .map((s) => s.replace(/^[-*]\s+/, '').trim())
          .filter(Boolean);

        return (
          <ul key={idx} className="case-study-list">
            {items.map((item, i) => (
              <li key={i}>{formatInline(item)}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={idx} className="case-study-para">
          {formatInline(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="case-study-backdrop" onClick={handleClose} id="case-study-drawer-overlay">
      <aside
        ref={drawerRef}
        tabIndex={-1}
        className="case-study-drawer"
        id="case-study-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
      >
        {/* Drawer Header */}
        <div className="case-study-header">
          <div className="case-study-header__eyebrow-row">
            <span className="case-study-eyebrow">ENGINEERING CASE STUDY : ADR-LOG</span>
            <button
              type="button"
              className="case-study-close-btn"
              onClick={handleClose}
              aria-label="Close case study drawer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="case-study-header__badge-row">
            {isFinalist ? (
              <span className="case-study-badge case-study-badge--gold">
                <span className="case-study-dot case-study-dot--gold" />
                Grand Finale Finalist
              </span>
            ) : isShipped ? (
              <span className="case-study-badge case-study-badge--green">
                <span className="case-study-dot case-study-dot--green" />
                Production Architecture
              </span>
            ) : (
              <span className="case-study-badge case-study-badge--zinc">
                <span className="case-study-dot case-study-dot--zinc" />
                Active Engineering
              </span>
            )}

            {project.repo_reference && (
              <a
                href={project.repo_reference}
                target="_blank"
                rel="noopener noreferrer"
                className="case-study-repo-link"
              >
                <span>GitHub Repository</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>

          <h2 className="case-study-title" id="case-study-title">
            {project.title}
          </h2>

          <div className="case-study-meta-row">
            <span>Author: Muzammil CK</span>
            <span className="case-study-meta-divider">/</span>
            <span>Created: {project.created || '2026'}</span>
            <span className="case-study-meta-divider">/</span>
            <span>Verified: {project.last_verified || '2026-08-03'}</span>
          </div>
        </div>

        {/* Drawer Body / Documentation Content */}
        <div className="case-study-body">
          {/* Section 1: Problem Statement */}
          <section className="case-study-section">
            <h3 className="case-study-section-title">1. Problem Statement</h3>
            <div className="case-study-prose">
              {renderFormattedText(sections.problem || sections.intro)}
            </div>
          </section>

          {/* Section 2: Architecture & System Design */}
          <section className="case-study-section">
            <h3 className="case-study-section-title">2. Architecture & System Rationale</h3>
            <div className="case-study-prose">
              {renderFormattedText(sections.architecture)}
            </div>
          </section>

          {/* Section 3: Constraints & Trade-offs */}
          {sections['constraints & trade-offs'] && (
            <section className="case-study-section">
              <h3 className="case-study-section-title">3. Constraints & Trade-Offs</h3>
              <div className="case-study-prose">
                {renderFormattedText(sections['constraints & trade-offs'])}
              </div>
            </section>
          )}

          {/* Section 4: Implementation Evidence */}
          {sections['implementation evidence'] && (
            <section className="case-study-section">
              <h3 className="case-study-section-title">4. Implementation Evidence</h3>
              <div className="case-study-prose">
                {renderFormattedText(sections['implementation evidence'])}
              </div>
            </section>
          )}

          {/* Section 5: Architecture Decision Records (ADRs) */}
          <section className="case-study-section">
            <div className="case-study-section-header-flex">
              <h3 className="case-study-section-title">5. Architectural Decision Records (ADRs)</h3>
              <span className="case-study-adr-count">
                {decisions.length} {decisions.length === 1 ? 'record' : 'records'}
              </span>
            </div>

            {decisions.length > 0 ? (
              <div className="case-study-adrs-list">
                {decisions.map((adr, idx) => (
                  <div key={idx} className="case-study-adr-card">
                    <div className="case-study-adr-header">
                      <span className="case-study-adr-num">
                        ADR {String(idx + 1).padStart(2, '0')} : {adr.date}
                      </span>
                      <span className="case-study-adr-status">Accepted</span>
                    </div>

                    <h4 className="case-study-adr-title">{adr.title}</h4>

                    {adr.context && (
                      <div className="case-study-adr-field">
                        <span className="case-study-adr-label">Context:</span>
                        <p className="case-study-adr-text">{adr.context}</p>
                      </div>
                    )}

                    {adr.decision && (
                      <div className="case-study-adr-field">
                        <span className="case-study-adr-label">Decision:</span>
                        <p className="case-study-adr-text">{adr.decision}</p>
                      </div>
                    )}

                    {adr.alternatives && (
                      <div className="case-study-adr-field">
                        <span className="case-study-adr-label">Alternatives Considered:</span>
                        <p className="case-study-adr-text">{adr.alternatives}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="case-study-placeholder">
                No formal ADR records logged. Baseline architectural invariants established in primary design specification.
              </p>
            )}
          </section>
        </div>

        {/* Drawer Footer */}
        <div className="case-study-footer">
          <div className="case-study-footer-stack">
            {(project.stack || []).slice(0, 4).map((tech, i) => (
              <span key={i} className="case-study-footer-tag">
                {tech}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="case-study-footer-close"
            onClick={onClose}
          >
            Close Reader (Esc)
          </button>
        </div>
      </aside>
    </div>
  );
}
