import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TimelineNode.css';

export default function TimelineNode({ decision, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="timeline-node"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      id={`decision-${index}`}
    >
      <div className="timeline-node__connector">
        <div className="timeline-node__dot" />
        <div className="timeline-node__line" />
      </div>

      <div className="timeline-node__content">
        <button
          className="timeline-node__header"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <div className="timeline-node__meta">
            <span className="timeline-node__date">{decision.date}</span>
            <span className={`badge ${decision.status === 'active' ? 'badge-active' : 'badge-shipped'}`}>
              {decision.status}
            </span>
          </div>
          <h4 className="timeline-node__title">{decision.title}</h4>
          <span className={`timeline-node__chevron ${expanded ? 'timeline-node__chevron--open' : ''}`}>
            ▾
          </span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              className="timeline-node__details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {decision.context && (
                <div className="timeline-node__field">
                  <span className="timeline-node__label">Context</span>
                  <p>{decision.context}</p>
                </div>
              )}
              {decision.decision && (
                <div className="timeline-node__field">
                  <span className="timeline-node__label">Decision</span>
                  <p>{decision.decision}</p>
                </div>
              )}
              {decision.alternatives && (
                <div className="timeline-node__field">
                  <span className="timeline-node__label">Alternatives</span>
                  <p>{decision.alternatives}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
