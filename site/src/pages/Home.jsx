import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import HeroStudio from '../components/portfolio/HeroStudio';
import ConnectedMind from '../components/portfolio/ConnectedMind';
import ProjectWorlds from '../components/portfolio/ProjectWorlds';
import ArchitecturalPivots from '../components/portfolio/ArchitecturalPivots';
import ThinkingLab from '../components/portfolio/ThinkingLab';
import DirectoryRow from '../components/portfolio/DirectoryRow';
import ArchitectureDrawer from '../components/portfolio/ArchitectureDrawer';

import portfolioData from '../data/generated/portfolio.json';
import './Home.css';

export default function Home() {
  const [inspectedProject, setInspectedProject] = useState(null);

  const enrichedProjects = useMemo(() => {
    return (portfolioData?.projects || []).map((p) => ({
      ...p,
      slug: p.slug || p.id,
      contentMd: p.body_markdown || '',
      decisionCount: p.decision_count || p.decisions?.length || 0,
    }));
  }, []);

  const flagshipProject = useMemo(() => {
    return enrichedProjects.find((p) => p.slug === 'odoo-hackathon') || enrichedProjects[0];
  }, [enrichedProjects]);

  // Curate 4 systems for the teaser ledger on the home page
  const ledgerPreview = useMemo(() => {
    const prioritySlugs = ['esg-audit-system', 'repomind', 'metatune', 'hadi'];
    return enrichedProjects.filter((p) => prioritySlugs.includes(p.slug));
  }, [enrichedProjects]);

  const handleInspect = (project) => {
    const fullProject = enrichedProjects.find((p) => p.slug === project.slug) || project;
    setInspectedProject(fullProject);
  };

  const handleCloseDrawer = () => {
    setInspectedProject(null);
  };

  const handleWatchIntro = () => {
    if (flagshipProject) {
      handleInspect(flagshipProject);
    }
  };

  return (
    <div className="home-studio" id="home-studio">
      {/* Subtle atmospheric background grid */}
      <div className="grain-overlay" aria-hidden="true"></div>

      {/* ── SECTION 01: Hero Studio ── */}
      <HeroStudio 
        onExploreWork={() => {}}
        onWatchIntro={handleWatchIntro}
      />

      {/* ── SECTION 02: Connected Mind Map ── */}
      <ConnectedMind />

      {/* ── SECTION 03: Project Worlds Carousel ── */}
      <ProjectWorlds 
        projects={enrichedProjects}
        onInspect={handleInspect}
      />

      <div className="home-secondary-sections">
        {/* ── SECTION 04: Engineering Evolution / Pivots ── */}
        <div id="architectural-pivots">
          <ArchitecturalPivots />
        </div>

        {/* ── SECTION 05: The Thinking Lab (Playground & Garden) ── */}
        <div id="thinking-lab">
          <ThinkingLab />
        </div>

        {/* ── SECTION 06: Systems Ledger & Archive Preview ── */}
        <section className="home-ledger" id="systems-ledger" aria-label="Engineered systems ledger teaser">
          <div className="section-label">
            <span>06 / ARCHIVE & LEDGER PREVIEW</span>
            <Link to="/projects" className="section-link">
              View All {enrichedProjects.length} Systems →
            </Link>
          </div>

          <div className="home-ledger__table">
            {ledgerPreview.map((project) => (
              <DirectoryRow
                key={project.slug}
                project={project}
                onInspect={handleInspect}
              />
            ))}
          </div>

          <div className="home-ledger__cta">
            <Link to="/projects" className="btn-archive">
              Explore Complete 14-Project Archive with Domain Filters →
            </Link>
          </div>
        </section>
      </div>

      {/* ── Technical Case Study Slide-Over Drawer ── */}
      {inspectedProject && (
        <ArchitectureDrawer
          project={inspectedProject}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}
