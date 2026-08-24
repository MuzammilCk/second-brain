import { motion } from 'framer-motion';
import logData from '../data/generated/log.json';
import prioritiesData from '../data/generated/priorities.json';
import projectsData from '../data/generated/projects.json';
import './Now.css';

export default function Now() {
  const activeProjects = projectsData.filter(p => p.status === 'active');

  return (
    <div className="now-page" id="now-page">
      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-header">
            <span className="section-label">Status</span>
            <h1 className="section-title">What I'm Doing Now</h1>
            <p className="section-subtitle">
              A living snapshot of my current focus — auto-generated from the Codex vault.
              Inspired by <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer">nownownow.com</a>.
            </p>
          </div>

          {/* Active Projects */}
          <motion.div
            className="glass-card now-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="now-section__title">
              <span className="now-section__icon">🚀</span>
              Active Projects
            </h2>
            <div className="now-projects">
              {activeProjects.map(p => (
                <div key={p.slug} className="now-project" id={`now-project-${p.slug}`}>
                  <div className="now-project__dot" />
                  <div>
                    <strong>{p.title}</strong>
                    <span className="now-project__stack">
                      {p.stack.slice(0, 3).join(' · ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Areas & Resources */}
          {prioritiesData.areas && (
            <motion.div
              className="glass-card now-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="now-section__title">
                <span className="now-section__icon">🎯</span>
                Focus Areas
              </h2>
              <div className="now-tags">
                {prioritiesData.areas.map((area, i) => (
                  <div key={i} className="now-tag">{area.replace(/\*\*/g, '')}</div>
                ))}
              </div>
            </motion.div>
          )}

          {prioritiesData.resources && (
            <motion.div
              className="glass-card now-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="now-section__title">
                <span className="now-section__icon">📚</span>
                Currently Learning
              </h2>
              <div className="now-tags">
                {prioritiesData.resources.map((r, i) => (
                  <span key={i} className="tech-pill">{r}</span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Log Feed */}
          <motion.div
            className="glass-card now-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="now-section__title">
              <span className="now-section__icon">📋</span>
              Recent Activity Log
            </h2>
            <div className="now-log">
              {logData.map((entry, i) => (
                <div key={i} className="now-log__entry">
                  <span className="now-log__date">{entry.date}</span>
                  <span className="now-log__label">{entry.label}</span>
                  <p className="now-log__desc">{entry.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
