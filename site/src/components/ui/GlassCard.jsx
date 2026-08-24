import { Link } from 'react-router-dom';
import './GlassCard.css';

export default function GlassCard({ project }) {
  const statusClass = project.status === 'active' ? 'badge-active' :
    (project.status === 'shipped' || project.status === 'done') ? 'badge-shipped' : 'badge-concept';

  return (
    <Link to={`/projects/${project.slug}`} className="glass-card project-card" id={`project-${project.slug}`}>
      <div className="project-card__header">
        <span className={`badge ${statusClass}`}>{project.status}</span>
        {project.decisionCount > 0 && (
          <span className="project-card__decisions">
            {project.decisionCount} decision{project.decisionCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <h3 className="project-card__title">{project.title}</h3>

      <p className="project-card__desc">
        {project.contentMd?.split('\n').find(l => l.length > 20 && !l.startsWith('#') && !l.startsWith('---'))?.slice(0, 140) || ''}
      </p>

      <div className="project-card__stack">
        {project.stack.slice(0, 5).map(tech => (
          <span key={tech} className="tech-pill">{tech}</span>
        ))}
        {project.stack.length > 5 && (
          <span className="tech-pill tech-pill--more">+{project.stack.length - 5}</span>
        )}
      </div>

      <div className="project-card__footer">
        <span className="project-card__date">
          {(() => {
            const d = project.lastUpdated || project.created || '';
            if (!d) return '';
            try {
              const date = new Date(d);
              if (isNaN(date)) return String(d);
              return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            } catch { return String(d); }
          })()}
        </span>
        <span className="project-card__arrow">→</span>
      </div>
    </Link>
  );
}
