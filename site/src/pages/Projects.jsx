import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterControls from '../components/portfolio/FilterControls';
import FeaturedCard from '../components/portfolio/FeaturedCard';
import DirectoryRow from '../components/portfolio/DirectoryRow';
import ArchitectureDrawer from '../components/portfolio/ArchitectureDrawer';

import portfolioData from '../data/generated/portfolio.json';
import './Projects.css';

// System domain classifications
const DOMAIN_MAP = {
  ai: ['esg-audit-system', 'crisissignal', 'repomind', 'metatune', 'viva'],
  fullstack: ['assetflow', 'fitness-platform', 'hadi', 'invoice-studio', 'masm-studio', 'realme', 'ytclfr', 'odoo-hackathon'],
};

// Designated flagships for prominent editorial presentation
const FLAGSHIP_SLUGS = ['odoo-hackathon', 'assetflow', 'esg-audit-system'];

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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
      const found = enrichedProjects.find((p) => p.slug === inspectSlug);
      if (found) setInspectedProject(found);
    }
  }, [searchParams, enrichedProjects]);

  const handleInspect = (project) => {
    setInspectedProject(project);
    setSearchParams({ inspect: project.slug });
  };

  const handleCloseDrawer = () => {
    setInspectedProject(null);
    setSearchParams({});
  };

  // Domain & status counts
  const counts = useMemo(() => {
    return {
      all: enrichedProjects.length,
      ai: enrichedProjects.filter(p => DOMAIN_MAP.ai.includes(p.slug) || p.stack?.some(t => /ai|ml|tensorflow|pytorch|langgraph/i.test(t))).length,
      fullstack: enrichedProjects.filter(p => DOMAIN_MAP.fullstack.includes(p.slug)).length,
      shipped: enrichedProjects.filter(p => p.status === 'shipped' || p.status === 'done').length,
    };
  }, [enrichedProjects]);

  // Filter & Search Logic
  const filteredProjects = useMemo(() => {
    return enrichedProjects.filter((p) => {
      // 1. Domain / Status Filter
      if (filter === 'ai') {
        const isAi = DOMAIN_MAP.ai.includes(p.slug) || p.stack?.some(t => /ai|ml|tensorflow|pytorch|langgraph/i.test(t));
        if (!isAi) return false;
      } else if (filter === 'fullstack') {
        if (!DOMAIN_MAP.fullstack.includes(p.slug)) return false;
      } else if (filter === 'shipped') {
        if (p.status !== 'shipped' && p.status !== 'done') return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesSlug = p.slug.toLowerCase().includes(q);
        const matchesStack = p.stack?.some(s => s.toLowerCase().includes(q));
        const matchesContent = p.contentMd?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSlug && !matchesStack && !matchesContent) {
          return false;
        }
      }

      return true;
    });
  }, [enrichedProjects, filter, searchQuery]);

  // Separate into Featured Flagships vs Directory rows
  const { featuredList, directoryList } = useMemo(() => {
    const featured = [];
    const directory = [];

    filteredProjects.forEach((p) => {
      if (FLAGSHIP_SLUGS.includes(p.slug) && featured.length < 2) {
        featured.push(p);
      } else {
        directory.push(p);
      }
    });

    // If no flagship matched current filter, elevate the first matching item to featured
    if (featured.length === 0 && directory.length > 0) {
      featured.push(directory.shift());
    }

    return { featuredList: featured, directoryList: directory };
  }, [filteredProjects]);

  return (
    <div className="projects-page" id="projects-page">
      <div className="projects-container">
        {/* Editorial Page Header */}
        <header className="projects-header">
          <div className="projects-header__eyebrow">
            <span>INDEX / 2026 : SYSTEMS ENGINEERING & RUNTIME ARCHITECTURE</span>
          </div>
          <h1 className="projects-header__title">Projects & Systems</h1>
          <p className="projects-header__bio">
            Production architectures, distributed tools, and ML systems with verifiable implementation records.
          </p>

          <div className="projects-header__meta-strip">
            <span className="meta-pill">
              <span className="meta-pill__dot meta-pill__dot--zinc" />
              14 projects documented
            </span>
            <span className="meta-pill">
              <span className="meta-pill__dot meta-pill__dot--green" />
              4 production systems
            </span>
            <span className="meta-pill meta-pill--highlight">
              <span className="meta-pill__dot meta-pill__dot--gold" />
              Odoo Hackathon Grand Finale Finalist
            </span>
          </div>
        </header>

        {/* Filter Tabs & Search Bar */}
        <FilterControls
          filter={filter}
          setFilter={setFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          counts={counts}
        />

        {/* Main Content Area */}
        {filteredProjects.length > 0 ? (
          <div className="projects-content">
            {/* Featured Systems Section */}
            {featuredList.length > 0 && (
              <section className="featured-section" aria-label="Featured systems architecture">
                <div className="section-label">
                  <span>FEATURED ARCHITECTURE CASE STUDIES</span>
                </div>
                <div className="featured-grid">
                  {featuredList.map((project) => (
                    <FeaturedCard
                      key={project.slug}
                      project={project}
                      onInspect={handleInspect}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Systems Directory Section */}
            {directoryList.length > 0 && (
              <section className="directory-section" aria-label="All engineered systems directory">
                <div className="section-label">
                  <span>ALL ENGINEERED SYSTEMS DIRECTORY</span>
                  <span className="section-count">{directoryList.length} systems</span>
                </div>
                <div className="directory-table">
                  {directoryList.map((project) => (
                    <DirectoryRow
                      key={project.slug}
                      project={project}
                      onInspect={handleInspect}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="projects-empty-state">
            <p className="empty-title">No matching systems found</p>
            <p className="empty-desc">
              No projects matched your search for "{searchQuery}". Try searching for another technology or keyword.
            </p>
            <button
              type="button"
              className="empty-clear-btn"
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Case Study Slide-Over Drawer */}
      {inspectedProject && (
        <ArchitectureDrawer
          project={inspectedProject}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}
