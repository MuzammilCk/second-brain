import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tactileAudio } from '../../utils/tactileAudio';
import './Navbar.css';

const NAV_LINKS = [
  { path: '/', label: 'Studio', icon: '🏛️' },
  { path: '/projects', label: 'Atlas', icon: '📂' },
  { path: '/radar', label: 'Radar', icon: '📡' },
  { path: '/concepts', label: 'Concepts', icon: '🧠' },
];

function TimeDisplay({ timeZone = 'Asia/Kolkata' }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, [timeZone]);

  return <span className="navbar__time-text">{currentTime || '13:45:00'} IST</span>;
}

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(() => tactileAudio.isMuted());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = () => {
    tactileAudio.playKeycapPress();
  };

  const handleToggleAudio = () => {
    const muted = tactileAudio.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) {
      tactileAudio.playKnobTick(1200);
    }
  };

  return (
    <header className={`navbar-wrapper ${scrolled ? 'navbar-wrapper--scrolled' : ''}`} id="main-nav">
      <div className="navbar__container">
        {/* Left: Identity & Live Location/Time Ticker */}
        <div className="navbar__left">
          <Link to="/" className="navbar__identity" id="nav-identity" onClick={handleNavClick}>
            <span className="navbar__identity-avatar">M</span>
            <div className="navbar__identity-text">
              <span className="navbar__identity-name">Muzammil CK</span>
              <div className="navbar__location-pill">
                <span className="navbar__location-pin">📍</span>
                <span>Kerala, IN</span>
                <span className="navbar__ticker-sep">·</span>
                <TimeDisplay />
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Precision Instrument Floating Segmented Dock */}
        <nav className="navbar__center-dock" aria-label="Main Navigation">
          <div className="navbar__dock-pill">
            {NAV_LINKS.map(({ path, label, icon }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`navbar__dock-item ${active ? 'navbar__dock-item--active' : ''}`}
                  onClick={handleNavClick}
                  id={`nav-link-${label.toLowerCase()}`}
                >
                  <span className="navbar__dock-icon" aria-hidden="true">{icon}</span>
                  <span className="navbar__dock-label">{label}</span>
                  {active && (
                    <motion.div
                      className="navbar__dock-active-indicator"
                      layoutId="dock-active-pill"
                      transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right: Telemetry Status, Audio Toggle & GitHub Link */}
        <div className="navbar__right">
          {/* Audio Haptic Feedback Toggle */}
          <button
            type="button"
            className={`navbar__audio-btn ${isAudioMuted ? 'navbar__audio-btn--muted' : ''}`}
            onClick={handleToggleAudio}
            title={isAudioMuted ? 'Unmute Tactile Synthesizer Audio' : 'Mute Tactile Audio'}
            id="nav-audio-toggle"
          >
            <span>{isAudioMuted ? '🔇' : '🔊'}</span>
          </button>

          <div className="navbar__status-badge" title="All Systems Operating Under Verified Invariants">
            <span className="navbar__status-dot" />
            <span className="navbar__status-label">Nominal</span>
          </div>

          <a
            href="https://github.com/MuzammilCk"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__action-btn"
            id="nav-github-btn"
            onClick={handleNavClick}
          >
            <span>GitHub</span>
            <span className="navbar__action-arrow">↗</span>
          </a>

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
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile-dock"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="navbar__mobile-content">
              <div className="navbar__mobile-location">
                <span className="navbar__status-dot" />
                <span>Kerala Lab · <TimeDisplay /></span>
              </div>

              <div className="navbar__mobile-links">
                {NAV_LINKS.map(({ path, label, icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`navbar__mobile-item ${isActive(path) ? 'navbar__mobile-item--active' : ''}`}
                    onClick={handleNavClick}
                  >
                    <span className="navbar__mobile-item-icon">{icon}</span>
                    <span className="navbar__mobile-item-label">{label}</span>
                    <span className="navbar__mobile-item-arrow">→</span>
                  </Link>
                ))}
              </div>

              <div className="navbar__mobile-actions">
                <a
                  href="https://github.com/MuzammilCk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="navbar__mobile-github"
                  onClick={handleNavClick}
                >
                  <span>MuzammilCk on GitHub</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
