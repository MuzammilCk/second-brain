import { useRef } from 'react';
import { Link } from 'react-router-dom';
import './ProjectWorlds.css';

const WORLDS = [
  {
    slug: 'assetflow',
    sysCode: 'SYS.01 // CORE',
    title: 'AssetFlow',
    liveBadge: 'Odoo Grand Finale Finalist',
    badgeColor: 'sage',
    pitch: 'Real-time range overlap query engine strictly preventing concurrent booking collisions with PostgreSQL GiST exclusion.',
    domains: ['ERP', 'ODOO', 'SYSTEMS'],
    bgImage: '/images/world-mountains.png',
    alt: 'Rugged mountain peak with atmospheric mist and dramatic light for AssetFlow'
  },
  {
    slug: 'metatune',
    sysCode: 'SYS.02 // AUDIO',
    title: 'MetaTune',
    liveBadge: 'Sub-400ms Pipeline',
    badgeColor: 'amber',
    pitch: 'Full-duplex conversational voice agent integrating LiveKit WebRTC pipeline with local LLM fallback and Opus audio sync.',
    domains: ['AI', 'OPTIMIZATION', 'RESEARCH'],
    bgImage: '/images/world-forest.png',
    alt: 'Moody pine forest shrouded in deep morning fog for MetaTune'
  },
  {
    slug: 'esg-audit-system',
    sysCode: 'SYS.03 // ZERO-TRUST',
    title: 'ESG Audit System',
    liveBadge: 'Nitro Enclave Attested',
    badgeColor: 'sage',
    pitch: 'Multiagent LangGraph DAG running inside cryptographically attested enclaves with Redis PII masking and automated red-teaming.',
    domains: ['LLM', 'RAG', 'IMPACT'],
    bgImage: '/images/world-dunes.png',
    alt: 'Expansive sand dunes at twilight dusk under starry night sky for ESG Audit'
  },
  {
    slug: 'crisissignal',
    sysCode: 'SYS.04 // EDGE ML',
    title: 'CrisisSignal',
    liveBadge: '8.4MB Quantized',
    badgeColor: 'sand',
    pitch: 'Passive behavioral telemetry with zero cloud data exposure. On-device PyTorch LSTM autoencoder running locally on edge hardware.',
    domains: ['NLP', 'SYSTEMS', 'EDGE'],
    bgImage: '/images/world-coastline.png',
    alt: 'Dramatic dark coastline with crashing waves against volcanic black cliffs for CrisisSignal'
  }
];

export default function ProjectWorlds({ projects = [], onInspect }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCardClick = (world) => {
    const matchedProject = projects.find((p) => p.slug === world.slug) || {
      slug: world.slug,
      title: world.title,
      contentMd: world.pitch,
      body_markdown: world.pitch,
      stack: world.domains
    };
    if (onInspect) {
      onInspect(matchedProject);
    }
  };

  return (
    <section className="project-worlds" id="projects">
      {/* ── Section Header + Carousel Controls ── */}
      <div className="project-worlds__header">
        <div>
          <div className="project-worlds__pill">
            03 // PROJECT WORLDS
          </div>
          <h2 className="project-worlds__title">
            Each project is a new world.
          </h2>
          <p className="project-worlds__subtitle">
            Different problems. Different challenges. Different versions of me.
          </p>
        </div>

        <div className="project-worlds__controls">
          <span className="font-handwritten project-worlds__annotation">
            New doors. More to explore.
          </span>
          <div className="project-worlds__arrows">
            <button 
              className="project-worlds__arrow-btn"
              onClick={() => scroll('left')}
              title="Previous project"
              aria-label="Previous project"
              type="button"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button 
              className="project-worlds__arrow-btn"
              onClick={() => scroll('right')}
              title="Next project"
              aria-label="Next project"
              type="button"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Horizontal Grid / Carousel of Tall Cinematic Cards ── */}
      <div className="project-worlds__grid" ref={scrollRef}>
        {WORLDS.map((world) => (
          <div 
            key={world.slug}
            className="project-worlds__card group"
            onClick={() => handleCardClick(world)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(world); }}
            aria-label={`Inspect ${world.title}`}
          >
            {/* Background Cinematic Photo */}
            <img 
              src={world.bgImage} 
              alt={world.alt}
              className="project-worlds__card-bg"
              loading="lazy"
            />
            {/* Atmospheric Gradient Scrim */}
            <div className="project-worlds__card-scrim"></div>

            {/* Top Card Metadata */}
            <div className="project-worlds__card-top">
              <span className="project-worlds__sys-code">
                {world.sysCode}
              </span>
              <span className="project-worlds__expand-btn" aria-hidden="true">
                <span className="material-symbols-outlined">north_east</span>
              </span>
            </div>

            {/* Bottom Card Content */}
            <div className="project-worlds__card-bottom">
              <div className="project-worlds__live-row">
                <span className={`project-worlds__live-dot project-worlds__live-dot--${world.badgeColor}`}></span>
                <span className={`project-worlds__live-text project-worlds__live-text--${world.badgeColor}`}>
                  {world.liveBadge}
                </span>
              </div>

              <h3 className="project-worlds__card-title">
                {world.title}
              </h3>

              <p className="project-worlds__card-pitch">
                {world.pitch}
              </p>

              <div className="project-worlds__domains">
                {world.domains.map((dom, i) => (
                  <span key={i} className="project-worlds__domain-item">
                    {i > 0 && <span className="project-worlds__domain-sep">&bull;</span>}
                    <span className={i === 0 ? 'project-worlds__domain-first' : ''}>{dom}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Carousel Footer Progress & Full Ledger Link ── */}
      <div className="project-worlds__footer">
        <div className="project-worlds__progress">
          <span className="project-worlds__progress-count">04 OF {projects.length || 14}</span>
          <div className="project-worlds__progress-bar">
            <div className="project-worlds__progress-fill"></div>
          </div>
          <span className="project-worlds__progress-label">FEATURED WORLDS</span>
        </div>

        <div className="project-worlds__ledger-link-wrapper">
          <Link to="/projects" className="project-worlds__ledger-link">
            <span>View Complete Architecture Ledger ({projects.length || 14} Specs)</span>
            <span className="material-symbols-outlined">arrow_outward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
