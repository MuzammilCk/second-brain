import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import conceptsData from '../data/generated/concepts.json';
import './Garden.css';

export default function Garden() {
  return (
    <div className="garden-page" id="garden-page">
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Knowledge</span>
            <h1 className="section-title">Digital Garden</h1>
            <p className="section-subtitle">
              Living technical notes and concepts — growing one idea at a time. 
              Each node is an atomic concept, interconnected with projects and other ideas.
            </p>
          </div>

          <div className="garden-grid stagger-children" id="garden-grid">
            {conceptsData.map((concept, i) => (
              <motion.div
                key={concept.slug}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Link
                  to={`/garden/${concept.slug}`}
                  className="glass-card garden-card"
                  id={`concept-${concept.slug}`}
                >
                  <div className="garden-card__icon">
                    {concept.slug === 'automl' ? '🤖' :
                     concept.slug === 'video-intelligence' ? '📹' :
                     concept.slug === 'three-physics' ? '🎮' :
                     concept.slug === 'skillopt' ? '⚡' : '📝'}
                  </div>
                  <span className="badge badge-concept">concept</span>
                  <h3 className="garden-card__title">{concept.title}</h3>
                  <p className="garden-card__excerpt">
                    {concept.contentMd?.split('\n').find(l => l.length > 20 && !l.startsWith('#') && !l.startsWith('---'))?.slice(0, 160) || ''}
                  </p>
                  <div className="garden-card__footer">
                    <span className="garden-card__date">{concept.lastUpdated || concept.created}</span>
                    <span className="garden-card__arrow">→</span>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Placeholder for growing garden */}
            <div className="glass-card garden-card garden-card--placeholder">
              <div className="garden-card__icon">🌱</div>
              <h3 className="garden-card__title" style={{ color: 'var(--text-muted)' }}>
                More growing...
              </h3>
              <p className="garden-card__excerpt">
                New concepts are added as I learn. Each engineering session or research deep-dive 
                produces an atomic note here.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
