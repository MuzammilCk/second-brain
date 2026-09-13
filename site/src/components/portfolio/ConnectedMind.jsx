import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ConnectedMind.css';

export default function ConnectedMind() {
  const [activeNode, setActiveNode] = useState(null);

  const nodes = [
    {
      id: 'projects',
      title: 'PROJECTS',
      badge: '14 TOTAL',
      badgeColor: 'sand',
      icon: 'terminal',
      desc: 'MetaTune, AssetFlow, CrisisSignal',
      tags: ['+11 systems', 'Odoo Grand Finale'],
      position: 'top-left',
      link: '/projects'
    },
    {
      id: 'concepts',
      title: 'CONCEPTS',
      badge: 'TAXONOMY',
      badgeColor: 'sand-dim',
      icon: 'psychology',
      desc: 'RAG, Agents, Optimization',
      tags: ['Systems Design', 'Invariants', '+more'],
      position: 'top-right',
      link: '/garden'
    },
    {
      id: 'aiml',
      title: 'AI / ML',
      badge: 'EDGE + REALTIME',
      badgeColor: 'amber',
      icon: 'memory',
      desc: 'Local TFLite &bull; WebRTC Voice',
      tags: ['Quantized Models', 'Zero-Cloud'],
      position: 'top-center',
      link: '/garden/streaming-voice-ai'
    },
    {
      id: 'interests',
      title: 'INTERESTS',
      badge: 'CURIOUS',
      badgeColor: 'sand-dim',
      icon: 'palette',
      desc: 'Photography, Design, Visual Rhythm',
      tags: ['Analogue lenses', 'Craft'],
      position: 'mid-left',
      link: '/now'
    },
    {
      id: 'decisions',
      title: 'DECISIONS',
      badge: 'ADR LOG',
      badgeColor: 'amber',
      icon: 'rule',
      desc: 'Architectural, Trade-offs & Post-mortems',
      tags: ['GiST Indexes', 'Event Loops'],
      position: 'mid-right',
      link: '/projects'
    },
    {
      id: 'experiments',
      title: 'EXPERIMENTS',
      badge: 'ACTIVE',
      badgeColor: 'sage',
      icon: 'science',
      desc: 'Interactive 3D Web & Hardware Prototypes',
      tags: ['Playground', 'Side Projects'],
      position: 'bottom-left',
      link: '/playground'
    },
    {
      id: 'growth',
      title: 'GROWTH',
      badge: '2026 LOG',
      badgeColor: 'sage',
      icon: 'trending_up',
      desc: 'Skills, Milestones & Engineering Reflections',
      tags: ['Distributed Systems', 'Production'],
      position: 'bottom-right',
      link: '/now'
    }
  ];

  return (
    <section className="connected-mind" id="mind">
      {/* ── Section Header ── */}
      <div className="connected-mind__header">
        <div className="connected-mind__annotation">
          <span className="font-handwritten connected-mind__annotation-text">
            A collection of questions I'm still exploring
          </span>
        </div>

        <div className="connected-mind__pill">
          02 // MY MIND
        </div>
        <h2 className="connected-mind__title">
          A connected mind.
        </h2>
        <p className="connected-mind__subtitle">
          Projects, ideas, concepts, and experiences, all part of the same journey.
        </p>
      </div>

      {/* ── Interactive Radial Node Graph Canvas ── */}
      <div className="connected-mind__canvas">
        {/* SVG Network Graph Layer */}
        <svg 
          className="connected-mind__svg" 
          viewBox="0 0 1000 600" 
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="amberLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4A373" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#2A4B6B" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="sageLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7A9E7E" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#D4A373" stopOpacity="0.3" />
            </linearGradient>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4A373" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0B0B0C" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Concentric Orbit Rings */}
          <circle cx="500" cy="300" r="140" fill="none" stroke="#2E2A25" strokeDasharray="4 6" strokeWidth="1" opacity="0.6" />
          <circle cx="500" cy="300" r="240" fill="none" stroke="#2E2A25" strokeDasharray="2 8" strokeWidth="1" opacity="0.4" />
          <circle cx="500" cy="300" r="280" fill="url(#centerGlow)" />

          {/* Connection Cables */}
          <path d="M 500 300 Q 380 200 260 140" fill="none" stroke="#D4A373" strokeWidth="1.8" strokeOpacity="0.75" strokeDasharray="6 3" />
          <path d="M 500 300 Q 620 190 740 140" fill="none" stroke="#D4A373" strokeWidth="1.8" strokeOpacity="0.75" />
          <path d="M 500 300 L 500 110" fill="none" stroke="#D4A373" strokeWidth="2" strokeOpacity="0.9" />
          <path d="M 500 300 Q 300 320 150 310" fill="none" stroke="#2A4B6B" strokeWidth="1.5" strokeOpacity="0.8" />
          <path d="M 500 300 Q 700 280 850 310" fill="none" stroke="#D4A373" strokeWidth="1.5" strokeOpacity="0.7" />
          <path d="M 500 300 Q 370 410 270 470" fill="none" stroke="#2A4B6B" strokeWidth="1.5" strokeOpacity="0.7" strokeDasharray="4 4" />
          <path d="M 500 300 Q 630 410 730 470" fill="none" stroke="#7A9E7E" strokeWidth="1.5" strokeOpacity="0.8" />
        </svg>

        {/* Center Node: 'ME' (Origin) */}
        <div className="connected-mind__center-node">
          <div className="connected-mind__center-circle radial-pulse">
            <div className="connected-mind__center-inner">
              <span className="connected-mind__center-tag">ORIGIN</span>
              <span className="connected-mind__center-name">Me</span>
              <span className="connected-mind__center-sub">Muzammil</span>
            </div>
          </div>
          <div className="connected-mind__center-badge">
            <span className="connected-mind__center-dot"></span>
            <span>Core Anchor</span>
          </div>
        </div>

        {/* Orbiting Satellite Nodes */}
        <div className="connected-mind__nodes-layer">
          {nodes.map((node) => (
            <Link
              key={node.id}
              to={node.link}
              className={`connected-mind__node connected-mind__node--${node.position} ${
                activeNode === node.id ? 'connected-mind__node--active' : ''
              }`}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
            >
              <div className="connected-mind__node-header">
                <span className="connected-mind__node-title">
                  <span className="material-symbols-outlined connected-mind__node-icon">{node.icon}</span>
                  {node.title}
                </span>
                <span className={`connected-mind__node-badge connected-mind__node-badge--${node.badgeColor}`}>
                  {node.badge}
                </span>
              </div>
              <p 
                className="connected-mind__node-desc"
                dangerouslySetInnerHTML={{ __html: node.desc }}
              />
              <div className="connected-mind__node-tags">
                {node.tags.map((tag, i) => (
                  <span key={i} className="connected-mind__node-tag">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom Section CTA ── */}
      <div className="connected-mind__footer">
        <Link to="/garden" className="connected-mind__cta-btn">
          <span>Explore the Map</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <span className="connected-mind__cta-info">
          Interactive digital garden &bull; Zoomable concept DAG structure
        </span>
      </div>
    </section>
  );
}
