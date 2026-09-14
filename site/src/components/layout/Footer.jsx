import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-title">MUZAMMIL CK</span>
            </Link>
            <p className="footer__tagline">
              Autonomous distributed runtimes, sub-400ms voice transport, and confidential machine learning.
            </p>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Wayfinding</h4>
            <Link to="/projects" className="footer__link">Projects Atlas</Link>
            <Link to="/radar" className="footer__link">Telemetry Radar</Link>
            <Link to="/concepts" className="footer__link">Concepts</Link>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Vault</h4>
            <a href="https://github.com/MuzammilCk" target="_blank" rel="noopener noreferrer" className="footer__link">
              GitHub Profile ↗
            </a>
            <span className="footer__status-tag">● Deterministic Vault</span>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} Muzammil Ck. Built with mathematical rigor &amp; physical invariants.
          </p>
          <span className="footer__pulse-note">Kerala Lab // 2026</span>
        </div>
      </div>
    </footer>
  );
}
