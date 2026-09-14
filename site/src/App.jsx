import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageTransition from './components/layout/PageTransition';

// Core 4 consolidated routes + detail pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Radar from './pages/Radar';
import Concepts from './pages/Concepts';
import ConceptDetail from './pages/ConceptDetail';

// Universal 3D WebGL Spatial Canvas Engine
import SpatialCanvas3D from './components/three/SpatialCanvas3D';

export default function App() {
  const location = useLocation();

  return (
    <div className="app">
      {/* ── Persistent 3D WebGL Spatial Universe ── */}
      <SpatialCanvas3D />
      <div className="blueprint-grid" aria-hidden="true" />

      <Navbar />
      <main style={{ paddingTop: 'var(--navbar-height)', position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* ── 4 Primary Consolidated Routes ── */}
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
            <Route path="/projects/:id" element={<PageTransition><ProjectDetail /></PageTransition>} />
            <Route path="/radar" element={<PageTransition><Radar /></PageTransition>} />
            <Route path="/concepts" element={<PageTransition><Concepts /></PageTransition>} />
            <Route path="/concepts/:id" element={<PageTransition><ConceptDetail /></PageTransition>} />

            {/* ── Legacy Route Aliases & Redirects ── */}
            <Route path="/garden" element={<Navigate to="/concepts" replace />} />
            <Route path="/garden/:id" element={<PageTransition><ConceptDetail /></PageTransition>} />
            <Route path="/now" element={<Navigate to="/radar" replace />} />
            <Route path="/prep" element={<Navigate to="/radar" replace />} />
            <Route path="/playground" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
