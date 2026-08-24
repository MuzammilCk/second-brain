import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import GlassCard from '../components/ui/GlassCard';
import statsData from '../data/generated/stats.json';
import projectsData from '../data/generated/projects.json';
import logData from '../data/generated/log.json';
import './Home.css';

const HeroScene = lazy(() => import('../components/three/HeroScene'));

export default function Home() {
  const featured = projectsData.filter(p => p.status === 'active').slice(0, 4);
  const recentLog = logData.slice(0, 6);

  return (
    <div className="home" id="home-page">
      {/* ── Hero ─────────────────────── */}
      <section className="hero" id="hero-section">
        <div className="hero__3d">
          <Suspense fallback={null}>
            <HeroScene projects={projectsData} />
          </Suspense>
        </div>

        <div className="hero__content container">
          <motion.div
            className="hero__text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="section-label">Welcome to the Codex</span>
            <h1 className="hero__title">
              Building systems<br />
              <span className="gradient-text">that think.</span>
            </h1>
            <p className="hero__subtitle">
              Developer, builder, and lifelong learner. Exploring AI pipelines,
              3D web experiences, and offline-first systems — powered by a living knowledge vault.
            </p>
            <div className="hero__actions">
              <Link to="/projects" className="btn btn-primary" id="hero-cta-projects">
                Explore Projects
              </Link>
              <Link to="/now" className="btn btn-ghost" id="hero-cta-now">
                What I'm doing now →
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="hero__gradient-orb hero__gradient-orb--1" />
        <div className="hero__gradient-orb hero__gradient-orb--2" />
      </section>

      {/* ── Stats ────────────────────── */}
      <section className="stats-section section-sm" id="stats-section">
        <div className="container">
          <div className="stats-grid">
            <AnimatedCounter value={statsData.totalProjects} label="Projects" />
            <AnimatedCounter value={statsData.totalDecisions} label="Decisions Logged" />
            <AnimatedCounter value={statsData.totalConcepts} label="Concepts" />
            <AnimatedCounter value={statsData.totalTechnologies} label="Technologies" suffix="+" />
          </div>
        </div>
      </section>

      {/* ── Featured Projects ────────── */}
      <section className="section" id="featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Featured Work</span>
            <h2 className="section-title">Active Projects</h2>
            <p className="section-subtitle">
              What I'm currently building — each with its own architectural decision trail.
            </p>
          </div>

          <div className="grid-auto stagger-children">
            {featured.map(project => (
              <GlassCard key={project.slug} project={project} />
            ))}
          </div>

          <div className="section-cta">
            <Link to="/projects" className="btn btn-ghost" id="featured-see-all">
              View all {projectsData.length} projects →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Activity Feed ────────────── */}
      <section className="section" id="activity-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Activity</span>
            <h2 className="section-title">Recent Signal</h2>
          </div>

          <div className="activity-feed glass-card">
            <div className="terminal-header">
              <span className="terminal-dot terminal-dot--red" />
              <span className="terminal-dot terminal-dot--yellow" />
              <span className="terminal-dot terminal-dot--green" />
              <span className="terminal-title">~/codex/wiki/log.md</span>
            </div>
            <div className="terminal-body">
              {recentLog.map((entry, i) => (
                <div key={i} className="terminal-line">
                  <span className="terminal-date">{entry.date}</span>
                  <span className="terminal-label">{entry.label}</span>
                  <span className="terminal-desc">{entry.description.slice(0, 120)}{entry.description.length > 120 ? '…' : ''}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
