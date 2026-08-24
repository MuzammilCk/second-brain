import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TimelineNode from '../components/ui/TimelineNode';
import projectsData from '../data/generated/projects.json';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projectsData.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="container section">
        <h1>Project not found</h1>
        <Link to="/projects" className="btn btn-ghost">← Back to projects</Link>
      </div>
    );
  }

  return (
    <div className="project-detail" id={`project-detail-${slug}`}>
      <section className="section">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb" id="project-breadcrumb">
            <Link to="/projects">Projects</Link>
            <span className="breadcrumb__sep">/</span>
            <span>{project.title}</span>
          </nav>

          {/* Header */}
          <motion.div
            className="project-detail__header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="project-detail__meta">
              <span className={`badge ${project.status === 'active' ? 'badge-active' : 'badge-shipped'}`}>
                {project.status}
              </span>
              {project.created && (
                <span className="project-detail__date">Since {project.created}</span>
              )}
            </div>

            <h1 className="project-detail__title">{project.title}</h1>

            <div className="project-detail__stack">
              {project.stack.map(tech => (
                <span key={tech} className="tech-pill">{tech}</span>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <div className="project-detail__layout">
            <div className="project-detail__content">
              <div className="glass-card">
                <h3 className="project-detail__section-title">Overview</h3>
                <div
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ __html: project.contentHtml }}
                />
              </div>
            </div>

            {/* Decision Timeline Sidebar */}
            {project.decisions.length > 0 && (
              <aside className="project-detail__sidebar">
                <div className="glass-card">
                  <h3 className="project-detail__section-title">
                    <span className="gradient-text">Decision Timeline</span>
                    <span className="project-detail__decision-count">
                      {project.decisions.length}
                    </span>
                  </h3>
                  <div className="project-detail__timeline" id="decision-timeline">
                    {project.decisions.map((d, i) => (
                      <TimelineNode key={i} decision={d} index={i} />
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
