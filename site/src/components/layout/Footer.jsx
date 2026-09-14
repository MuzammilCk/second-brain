import { Link } from 'react-router-dom';
import { tactileAudio } from '../../utils/tactileAudio';
import './Footer.css';

export default function Footer() {
  const handleLinkClick = () => {
    tactileAudio.playKeycapPress();
  };

  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        {/* Machined Metal Specification Plate */}
        <div className="footer__spec-plate">
          <div className="footer__spec-header">
            <span className="footer__spec-dot" />
            <span className="footer__spec-title">HARDWARE COMPLIANCE & SPECIFICATION PLATE</span>
            <span className="footer__spec-serial">SER: MZ-2026-OP</span>
          </div>

          <div className="footer__grid">
            <div className="footer__brand">
              <Link to="/" className="footer__logo" onClick={handleLinkClick}>
                <span className="footer__logo-title">MUZAMMIL CK</span>
              </Link>
              <p className="footer__tagline">
                Autonomous distributed runtimes, sub-400ms voice transport, and confidential machine learning built against strict physical invariants.
              </p>
              <div className="footer__hardware-specs">
                <span className="footer__spec-item">ARCH: RISC-V &amp; EDGE TENSOR</span>
                <span className="footer__spec-sep">/</span>
                <span className="footer__spec-item">ISOLATION: NITRO TEE</span>
                <span className="footer__spec-sep">/</span>
                <span className="footer__spec-item">STABILITY: 100% ACID</span>
              </div>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">Wayfinding Portals</h4>
              <Link to="/projects" className="footer__link" onClick={handleLinkClick}>01 // Projects Atlas</Link>
              <Link to="/radar" className="footer__link" onClick={handleLinkClick}>02 // Telemetry Radar</Link>
              <Link to="/concepts" className="footer__link" onClick={handleLinkClick}>03 // Concepts &amp; Mind</Link>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">Vault Boundary</h4>
              <a
                href="https://github.com/MuzammilCk"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link"
                onClick={handleLinkClick}
              >
                GitHub Profile ↗
              </a>
              <span className="footer__status-tag">● Deterministic Vault Boundaries</span>
              <span className="footer__hash-tag">SIG: 4F9A-82B1-0C3D-E75F</span>
            </div>
          </div>

          <div className="footer__bottom">
            <p className="footer__copy">
              © {new Date().getFullYear()} Muzammil Ck. Precision engineered under mathematical invariants. Zero private vault leakage.
            </p>
            <div className="footer__coords">
              <span>KERALA LAB</span>
              <span className="footer__spec-sep">·</span>
              <span>11.2588° N, 75.7804° E</span>
              <span className="footer__spec-sep">·</span>
              <span className="footer__live-dot" />
              <span>ALL CIRCUITS ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
