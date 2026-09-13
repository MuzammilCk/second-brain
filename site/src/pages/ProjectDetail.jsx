import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import projectsData from '../data/generated/projects.json';
import portfolioData from '../data/generated/portfolio.json';
import './ProjectDetail.css';

// Parse raw markdown into structured 10-Act Narrative sections
function parseNarrativeActs(markdown = '') {
  const sections = {
    overview: '',
    problem: '',
    architecture: '',
    constraints: '',
    evidence: '',
    currentState: ''
  };

  if (!markdown) return sections;

  // Split by top-level ## headings
  const parts = markdown.split(/^##\s+/m);
  
  // The first part contains title and lead overview
  const leadLines = parts[0].split('\n').filter(line => !line.startsWith('#'));
  sections.overview = leadLines.join('\n').trim();

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const newlineIdx = part.indexOf('\n');
    if (newlineIdx === -1) continue;

    const heading = part.substring(0, newlineIdx).trim().toLowerCase();
    const content = part.substring(newlineIdx).trim();

    if (heading.includes('problem')) {
      sections.problem = content;
    } else if (heading.includes('architecture')) {
      sections.architecture = content;
    } else if (heading.includes('constraint') || heading.includes('trade-off')) {
      sections.constraints = content;
    } else if (heading.includes('evidence') || heading.includes('implementation')) {
      sections.evidence = content;
    } else if (heading.includes('current state') || heading.includes('state')) {
      sections.currentState = content;
    }
  }

  return sections;
}

// Simple markdown formatter helper for paragraphs and bullet lists
function renderFormattedMarkdown(text = '') {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const flushList = (key) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="narrative-list">
          {currentList.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      // Bold syntax helper: **text** -> <strong>text</strong>
      const parsedItem = trimmed.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      currentList.push(parsedItem);
    } else if (trimmed === '') {
      flushList(idx);
    } else {
      flushList(idx);
      const parsedPara = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      elements.push(
        <p key={`p-${idx}`} className="narrative-paragraph" dangerouslySetInnerHTML={{ __html: parsedPara }} />
      );
    }
  });

  flushList('final');
  return elements;
}

