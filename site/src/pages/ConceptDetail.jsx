import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import conceptsData from '../data/generated/concepts.json';
import styles from './ConceptDetail.module.css';

// Transform mathematical LaTeX expressions and wiki-links into styled HTML
function processMarkdownWithLatex(rawMarkdown = '') {
  if (!rawMarkdown) return '';

  // 1. Convert Display Math: $$ ... $$
  let text = rawMarkdown.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    const cleanMath = math.trim().replace(/\\/g, '&#92;');
    return `\n\n<div class="${styles.mathBlock}">${cleanMath}</div>\n\n`;
  });

  // 2. Convert Inline Math: $ ... $
  text = text.replace(/\$([^$\n]+?)\$/g, (_, math) => {
    return `<span class="${styles.mathInline}">${math.trim()}</span>`;
  });

  // 3. Resolve Obsidian-style internal wiki links: [[slug|Title]] or [[slug]]
  text = text.replace(/\[\[(.*?)\|(.*?)\]\]/g, (_, target, label) => {
    return `<a href="/concepts/${target.trim()}" class="${styles.breadcrumbLink}"><strong>${label.trim()}</strong></a>`;
  });
  text = text.replace(/\[\[(.*?)\]\]/g, (_, target) => {
    return `<a href="/concepts/${target.trim()}" class="${styles.breadcrumbLink}"><strong>${target.trim()}</strong></a>`;
  });

  // 4. Parse standard GitHub Flavored Markdown with marked
  try {
    return marked.parse(text);
  } catch (err) {
    console.error('Error parsing markdown:', err);
    return text;
  }
}

export default function ConceptDetail() {
  const { id, slug } = useParams();
  const conceptKey = id || slug;

  const conceptList = useMemo(() => {
    if (Array.isArray(conceptsData)) return conceptsData;
    return conceptsData?.concepts || [];
  }, []);

  const concept = useMemo(() => {
    return conceptList.find((c) => c.id === conceptKey || c.slug === conceptKey);
  }, [conceptList, conceptKey]);

  const renderedHtml = useMemo(() => {
    return processMarkdownWithLatex(concept?.body_markdown || concept?.content || '');
  }, [concept]);

  if (!concept) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.articleContainer}>
          <div className={styles.errorCard}>
            <h1 className={styles.title}>Concept Note Not Found</h1>
            <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
              The requested conceptual atom [<code>{conceptKey}</code>] has not been compiled into concepts.json.
            </p>
            <Link to="/concepts" className={styles.breadcrumbLink}>
              ← Return to Concepts Constellation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer} id={`concept-detail-${concept.id}`}>
      <article className={styles.articleContainer}>
        {/* ── Breadcrumb ── */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb navigation">
          <Link to="/" className={styles.breadcrumbLink}>Studio</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link to="/concepts" className={styles.breadcrumbLink}>Concepts</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span style={{ color: '#f3f4f6' }}>{concept.title}</span>
        </nav>

        {/* ── Header ── */}
        <div className={styles.conceptBadge}>
          <span>SPECIFICATION // {concept.id.toUpperCase()}</span>
        </div>
        <h1 className={styles.title}>{concept.title}</h1>

        <div className={styles.metaBar}>
          <div className={styles.metaItem}>
            <span>SOURCE:</span>
            <span style={{ color: '#9ca3af' }}>core/wiki/concepts/{concept.id}.md</span>
          </div>
          {concept.last_verified && (
            <div className={styles.metaItem}>
              <span>VERIFIED:</span>
              <span style={{ color: '#9ca3af' }}>{concept.last_verified}</span>
            </div>
          )}
        </div>

        {/* ── Rendered Markdown with LaTeX & Syntax Highlighting ── */}
        <div className={styles.contentCard}>
          <div
            className={styles.markdownBody}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </div>
      </article>
    </div>
  );
}
