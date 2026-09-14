import progressData from '../data/generated/progress.json';
import LivingRadar from '../components/portfolio/LivingRadar';
import styles from './Radar.module.css';

export default function Radar() {
  const sprintSummary = progressData?.current_sprint_summary || 'Multi-tier vault separation active; Live telemetry running; Zero private leaks guaranteed.';
  const currentSprint = progressData?.active_focus?.current_sprint || 'Sprint 04 // Architecture Consolidation';
  const compiledAt = progressData?.compiled_at
    ? new Date(progressData.compiled_at).toLocaleDateString()
    : 'Active';

  return (
    <div className={styles.pageContainer} id="radar-page">
      {/* ── Current Sprint Banner ── */}
      <section className={styles.sprintBanner} aria-label="Current engineering sprint focus">
        <div className={styles.bannerCard}>
          <div className={styles.bannerLeft}>
            <div className={styles.bannerEyebrow}>
              <span className={styles.pulseDot} />
              <span>RADAR TELEMETRY // CURRENT RUNTIME SPRINT</span>
            </div>
            <h1 className={styles.bannerTitle}>{currentSprint}</h1>
            <p className={styles.bannerDesc}>{sprintSummary}</p>
          </div>

          <div className={styles.bannerRight}>
            <span className={styles.badgeLive}>TELEMETRY ACTIVE</span>
            <span className={styles.syncTimestamp}>COMPILED: {compiledAt}</span>
          </div>
        </div>
      </section>

      {/* ── Living Radar (Full view with Polar Chart & Algo Stats) ── */}
      <LivingRadar variant="full" />
    </div>
  );
}
