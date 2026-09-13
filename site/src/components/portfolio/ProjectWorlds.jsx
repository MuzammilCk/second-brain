import { useRef } from 'react';
import { Link } from 'react-router-dom';
import './ProjectWorlds.css';

const FEATURED_DOORS = [
  {
    slug: 'assetflow',
    sysCode: 'SYS.01 // WALL OF INVARIANTS',
    title: 'AssetFlow',
    liveBadge: 'Odoo Grand Finale Finalist',
    badgeColor: 'sage',
    domainTheme: 'Enterprise Concurrency · 8h Hackathon',
    pitch: 'Real-time range overlap query engine strictly preventing concurrent equipment booking collisions at the database layer.',
    whatBroke: 'Application-layer JS array filtering produced race conditions under concurrent booking bursts.',
    invariant: 'PostgreSQL tsrange exclusion lock (&&) rejects overlapping reservations in the transaction kernel.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Prisma', 'GiST Index'],
    bgImage: '/images/world-mountains.png',
    alt: 'Rugged mountain peak with atmospheric mist and dramatic light for AssetFlow'
  },
  {
    slug: 'metatune',
    sysCode: 'SYS.02 // SOUND CHAMBER',
    title: 'MetaTune',
    liveBadge: 'Sub-400ms Pipeline',
    badgeColor: 'amber',
    domainTheme: 'Real-Time Voice AI · Audio Pipeline',
    pitch: 'Full-duplex conversational voice agent integrating LiveKit WebRTC pipeline with local LLM fallback and Bayesian hyperparameter sweeps.',
    whatBroke: 'TCP WebSocket streaming stalled audio chunks under cellular packet loss, ballooning latency to 850ms.',
    invariant: 'UDP WebRTC audio tracks maintain sub-14ms barge-in and preserve conversational flow.',
    stack: ['Python', 'WebRTC', 'LiveKit', 'FastAPI', 'Google Vizier'],
    bgImage: '/images/world-forest.png',
    alt: 'Moody pine forest shrouded in deep morning fog for MetaTune'
  },
  {
    slug: 'crisissignal',
    sysCode: 'SYS.03 // OFFLINE FORTRESS',
    title: 'CrisisSignal',
    liveBadge: '8.4MB Quantized',
    badgeColor: 'sage',
    domainTheme: 'Edge ML · Privacy-Preserving Telemetry',
    pitch: 'Passive behavioral telemetry detecting anomalies with zero cloud data exposure. On-device PyTorch LSTM autoencoder running locally.',
    whatBroke: 'Centralized database tracking student mobility was legally rejected over location privacy risks.',
    invariant: 'Zero raw behavioral data leaves the phone. Only gradient weights communicate via Flower federated rounds.',
    stack: ['PyTorch', 'TensorFlow Lite', 'Kotlin', 'Flower', 'SHAP'],
    bgImage: '/images/world-coastline.png',
    alt: 'Dramatic dark coastline with crashing waves against volcanic black cliffs for CrisisSignal'
  },
  {
    slug: 'masm-studio',
    sysCode: 'SYS.04 // SILICON MONOLITH',
    title: 'MASM Studio',
    liveBadge: '8086 Memory Visualizer',
    badgeColor: 'sand',
    domainTheme: 'Low-Level Systems · Hardware Emulation',
    pitch: 'Zero-install 8086 Assembly visual step debugger and register inspector running directly inside modern browsers.',
    whatBroke: 'Clunky local DOSBox environments created massive friction for students trying to understand segmented memory.',
    invariant: 'Direct browser execution of 16-bit segmented register memory with instant breakpoint reflection.',
    stack: ['Assembly 8086', 'TypeScript', 'WebAssembly', 'Canvas'],
    bgImage: '/images/world-dunes.png',
    alt: 'Expansive sand dunes at twilight dusk under starry night sky for MASM Studio'
  }
];

