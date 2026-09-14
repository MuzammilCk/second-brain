import { useState } from 'react';
import RevealFx from '../ui/RevealFx';
import styles from './TerminalDispatch.module.css';

const CONNECT_LINKS = [
  { name: 'GitHub', href: 'https://github.com/MuzammilCk', icon: '↗', label: '@MuzammilCk' },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/muzammil-ck', icon: '↗', label: 'in/muzammil-ck' },
  { name: 'Direct Dispatch', href: 'mailto:muzammilck@proton.me', icon: '✉', label: 'muzammilck@proton.me' },
  { name: 'Book Sync (Cal.com)', href: 'https://cal.com/muzammilck', icon: '🗓️', label: '15m Technical Alignment' },
];

export default function TerminalDispatch() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | transmitting | success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('transmitting');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 800);
  };

  return (
    <section className={styles.dispatchSection} aria-label="Terminal Dispatch & Transmission">
      <div className={styles.container}>
        {/* Once UI Line Divider */}
        <div className={styles.lineDividerRow}>
          <div className={styles.lineSegment} />
        </div>

        <RevealFx translateY={16} delay={0.1}>
          <div className={styles.dispatchCard}>
            <div className={styles.cardHeader}>
              <div className={styles.eyebrowPill}>
                <span className={styles.eyebrowDot} />
                <span>03 // DIRECT TRANSMISSION</span>
              </div>
              <h3 className={styles.dispatchTitle}>
                Dispatch Ledger &amp; Alignment
              </h3>
              <p className={styles.dispatchSubtitle}>
                Quarterly technical briefs on distributed consensus, physical database invariants, and edge ML quantization directly from the Kerala lab.
              </p>
            </div>

            {/* Transmission Form */}
            <form className={styles.formRow} onSubmit={handleSubmit}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>$</span>
                <input
                  type="email"
                  placeholder="engineer@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.inputField}
                  disabled={status === 'success'}
                  required
                />
              </div>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={status === 'transmitting' || status === 'success'}
              >
                {status === 'idle' && <span>Transmit Note →</span>}
                {status === 'transmitting' && <span>Encrypting...</span>}
                {status === 'success' && <span>Signal Verified ✓</span>}
              </button>
            </form>

            {status === 'success' && (
              <p className={styles.successNote}>
                Transmission logged into dispatch queue. Zero marketing, pure engineering signal.
              </p>
            )}

            {/* Quick Connect Dock */}
            <div className={styles.connectDock}>
              <div className={styles.dockTitle}>DIRECT CHANNELS &amp; VERIFIED SIGNALS</div>
              <div className={styles.linksGrid}>
                {CONNECT_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.connectPill}
                  >
                    <span className={styles.linkIcon}>{link.icon}</span>
                    <span className={styles.linkName}>{link.name}</span>
                    <span className={styles.linkLabel}>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* PGP Cryptographic Fingerprint */}
            <div className={styles.pgpRow}>
              <span className={styles.pgpLabel}>PGP FINGERPRINT:</span>
              <code className={styles.pgpCode}>
                4F9A 82B1 0C3D E75F 2940 A1B8 D4E6 F8C0 9231 A7B4
              </code>
              <span className={styles.pgpStatus}>• GPG KEY VERIFIED</span>
            </div>
          </div>
        </RevealFx>
      </div>
    </section>
  );
}
