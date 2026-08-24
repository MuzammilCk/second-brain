import { useState, useMemo } from 'react';
import GlassCard from '../components/ui/GlassCard';
import projectsData from '../data/generated/projects.json';
import './Projects.css';

export default function Projects() {
  const [filter, setFilter] = useState('all');

  const filters = useMemo(() => {
    const statuses = new Set(projectsData.map(p => p.status));
    return ['all', ...statuses];
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return projectsData;
    return projectsData.filter(p => p.status === filter);
  }, [filter]);

  // Collect all unique techs for display
  const techCounts = useMemo(() => {
    const map = {};
    projectsData.forEach(p => p.stack.forEach(t => { map[t] = (map[t] || 0) + 1; }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, []);

  return (
    <div className="projects-page" id="projects-page">
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Portfolio</span>
            <h1 className="section-title">Projects</h1>
            <p className="section-subtitle">
              {projectsData.length} projects across AI, full-stack, 3D, and systems engineering
              — each with full architectural decision trails.
            </p>
          </div>

          {/* Filter chips */}
          <div className="projects-filters" id="project-filters">
            {filters.map(f => (
              <button
                key={f}
                className={`projects-filter ${filter === f ? 'projects-filter--active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
                {f !== 'all' && (
                  <span className="projects-filter__count">
                    {projectsData.filter(p => p.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tech cloud */}
          <div className="tech-cloud" id="tech-cloud">
            {techCounts.map(([tech, count]) => (
              <span key={tech} className="tech-pill" title={`Used in ${count} project(s)`}>
                {tech}
              </span>
            ))}
          </div>

          {/* Project grid */}
          <div className="grid-auto stagger-children" id="projects-grid">
            {filtered.map(project => (
              <GlassCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
