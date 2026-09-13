import './HeroStudio.css';

export default function HeroStudio({ onExploreWork, onWatchIntro }) {
  return (
    <section className="hero-studio" id="me">
      {/* ── Tripartite Main Grid ── */}
      <div className="hero-studio__grid">
        
        {/* Left Column: Personal Studio Guide */}
        <aside className="hero-studio__index-col" aria-label="Studio Wayfinding">
          <span className="hero-studio__index-header">STUDIO GUIDE</span>
          <nav className="hero-studio__index-nav">
            <a href="#me" className="hero-studio__index-item hero-studio__index-item--active">
              <span className="hero-studio__index-title">
                01 · ME <span className="hero-studio__index-badge">HERE</span>
              </span>
              <span className="hero-studio__index-desc">Who I am</span>
            </a>
            <a href="#mind" className="hero-studio__index-item">
              <span className="hero-studio__index-title">02 · MIND</span>
              <span className="hero-studio__index-desc">Connected ideas</span>
            </a>
            <a href="#projects" className="hero-studio__index-item">
              <span className="hero-studio__index-title">03 · WORLDS</span>
              <span className="hero-studio__index-desc">Projects as doors</span>
            </a>
            <a href="#architectural-pivots" className="hero-studio__index-item">
              <span className="hero-studio__index-title">04 · FORGE</span>
              <span className="hero-studio__index-desc">Failures & pivots</span>
            </a>
            <a href="#thinking-lab" className="hero-studio__index-item">
              <span className="hero-studio__index-title">05 · THE LAB</span>
              <span className="hero-studio__index-desc">Garden & sandbox</span>
            </a>
            <a href="#systems-ledger" className="hero-studio__index-item">
              <span className="hero-studio__index-title">06 · ARCHIVE</span>
              <span className="hero-studio__index-desc">The complete library</span>
            </a>
          </nav>
        </aside>

        {/* Center Column: Core Narrative & Persona */}
        <div className="hero-studio__narrative-col">
          <div className="hero-studio__role-tag">
            <span className="hero-studio__role-dot"></span>
            <span className="hero-studio__role-text">CS STUDENT · SYSTEMS BUILDER · FIRST-PRINCIPLES EXPLORER</span>
          </div>

          <h1 className="hero-studio__headline">
            I build systems from scratch to <span className="underline-hand hero-studio__accent">understand</span> how they actually work.
          </h1>

          <p className="hero-studio__lead">
            Most people use AI to write wrappers. I use it to explore edge intelligence, audio latency, and physical constraints. When something breaks, I don't hide the crash — I trace the invariant. This is my public studio: the things I build, the constraints I run into, and how I evolve.
          </p>

          <div className="hero-studio__actions">
            <a 
              href="#projects" 
              className="hero-studio__btn-primary"
              onClick={onExploreWork}
            >
              <span>Enter The Worlds</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>

            <button 
              className="hero-studio__btn-secondary"
              onClick={onWatchIntro}
              type="button"
            >
              <span className="material-symbols-outlined hero-studio__play-icon">play_circle</span>
              <span>The 8h Sprint Story</span>
            </button>
          </div>

          <div className="hero-studio__meta-row">
            <span className="hero-studio__meta-item">
              <span className="hero-studio__meta-dot hero-studio__meta-dot--amber">●</span> Studio Lab · Kerala, India
            </span>
            <span className="hero-studio__meta-item">
              <span className="hero-studio__meta-dot hero-studio__meta-dot--sage">●</span> ThinkPad L13 · On-Device Systems
            </span>
            <span className="hero-studio__meta-item">
              <span className="hero-studio__meta-dot hero-studio__meta-dot--sand">●</span> Second Brain in Public
            </span>
          </div>
        </div>

        {/* Right Column: Atmospheric Studio Visual & Handwritten Overlays */}
        <div className="hero-studio__photo-col">
          <div className="hero-studio__photo-card group">
            <img 
              src="/images/hero-workspace.png" 
              alt="Muzammil CK working at dusk studio with mountain vistas and warm ambient amber light"
              className="hero-studio__photo-img"
              loading="eager"
            />
            <div className="hero-studio__photo-gradient"></div>
            <div className="hero-studio__photo-overlay"></div>

            {/* Handwritten overlay: Curiosity Compounds Everything */}
            <div className="hero-studio__note hero-studio__note--top">
              <span className="font-handwritten hero-studio__note-text hero-studio__note-text--amber">
                Curiosity Compounds Everything
              </span>
            </div>

            {/* Handwritten overlay: Better Systems Brighter People */}
            <div className="hero-studio__note hero-studio__note--bottom">
              <span className="font-handwritten hero-studio__note-text hero-studio__note-text--sand">
                Better Systems Brighter People
              </span>
            </div>

            {/* Typographic badge: MUZAMMIL'S DESK · LATE NIGHT BUILD */}
            <div className="hero-studio__badge-sleep">
              MUZAMMIL'S DESK · FIRST-PRINCIPLES LAB
            </div>
          </div>
        </div>

        {/* Far Right Vertical Ribbon Strip */}
        <aside className="hero-studio__vertical-ribbon" aria-hidden="true">
          <div className="hero-studio__ribbon-text">
            <span>REPEAT</span>
            <span className="hero-studio__ribbon-dot">&bull;</span>
            <span>LEARN</span>
            <span className="hero-studio__ribbon-dot">&bull;</span>
            <span>BUILD</span>
            <span className="hero-studio__ribbon-dot">&bull;</span>
            <span className="hero-studio__ribbon-highlight">THINK</span>
          </div>
        </aside>

      </div>

      {/* ── Bottom Manifesto & Live Status Ribbon ── */}
      <footer className="hero-studio__bottom-ribbon">
        <div className="hero-studio__manifesto">
          <span className="hero-studio__manifesto-label">&para; PHILOSOPHY:</span>
          <span className="hero-studio__manifesto-text">
            FIRST PRINCIPLES OVER BOILERPLATE &bull; HONEST POST-MORTEMS OVER POLISHED DEMOS &bull; REAL CONSTRAINTS
          </span>
        </div>

        <div className="hero-studio__live-pill">
          <span className="hero-studio__live-indicator">
            <span className="hero-studio__live-ping"></span>
            <span className="hero-studio__live-dot"></span>
          </span>
          <span className="hero-studio__live-text">
            <strong className="hero-studio__live-strong">CURRENT SPRINT</strong> Voice AI Pipelines & Edge Inference
          </span>
          <span className="hero-studio__live-sep">/</span>
          <span className="hero-studio__live-year">2026</span>
        </div>
      </footer>
    </section>
  );
}
