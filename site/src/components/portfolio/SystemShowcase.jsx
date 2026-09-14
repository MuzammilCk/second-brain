import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import portfolioData from '../../data/generated/portfolio.json';
import styles from './SystemShowcase.module.css';

// System domain classifications for filtering
const DOMAIN_MAP = {
  ai: ['esg-audit-system', 'crisissignal', 'repomind', 'metatune', 'viva'],
  fullstack: ['assetflow', 'fitness-platform', 'hadi', 'invoice-studio', 'masm-studio', 'realme', 'ytclfr', 'odoo-hackathon'],
};

// Curated flagship data overlay for headline metrics & architecture flow
const FLAGSHIP_METADATA = {
  assetflow: {
    systemIndex: 'SYS.01 // CONCURRENCY INVARIANT',
    accolade: 'Odoo Grand Finale Finalist',
    metricLabel: 'ALLOCATION ENGINE',
    metricValue: 'tsrange Exclusion (GiST)',
    problem: 'Physical equipment faced dual-allocations under concurrent bursts. Application-layer JavaScript checks resulted in race conditions.',
    architecture: 'PostgreSQL transactional exclusion constraints with Prisma ORM and a 6-stage maintenance Kanban state machine.',
    tradeoff: 'Cut real-time WebSockets to deliver verifiable database-level slot lock guarantees within the 8-hour competition window.',
  },
  crisissignal: {
    systemIndex: 'SYS.02 // PRIVACY EDGE ML',
    accolade: 'AI For Good 2026',
    metricLabel: 'EDGE QUANTIZATION',
    metricValue: '8.4MB TFLite / Zero Egress',
    problem: 'Behavioral anomalies occur 5-7 days before crisis, but centralized tracking of student mobility violates legal privacy boundaries.',
    architecture: 'Unsupervised PyTorch LSTM Autoencoder detecting anomaly reconstruction errors, quantized for Android CPU inference.',
    tradeoff: 'Reconstruction error thresholding over supervised classification due to subjective labeling bias and privacy constraints.',
  },
  'odoo-hackathon': {
    systemIndex: 'SYS.03 // REAL-TIME PIPELINE',
    accolade: 'Hackathon Finalist',
    metricLabel: 'VOICE LATENCY',
    metricValue: 'Sub-400ms Full-Duplex',
    problem: 'TCP WebSocket audio streaming stalled chunks under mobile network degradation, degrading conversation realism.',
    architecture: 'WebRTC data & media tracks with LiveKit orchestrator and streaming LLM token fallback pipelines.',
    tradeoff: 'UDP unreliable delivery chosen over TCP retransmission to preserve strict turn-taking cadence.',
  },
  metatune: {
    systemIndex: 'SYS.04 // HPO OPTIMIZATION',
    accolade: 'Distributed AutoML',
    metricLabel: 'SEARCH SPEEDUP',
    metricValue: '3.4x Faster Convergence',
    problem: 'Brute-force grid search on deep learning parameters wasted thousands of GPU compute minutes.',
    architecture: 'Dataset meta-features mapped to neural meta-learners with Google Vizier Bayesian GP search sweeps.',
    tradeoff: 'Bounded search space with early median stopping to eliminate non-converging trials quickly.',
  },
};

