import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const NAV_LINKS = [
  { path: '/', label: 'Studio' },
  { path: '/projects', label: 'Worlds' },
  { path: '/garden', label: 'Garden' },
  { path: '/now', label: 'Now' },
  { path: '/playground', label: 'Playground' },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" id="nav-logo">
          <div className="navbar__logo-badge">&lt;M&gt;</div>
          <div className="navbar__logo-text-group">
            <div className="navbar__logo-title-row">
              <span className="navbar__logo-title">MUZAMMIL CK</span>
            </div>
            <span className="navbar__logo-sub">SECOND BRAIN IN PUBLIC</span>
          </div>
        </Link>

        {/* Live Studio Status Pill */}
        <div className="navbar__status-pill hidden-mobile" id="nav-status-pill">
          <span className="navbar__status-dot"></span>
          <span>Studio Active · Kerala Lab</span>
          <span className="navbar__status-divider">/</span>
          <span className="navbar__status-location">2026</span>
        </div>

        {/* Desktop Wayfinding Links */}
        <div className="navbar__links" id="nav-links">
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`navbar__link ${location.pathname === path ? 'navbar__link--active' : ''}`}
              id={`nav-link-${label.toLowerCase()}`}
            >
              {label}
              {location.pathname === path && (
                <motion.div
                  className="navbar__link-indicator"
                  layoutId="nav-indicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Secondary Action: GitHub Profile */}
        <div className="navbar__actions">
          <a
            href="https://github.com/MuzammilCk"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__connect-btn"
            id="nav-connect"
          >
            <span>GitHub</span>
            <span className="material-symbols-outlined navbar__connect-icon">north_east</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
          id="nav-hamburger"
          type="button"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="navbar__mobile-inner">
              <div className="navbar__mobile-meta">
                <span className="navbar__status-dot"></span>
                <span>Studio Active · ThinkPad L13</span>
              </div>

              {NAV_LINKS.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`navbar__mobile-link ${location.pathname === path ? 'navbar__mobile-link--active' : ''}`}
                >
                  <span>{label}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              ))}

              <div className="navbar__mobile-actions">
                <a
                  href="https://github.com/MuzammilCk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="navbar__mobile-connect"
                >
                  <span>View GitHub Repositories</span>
                  <span className="material-symbols-outlined">north_east</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
