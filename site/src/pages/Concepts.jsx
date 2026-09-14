import ConnectedMind from '../components/portfolio/ConnectedMind';
import ConceptsGrid from '../components/portfolio/ConceptsGrid';
import styles from './Concepts.module.css';

export default function Concepts() {
  return (
    <div className={styles.pageContainer} id="concepts-page">
      {/* ── Page Header ── */}
      <header className={styles.heroHeader} aria-label="Conceptual garden header">
        <div className={styles.headerInner}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            <span>VAULT KNOWLEDGE ATLAS // CORE/WIKI/CONCEPTS</span>
          </div>
          <h1 className={styles.title}>Concepts & Systems Constellation</h1>
          <p className={styles.subtitle}>
            A living graph of mental models, mathematical invariants, and architectural decisions connecting technical concepts to production code.
          </p>
        </div>
      </header>

      {/* ── Connected Mind Constellation (Full view) ── */}
      <ConnectedMind variant="full" />

      {/* ── Concepts Grid (Reading from concepts.json) ── */}
      <ConceptsGrid />
    </div>
  );
}