export default function ProjectDetail() {
  const { slug } = useParams();

  const currentIndex = useMemo(() => {
    return projectsData.findIndex(p => p.slug === slug);
  }, [slug]);

  const rawProject = projectsData[currentIndex];
  const portMeta = (portfolioData?.projects || []).find(p => p.id === slug) || {};
  const project = rawProject ? { ...rawProject, ...portMeta } : null;

  // Previous and next project navigation
  const prevProject = useMemo(() => {
    if (currentIndex > 0) return projectsData[currentIndex - 1];
    return projectsData[projectsData.length - 1];
  }, [currentIndex]);

  const nextProject = useMemo(() => {
    if (currentIndex < projectsData.length - 1) return projectsData[currentIndex + 1];
    return projectsData[0];
  }, [currentIndex]);

  const acts = useMemo(() => {
    return parseNarrativeActs(project?.body_markdown || project?.contentMd || '');
  }, [project]);

  if (!project) {
    return (
      <div className="project-detail__error-container">
        <div className="project-detail__error-card">
          <h1>System World Not Found</h1>
          <p>The requested engineered system does not exist or has been relocated.</p>
          <Link to="/projects" className="project-detail__back-btn">
            ← Return to Architecture Atlas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="project-narrative" id={`project-narrative-${slug}`}>
      {/* ── Top Atmospheric Breadcrumb & Wayfinding ── */}
      <header className="project-narrative__hero">
        <div className="project-narrative__hero-inner">
          <nav className="project-narrative__breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Studio</Link>
            <span className="project-narrative__sep">/</span>
            <Link to="/projects">Worlds</Link>
            <span className="project-narrative__sep">/</span>
            <span className="project-narrative__current">{project.title}</span>
          </nav>

          <div className="project-narrative__meta-bar">
            <span className="project-narrative__sys-code">
              SYS.{(currentIndex + 1).toString().padStart(2, '0')} // ARCHITECTURAL DOSSIER
            </span>
            <span className={`project-narrative__status-pill project-narrative__status-pill--${project.status}`}>
              {project.status === 'active' ? 'Active Sprint' : 'Shipped & Verified'}
            </span>
            {project.last_verified && (
              <span className="project-narrative__verified-date">
                Last Verified: {project.last_verified}
              </span>
            )}
            {project.repo_reference && (
              <a
                href={project.repo_reference}
                target="_blank"
                rel="noopener noreferrer"
                className="project-narrative__github-btn"
              >
                <span>View Source on GitHub</span>
                <span className="material-symbols-outlined">north_east</span>
              </a>
            )}
          </div>

          <h1 className="project-narrative__title">{project.title}</h1>

          {/* Lead Hook / Overview */}
          {acts.overview && (
            <p className="project-narrative__lead">
              {acts.overview}
            </p>
          )}

          {/* Stack Pills */}
          <div className="project-narrative__stack-list" aria-label="Technology Stack">
            {project.stack.map(tech => (
              <span key={tech} className="project-narrative__stack-tag">{tech}</span>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Narrative Layout (Chapters + Content) ── */}
      <div className="project-narrative__body">
        {/* Sticky Lateral Chapter Wayfinding */}
        <aside className="project-narrative__chapter-nav" aria-label="Case Study Chapters">
          <span className="project-narrative__chapter-title">NARRATIVE CHAPTERS</span>
          <nav className="project-narrative__chapter-list">
            <a href="#act-problem" className="project-narrative__chapter-link">
              <span>01 · THE PROBLEM</span>
            </a>
            <a href="#act-constraints" className="project-narrative__chapter-link">
              <span>02 · HARD CONSTRAINTS</span>
            </a>
            <a href="#act-architecture" className="project-narrative__chapter-link">
              <span>03 · ARCHITECTURE</span>
            </a>
            <a href="#act-evidence" className="project-narrative__chapter-link">
              <span>04 · EVIDENCE</span>
            </a>
            {project.decisions && project.decisions.length > 0 && (
              <a href="#act-decisions" className="project-narrative__chapter-link">
                <span>05 · TURNING POINTS ({project.decisions.length})</span>
              </a>
            )}
            <a href="#act-state" className="project-narrative__chapter-link">
              <span>06 · CURRENT STATE</span>
            </a>
          </nav>
        </aside>

        {/* Narrative Flow Acts */}
        <main className="project-narrative__content">
          
          {/* Act 1: The Problem */}
          <section id="act-problem" className="project-narrative__section">
            <div className="project-narrative__act-label">
              <span className="project-narrative__act-num">ACT I & II</span>
              <span className="project-narrative__act-name">THE PROBLEM & HUMAN STAKES</span>
            </div>
            <h2 className="project-narrative__section-heading">
              What was broken in the real world?
            </h2>
            <div className="project-narrative__text-block">
              {renderFormattedMarkdown(acts.problem)}
            </div>
          </section>

          {/* Act 2: Constraints & Trade-offs */}
          <section id="act-constraints" className="project-narrative__section">
            <div className="project-narrative__act-label">
              <span className="project-narrative__act-num">ACT III, IV & V</span>
              <span className="project-narrative__act-name">THE STRUGGLE & HARD CONSTRAINTS</span>
            </div>
            <h2 className="project-narrative__section-heading">
              Why naive solutions failed
            </h2>
            <div className="project-narrative__text-block project-narrative__text-block--constraints">
              {renderFormattedMarkdown(acts.constraints)}
            </div>
          </section>

          {/* Act 3: Architecture Blueprint */}
          <section id="act-architecture" className="project-narrative__section">
            <div className="project-narrative__act-label">
              <span className="project-narrative__act-num">ACT VI & VII</span>
              <span className="project-narrative__act-name">THE EVOLVED ARCHITECTURE</span>
            </div>
            <h2 className="project-narrative__section-heading">
              System Architecture & Core Components
            </h2>
            <div className="project-narrative__text-block project-narrative__text-block--architecture">
              {renderFormattedMarkdown(acts.architecture)}
            </div>
          </section>

          {/* Act 4: Implementation Evidence */}
          <section id="act-evidence" className="project-narrative__section">
            <div className="project-narrative__act-label">
              <span className="project-narrative__act-num">ACT VIII</span>
              <span className="project-narrative__act-name">VERIFIED IMPLEMENTATION EVIDENCE</span>
            </div>
            <h2 className="project-narrative__section-heading">
              Concrete Deliverables & Proof of Invariants
            </h2>
            <div className="project-narrative__text-block">
              {renderFormattedMarkdown(acts.evidence)}
            </div>
          </section>

          {/* Act 5: Architectural Decision Records (ADRs) */}
          {project.decisions && project.decisions.length > 0 && (
            <section id="act-decisions" className="project-narrative__section">
              <div className="project-narrative__act-label">
                <span className="project-narrative__act-num">ACT IX</span>
                <span className="project-narrative__act-name">TURNING POINTS & INVARIANTS (ADRS)</span>
              </div>
              <h2 className="project-narrative__section-heading">
                Decisions forged under fire ({project.decisions.length} Records)
              </h2>

              <div className="project-narrative__decisions-grid">
                {project.decisions.map((d, i) => (
                  <div key={i} className="project-narrative__adr-card">
                    <div className="project-narrative__adr-header">
                      <span className="project-narrative__adr-date">{d.date}</span>
                      <span className="project-narrative__adr-status">STATUS: {d.status?.toUpperCase() || 'ACTIVE'}</span>
                    </div>
                    <h3 className="project-narrative__adr-title">{d.title}</h3>

                    {d.context && (
                      <div className="project-narrative__adr-part">
                        <strong className="project-narrative__adr-part-label">Context & Problem:</strong>
                        <p>{d.context}</p>
                      </div>
                    )}

                    {d.decision && (
                      <div className="project-narrative__adr-part project-narrative__adr-part--decision">
                        <strong className="project-narrative__adr-part-label">Architectural Decision:</strong>
                        <p>{d.decision}</p>
                      </div>
                    )}

                    {d.alternatives && (
                      <div className="project-narrative__adr-part">
                        <strong className="project-narrative__adr-part-label">Alternatives Rejected:</strong>
                        <p>{d.alternatives}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Act 6: Current State & Learnings */}
          <section id="act-state" className="project-narrative__section">
            <div className="project-narrative__act-label">
              <span className="project-narrative__act-num">ACT X</span>
              <span className="project-narrative__act-name">CURRENT STATE & LESSONS</span>
            </div>
            <h2 className="project-narrative__section-heading">
              Current Status & Takeaways
            </h2>
            <div className="project-narrative__text-block">
              {renderFormattedMarkdown(acts.currentState)}
            </div>
          </section>

          {/* ── World Transitions: Prev / Next Navigator ── */}
          <footer className="project-narrative__footer-nav">
            <Link to={`/projects/${prevProject.slug}`} className="project-narrative__nav-door project-narrative__nav-door--prev">
              <span className="project-narrative__nav-label">← PREVIOUS WORLD</span>
              <span className="project-narrative__nav-name">{prevProject.title}</span>
            </Link>

            <Link to="/projects" className="project-narrative__nav-center">
              <span className="material-symbols-outlined">grid_view</span>
              <span>All Systems Atlas</span>
            </Link>

            <Link to={`/projects/${nextProject.slug}`} className="project-narrative__nav-door project-narrative__nav-door--next">
              <span className="project-narrative__nav-label">NEXT WORLD →</span>
              <span className="project-narrative__nav-name">{nextProject.title}</span>
            </Link>
          </footer>
        </main>
      </div>
    </article>
  );
}
