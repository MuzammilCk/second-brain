import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import conceptsData from '../../data/generated/concepts.json';
import { tactileAudio } from '../../utils/tactileAudio';
import styles from './ConceptsGrid.module.css';

// Extract clean introductory excerpt from markdown body
function extractExcerpt(markdown = '', maxLength = 160) {
  if (!markdown) return 'Theoretical concept and architectural design patterns.';
  const lines = markdown.split('\n');
  const contentLines = lines.filter((l) => {
    const t = l.trim();
    return t && !t.startsWith('#') && !t.startsWith('![') && !t.startsWith('```');
  });

  const raw = contentLines.join(' ').replace(/\*\*(.*?)\*\*/g, '$1').replace(/\[\[.*?\|(.*?)\]\]/g, '$1').replace(/\[\[(.*?)\]\]/g, '$1');
  if (raw.length <= maxLength) return raw;
  return raw.slice(0, maxLength) + '...';
}

const CONCEPT_TAGS = {
  automl: ['Bayesian HPO', 'Google Vizier', 'Neural Meta-Learners'],
  skillopt: ['Agent Self-Evolution', 'Microsoft Research', 'Sleep Cycles'],
  'three-physics': ['Verlet Integration', 'Cloth Dynamics', 'WebGL Shaders'],
  'video-intelligence': ['Signal Manifest', 'Whisper ASR', 'PaddleOCR'],
};

export default function ConceptsGrid() {
  // Support both array structure (legacy) and object with concepts array (new compiler format)
  const rawList = useMemo(() => {
    if (Array.isArray(conceptsData)) return conceptsData;
    return conceptsData?.concepts || [];
  }, []);

  // Filter out the index overview note from cards, keeping atomic concept notes
  const concepts = useMemo(() => {
    return rawList
      .filter((c) => c.id !== 'index' && c.slug !== 'index')
      .map((c) => ({
        ...c,
        id: c.id || c.slug,
        excerpt: extractExcerpt(c.body_markdown || c.content || ''),
        tags: (c.tags && c.tags.length > 0) ? c.tags : (CONCEPT_TAGS[c.id || c.slug] || ['Systems', 'Architecture']),
      }));
  }, [rawList]);

  return (
    <section className={styles.conceptsSection} id="concepts-grid" aria-label="Conceptual Architecture & Research Notes">
      <div className={styles.sectionHeader}>
        <div>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            <span>04 // ATOMIC CONCEPTS & SCHEMAS</span>
          </div>
          <h2 className={styles.title}>Deep Conceptual Specifications</h2>
          <p className={styles.subtitle}>
            Formal technical notes, mathematical models, and algorithmic frameworks derived across production workloads.
          </p>
        </div>

        <div className={styles.headerCount}>
          <span>{concepts.length} CURATED ATOMS</span>
        </div>
      </div>

      <div className={styles.grid}>
        {concepts.map((concept) => (
          <Link
            key={concept.id}
            to={`/concepts/${concept.id}`}
            className={styles.conceptCard}
            onClick={() => tactileAudio.playKeycapPress()}
            id={`concept-card-${concept.id}`}
          >
            <div className={styles.cardGlow} />

            <div className={styles.cardHeader}>
              <span className={styles.cardId}>SPEC // {concept.id.toUpperCase()}</span>
              <span className={styles.cardBadge}>TECHNICAL NOTE</span>
            </div>

            <h3 className={styles.cardTitle}>{concept.title}</h3>
            <p className={styles.cardExcerpt}>{concept.excerpt}</p>

            <div className={styles.cardFooter}>
              <div className={styles.cardTags}>
                {concept.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className={styles.tagPill}>
                    {tag}
                  </span>
                ))}
              </div>

              <span className={styles.openLink}>
                <span>Read Note</span>
                <span>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
