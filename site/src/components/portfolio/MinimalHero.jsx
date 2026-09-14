import { Link } from 'react-router-dom';
import RevealFx from '../ui/RevealFx';
import TactileConsole3D from '../three/TactileConsole3D';
import styles from './MinimalHero.module.css';

export default function MinimalHero({
  activeSystemIndex = 0,
  onSelectSystem,
  onInspect,
}) {
  return (
    <section className={styles.heroSection} aria-label="Muzammil CK Engineering Studio">
      <div className={styles.heroContainer}>
        {/* Once UI Featured Work Pill */}
        <RevealFx translateY={-8} delay={0.05}>
          <Link to="/projects?inspect=assetflow" className={styles.featuredBadge} id="hero-featured-badge">
            <span className={styles.featuredTag}>✦ FEATURED SYSTEM</span>
            <span className={styles.badgeDivider} aria-hidden="true" />
            <span className={styles.featuredTitle}>AssetFlow // Zero-Overlap PostgreSQL GiST Engine</span>
            <span className={styles.badgeArrow}>→</span>
          </Link>
        </RevealFx>

        {/* Monumental Editorial Headline */}
        <RevealFx translateY={12} delay={0.15}>
          <h1 className={styles.headline}>
            Systems Forged Under <span className={styles.editorialItalic}>Pressure.</span>
          </h1>
        </RevealFx>

        {/* Concise One-Sentence Ethos */}
        <RevealFx translateY={14} delay={0.25}>
          <p className={styles.ethos}>
            I'm Muzammil, a Systems Architect &amp; ML Engineer building high-assurance distributed software and edge intelligence. Stress-testing sub-400ms voice pipelines and confidential computing under strict physical invariants.
          </p>
        </RevealFx>

        {/* ── 3D TACTILE HARDWARE SYNTHESIZER CONSOLE (Teenage Engineering Precision Unit) ── */}
        <RevealFx translateY={20} delay={0.3}>
          <div className={styles.consoleContainer}>
            <TactileConsole3D
              activeSystemIndex={activeSystemIndex}
              onSelectSystem={onSelectSystem}
              onInspect={onInspect}
            />
          </div>
        </RevealFx>

        {/* Action Group */}
        <RevealFx translateY={16} delay={0.4}>
          <div className={styles.actionRow}>
            <Link to="/projects" className={styles.primaryBtn} id="hero-explore-work-btn">
              <span>Explore Engineering Atlas</span>
              <span className={styles.btnArrow}>→</span>
            </Link>
            <Link to="/radar" className={styles.ghostBtn} id="hero-telemetry-btn">
              <span>Live Radar Telemetry</span>
              <span className={styles.ghostIcon}>📡</span>
            </Link>
          </div>
        </RevealFx>

        {/* Minimalist Live Status Bar */}
        <RevealFx translateY={12} delay={0.45}>
          <div className={styles.statusTicker}>
            <span className={styles.tickerItem}>
              <span className={styles.tickerDot} /> All Systems Nominal
            </span>
            <span className={styles.tickerSep}>/</span>
            <span className={styles.tickerItem}>Postgres GiST Verified</span>
            <span className={styles.tickerSep}>/</span>
            <span className={styles.tickerItem}>30+ Repos Synced</span>
            <span className={styles.tickerSep}>/</span>
            <span className={styles.tickerItem}>Kerala Lab · 2026</span>
          </div>
        </RevealFx>
      </div>
    </section>
  );
}
