import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import placementsData from '../data/generated/placements.json';
import './DSADashboard.css';

// Fallback data for when placements are gated
const FALLBACK_RADAR = [
  { topic: 'Arrays', score: 5 },
  { topic: 'Two Pointers', score: 4.5 },
  { topic: 'Sliding Window', score: 4 },
  { topic: 'Sort/Search', score: 4 },
  { topic: 'Recursion', score: 3 },
  { topic: 'Trees', score: 3 },
  { topic: 'Graphs', score: 2.5 },
  { topic: 'DP', score: 2 },
];

export default function DSADashboard() {
  if (placementsData.gated) {
    return (
      <div className="dsa-page" id="dsa-page">
        <section className="section">
          <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="section-label">Placement Prep</span>
              <h1 className="section-title" style={{ marginBottom: 'var(--space-6)' }}>
                DSA Dashboard
              </h1>
              <div className="glass-card" style={{ padding: 'var(--space-12)' }}>
                <p style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>
                  🔒 This section is currently private.
                </p>
                <p style={{ color: 'var(--text-muted)' }}>
                  DSA tracker, mock interview logs, and placement prep data are gated 
                  for privacy. Toggle <code>showPlacements: true</code> in site.config.js 
                  to make this public.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="dsa-page" id="dsa-page">
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Preparation</span>
            <h1 className="section-title">DSA Dashboard</h1>
            <p className="section-subtitle">
              Live tracking of DSA preparation, confidence matrix, and mock interview feedback.
            </p>
          </div>

          {/* Radar Chart */}
          <motion.div
            className="glass-card dsa-radar"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Confidence Radar</h3>
            <div className="dsa-radar__chart">
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={FALLBACK_RADAR}>
                  <PolarGrid stroke="rgba(139, 92, 246, 0.2)" />
                  <PolarAngleAxis dataKey="topic" tick={{ fill: '#9898b0', fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 5]} tick={{ fill: '#5a5a78', fontSize: 10 }} />
                  <Radar
                    name="Confidence"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Mock Interviews */}
          {placementsData.mockInterviews && placementsData.mockInterviews.length > 0 && (
            <motion.div
              className="glass-card dsa-mocks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3>Mock Interview Log</h3>
              <div className="dsa-mocks__list">
                {placementsData.mockInterviews.map((mock, i) => (
                  <div key={i} className="dsa-mock-entry" id={`mock-${i}`}>
                    <div className="dsa-mock-entry__header">
                      <span className="dsa-mock-entry__date">{mock.date}</span>
                      <span className="badge badge-concept">{mock.format}</span>
                    </div>
                    <h4>{mock.title}</h4>
                    {mock.good && (
                      <div className="dsa-mock-entry__field dsa-mock-entry__field--good">
                        <span>✅ Went well:</span> {mock.good}
                      </div>
                    )}
                    {mock.fix && (
                      <div className="dsa-mock-entry__field dsa-mock-entry__field--fix">
                        <span>🔧 Fix next time:</span> {mock.fix}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
