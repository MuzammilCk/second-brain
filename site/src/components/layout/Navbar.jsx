import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/projects', label: 'Projects' },
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
          <div className="navbar__logo-badge">&lt;C&gt;</div>
          <div className="navbar__logo-text-group">
            <div className="navbar__logo-title-row">
              <span className="navbar__logo-title">CODEX</span>
              <span className="navbar__version-pill">V4.8</span>
            </div>
            <span className="navbar__logo-sub">A SECOND BRAIN IN PUBLIC</span>
          </div>
        </Link>

        <div className="navbar__status-pill hidden-mobile" id="nav-status-pill">
          <span className="navbar__status-dot"></span>
          <span>MUZAMMIL CK STUDIO ARCHIVE</span>
          <span className="navbar__status-divider">/</span>
          <span className="navbar__status-latency">1.2ms</span>
        </div>

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

        <div className="navbar__actions">
          <a
            href="https://github.com/MuzammilCk"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__connect-btn"
            id="nav-connect"
          >
            <span>Let's Connect</span>
            <span className="material-symbols-outlined navbar__connect-icon">arrow_forward</span>
          </a>
        </div>

        <button
          className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
          id="nav-hamburger"
        >
          <span /><span /><span />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            id="nav-mobile-menu"
          >
            {NAV_LINKS.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`navbar__mobile-link ${location.pathname === path ? 'navbar__mobile-link--active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
