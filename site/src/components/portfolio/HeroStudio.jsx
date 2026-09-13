import { motion } from 'framer-motion';
import './HeroStudio.css';

export default function HeroStudio({ onExploreWork, onWatchIntro }) {
  return (
    <section className="hero-studio" id="me">
      {/* ── Tripartite Main Grid ── */}
      <div className="hero-studio__grid">
        
        {/* Left Column: Vertical Index Directory */}
        <aside className="hero-studio__index-col" aria-label="Index Directory">
          <span className="hero-studio__index-header">INDEX DIRECTORY</span>
          <nav className="hero-studio__index-nav">
            <a href="#me" className="hero-studio__index-item hero-studio__index-item--active">
              <span className="hero-studio__index-title">
                01 ME <span className="hero-studio__index-badge">ACTIVE</span>
              </span>
              <span className="hero-studio__index-desc">Who I am</span>
            </a>
            <a href="#mind" className="hero-studio__index-item">
              <span className="hero-studio__index-title">02 WORLD</span>
              <span className="hero-studio__index-desc">How I think</span>
            </a>
            <a href="#projects" className="hero-studio__index-item">
              <span className="hero-studio__index-title">03 WORK</span>
              <span className="hero-studio__index-desc">What I build</span>
            </a>
            <a href="#architectural-pivots" className="hero-studio__index-item">
              <span className="hero-studio__index-title">04 EVOLUTION</span>
              <span className="hero-studio__index-desc">How I grow</span>
            </a>
            <a href="#thinking-lab" className="hero-studio__index-item">
              <span className="hero-studio__index-title">05 EXPERIMENTS</span>
              <span className="hero-studio__index-desc">What I explore</span>
            </a>
            <a href="#systems-ledger" className="hero-studio__index-item">
              <span className="hero-studio__index-title">06 ARCHIVE</span>
              <span className="hero-studio__index-desc">Everything else</span>
            </a>
          </nav>
        </aside>

        {/* Center Column: Core Narrative & Persona */}
        <div className="hero-studio__narrative-col">
          <div className="hero-studio__role-tag">
            <span className="hero-studio__role-dot"></span>
            <span className="hero-studio__role-text">CS STUDENT &bull; BUILDER &bull; SYSTEMS THINKER</span>
          </div>

          <h1 className="hero-studio__headline">
            I build things to <span className="underline-hand hero-studio__accent">understand</span> how they work.
          </h1>

          <p className="hero-studio__lead">
            Exploring the intersection of AI, software, and human curiosity. This is my public studio, a window into the systems I build, the ideas I explore, and the person I'm becoming.
          </p>

          <div className="hero-studio__actions">
            <a 
              href="#projects" 
              className="hero-studio__btn-primary"
              onClick={onExploreWork}
            >
              <span>Explore My Work</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>

            <button 
              className="hero-studio__btn-secondary"
              onClick={onWatchIntro}
              type="button"
            >
              <span className="material-symbols-outlined hero-studio__play-icon">play_circle</span>
              <span>Flagship Story</span>
            </button>
          </div>

          <div className="hero-studio__meta-row">
            <span className="hero-studio__meta-item">
              <span className="hero-studio__meta-dot hero-studio__meta-dot--amber">●</span> 14 Distributed Systems
            </span>
            <span className="hero-studio__meta-item">
              <span className="hero-studio__meta-dot hero-studio__meta-dot--sage">●</span> Open Source Kernel
            </span>
            <span className="hero-studio__meta-item">
              <span className="hero-studio__meta-dot hero-studio__meta-dot--sand">●</span> Kerala &rarr; Global
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

            {/* Typographic badge: SOME IDEAS NEVER LET YOU SLEEP */}
            <div className="hero-studio__badge-sleep">
              SOME IDEAS NEVER LET YOU SLEEP
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
          <span className="hero-studio__manifesto-label">&para; MANIFESTO:</span>
          <span className="hero-studio__manifesto-text">
            IDEAS &bull; SYSTEMS &bull; PEOPLE &bull; A MORE INTERESTING TOMORROW
          </span>
        </div>

        <div className="hero-studio__live-pill">
          <span className="hero-studio__live-indicator">
            <span className="hero-studio__live-ping"></span>
            <span className="hero-studio__live-dot"></span>
          </span>
          <span className="hero-studio__live-text">
            <strong className="hero-studio__live-strong">CURRENTLY</strong> Building Something Interesting
          </span>
          <span className="hero-studio__live-sep">/</span>
          <span className="hero-studio__live-year">2026</span>
        </div>
      </footer>
    </section>
  );
}
