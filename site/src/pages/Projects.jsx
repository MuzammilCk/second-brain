import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SystemShowcase from '../components/portfolio/SystemShowcase';
import ArchitectureDrawer from '../components/portfolio/ArchitectureDrawer';
import portfolioData from '../data/generated/portfolio.json';
import './Projects.css';

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inspectedProject, setInspectedProject] = useState(null);

  // Read exclusively from portfolio.json
  const enrichedProjects = useMemo(() => {
    return (portfolioData?.projects || []).map((p) => ({
      ...p,
      slug: p.slug || p.id,
      contentMd: p.body_markdown || '',
      decisionCount: p.decision_count || p.decisions?.length || 0,
    }));
  }, []);

  // Sync drawer with URL ?inspect=slug
  useEffect(() => {
    const inspectSlug = searchParams.get('inspect');
    if (inspectSlug) {
      const found = enrichedProjects.find((p) => p.slug === inspectSlug || p.id === inspectSlug);
      if (found) setInspectedProject(found);
    }
  }, [searchParams, enrichedProjects]);

  const handleInspect = (project) => {
    setInspectedProject(project);
    setSearchParams({ inspect: project.slug || project.id });
  };

  const handleCloseDrawer = () => {
    setInspectedProject(null);
    setSearchParams({});
  };

  return (
    <div className="projects-page" id="projects-page">
      {/* ── Architectural Header ── */}
      <header className="projects-header">
        <div className="container">
          <div className="projects-header__eyebrow">
            <span className="projects-header__dot" />
            <span>01 // PRODUCTION ATLAS</span>
          </div>
          <h1 className="projects-header__title">Atlas of Engineered Systems</h1>
          <p className="projects-header__subtitle">
            A comprehensive record of {enrichedProjects.length} systems, architectural trade-offs, and verified production invariants compiled from the private vault into public evidence.
          </p>
        </div>
      </header>

      {/* ── System Showcase (Full Mode: Flagships, Standard Grid & Filterable Directory) ── */}
      <SystemShowcase mode="full" onInspect={handleInspect} />

      {/* ── Technical Trade-offs Inspection Drawer ── */}
      {inspectedProject && (
        <ArchitectureDrawer
          project={inspectedProject}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}
