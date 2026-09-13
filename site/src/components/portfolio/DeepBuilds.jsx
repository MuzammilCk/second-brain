import './DeepBuilds.css';

const DEEP_PROJECTS = [
  {
    slug: 'assetflow',
    number: '02.A',
    title: 'AssetFlow: Relational Collision Engine',
    subtitle: 'Enterprise Physical Asset Scheduler Built in an 8-Hour Sprint',
    accolade: 'ODOO HACKATHON QUALIFIER',
    problem: 'Physical equipment and rooms faced dual-allocations under concurrent user requests. Relying on application-layer JavaScript checks resulted in subtle race condition failures.',
    architecture: 'PostgreSQL transactional exclusion constraints with Prisma ORM and a 6-stage maintenance Kanban state machine.',
    tradeoff: 'Cut real-time WebSockets to deliver verifiable database-level slot lock guarantees within the 8-hour competition window.',
    evidence: '4 role-scoped permission guards, overlap query intersection rejection, Recharts utilization analytics.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS']
  },
  {
    slug: 'crisissignal',
    number: '02.B',
    title: 'CrisisSignal: On-Device Privacy ML',
    subtitle: 'Passive Anomaly Detection for Student Mental Health Support',
    accolade: 'AI FOR GOOD 2026',
    problem: 'Early behavioral shifts occur 5 to 7 days before crisis points, but centralizing sensitive student mobility, sleep, and communication data violates privacy.',
    architecture: 'Unsupervised LSTM Autoencoder detecting anomaly reconstruction errors, quantized for local Android CPU inference, with Flower federated model aggregation.',
    tradeoff: 'Adopted reconstruction error thresholds over supervised classification because labeled crisis data carries severe validation bias and privacy risks.',
    evidence: '8.4MB quantized TFLite model, SHAP feature explainability layer, simulated multi-client federated training rounds.',
    stack: ['Python 3.11', 'TensorFlow Lite', 'Flower FL', 'SHAP', 'Android Kotlin']
  }
];

export default function DeepBuilds({ projects, onInspect }) {
  const findProject = (slug) => projects?.find(p => p.slug === slug);

  return (
    <section className="deep-builds" aria-label="Deep engineering builds and system architectures">
      <div className="section-label">
        <span>02 / DEEP SYSTEM BUILDS : ARCHITECTURE & TRADE-OFFS</span>
        <span className="section-count">2 CASE STUDIES</span>
      </div>

      <div className="deep-builds__grid">
        {DEEP_PROJECTS.map((item) => {
          const rawProject = findProject(item.slug);
          return (
            <article key={item.slug} className="deep-build-card">
              <div className="deep-build-card__eyebrow">
                <span className="deep-build-card__number">{item.number}</span>
                <span className="deep-build-card__accolade">{item.accolade}</span>
              </div>

              <h3 className="deep-build-card__title">{item.title}</h3>
              <p className="deep-build-card__subtitle">{item.subtitle}</p>

              <div className="deep-build-card__section">
                <span className="section-meta-label">PROBLEM & TENSION</span>
                <p className="section-meta-text">{item.problem}</p>
              </div>

              <div className="deep-build-card__section">
                <span className="section-meta-label">CHOSEN ARCHITECTURE</span>
                <p className="section-meta-text">{item.architecture}</p>
              </div>

              <div className="deep-build-card__section deep-build-card__section--tradeoff">
                <span className="section-meta-label">CRITICAL TRADE-OFF</span>
                <p className="section-meta-text">{item.tradeoff}</p>
              </div>

              <div className="deep-build-card__stack">
                {item.stack.map((t) => (
                  <span key={t} className="deep-build-card__pill">{t}</span>
                ))}
              </div>

              <div className="deep-build-card__footer">
                <button
                  type="button"
                  className="deep-build-btn"
                  onClick={() => onInspect && onInspect(rawProject || { slug: item.slug, title: item.title })}
                >
                  Examine Architecture Rationale →
                </button>
                {rawProject?.repo_reference && (
                  <a
                    href={rawProject.repo_reference}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="deep-build-repo-link"
                    title="View GitHub Repository"
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
