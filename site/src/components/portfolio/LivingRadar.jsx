import { Link } from 'react-router-dom';
import prioritiesData from '../../data/generated/priorities.json';
import logData from '../../data/generated/log.json';
import './LivingRadar.css';

export default function LivingRadar() {
  const activeProjects = (prioritiesData?.projects || []).map(p => {
    // Strip bold markers and format clean separation without em-dashes
    const cleaned = p.replace(/\*\*/g, '').replace(/ — /g, ' : ').replace(/–/g, '-');
    const [name, ...descParts] = cleaned.split(' : ');
    return { name, desc: descParts.join(' : ') };
  });

  const activeAreas = (prioritiesData?.areas || []).map(a => 
    a.replace(/ — /g, ' : ').replace(/–/g, '-')
  );

  const recentSignals = (logData || []).slice(0, 3).map(entry => ({
    ...entry,
    description: entry.description.replace(/ — /g, ' : ').replace(/–/g, '-')
  }));

  return (
    <section className="living-radar" aria-label="Living engineering radar and active sprint focus">
      <div className="living-radar__header">
        <div className="living-radar__status-indicator">
          <span className="radar-pulse-ring" />
          <span className="radar-status-dot" />
          <span className="radar-status-text">ACTIVE SPRINT / IN PROGRESS</span>
        </div>
        <div className="living-radar__timestamp">
          <span>SOURCE: VAULT SIGNAL / Q3 2026</span>
          <Link to="/now" className="radar-now-link">
            Full Now Page →
          </Link>
        </div>
      </div>

      <div className="living-radar__grid">
        {/* Column 1: Current Active Focus */}
        <div className="radar-card radar-card--primary">
          <div className="radar-card__label">
            <span>CURRENT OBSESSIONS</span>
            <span className="radar-card__counter">3 ACTIVE THREADS</span>
          </div>
          <div className="radar-threads">
            {activeProjects.map((item, idx) => (
              <div key={idx} className="radar-thread-item">
                <div className="radar-thread-head">
                  <span className="radar-thread-badge">0{idx + 1}</span>
                  <h4 className="radar-thread-name">{item.name}</h4>
                </div>
                <p className="radar-thread-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Active Domains & Recent Signals */}
        <div className="radar-card radar-card--secondary">
          <div className="radar-card__label">
            <span>ACTIVE DOMAINS</span>
            <span className="radar-card__counter">AREAS OF DEPTH</span>
          </div>
          <div className="radar-areas-list">
            {activeAreas.map((area, idx) => (
              <div key={idx} className="radar-area-chip">
                <span className="radar-area-bullet" />
                <span className="radar-area-text">{area}</span>
              </div>
            ))}
          </div>

          <div className="radar-card__label radar-card__label--nested">
            <span>RECENT EXECUTION PULSE</span>
            <span className="radar-card__counter">LIVE LOG</span>
          </div>
          <div className="radar-signals-list">
            {recentSignals.map((sig, idx) => (
              <div key={idx} className="radar-signal-row">
                <span className="radar-signal-date">{sig.date}</span>
                <span className="radar-signal-label">{sig.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
