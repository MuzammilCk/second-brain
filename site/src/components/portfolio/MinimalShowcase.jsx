import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import portfolioData from '../../data/generated/portfolio.json';
import RevealFx from '../ui/RevealFx';
import styles from './MinimalShowcase.module.css';

// Curated flagship projects for the home page showcase
const FLAGSHIP_IDS = ['assetflow', 'crisissignal', 'esg-audit-system'];

const FLAGSHIP_METADATA = {
  assetflow: {
    category: 'DISTRIBUTED ERP // 2026',
    tagline: 'Physical asset allocation engine with PostgreSQL double-allocation transaction guards and tsrange exclusion locks.',
    metricLabel: 'Zero Overlaps',
    metricVal: '100% ACID',
    highlightStack: ['PostgreSQL', 'Prisma', 'Supabase', 'React 19'],
    badge: 'GRAND FINALE FINALIST',
  },
  crisissignal: {
    category: 'FEDERATED ML // 2026',
    tagline: 'Passive on-device mental health crisis prediction using LSTM Autoencoders & Flower federated network with zero egress.',
    metricLabel: 'Early Warning',
    metricVal: '5-7 Days Lead',
    highlightStack: ['PyTorch', 'TensorFlow Lite', 'Flower', 'Python 3.11'],
    badge: 'AI FOR GOOD 2026',
  },
  'esg-audit-system': {
    category: 'CONFIDENTIAL COMPUTING // 2026',
    tagline: 'Zero-trust multi-agent supply chain compliance auditing with AWS Nitro Enclaves and C2PA cryptographic provenance.',
    metricLabel: 'Security Boundary',
    metricVal: 'C2PA Enclave',
    highlightStack: ['AWS Nitro', 'LangGraph', 'Qdrant', 'FastAPI'],
    badge: 'CRYPTOGRAPHIC AUDIT',
  },
};

