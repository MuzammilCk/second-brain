import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import conceptsData from '../../data/generated/concepts.json';
import portfolioData from '../../data/generated/portfolio.json';
import './ConnectedMind.css';

// Semantic constellation graph defining the actual intellectual links in Muzammil's world
const CONSTELLATION_NODES = [
  // ── CORE ORIGIN ──
  {
    id: 'origin',
    type: 'origin',
    label: 'Me (Muzammil)',
    sublabel: 'Systems & ML',
    x: 500,
    y: 300,
    domain: 'Core Anchor',
    summary: 'Computer science student building systems from scratch to understand physical, algorithmic, and runtime constraints.'
  },
  
  // ── PRODUCTION WORLDS (Left / Top-Left) ──
  {
    id: 'proj-assetflow',
    type: 'project',
    slug: 'assetflow',
    label: 'AssetFlow',
    sublabel: 'Odoo Grand Finale',
    category: 'System World',
    x: 230,
    y: 160,
    color: 'amber',
    connectedTo: ['origin', 'dec-gist'],
    summary: 'Enterprise asset management built in an 8-hour sprint. Solved double-booking collisions by offloading concurrency locks into PostgreSQL GiST exclusion.',
    link: '/projects/assetflow'
  },
  {
    id: 'proj-metatune',
    type: 'project',
    slug: 'metatune',
    label: 'MetaTune',
    sublabel: 'Sub-400ms Voice AI',
    category: 'System World',
    x: 240,
    y: 430,
    color: 'amber',
    connectedTo: ['origin', 'concept-automl', 'dec-webrtc'],
    summary: 'Real-time full-duplex voice agent with LiveKit WebRTC pipeline and Bayesian hyperparameter optimization to minimize latency.',
    link: '/projects/metatune'
  },
  {
    id: 'proj-crisissignal',
    type: 'project',
    slug: 'crisissignal',
    label: 'CrisisSignal',
    sublabel: '8.4MB Edge ML',
    category: 'System World',
    x: 130,
    y: 300,
    color: 'sage',
    connectedTo: ['origin', 'dec-federated'],
    summary: 'Zero-cloud student safety telemetry. On-device PyTorch LSTM autoencoder detecting behavioral anomalies with Flower federated updates.',
    link: '/projects/crisissignal'
  },
  {
    id: 'proj-ytclfr',
    type: 'project',
    slug: 'ytclfr',
    label: 'ytclfr',
    sublabel: 'Multimodal Video Engine',
    category: 'System World',
    x: 370,
    y: 110,
    color: 'sand',
    connectedTo: ['origin', 'concept-video'],
    summary: '4-stage signal census pipeline replacing brute-force parsing with progressive detection gates (Speech, OCR, Cuts, Fusion).',
    link: '/projects/ytclfr'
  },

  // ── DEEP CONCEPTS (Right / Top-Right) ──
  {
    id: 'concept-automl',
    type: 'concept',
    slug: 'automl',
    label: 'AutoML & HPO',
    sublabel: 'Google Vizier / Pythia',
    category: 'Research Note',
    x: 770,
    y: 150,
    color: 'amber',
    connectedTo: ['origin', 'proj-metatune'],
    summary: 'Dataset-aware Bayesian hyperparameter sweeps and neural meta-learners. Applied in MetaTune to scale parameter search.',
    link: '/garden/automl'
  },
  {
    id: 'concept-video',
    type: 'concept',
    slug: 'video-intelligence',
    label: 'Video Intelligence',
    sublabel: 'Staged Signal Gates',
    category: 'Research Note',
    x: 640,
    y: 100,
    color: 'sand',
    connectedTo: ['origin', 'proj-ytclfr'],
    summary: 'Signal census architecture partitioning media analysis to avoid expensive spatial/temporal neural processing on silent tracks.',
    link: '/garden/video-intelligence'
  },
  {
    id: 'concept-physics',
    type: 'concept',
    slug: 'three-physics',
    label: '3D Web Physics',
    sublabel: 'Verlet Cloth Dynamics',
    category: 'Research Note',
    x: 870,
    y: 290,
    color: 'deep-blue',
    connectedTo: ['origin'],
    summary: 'Verlet numerical integration modeling paper physics and interactive diary page flips without velocity overhead.',
    link: '/garden/three-physics'
  },
  {
    id: 'concept-skillopt',
    type: 'concept',
    slug: 'skillopt',
    label: 'SkillOpt',
    sublabel: 'Self-Evolving Agent Skills',
    category: 'Research Note',
    x: 760,
    y: 440,
    color: 'sage',
    connectedTo: ['origin'],
    summary: 'Validation-gated offline optimization for coding agents. Local audit and sleep-cycle synthesis on ThinkPad hardware.',
    link: '/garden/skillopt'
  },

  // ── TURNING POINTS & INVARIANTS (Bottom Arc) ──
  {
    id: 'dec-gist',
    type: 'decision',
    label: 'GiST Exclusion',
    sublabel: 'Postgres Invariant',
    category: 'Turning Point',
    x: 370,
    y: 500,
    color: 'amber',
    connectedTo: ['proj-assetflow', 'origin'],
    summary: 'Pivot from application JS filtering to PostgreSQL btree_gist exclusion lock, eliminating race conditions under concurrent requests.'
  },
  {
    id: 'dec-webrtc',
    type: 'decision',
    label: 'UDP WebRTC Tracks',
    sublabel: 'Sub-14ms Barge-in',
    category: 'Turning Point',
    x: 500,
    y: 480,
    color: 'amber',
    connectedTo: ['proj-metatune', 'origin'],
    summary: 'Replaced TCP WebSocket streaming with UDP WebRTC audio tracks to prevent head-of-line blocking under packet loss.'
  },
  {
    id: 'dec-federated',
    type: 'decision',
    label: 'Zero-Egress ML',
    sublabel: 'Privacy Guarantee',
    category: 'Turning Point',
    x: 630,
    y: 510,
    color: 'sage',
    connectedTo: ['proj-crisissignal', 'origin'],
    summary: 'Pivot from centralized cloud DB to local quantized LSTM + federated gradient updates to guarantee zero student data leaks.'
  }
];

