import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="gradient-text">◆</span> codex
            </Link>
            <p className="footer__tagline">Building systems that think.</p>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Navigate</h4>
            <Link to="/projects" className="footer__link">Projects</Link>
            <Link to="/garden" className="footer__link">Garden</Link>
            <Link to="/now" className="footer__link">Now</Link>
            <Link to="/playground" className="footer__link">Playground</Link>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Connect</h4>
            <a href="https://github.com/MuzammilCk" target="_blank" rel="noopener noreferrer" className="footer__link">
              GitHub
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} Muzammil Ck — Powered by the Codex Vault
          </p>
          <p className="footer__built">
            <span className="footer__pulse" /> Built with curiosity
          </p>
        </div>
      </div>
    </footer>
  );
}