export default function MinimalShowcase({ onInspect }) {
  const projects = useMemo(() => {
    const raw = portfolioData?.projects || [];
    return FLAGSHIP_IDS.map((id) => {
      const match = raw.find((p) => p.id === id || p.slug === id);
      return match || { id, title: id, stack: [] };
    });
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    e.currentTarget.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <section className={styles.showcaseSection} aria-label="Featured Systems">
      <div className={styles.container}>
        {/* Once UI Line Divider */}
        <div className={styles.lineDividerRow}>
          <div className={styles.lineSegment} />
        </div>

        {/* Section Header */}
        <RevealFx translateY={14} delay={0.1}>
          <div className={styles.sectionHeader}>
            <div className={styles.eyebrowPill}>
              <span className={styles.eyebrowDot} />
              <span>01 // CURATED ARCHITECTURES</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Engineered Invariants
            </h2>
            <p className={styles.sectionSubtitle}>
              Three production systems built against deterministic constraints, privacy invariants, and cryptographic guarantees.
            </p>
          </div>
        </RevealFx>

        {/* Flagship Specimen List with 3D Tilt */}
        <div className={styles.cardsGrid}>
          {projects.map((project, idx) => {
            const meta = FLAGSHIP_METADATA[project.id] || {
              category: 'SYSTEM ARCHITECTURE',
              tagline: project.problem || 'Production system built under strict engineering constraints.',
              metricLabel: 'Decisions',
              metricVal: `${project.decision_count || 0} Logged`,
              highlightStack: project.stack?.slice(0, 4) || [],
              badge: 'VERIFIED',
            };

            return (
              <RevealFx key={project.id} translateY={20} delay={0.15 + idx * 0.1}>
                <article
                  className={styles.card}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  id={`flagship-card-${project.id}`}
                >
                  <div className={styles.cardGlowSheen} />
                  <div className={styles.cardInner}>
                    {/* Card Meta Row */}
                    <div className={styles.cardMetaRow}>
                      <span className={styles.projectIdx}>0{idx + 1}</span>
                      <span className={styles.categoryBadge}>{meta.category}</span>
                      <span className={styles.statusPill}>
                        {project.status === 'shipped' ? 'SHIPPED' : 'ACTIVE'}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.projectTagline}>{meta.tagline}</p>

                    {/* Metric & Accolade Badge */}
                    <div className={styles.metricContainer}>
                      <div className={styles.metricBadge}>
                        <span className={styles.metricValue}>{meta.metricVal}</span>
                        <span className={styles.metricLabel}>{meta.metricLabel}</span>
                      </div>
                      {meta.badge && (
                        <span className={styles.accoladeBadge}>{meta.badge}</span>
                      )}
                    </div>

                    {/* Tech Stack Chips */}
                    <div className={styles.stackRow}>
                      {meta.highlightStack.map((tech) => (
                        <span key={tech} className={styles.stackChip}>
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className={styles.cardActionRow}>
                      <button
                        type="button"
                        className={styles.inspectBtn}
                        onClick={() => onInspect && onInspect(project)}
                        id={`inspect-btn-${project.id}`}
                      >
                        <span>Inspect Invariants</span>
                        <span className={styles.btnIcon}>↗</span>
                      </button>
                      <Link
                        to={`/projects?inspect=${project.slug || project.id}`}
                        className={styles.detailLink}
                      >
                        <span>View In Atlas</span>
                        <span className={styles.linkArrow}>→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              </RevealFx>
            );
          })}
        </div>

        {/* Once UI Line Divider */}
        <div className={styles.lineDividerRow} style={{ marginTop: '5rem' }}>
          <div className={styles.lineSegment} />
        </div>

        {/* Wayfinding Portals (Second Brain Navigator) */}
        <RevealFx translateY={14} delay={0.1}>
          <div className={styles.wayfindingHeader}>
            <div className={styles.eyebrowPill}>
              <span className={styles.eyebrowDot} />
              <span>02 // ECOSYSTEM NAVIGATOR</span>
            </div>
            <h3 className={styles.wayfindingTitle}>Second Brain Portals</h3>
            <p className={styles.wayfindingSubtitle}>
              Direct gateways into the synchronized repositories, operational telemetry, and connected concept graph.
            </p>
          </div>
        </RevealFx>

        <div className={styles.wayfindingGrid}>
          <RevealFx translateY={16} delay={0.15}>
            <Link to="/projects" className={styles.wayfindingCard} id="portal-projects">
              <div className={styles.wayfindingTopRow}>
                <div className={styles.wayfindingNumber}>01</div>
                <span className={styles.wayfindingBadge}>12 SYSTEMS</span>
              </div>
              <div className={styles.wayfindingContent}>
                <h4 className={styles.wayfindingName}>Engineering Atlas</h4>
                <p className={styles.wayfindingDesc}>
                  Full directory of production systems, hackathon submissions, and architectural trade-off logs.
                </p>
              </div>
              <div className={styles.wayfindingFooter}>
                <span className={styles.wayfindingAction}>Explore Catalog</span>
                <span className={styles.wayfindingArrow}>→</span>
              </div>
            </Link>
          </RevealFx>

          <RevealFx translateY={16} delay={0.25}>
            <Link to="/radar" className={styles.wayfindingCard} id="portal-radar">
              <div className={styles.wayfindingTopRow}>
                <div className={styles.wayfindingNumber}>02</div>
                <span className={styles.wayfindingBadge}>LIVE TELEMETRY</span>
              </div>
              <div className={styles.wayfindingContent}>
                <h4 className={styles.wayfindingName}>Production Radar</h4>
                <p className={styles.wayfindingDesc}>
                  Real-time competency polar charts, active sprint milestones, and verified stack inventory.
                </p>
              </div>
              <div className={styles.wayfindingFooter}>
                <span className={styles.wayfindingAction}>View Telemetry</span>
                <span className={styles.wayfindingArrow}>→</span>
              </div>
            </Link>
          </RevealFx>

          <RevealFx translateY={16} delay={0.35}>
            <Link to="/concepts" className={styles.wayfindingCard} id="portal-concepts">
              <div className={styles.wayfindingTopRow}>
                <div className={styles.wayfindingNumber}>03</div>
                <span className={styles.wayfindingBadge}>KNOWLEDGE GRAPH</span>
              </div>
              <div className={styles.wayfindingContent}>
                <h4 className={styles.wayfindingName}>Concepts &amp; Mind</h4>
                <p className={styles.wayfindingDesc}>
                  Atomic technical notes connected via [[wiki-links]] linking core computer science principles to code.
                </p>
              </div>
              <div className={styles.wayfindingFooter}>
                <span className={styles.wayfindingAction}>Open Mind Graph</span>
                <span className={styles.wayfindingArrow}>→</span>
              </div>
            </Link>
          </RevealFx>
        </div>
      </div>
    </section>
  );
}
