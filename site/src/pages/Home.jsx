import { useState, useMemo } from 'react';
import MinimalHero from '../components/portfolio/MinimalHero';
import MinimalShowcase from '../components/portfolio/MinimalShowcase';
import TerminalDispatch from '../components/portfolio/TerminalDispatch';
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

  const handleInspect = (project) => {
    if (!project) return;
    const full = enrichedProjects.find((p) => p.slug === project.slug || p.id === project.id) || project;
    setInspectedProject(full);
  };

  const handleCloseDrawer = () => {
    setInspectedProject(null);
  };

  return (
    <div className="home-studio" id="home-studio">
      <div className="home-spatial-content">
        {/* Act I: Genesis & Monumental Identity */}
        <MinimalHero />

        {/* Act II & III: Curated Systems Showcase & Second Brain Portals */}
        <MinimalShowcase onInspect={handleInspect} />

        {/* Act VI: Terminal Dispatch & Transmission */}
        <TerminalDispatch />
      </div>

      {/* Deep Technical Trade-offs & Invariants Drawer */}
      {inspectedProject && (
        <ArchitectureDrawer
          project={inspectedProject}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}
