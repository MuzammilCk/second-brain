import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import progressData from '../../data/generated/progress.json';
import styles from './LivingRadar.module.css';

// Systems engineering domain confidence matrix for polar radar
const SYSTEMS_RADAR_TOPICS = [
  { topic: 'Database Invariants', score: 4.8, fullMark: 5 },
  { topic: 'Concurrency & Locks', score: 4.5, fullMark: 5 },
  { topic: 'On-Device Edge ML', score: 4.2, fullMark: 5 },
  { topic: 'WebRTC Audio Pipeline', score: 4.0, fullMark: 5 },
  { topic: 'Distributed Indexing', score: 4.1, fullMark: 5 },
  { topic: 'Systems & Assembly', score: 3.8, fullMark: 5 },
  { topic: 'Type-Safe Monorepos', score: 4.6, fullMark: 5 },
  { topic: 'Telemetry Boundaries', score: 4.9, fullMark: 5 },
];

export default function LivingRadar({ variant = 'full' }) {
  // Read algorithm stats strictly from progress.json's algo_stats field
  const algoStats = progressData?.algo_stats || {};
  const isAlgoStatsEmpty =
    !algoStats ||
    typeof algoStats !== 'object' ||
    (algoStats.contest_rating === 0 &&
      algoStats.total_solved === 0 &&
      (!algoStats.by_category || Object.values(algoStats.by_category).every((v) => v === 0)));

  const activeFocus = progressData?.active_focus || {};
  const sprintSummary = progressData?.current_sprint_summary || '';

  // Extract sprint threads or active focus
  const activeThreads = useMemo(() => {
    if (activeFocus.primary_threads && Array.isArray(activeFocus.primary_threads)) {
      return activeFocus.primary_threads;
    }
    return [
      {
        name: 'AssetFlow Concurrency Hardening',
        desc: 'PostgreSQL exclusion locks & state machine audit logs under concurrent stress bursts.',
      },
      {
        name: 'CrisisSignal Edge Optimization',
        desc: 'Quantizing LSTM Autoencoder for sub-10MB mobile runtime with Flower federated updates.',
      },
      {
        name: 'Portfolio Architecture Consolidation',
        desc: 'Single-source-of-truth Python compilers, zero private leaks, CSS modules.',
      },
    ];
  }, [activeFocus]);

  const activeDomains = [
    'Database Invariants',
    'Edge Machine Learning',
    'Real-Time WebRTC Media',
    'Agentic Workflow Security',
    'Static Verification',
  ];

  return (
    <section className={styles.radarSection} id="living-radar" aria-label="Living Engineering Radar & Telemetry">
      {/* ── Section Header ── */}
      <div className={styles.radarHeader}>
        <div>
          <div className={styles.eyebrow}>
            <span className={styles.statusDot} />
            <span>03 // RADAR & TELEMETRY</span>
          </div>
          <h2 className={styles.title}>
            {variant === 'preview' ? 'Active Focus & Radar Preview' : 'Living Systems Radar'}
          </h2>
          <p className={styles.subtitle}>
            Polar telemetry visualizer measuring systems architecture depth, concurrent engineering sprint focus, and live algorithmic progress.
          </p>
        </div>

        <div className={styles.headerMeta}>
          <div className={styles.metaBadge}>
            <span>SOURCE: CORE/PROGRESS</span>
          </div>
          {variant === 'preview' ? (
            <Link to="/radar" className={styles.linkBtn}>
              Full Radar & Algo Pulse →
            </Link>
          ) : (
            <Link to="/projects" className={styles.linkBtn}>
              View Verified Projects →
            </Link>
          )}
        </div>
      </div>

      {/* ── Main Radar Grid: Polar Chart + Active Threads ── */}
      <div className={styles.radarGrid}>
        {/* Column 1: Polar Radar Chart */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>SYSTEMS CAPABILITY RADAR</span>
            <span className={styles.metaBadge}>POLAR PROJECTION</span>
          </div>

          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={SYSTEMS_RADAR_TOPICS} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="rgba(180, 83, 9, 0.15)" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="topic"
                  tick={{ fill: '#334155', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                />
                <PolarRadiusAxis
                  domain={[0, 5]}
                  tick={{ fill: '#94a3b8', fontSize: 9 }}
                  axisLine={{ stroke: 'rgba(0, 0, 0, 0.08)' }}
                />
                <Radar
                  name="Systems Rigor"
                  dataKey="score"
                  stroke="#b45309"
                  fill="#b45309"
                  fillOpacity={0.16}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ background: '#f59e0b' }} />
              <span>Verified Implementation Confidence (0–5)</span>
            </div>
          </div>
        </div>

        {/* Column 2: Active Sprint Obsessions & Domains */}
        <div className={styles.focusCol}>
          <div className={styles.focusCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>ACTIVE SPRINT THREADS</span>
              <span className={styles.metaBadge}>IN PROGRESS</span>
            </div>

            {sprintSummary && (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#9ca3af', margin: '0 0 1rem 0' }}>
                {sprintSummary}
              </p>
            )}

            <div className={styles.threadList}>
              {activeThreads.map((thread, idx) => (
                <div key={idx} className={styles.threadItem}>
                  <div className={styles.threadHeader}>
                    <h4 className={styles.threadName}>{thread.name}</h4>
                    <span className={styles.threadBadge}>0{idx + 1}</span>
                  </div>
                  <p className={styles.threadDesc}>{thread.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.focusCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>DEPTH DOMAINS</span>
              <span className={styles.metaBadge}>{activeDomains.length} AREAS</span>
            </div>

            <div className={styles.domainsList}>
              {activeDomains.map((domain, idx) => (
                <span key={idx} className={styles.domainChip}>
                  <span className={styles.domainDot} />
                  <span>{domain}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Panel: algo_stats from progress.json ── */}
      <div className={styles.algoPanel} id="algo-stats-panel">
        <div className={styles.algoPanelGlow} />

        <div className={styles.algoHeader}>
          <div className={styles.algoTitleGroup}>
            <span className={styles.algoTitle}>ALGORITHMIC & CONTEST TELEMETRY</span>
            <span className={styles.algoPlatformBadge}>{algoStats?.platform || 'LeetCode'}</span>
          </div>
          <span className={styles.algoTimestamp}>
            LAST SYNC: {algoStats?.last_updated || 'RECENT'}
          </span>
        </div>

        {isAlgoStatsEmpty ? (
          <div className={styles.algoEmptyState}>
            <div className={styles.algoEmptyIcon}>⚡</div>
            <p className={styles.algoEmptyText}>No active contest telemetry entries recorded in algo-stats.json</p>
            <p className={styles.algoEmptySubtext}>
              Telemetry pipeline is active. Algorithmic stats are maintained separately in core/progress/algo-stats.json without private vault leakage.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.algoMetricsRow}>
              <div className={styles.algoMetricCard}>
                <div className={`${styles.metricNumber} ${styles.metricRatingNumber}`}>
                  {algoStats.contest_rating || '—'}
                </div>
                <div className={styles.metricSublabel}>Contest Rating</div>
              </div>
              <div className={styles.algoMetricCard}>
                <div className={styles.metricNumber}>{algoStats.total_solved || 0}</div>
                <div className={styles.metricSublabel}>Total Solved</div>
              </div>
            </div>

            {algoStats.by_category && (
              <div className={styles.categoryBreakdown}>
                {Object.entries(algoStats.by_category).map(([category, count]) => (
                  <div key={category} className={styles.categoryItem}>
                    <span className={styles.categoryName}>{category}</span>
                    <span className={styles.categoryCount}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
