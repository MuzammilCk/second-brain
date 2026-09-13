import React, { useRef, useEffect } from 'react';
import './FilterControls.css';

export default function FilterControls({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  counts = {}
}) {
  const searchInputRef = useRef(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K / '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filterOptions = [
    { id: 'all', label: 'All', count: counts.all || 14 },
    { id: 'ai', label: 'AI & Systems', count: counts.ai || 5 },
    { id: 'fullstack', label: 'Full-Stack', count: counts.fullstack || 7 },
    { id: 'shipped', label: 'Shipped', count: counts.shipped || 5 },
  ];

  return (
    <div className="filter-controls" id="filter-controls">
      <div className="filter-controls__pills" role="tablist" aria-label="Filter project categories">
        {filterOptions.map((opt) => {
          const isActive = filter === opt.id;
          return (
            <button
              key={opt.id}
              role="tab"
              aria-selected={isActive}
              className={`filter-pill ${isActive ? 'filter-pill--active' : ''}`}
              onClick={() => setFilter(opt.id)}
            >
              <span className="filter-pill__label">{opt.label}</span>
              <span className="filter-pill__count">{opt.count}</span>
            </button>
          );
        })}
      </div>

      <div className="filter-controls__search">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by keyword, tech, or architecture..."
          className="search-input"
          id="project-search-input"
          aria-label="Filter projects"
        />
        {searchQuery ? (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : (
          <span className="search-shortcut">⌘K</span>
        )}
      </div>
    </div>
  );
}