// Derive clean 1-sentence technical pitch for directory rows
function getProjectPitch(project) {
  const customPitches = {
    crisissignal: 'On-device behavioral anomaly detection with local ML & zero raw egress.',
    hadi: 'High-concurrency tree-based commission and payout calculation engine.',
    'fitness-platform': 'Type-safe monorepo platform with zero runtime schema drift.',
    repomind: 'Fast semantic codebase indexing with AST extraction and query synthesis.',
    ytclfr: 'Distributed video intelligence extraction pipeline with staged background gates.',
    metatune: 'AutoML hyperparameter optimization platform with real-time trial tracking.',
    'invoice-studio': 'Client-side invoice generation engine with structured JSON data export.',
    'masm-studio': 'Browser-based 8086 assembly simulator and interactive memory visualizer.',
    healthsync: 'Clinical health tracking suite with strict client-side privacy controls.',
    realme: 'Interactive 3D WebGL portfolio workspace with physics-based shaders.',
    viva: 'Corporate portal platform built on Next.js App Router architecture.',
    'esg-audit-system': 'Zero-trust multiagent compliance audit engine with cryptographic ledger.',
    'odoo-hackathon': 'Full-duplex conversational voice agent with sub-400ms end-to-end latency.',
    assetflow: 'Offline-first ERP asset manager with double-allocation prevention.',
  };

  if (customPitches[project.slug]) return customPitches[project.slug];

  const md = project.body_markdown || '';
  const match = md.match(/## Problem\s*\n+([^\n#]+)/);
  if (match && match[1]) {
    return match[1].slice(0, 90) + (match[1].length > 90 ? '...' : '');
  }
  return 'Production systems engineering and software architecture project.';
}

export default function SystemShowcase({ mode = 'full', onInspect }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Read exclusively from portfolio.json
  const allProjects = useMemo(() => {
    return (portfolioData?.projects || []).map((p) => ({
      ...p,
      slug: p.slug || p.id,
      contentMd: p.body_markdown || '',
      decisionCount: p.decision_count || p.decisions?.length || 0,
    }));
  }, []);

  // Filtered dataset
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      if (filter === 'ai') {
        const isAi = DOMAIN_MAP.ai.includes(p.slug) || p.stack?.some((t) => /ai|ml|tensorflow|pytorch|flower/i.test(t));
        if (!isAi) return false;
      } else if (filter === 'fullstack') {
        if (!DOMAIN_MAP.fullstack.includes(p.slug)) return false;
      } else if (filter === 'shipped') {
        if (p.status !== 'shipped' && p.status !== 'done') return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesSlug = p.slug.toLowerCase().includes(q);
        const matchesStack = p.stack?.some((s) => s.toLowerCase().includes(q));
        const matchesPitch = getProjectPitch(p).toLowerCase().includes(q);
        if (!matchesTitle && !matchesSlug && !matchesStack && !matchesPitch) {
          return false;
        }
      }

      return true;
    });
  }, [allProjects, filter, searchQuery]);

  // Designated Flagships: top 2 high-signal projects (AssetFlow & CrisisSignal)
  const flagshipProjects = useMemo(() => {
    const list = allProjects.filter((p) => p.slug === 'assetflow' || p.slug === 'crisissignal');
    return list.length > 0 ? list : allProjects.slice(0, 2);
  }, [allProjects]);

  // Standard cards (secondary high-signal projects)
  const standardProjects = useMemo(() => {
    const flagshipSlugs = new Set(flagshipProjects.map((p) => p.slug));
    return filteredProjects.filter((p) => !flagshipSlugs.has(p.slug) && (p.slug === 'metatune' || p.slug === 'ytclfr' || p.slug === 'masm-studio' || p.slug === 'esg-audit-system')).slice(0, 4);
  }, [filteredProjects, flagshipProjects]);

  // Long-tail directory projects
  const directoryProjects = useMemo(() => {
    return filteredProjects;
  }, [filteredProjects]);

  const counts = useMemo(() => ({
    all: allProjects.length,
    ai: allProjects.filter((p) => DOMAIN_MAP.ai.includes(p.slug) || p.stack?.some((t) => /ai|ml|tensorflow|pytorch/i.test(t))).length,
    fullstack: allProjects.filter((p) => DOMAIN_MAP.fullstack.includes(p.slug)).length,
    shipped: allProjects.filter((p) => p.status === 'shipped' || p.status === 'done').length,
  }), [allProjects]);

  return (
    <section className={styles.showcaseSection} id="system-showcase" aria-label="System Architectures & Production Engineering Showcase">
      {/* ── Section Header ── */}
      <div className={styles.sectionHeader}>
        <div>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            <span>02 // PRODUCTION SHOWCASE</span>
          </div>
          <h2 className={styles.title}>
            {mode === 'top' ? 'Flagship System Architectures' : 'Engineering Systems & Architectures'}
          </h2>
          <p className={styles.subtitle}>
            Production-grade systems designed with formal concurrency guarantees, edge ML inference, and strict telemetry boundaries.
          </p>
        </div>

        {mode === 'full' && (
          <div className={styles.filterBar}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search systems, stack, invariants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Filter systems"
              />
            </div>

            <div className={styles.categoryPills} role="tablist">
              <button
                type="button"
                className={`${styles.pillBtn} ${filter === 'all' ? styles.pillBtnActive : ''}`}
                onClick={() => setFilter('all')}
              >
                <span>ALL</span>
                <span className={styles.pillCount}>({counts.all})</span>
              </button>
              <button
                type="button"
                className={`${styles.pillBtn} ${filter === 'ai' ? styles.pillBtnActive : ''}`}
                onClick={() => setFilter('ai')}
              >
                <span>AI / ML</span>
                <span className={styles.pillCount}>({counts.ai})</span>
              </button>
              <button
                type="button"
                className={`${styles.pillBtn} ${filter === 'fullstack' ? styles.pillBtnActive : ''}`}
                onClick={() => setFilter('fullstack')}
              >
                <span>FULLSTACK</span>
                <span className={styles.pillCount}>({counts.fullstack})</span>
              </button>
              <button
                type="button"
                className={`${styles.pillBtn} ${filter === 'shipped' ? styles.pillBtnActive : ''}`}
                onClick={() => setFilter('shipped')}
              >
                <span>SHIPPED</span>
                <span className={styles.pillCount}>({counts.shipped})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Flagship Cards (2-column span for top high-signal projects) ── */}
      <div className={styles.flagshipGrid}>
        {(mode === 'top' ? flagshipProjects.slice(0, 2) : flagshipProjects).map((project) => {
          const meta = FLAGSHIP_METADATA[project.slug] || {};
          return (
            <article key={project.slug} className={styles.flagshipCard} id={`flagship-${project.slug}`}>
              <div className={styles.cardGlowBar} />
              
              <div className={styles.cardHeader}>
                <span className={styles.cardSystemIndex}>{meta.systemIndex || 'SYS.FLAGSHIP'}</span>
                {meta.accolade && (
                  <span className={styles.badgeAccolade}>
                    <span>★</span>
                    <span>{meta.accolade}</span>
                  </span>
                )}
              </div>

              <div className={styles.cardTitleGroup}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardSubtitle}>
                  {project.slug === 'assetflow'
                    ? 'Enterprise Relational Conflict Prevention Engine · 8h Hackathon Sprint'
                    : 'Federated Edge ML Behavioral Telemetry · Zero Cloud Egress'}
                </p>
              </div>

              {meta.metricLabel && (
                <div className={styles.metricCallout}>
                  <span className={styles.metricLabel}>{meta.metricLabel}</span>
                  <span className={styles.metricValue}>{meta.metricValue}</span>
                </div>
              )}

              <div className={styles.architectureFlow}>
                <div className={styles.flowItem}>
                  <span className={styles.flowLabel}>Problem & Boundary Tension</span>
                  <p className={styles.flowText}>{meta.problem || getProjectPitch(project)}</p>
                </div>
                <div className={styles.flowItem}>
                  <span className={styles.flowLabel}>Chosen Architecture & Invariant</span>
                  <p className={styles.flowText}>{meta.architecture || 'PostgreSQL transactional state machine with Prisma ORM.'}</p>
                </div>
                <div className={styles.flowItem}>
                  <span className={styles.flowLabel}>Engineering Trade-off</span>
                  <p className={styles.flowText}>
                    <span className={styles.flowTextHighlight}>{meta.tradeoff}</span>
                  </p>
                </div>
              </div>

              <div className={styles.cardStack}>
                {(project.stack || []).slice(0, 6).map((tech, idx) => (
                  <span key={idx} className={styles.techPill}>
                    {tech}
                  </span>
                ))}
                {project.decisionCount > 0 && (
                  <span className={`${styles.techPill} ${styles.adrPill}`}>
                    {project.decisionCount} {project.decisionCount === 1 ? 'ADR' : 'ADRs'}
                  </span>
                )}
              </div>

              <div className={styles.cardActions}>
                {onInspect && (
                  <button
                    type="button"
                    className={styles.inspectBtn}
                    onClick={() => onInspect(project)}
                    aria-label={`View technical trade-offs for ${project.title}`}
                  >
                    <span>+ View Technical Trade-offs</span>
                  </button>
                )}
                <Link
                  to={`/projects/${project.slug}`}
                  className={styles.detailLink}
                  aria-label={`Read case study for ${project.title}`}
                >
                  <span>Case Study →</span>
                </Link>
                {project.repo_reference && (
                  <a
                    href={project.repo_reference}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.detailLink}
                    aria-label={`GitHub repo for ${project.title}`}
                  >
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Mode = top: Show quick link to full directory */}
      {mode === 'top' && (
        <div className={styles.viewAllBar}>
          <Link to="/projects" className={styles.viewAllLink}>
            <span>View All {allProjects.length} System Architectures & Index →</span>
          </Link>
        </div>
      )}

      {/* Mode = full: Standard Cards + Long-Tail Table View */}
      {mode === 'full' && (
        <>
          {standardProjects.length > 0 && (
            <>
              <h3 className={styles.standardSectionTitle}>SPECIALIZED ARCHITECTURES & SIMULATIONS</h3>
              <div className={styles.standardGrid}>
                {standardProjects.map((p) => {
                  const isShipped = p.status === 'shipped' || p.status === 'done';
                  return (
                    <div key={p.slug} className={styles.standardCard}>
                      <div className={styles.standardCardHeader}>
                        <h4 className={styles.standardTitle}>{p.title}</h4>
                        <span className={`${styles.standardStatus} ${isShipped ? styles.standardStatusShipped : ''}`}>
                          {isShipped ? 'Shipped' : 'Active'}
                        </span>
                      </div>
                      <p className={styles.standardDesc}>{getProjectPitch(p)}</p>

                      <div className={styles.cardStack}>
                        {(p.stack || []).slice(0, 3).map((t, idx) => (
                          <span key={idx} className={styles.techPill}>
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className={styles.standardFooter}>
                        <div className={styles.standardActions}>
                          {onInspect && (
                            <button
                              type="button"
                              className={styles.miniBtn}
                              onClick={() => onInspect(p)}
                            >
                              <span>Trade-offs</span>
                            </button>
                          )}
                          <Link to={`/projects/${p.slug}`} className={styles.miniBtn}>
                            <span>Case Study →</span>
                          </Link>
                        </div>
                        {p.repo_reference && (
                          <a
                            href={p.repo_reference}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.miniBtn}
                          >
                            <span>Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Filterable Directory Table for Long Tail ── */}
          <div className={styles.tableContainer}>
            <div className={styles.tableHeaderBar}>
              <span className={styles.tableTitle}>SYSTEM DIRECTORY INDEX // ALL ARTIFACTS</span>
              <span className={styles.tableCount}>SHOWING {directoryProjects.length} OF {allProjects.length}</span>
            </div>

            <table className={styles.directoryTable}>
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>System</th>
                  <th style={{ width: '40%' }}>Core Invariant / Specification</th>
                  <th style={{ width: '20%' }}>Stack</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {directoryProjects.map((project) => {
                  const isShipped = project.status === 'shipped' || project.status === 'done';
                  return (
                    <tr key={project.slug} className={styles.directoryRow}>
                      <td>
                        <div className={styles.tableNameCell}>
                          <span className={`${styles.statusDot} ${isShipped ? styles.statusDotGreen : ''}`} />
                          <span>{project.title}</span>
                        </div>
                      </td>
                      <td className={styles.tablePitchCell}>{getProjectPitch(project)}</td>
                      <td>
                        <div className={styles.tableStackCell}>
                          {(project.stack || []).slice(0, 3).map((s, idx) => (
                            <span key={idx} className={styles.techPill}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className={styles.tableActionCell}>
                        {onInspect && (
                          <button
                            type="button"
                            className={styles.miniBtn}
                            onClick={() => onInspect(project)}
                            style={{ marginRight: '0.4rem' }}
                          >
                            <span>Inspect</span>
                          </button>
                        )}
                        <Link to={`/projects/${project.slug}`} className={styles.miniBtn}>
                          <span>Open</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