export default function ConnectedMind() {
  const [selectedNodeId, setSelectedNodeId] = useState('origin');
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [viewMode, setViewMode] = useState('constellation'); // 'constellation' | 'index'

  const activeNodeId = hoveredNodeId || selectedNodeId;

  const activeNode = useMemo(() => {
    return CONSTELLATION_NODES.find(n => n.id === activeNodeId) || CONSTELLATION_NODES[0];
  }, [activeNodeId]);

  // Determine which connections and nodes should be highlighted
  const highlightedNodeIds = useMemo(() => {
    if (!activeNode) return new Set(['origin']);
    const set = new Set([activeNode.id]);
    (activeNode.connectedTo || []).forEach(id => set.add(id));
    
    // Also include nodes that connect to the active node
    CONSTELLATION_NODES.forEach(n => {
      if (n.connectedTo && n.connectedTo.includes(activeNode.id)) {
        set.add(n.id);
      }
    });
    return set;
  }, [activeNode]);

  // Generate SVG path strings between connected nodes
  const connectionLinks = useMemo(() => {
    const links = [];
    CONSTELLATION_NODES.forEach(node => {
      if (!node.connectedTo) return;
      node.connectedTo.forEach(targetId => {
        const target = CONSTELLATION_NODES.find(n => n.id === targetId);
        if (!target) return;
        
        const isHighlighted = highlightedNodeIds.has(node.id) && highlightedNodeIds.has(target.id);
        const linkId = `${node.id}-${target.id}`;

        // Create curved quadratic bezier path
        const midX = (node.x + target.x) / 2;
        const midY = (node.y + target.y) / 2;
        // subtle curve factor
        const curveOffset = (node.x - target.x) * 0.12;
        const cpX = midX;
        const cpY = midY - curveOffset;

        links.push({
          id: linkId,
          d: `M ${node.x} ${node.y} Q ${cpX} ${cpY} ${target.x} ${target.y}`,
          isHighlighted,
          color: node.color || 'amber'
        });
      });
    });
    return links;
  }, [highlightedNodeIds]);

  return (
    <section className="connected-mind" id="mind" aria-label="Interactive map of ideas, systems, and engineering decisions">
      {/* ── Section Header ── */}
      <div className="connected-mind__header">
        <div className="connected-mind__annotation">
          <span className="font-handwritten connected-mind__annotation-text">
            Ideas, systems & failures connect here
          </span>
        </div>

        <div className="connected-mind__pill">
          02 // THE CONNECTED MIND
        </div>
        <h2 className="connected-mind__title">
          An ecosystem of thought, systems & pivots.
        </h2>
        <p className="connected-mind__subtitle">
          Projects are not standalone items. They grow out of research concepts, hit physical constraints, force turning points, and leave durable invariants.
        </p>

        {/* View Mode Toggle (A11y & Mobile Friendly) */}
        <div className="connected-mind__view-toggle" role="tablist" aria-label="View mode">
          <button
            type="button"
            className={`connected-mind__toggle-btn ${viewMode === 'constellation' ? 'connected-mind__toggle-btn--active' : ''}`}
            onClick={() => setViewMode('constellation')}
            role="tab"
            aria-selected={viewMode === 'constellation'}
          >
            <span className="material-symbols-outlined">scatter_plot</span>
            <span>Constellation</span>
          </button>
          <button
            type="button"
            className={`connected-mind__toggle-btn ${viewMode === 'index' ? 'connected-mind__toggle-btn--active' : ''}`}
            onClick={() => setViewMode('index')}
            role="tab"
            aria-selected={viewMode === 'index'}
          >
            <span className="material-symbols-outlined">list</span>
            <span>Relationship Index</span>
          </button>
        </div>
      </div>

      {viewMode === 'constellation' ? (
        /* ── Visual Constellation Canvas ── */
        <div className="connected-mind__canvas">
          {/* SVG Connection Lines */}
          <svg 
            className="connected-mind__svg" 
            viewBox="0 0 1000 600" 
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#D4A373" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#D4A373" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0B0B0C" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Orbit Guides */}
            <circle cx="500" cy="300" r="160" fill="none" stroke="rgba(46, 42, 37, 0.4)" strokeDasharray="3 6" />
            <circle cx="500" cy="300" r="280" fill="none" stroke="rgba(46, 42, 37, 0.25)" strokeDasharray="2 8" />
            <circle cx="500" cy="300" r="320" fill="url(#sunGlow)" />

            {/* Render Connection Filaments */}
            {connectionLinks.map(link => (
              <path
                key={link.id}
                d={link.d}
                className={`connected-mind__path ${link.isHighlighted ? 'connected-mind__path--active' : ''}`}
              />
            ))}
          </svg>

          {/* Interactive Nodes Layer */}
          <div className="connected-mind__nodes-container">
            {CONSTELLATION_NODES.map(node => {
              const isSelected = activeNodeId === node.id;
              const isLinked = highlightedNodeIds.has(node.id);
              const isOrigin = node.type === 'origin';

              return (
                <button
                  key={node.id}
                  type="button"
                  className={`connected-mind__star connected-mind__star--${node.type} ${
                    isSelected ? 'connected-mind__star--selected' : ''
                  } ${isLinked ? 'connected-mind__star--linked' : 'connected-mind__star--dim'}`}
                  style={{
                    left: `${(node.x / 1000) * 100}%`,
                    top: `${(node.y / 600) * 100}%`
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => setSelectedNodeId(node.id)}
                  aria-label={`${node.category || 'Node'}: ${node.label}`}
                >
                  <div className="connected-mind__star-body">
                    <span className="connected-mind__star-core"></span>
                    {isOrigin && <span className="connected-mind__star-pulse"></span>}
                  </div>
                  <div className="connected-mind__star-label">
                    <span className="connected-mind__star-title">{node.label}</span>
                    <span className="connected-mind__star-sub">{node.sublabel}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Persistent In-Canvas Insight Panel */}
          <div className="connected-mind__insight-dock" aria-live="polite">
            <div className="connected-mind__insight-badge">
              <span className="connected-mind__insight-dot"></span>
              <span>{activeNode.category || 'SYSTEM PERSPECTIVE'}</span>
            </div>
            <h3 className="connected-mind__insight-title">{activeNode.label}</h3>
            <p className="connected-mind__insight-text">{activeNode.summary}</p>
            
            {activeNode.link && (
              <Link to={activeNode.link} className="connected-mind__insight-link">
                <span>Investigate {activeNode.type === 'project' ? 'World' : 'Concept'}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* ── Semantic Relationship Index (A11y Fallback) ── */
        <div className="connected-mind__index-view">
          <div className="connected-mind__index-grid">
            {CONSTELLATION_NODES.filter(n => n.type !== 'origin').map(node => (
              <div key={node.id} className="connected-mind__index-card">
                <div className="connected-mind__index-card-header">
                  <span className="connected-mind__index-cat">{node.category}</span>
                  <span className="connected-mind__index-sub">{node.sublabel}</span>
                </div>
                <h4 className="connected-mind__index-name">{node.label}</h4>
                <p className="connected-mind__index-summary">{node.summary}</p>
                {node.link ? (
                  <Link to={node.link} className="connected-mind__index-door">
                    Deep Dive →
                  </Link>
                ) : (
                  <span className="connected-mind__index-door connected-mind__index-door--disabled">
                    Architectural Invariant
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section Footer ── */}
      <div className="connected-mind__footer">
        <div className="connected-mind__footer-info">
          <span className="connected-mind__footer-dot">●</span>
          <span>Interactive Cognitive Constellation · Grounded in real wiki markdowns & decisions</span>
        </div>
        <Link to="/garden" className="connected-mind__cta-btn">
          <span>Explore Digital Garden</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
