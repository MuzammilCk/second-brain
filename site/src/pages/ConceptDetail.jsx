import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import conceptsData from '../data/generated/concepts.json';

export default function ConceptDetail() {
  const { slug } = useParams();
  const concept = conceptsData.find(c => c.slug === slug);

  if (!concept) {
    return (
      <div className="container section">
        <h1>Concept not found</h1>
        <Link to="/garden" className="btn btn-ghost">← Back to garden</Link>
      </div>
    );
  }

  return (
    <div className="concept-detail" id={`concept-${slug}`}>
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <nav className="breadcrumb">
            <Link to="/garden">Garden</Link>
            <span className="breadcrumb__sep">/</span>
            <span>{concept.title}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge badge-concept" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
              concept
            </span>
            <h1 style={{ marginBottom: 'var(--space-4)' }}>{concept.title}</h1>
            {concept.lastUpdated && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-8)' }}>
                Last updated: {concept.lastUpdated}
              </p>
            )}

            <div className="glass-card">
              <div
                className="markdown-content"
                dangerouslySetInnerHTML={{ __html: concept.contentHtml }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