export default function ProjectWorlds({ projects = [], onInspect }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleQuickInspect = (e, door) => {
    e.stopPropagation();
    const matchedProject = projects.find((p) => p.slug === door.slug) || {
      slug: door.slug,
      title: door.title,
      contentMd: door.pitch,
      body_markdown: door.pitch,
      stack: door.stack
    };
    if (onInspect) {
      onInspect(matchedProject);
    }
  };

  return (
    <section className="project-worlds" id="projects" aria-label="Engineered project worlds and architectural doors">
      {/* ── Section Header + Carousel Controls ── */}
      <div className="project-worlds__header">
        <div>
          <div className="project-worlds__pill">
            03 // PROJECT WORLDS
          </div>
          <h2 className="project-worlds__title">
            Projects are not cards. They are doors.
          </h2>
          <p className="project-worlds__subtitle">
            Different problem domains, different physical constraints, and different versions of me. Step across the threshold to inspect what broke and what was built.
          </p>
        </div>

        <div className="project-worlds__controls">
          <span className="font-handwritten project-worlds__annotation">
            Each door has an invariant
          </span>
          <div className="project-worlds__arrows">
            <button 
              className="project-worlds__arrow-btn"
              onClick={() => scroll('left')}
              title="Previous world"
              aria-label="Previous world"
              type="button"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button 
              className="project-worlds__arrow-btn"
              onClick={() => scroll('right')}
              title="Next world"
              aria-label="Next world"
              type="button"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Horizontal Grid / Carousel of Architectural Doors ── */}
      <div className="project-worlds__grid" ref={scrollRef}>
        {FEATURED_DOORS.map((door) => (
          <article 
            key={door.slug}
            className={`project-worlds__door project-worlds__door--${door.slug} group`}
          >
            {/* Background Photographic Atmosphere */}
            <div className="project-worlds__door-bg-wrapper">
              <img 
                src={door.bgImage} 
                alt={door.alt}
                className="project-worlds__door-bg"
                loading="lazy"
              />
              <div className="project-worlds__door-scrim"></div>
            </div>

            {/* Header / Domain Strip */}
            <div className="project-worlds__door-header">
              <div className="project-worlds__sys-code">
                {door.sysCode}
              </div>
              <button
                type="button"
                className="project-worlds__inspect-btn"
                onClick={(e) => handleQuickInspect(e, door)}
                title={`Quick inspect ${door.title} architecture`}
                aria-label={`Quick inspect ${door.title}`}
              >
                <span className="material-symbols-outlined">dock_to_left</span>
                <span>Inspect</span>
              </button>
            </div>

            {/* Core Door Body */}
            <div className="project-worlds__door-body">
              <div className="project-worlds__live-pill">
                <span className={`project-worlds__live-dot project-worlds__live-dot--${door.badgeColor}`}></span>
                <span className="project-worlds__live-text">{door.liveBadge}</span>
              </div>

              <h3 className="project-worlds__door-title">
                {door.title}
              </h3>
              <p className="project-worlds__door-theme">
                {door.domainTheme}
              </p>

              <p className="project-worlds__door-pitch">
                {door.pitch}
              </p>

              {/* Failure & Invariant Micro-Postmortem */}
              <div className="project-worlds__door-failure">
                <div className="project-worlds__failure-label">
                  <span className="material-symbols-outlined project-worlds__failure-icon">warning</span>
                  <span>WHAT BROKE:</span>
                </div>
                <p className="project-worlds__failure-text">
                  {door.whatBroke}
                </p>
              </div>

              {/* Stack Micro-Pills */}
              <div className="project-worlds__door-stack">
                {door.stack.map((tech, i) => (
                  <span key={i} className="project-worlds__stack-pill">{tech}</span>
                ))}
              </div>

              {/* Door Action: Enter World */}
              <Link 
                to={`/projects/${door.slug}`} 
                className="project-worlds__enter-btn"
              >
                <span>Enter The World</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </article>
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
            <span>Explore All {projects.length || 14} Systems in the Archive</span>
            <span className="material-symbols-outlined">arrow_outward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
